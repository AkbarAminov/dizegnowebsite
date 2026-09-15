# Dizegno — AI agent guide

Portfolio site of a branding agency (Tashkent), public in RU/EN/UZ, plus a small self-hosted admin. Single admin user, no user table.

> **Next.js 16 App Router — this is NOT the Next.js in your training data.** APIs, file conventions and types changed. Read the relevant guide in `node_modules/next/dist/docs/` before writing Next code. (See the managed reminder at the bottom of this file.)

## Docs — read the one that fits your task
| Doc | Read before you… |
|-----|------------------|
| [docs/architecture.md](docs/architecture.md) | touch routing, i18n, data flow, rendering, or need the file map |
| [docs/code-style.md](docs/code-style.md) | write or edit any TS / React / API / Prisma code |
| [docs/design-style.md](docs/design-style.md) | build or change UI — styling, layout, typography, motion |
| [docs/development.md](docs/development.md) | run the app locally, or verify a change |
| [docs/deployment.md](docs/deployment.md) | deploy to production |

## Stack
Next.js 16 (Turbopack) · React 19 · TypeScript strict · Tailwind CSS 4 · Framer Motion · Prisma 7 + MySQL 8 · Zod 4 · dnd-kit · nodemailer. Node ≥ 22.18.

## Non-negotiables
Details and canonical files are in the docs above.
1. **Public site is static/ISR; every admin mutation calls `revalidatePublicSite()`** (`src/lib/projects.ts`), or the site goes stale.
2. **Validate every external input with Zod** (`src/lib/validation.ts`); parse request bodies with `parseBody` (`src/lib/api.ts`).
3. **Trailing slash on all internal URLs** (`trailingSlash: true`).
4. **`params` are Promises; use the generated `PageProps`/`LayoutProps`/`RouteContext` types** — never hand-write route param types. Middleware lives in `src/proxy.ts`.
5. **Tailwind only**, tokens in `src/app/globals.css` (`canvas`/`surface`/`panel`/`accent`); never pure black. Public site and admin are different design languages.
6. **The public site consumes only `Project`** (`src/lib/types.ts`), built by `toProject`.
7. **Schema change** → edit `prisma/schema.prisma` → `make migrate name=<change>` → commit the migration.

## Verify (before calling anything done)
```bash
npm run typecheck && npm run lint && npm run build
```
`next build` prerenders the public pages, so it needs a reachable database.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
