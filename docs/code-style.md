# Code style

Rules for writing/editing TS, React, API and Prisma code. Match the surrounding file; the patterns below are already in the codebase — copy the canonical file, don't invent.

## Golden rules
1. **Verify before done:** `npm run typecheck && npm run lint && npm run build`. Build prerenders public pages → needs a reachable DB.
2. **Every admin mutation calls `revalidatePublicSite()`** (`src/lib/projects.ts`) or the static public site goes stale.
3. **Validate all external input with Zod** — schemas live in `src/lib/validation.ts`. Never trust a request body.
4. **Trailing slash on every internal URL** (`/work/`, `/api/admin/projects/${id}/`). `trailingSlash: true` is on.
5. **This is Next.js 16, not your training data.** Read `node_modules/next/dist/docs/` before using a Next API you're unsure about.

## TypeScript
- `strict` is on. No `any`, no non-null `!` unless the invariant is right above it (see `auth.ts` `match()!`).
- `type` aliases, not `interface` (whole codebase). Import types with `import type`.
- Path alias `@/*` → `src/*`. No deep relative chains across `src/`.
- Named exports everywhere. Default export **only** in Next route files (`page.tsx`/`layout.tsx`) and dictionaries.
- Prefer `satisfies` over annotation when you want inference kept: `const include = {…} satisfies Prisma.ProjectInclude`.

## Comments
Comments explain **why**, never what. Match the existing density: every non-obvious decision gets one terse comment, obvious code gets none. Good examples: `src/lib/projects.ts:26`, `src/proxy.ts:5`, `src/components/WorkGrid.tsx:49`. Do not add narration like `// set state`.

## Next.js 16 — what differs from older versions
- **`params` / `searchParams` are Promises.** `const { lang } = await params;` — always.
- **Never hand-write route param types.** Use the generated globals (no import): `PageProps<"/[lang]/work/[slug]">`, `LayoutProps<"/[lang]">`, `RouteContext<"/api/admin/projects/[id]">`. They're produced by `next dev`/`next typegen`.
- **Middleware is `src/proxy.ts`** — exports `proxy(request)` and `config`, not `middleware`.
- **Server Components by default.** Add `"use client"` only for interactivity (state, effects, event handlers, Framer Motion).
- Rendering intent is explicit: `export const revalidate = 3600` (public, in `src/app/[lang]/layout.tsx`), `force-dynamic` (admin). Don't remove these.
- **Public pages export `generateMetadata` built with `pageMetadata()`** (`src/lib/seo.ts`) — never hand-write canonical/hreflang/OG tags. A new page also needs a `dict.seo.<page>` entry and a row in `src/app/sitemap.ts`.
- Server Actions: `"use server"` + `useActionState` (see `src/app/admin/actions.ts`, `src/app/admin/login/page.tsx`).

## API routes (`src/app/api/**`)
Canonical: `src/app/api/admin/projects/[id]/route.ts`. Every handler:
```ts
export async function PATCH(request: Request, { params }: RouteContext<"/api/admin/projects/[id]">) {
  const { id } = await params;
  const parsed = await parseBody(request, projectPatchSchema); // src/lib/api.ts
  if (!parsed.ok) return parsed.response;                      // 400 with field path
  // …mutate…
  revalidatePublicSite();
  return Response.json(project);
}
```
- Errors: `jsonError(message, status)`. Unique constraint: `if (isUniqueViolation(error)) return jsonError("… already in use", 409)`.
- Auth is handled by `proxy.ts` (401 for `/api/admin/*`), not per-route.
- Public contact endpoint returns `fieldErrors` via `z.flattenError` — see `src/app/api/contact/route.ts`.

## Prisma / data
- One client: `import { prisma } from "@/lib/prisma"`. Never `new PrismaClient()`.
- The public site consumes **only** `Project` (`src/lib/types.ts`), built by `toProject` in `src/lib/projects.ts`. Row fields (`year`, `production`, `fields[]`) collapse into `credits`. Add public fields there, not by leaking Prisma rows into components.
- Wrap per-request reads in React `cache` so a page and its `generateMetadata` share one query (`getPublishedProjects`).
- Replace-wholesale for child collections the form owns (translations, credit fields) inside `prisma.$transaction` — see the PATCH handler.
- Schema change workflow: edit `prisma/schema.prisma` → `make migrate name=<change>` → commit the generated migration. Migrations run at deploy build time — additive changes are safe, plan destructive ones.

## i18n (`src/lib/i18n.ts`)
- Locales `["ru", "en", "uz"]`; `ru` is the unprefixed default (`/work/`), others are prefixed (`/en/work/`).
- **Static UI copy** → typed `Dictionary` in `src/lib/dictionaries/<locale>.ts`, loaded via `getDictionary(locale)`. Add a key to the `Dictionary` type first — all three locales must implement it. Pass client components only the slice they need (`dict.nav`, `dict.contact`), not the whole dictionary — it is serialized into the page.
- **DB content** → `ProjectTranslation`; read with `pickTranslation` (falls back to `en`, then any filled).
- Build hrefs with `localeHref(lang, "/work/")`, never string-concat a locale prefix. Split with `stripLocale`.
- All rendered content strings pass through `preventOrphans` (`src/lib/typography.ts`) — `toProject` and `getDictionary` already apply it; don't double-apply.

## Client state & forms
- Admin calls the API through the `api()` wrapper (`src/app/admin/(dashboard)/ui.ts`): normalises the trailing slash, returns `{ ok, data } | { ok, error }`. Don't call `fetch` directly from admin components.
- **Optimistic mutation pattern** (canonical `ProjectsTable.tsx` `run()`): apply state → await request → success `Toast`, or error `Toast` + `router.refresh()` to snap back to server truth.
- Forms validate client-side before sending and surface the same errors the API would (`ProjectForm.tsx` `validate()`), track a `dirty` diff (`JSON.stringify(values) !== JSON.stringify(saved)`), warn on `beforeunload`, and keep publish/feature toggles **out** of the submit — those apply immediately via their own PATCH.
- dnd-kit needs a stable `id={useId()}` on `DndContext` or hydration mismatches appear; `PointerSensor` with `activationConstraint: { distance: 4 }`; reorder with `arrayMove` then PATCH the id list.

## Auth (`src/lib/auth.ts`)
- Single admin from `ADMIN_EMAIL`/`ADMIN_PASSWORD`; session is an HMAC-signed expiring cookie via **Web Crypto** (runs in both `proxy.ts` and server actions — keep it Web-Crypto-only, no Node `crypto`).
- Credentials compared in constant time (`constantTimeEqual`). Don't add `===` shortcuts.

## Uploads (`src/lib/uploads.ts`)
- `prepareUpload` validates the whole batch first (reject as a unit), then `storeUpload` writes. Served by `src/app/uploads/[file]/route.ts` at runtime — **not** as static `public/` files (those aren't re-served after `next start` boots).
- Rules read from bytes: JPG/PNG/WEBP/GIF, ≥ 800px short side, ≤ 20 MB. To move off local disk (serverless), reimplement `uploads.ts` only.

## Error handling
- Contact-form notifications (`src/lib/notifications.ts`) must never fail the request: each channel is optional and logs on error.
- Network `fetch` in client code uses `.catch(() => null)` and degrades — see `api()` and `ContactForm.tsx`.
