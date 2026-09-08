# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

# Dizegno — project guide for AI agents

Portfolio site of a branding agency (Tashkent) with a small self-hosted admin. Single admin user, no user table.

## Stack
Next.js 16 App Router (Turbopack) · React 19 · TypeScript strict · Tailwind CSS 4 · Framer Motion · Prisma 7 + MySQL 8 (`@prisma/adapter-mariadb`) · Zod 4 · dnd-kit (admin drag & drop) · nodemailer. Node ≥ 22.18 (seed runs as native TS).

## Run
- `make up` — whole stack in Docker (node:22-alpine + mysql:8.0, no Dockerfile): installs deps, applies migrations, starts `next dev` on http://localhost:3000. `make help` lists everything (`down`, `logs`, `shell`, `seed`, `migrate name=…`, `check`, `clean`).
- Without Docker for the app: `npm install && npm run db:migrate && npm run dev`, with MySQL from `make up` (host port 3307) or any `DATABASE_URL`.
- **`.env` is the single source of configuration** (created by `make env` from `.env.example`, unquoted `KEY=value`). Compose reads it for `MYSQL_*`, `MYSQL_PORT`, `APP_PORT` and builds the container `DATABASE_URL` from `MYSQL_*`; the `DATABASE_URL` line itself is only for running the app on the host. App vars: `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `AUTH_SECRET`; optional `TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID`, `EMAIL_HOST`/`EMAIL_PORT`/`EMAIL_USER`/`EMAIL_PASS`/`EMAIL_TO`.
- Verify changes with `npm run typecheck && npm run lint && npm run build`. `next build` prerenders public pages and therefore needs a reachable database.

## Layout
```
src/app/(site)/          public pages: / (grid), /work, /work/[slug], /answers, /contact
src/app/admin/           /admin/login (server action in actions.ts) + (dashboard)/ projects, messages
src/app/uploads/[file]   serves uploaded images from disk at runtime
src/app/api/contact      public contact-form endpoint
src/app/api/admin/**     JSON endpoints used by the admin UI
src/components/          public-site UI (client components where interactive)
src/lib/                 projects.ts (read model + revalidatePublicSite), auth.ts, validation.ts (zod),
                         uploads.ts + imageInfo.ts, notifications.ts, youtube.ts, site.ts (nav/contacts), types.ts
src/lib/data/answers.json  FAQ content (static, not in DB)
src/proxy.ts             auth guard for /admin/* (redirect) and /api/admin/* (401)
prisma/                  schema.prisma, migrations/, seed.mts (upserts 10 demo projects)
docker/compose.yml       dev stack, all values from .env; Makefile wraps it
docker/Dockerfile        production image (built on the server by the deploy playbook)
ansible/                 deploy to dizegnoagency.com (`make deploy`); see ansible/README.md
```

## Deploy (production: https://dizegnoagency.com)

Ansible from your own machine, no CI/CD. One command:

```bash
make deploy
```

It rsyncs the working copy (not git HEAD — uncommitted changes ship too), builds
the image **on the server**, applies migrations, and restarts the container.
Everything lives in `ansible/`; see `ansible/README.md` for the first-run steps
(`make ansible-deps`, `make vault-init`, `make vault-edit`) and the vault password
file `.vault_pass`.

**Server** (shared with the unrelated out-bot project — never touch its
container, vhost, database or `/home/deploy/app`):
Hetzner `195.201.93.68`, Ubuntu 24.04, user `deploy`, key `~/.ssh/outbot_deploy`.
- app: container `dizegno-app` on `127.0.0.1:3001`, image `dizegno-web:latest`, compose project `dizegno` in `/home/deploy/dizegno`
- database: the host's **system MySQL**, database and user `dizegno` (out-bot uses the same server, its own database)
- uploads: `/home/deploy/dizegno/uploads` bind-mounted at `/app/public/uploads`, survive redeploys
- nginx: `sites-available/dizegno` (name-based vhost; out-bot keeps `default_server`), TLS via Let's Encrypt webroot, renewed by certbot's systemd timer
- DNS/CDN: Cloudflare proxy in front, SSL mode Full (strict)

**What a deploy does**, in order: assert the vault has no placeholder values →
create/ensure the MySQL database and user → rsync source → `docker build
--network=host` (the build runs `prisma migrate deploy` and prerenders the public
pages, so it needs the real database) → `docker compose up -d` → nginx vhost,
validated with `nginx -t` before any reload, then the certificate.

**When changing things, remember:**
- **New env vars** do not travel with the code: the server's `.env` is rendered from
  `ansible/roles/app/templates/env.j2`, with secrets in the vault. Add the variable
  there *and* in `inventory/group_vars/all/vars.yml` + `vault.yml`, or it will be missing in production.
- Values in that `.env` are read through Compose's `env_file`, which interpolates
  `$`; the template escapes it as `$$`. Keep that when adding variables.
- Passwords in connection strings go through `mysql_password_url`
  (`urlencode` plus an explicit `/` → `%2F`, which Ansible's filter leaves alone).
- Migrations run during the image build, a minute before the new container takes
  over — fine for additive changes, plan destructive ones accordingly.
- Redeploying recreates the container: expect a few seconds of 502.
- Public pages are prerendered during the build from the database as it is then;
  later edits in the admin refresh them through `revalidatePublicSite()`.
- Excluded from the rsync: `.git`, `node_modules`, `.next`, `.env`, `.vault_pass`,
  `ansible/`, `.idea`, `.claude`, `public/uploads`, `*.tsbuildinfo`.

**Checks**: `make deploy-logs` tails the app;
`ssh -i ~/.ssh/outbot_deploy deploy@195.201.93.68 'docker ps'` shows both projects.


## Conventions that matter
- **Static public site + on-demand revalidation.** Public pages are prerendered (`revalidate = 3600` in `(site)/layout.tsx`). Every admin mutation must call `revalidatePublicSite()` from `src/lib/projects.ts`; admin pages are `force-dynamic`.
- **Trailing slashes everywhere** (`trailingSlash: true`): internal links and fetch URLs end with `/`; the admin `api()` helper in `src/app/admin/(dashboard)/ui.ts` normalises this.
- **Auth** = HMAC-signed expiring cookie (`admin_session`), verified in `src/proxy.ts` with Web Crypto so the same code runs in proxy and server actions. Credentials are compared in constant time against env vars.
- **API routes**: parse bodies with `parseBody(request, schema)` from `src/lib/api.ts`; errors via `jsonError`; use Next's global `RouteContext<"/api/…">` / `PageProps<"/…">` types (generated by `next typegen`/`next dev`).
- **Images**: stored in `public/uploads` (gitignored) via `prepareUpload` (validate whole batch first) → `storeUpload`, and served by `src/app/uploads/[file]/route.ts` — **not** as static public files: `next start` only serves what was in `public/` at boot, so runtime uploads would 404 in production (next/image included, it fetches the original through the same server). Format/size read from bytes (JPG/PNG/WEBP/GIF, min 800px short side, max 20 MB). GIFs render with `next/image unoptimized`; YouTube items store the embed URL and use `img.youtube.com` thumbnails. For serverless hosting reimplement `src/lib/uploads.ts` only.
- **Admin UI**: shared classes and the `api()` wrapper live in `src/app/admin/(dashboard)/ui.ts`; state that changes the site uses a labelled `Switch` (never a badge that happens to be clickable), and every optimistic action confirms through `Toast`. The project form validates client-side before sending, tracks a dirty state in a sticky save bar, and keeps publish/feature toggles out of the form because they apply immediately.
- **Data shape**: the public site only consumes `Project` from `src/lib/types.ts`, built by `toProject` in `src/lib/projects.ts`. `year`/`production`/extra fields become `credits`. Project `order` + `pinned` define grid order.
- **Styling**: Tailwind only; accent colour is the `accent` token (`text-accent`, `bg-accent`) defined in `src/app/globals.css`. Admin uses the neutral palette. Body scroll under overlays is locked with `useLockBodyScroll`.
- **Schema changes**: edit `prisma/schema.prisma`, run `make migrate name=<change>` (or `npx prisma migrate dev`), commit the migration. Enum for media type; `fitMode` is a plain string (`cover`|`contain`).

## Gotchas
- dnd-kit contexts need a stable `id` (`useId`) or hydration mismatches appear.
- Contact-form notifications are optional and never fail the request; failures are only logged.
- `npm audit` reports transitive issues inside the Prisma CLI (dev dependency); fixing requires Prisma 8.
