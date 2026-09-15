# Architecture

Portfolio site (public, RU/EN/UZ) + a small self-hosted admin. Single admin user, no user table.

**Stack:** Next.js 16 App Router (Turbopack) · React 19 · TypeScript strict · Tailwind CSS 4 · Framer Motion · Prisma 7 + MySQL 8 (`@prisma/adapter-mariadb`) · Zod 4 · dnd-kit · nodemailer. Node ≥ 22.18.

## Rendering model — the core invariant
- **Public pages are static / ISR.** `export const revalidate = 3600` in `src/app/[lang]/(site)/layout.tsx`. They're prerendered at build time (per locale via `generateStaticParams`) from the DB.
- **Admin pages are `force-dynamic`.**
- **Every admin mutation must call `revalidatePublicSite()`** (`src/lib/projects.ts` → `revalidatePath("/", "layout")`) so the next visit re-renders with fresh data. The hourly `revalidate` is only a safety net for out-of-band changes (e.g. a seed run).
- `next build` prerenders the public pages, so **the build needs a reachable database.**

## File map
```
src/app/
  layout.tsx                    root <html>, global CSS
  not-found.tsx
  [lang]/layout.tsx             generateStaticParams for locales; 404s unknown locale
  [lang]/(site)/                public pages (revalidate=3600)
    layout.tsx                  Header + PageTransition + ContactPopup
    page.tsx                    home: WorkGrid + PartnersMarquee + EndCTA
    work/page.tsx               all projects (WorkFilter)
    work/[slug]/page.tsx        project page; generateStaticParams + generateMetadata
    answers/page.tsx            FAQ (static JSON, not DB)
    contact/page.tsx
  admin/
    login/page.tsx              server action in actions.ts
    (dashboard)/                force-dynamic admin UI: projects, messages
  api/contact/route.ts          public contact form → DB + notifications
  api/admin/**/route.ts         JSON endpoints for the admin UI
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
  dictionaries/{ru,en,uz}.ts    the copy
  typography.ts                 preventOrphans (widow control)
  answers.ts + data/answers.{ru,en,uz}.json   FAQ content
  site.ts                       NAV_LINKS + CONTACT constants
  youtube.ts                    embed/thumbnail URL helpers
src/proxy.ts                    request guard: auth for /admin/*, locale rewrite for pages
prisma/                         schema.prisma, migrations/, seed
docker/                         compose.yml (dev), Dockerfile (prod, built on server)
ansible/                        deploy — see docs/deployment.md
```

## Routing & i18n (`src/lib/i18n.ts`, `src/proxy.ts`)
- Locales `["ru", "en", "uz"]`. **`ru` is the default and unprefixed** (`/work/`); `en`/`uz` are prefixed (`/en/work/`). Keeps existing indexed URLs unchanged.
- `proxy.ts` rewrites any non-prefixed, non-admin, non-`/api/` path onto the `ru` branch of `[lang]` — the URL bar stays unprefixed, the page stays static. It does **not** personalize per visitor.
- Two content channels:
  - **Static UI copy:** typed `Dictionary`, one module per locale, loaded by `getDictionary`.
  - **DB content:** `ProjectTranslation` per locale; `pickTranslation` falls back `locale → en → any filled`.
- Helpers: `localeHref(lang, path)`, `stripLocale(pathname)`, `isLocale`, `mapLocales`. Never string-concat a locale prefix.

## Data flow
DB (`Project` + `ProjectTranslation` + `ProjectImage` + `ProjectField`) → `toProject(row, locale)` → **`Project`** (`types.ts`) → components. `year`/`production`/`fields[]` collapse into `credits`. Grid order = `pinned desc, order asc`. The public site never sees a raw Prisma row.

## Auth (`src/lib/auth.ts`, `src/proxy.ts`)
Single admin from `ADMIN_EMAIL`/`ADMIN_PASSWORD`. Session = HMAC-SHA256 signed, expiring `admin_session` cookie built with **Web Crypto** (so identical code runs in the proxy and in server actions). `proxy.ts` redirects unauthenticated `/admin/*` to the login page and 401s `/api/admin/*`. Credentials compared in constant time.

## Uploads
Local disk under `public/uploads` (gitignored), served by `src/app/uploads/[file]/route.ts` at runtime — not as static files. Validate a batch with `prepareUpload` before writing any, then `storeUpload`. Rules read from bytes (JPG/PNG/WEBP/GIF, ≥ 800px short side, ≤ 20 MB). Serverless: reimplement `src/lib/uploads.ts` only.
