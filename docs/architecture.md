# Architecture

Portfolio site (public, RU/EN/UZ) + a small self-hosted admin. Single admin user, no user table.

**Stack:** Next.js 16 App Router (Turbopack) · React 19 · TypeScript strict · Tailwind CSS 4 · Framer Motion · Prisma 7 + MySQL 8 (`@prisma/adapter-mariadb`) · Zod 4 · dnd-kit · nodemailer. Node ≥ 22.18.

## Rendering model — the core invariant
- **Public pages are static / ISR.** `export const revalidate = 3600` in `src/app/[lang]/layout.tsx`. They're prerendered at build time (per locale via `generateStaticParams`) from the DB.
- **Admin pages are `force-dynamic`.**
- **Every admin mutation must call `revalidatePublicSite()`** (`src/lib/projects.ts` → `revalidatePath("/", "layout")`) so the next visit re-renders with fresh data. The hourly `revalidate` is only a safety net for out-of-band changes (e.g. a seed run).
- `next build` prerenders the public pages, so **the build needs a reachable database.**

## File map
```
src/app/
  [lang]/layout.tsx             ROOT layout of the public site: <html lang>, Header, Footer,
                                ContactPopup, site-wide metadata, Organization JSON-LD; revalidate=3600
  [lang]/not-found.tsx          localized 404 (rendered inside the site layout)
  [lang]/[...rest]/page.tsx     catch-all → notFound(), so unknown URLs get the localized 404
  [lang]/page.tsx               home: Hero + WorkGrid + Services + Process + Why + Partners + EndCTA
  [lang]/work/page.tsx          all projects (WorkFilter)
  [lang]/work/[slug]/page.tsx   project page; generateStaticParams + generateMetadata + JSON-LD
  [lang]/services/page.tsx      services (static dictionary content)
  [lang]/answers/page.tsx       FAQ (static JSON, not DB) + FAQPage JSON-LD
  [lang]/contact/page.tsx
  admin/layout.tsx              ROOT layout of the admin (noindex) — the two never share a layout
  admin/login/page.tsx          server action in actions.ts
  admin/(dashboard)/            force-dynamic admin UI: projects, messages
  api/contact/route.ts          public contact form → DB + notifications
  api/og/route.tsx              default Open Graph image (ImageResponse, static)
  api/admin/**/route.ts         JSON endpoints for the admin UI
  apple-icon.tsx                generated home-screen icon
  sitemap.ts / robots.ts        every page × locale with hreflang; disallows /admin and /api
  uploads/[file]/route.ts       serves uploaded images from disk at runtime

src/components/                 public-site UI (client where interactive)
src/lib/
  types.ts                      Project — the only shape the public site consumes
  projects.ts                   read model (toProject, getPublishedProjects) + revalidatePublicSite
  prisma.ts                     Prisma client singleton
  validation.ts                 Zod schemas
  api.ts                        parseBody / jsonError / isUniqueViolation (route helpers)
  auth.ts                       HMAC session cookie (Web Crypto)
  uploads.ts + imageInfo.ts     upload validation/storage; format+size read from bytes
  notifications.ts              optional Telegram + email on contact submit
  i18n.ts                       locales, localeHref, stripLocale, Dictionary type
  getDictionary.ts              per-locale static UI copy loader (server-only, cached)
  dictionaries/{ru,en,uz}.ts    the copy (nav, SEO titles/descriptions, home, services, contact, footer…)
  seo.ts                        SITE_URL, pageMetadata() — title/description/canonical/hreflang/OG in one place
  structuredData.ts             schema.org builders (Organization, Service list, FAQPage, CreativeWork, Breadcrumb)
  logoPaths.ts                  logo path data shared by <Logo> and the generated images
  typography.ts                 preventOrphans (widow control)
  answers.ts + data/answers.{ru,en,uz}.json   FAQ content
  site.ts                       NAV_LINKS + CONTACT + SITE constants
  youtube.ts                    embed/thumbnail URL helpers
src/proxy.ts                    request guard: auth for /admin/*, locale rewrite for pages
prisma/                         schema.prisma, migrations/, seed
docker/                         compose.yml (dev), Dockerfile (prod, built on server)
ansible/                        deploy — see docs/deployment.md
```

## Routing & i18n (`src/lib/i18n.ts`, `src/proxy.ts`)
- Locales `["ru", "en", "uz"]`. **`ru` is the default and unprefixed** (`/work/`); `en`/`uz` are prefixed (`/en/work/`). Keeps existing indexed URLs unchanged.
- `proxy.ts` rewrites any non-prefixed, non-admin, non-`/api/` path onto the `ru` branch of `[lang]` — the URL bar stays unprefixed, the page stays static. It does **not** personalize per visitor. Next's extensionless metadata routes (`/apple-icon`, `/icon`, …) are passed through untouched.
- **Two root layouts.** `src/app/[lang]/layout.tsx` owns `<html lang={lang}>` for the public site; `src/app/admin/layout.tsx` owns the admin's. There is no `src/app/layout.tsx` — that is what lets `<html lang>` be locale-accurate while the pages stay static.
- Two content channels:
  - **Static UI copy:** typed `Dictionary`, one module per locale, loaded by `getDictionary`.
  - **DB content:** `ProjectTranslation` per locale; `pickTranslation` falls back `locale → en → any filled`.
- Helpers: `localeHref(lang, path)`, `stripLocale(pathname)`, `isLocale`, `mapLocales`. Never string-concat a locale prefix.

## SEO
- `pageMetadata()` (`src/lib/seo.ts`) builds title, description, canonical, hreflang (`ru`/`en`/`uz` + `x-default` → unprefixed ru) and the Open Graph / Twitter card for every public page; titles and descriptions live in `dict.seo`. Meta strings are passed through `plainText()` because dictionary copy carries non-breaking spaces from `preventOrphans`.
- Structured data: `Organization` on every page (site layout), `ItemList` of `Service` on `/services/`, `FAQPage` on `/answers/`, `CreativeWork` + `BreadcrumbList` on project pages — builders in `src/lib/structuredData.ts`, rendered by `<JsonLd>`.
- The project description and credits are server-rendered inside `ProjectInfoPanel` (faded out + `inert` while closed), so a project page has indexable text even though the panel is a toggle.
- `sitemap.ts` lists every page × locale with hreflang alternates and project `updatedAt`; `robots.ts` disallows `/admin/` and the API. The default share image is generated by `api/og/route.tsx`; project pages use their thumbnail.

## Data flow
DB (`Project` + `ProjectTranslation` + `ProjectImage` + `ProjectField`) → `toProject(row, locale)` → **`Project`** (`types.ts`) → components. `year`/`production`/`fields[]` collapse into `credits`. Grid order = `pinned desc, order asc`. The public site never sees a raw Prisma row.

## Auth (`src/lib/auth.ts`, `src/proxy.ts`)
Single admin from `ADMIN_EMAIL`/`ADMIN_PASSWORD`. Session = HMAC-SHA256 signed, expiring `admin_session` cookie built with **Web Crypto** (so identical code runs in the proxy and in server actions). `proxy.ts` redirects unauthenticated `/admin/*` to the login page and 401s `/api/admin/*`. Credentials compared in constant time.

## Uploads
Local disk under `public/uploads` (gitignored), served by `src/app/uploads/[file]/route.ts` at runtime — not as static files. Validate a batch with `prepareUpload` before writing any, then `storeUpload`. Rules read from bytes (JPG/PNG/WEBP/GIF, ≥ 800px short side, ≤ 20 MB). Serverless: reimplement `src/lib/uploads.ts` only.
