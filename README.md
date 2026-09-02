# Dizegno

Portfolio site for a branding agency: Next.js 16 (App Router), TypeScript,
Tailwind CSS 4, Framer Motion, Prisma 7 + PostgreSQL, and a small
self-hosted admin panel at `/admin`.

## Getting started

```bash
docker compose up -d db        # Postgres 16 on localhost:5433
cp .env.example .env           # then fill in ADMIN_* and AUTH_SECRET
npm install
npm run db:migrate             # create the schema
npm run db:seed                # optional: 10 demo projects with placeholder images
npm run dev                    # http://localhost:3000
```

Generate `AUTH_SECRET` with `openssl rand -base64 32`. Sign in at
`/admin/login` with `ADMIN_EMAIL` / `ADMIN_PASSWORD`; that env pair is the
only account.

Requires Node 22.18+ (the seed script runs as TypeScript natively).

| Script | What it does |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js dev server / production build / serve the build |
| `npm run lint` / `typecheck` | ESLint / `tsc --noEmit` |
| `npm run db:migrate` | `prisma migrate dev` (local development) |
| `npm run db:deploy` | `prisma migrate deploy` (production) |
| `npm run db:seed` | Upsert demo projects by slug; safe to re-run |

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Postgres connection string |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Yes | The single admin login |
| `AUTH_SECRET` | Yes | Signs the admin session cookie |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | No | Telegram notification on each contact-form submission |
| `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` | No | SMTP notification on each contact-form submission |
| `EMAIL_TO` | No | Recipient for those emails; defaults to `EMAIL_USER` |

Notification channels are independent and optional. Messages are always
saved to the database; a missing or failing channel is logged, never
surfaced to the visitor.

To get Telegram values: create a bot with [@BotFather](https://t.me/BotFather)
(`/newbot`), send it any message, then open
`https://api.telegram.org/bot<TOKEN>/getUpdates` and read `chat.id`.

## How it fits together

```
app/
  layout.tsx                  Root layout (<html>/<body>, metadata)
  (site)/                     Public site: Header, page transition, end CTA, contact popup
    page.tsx                  Home: project grid
    work/page.tsx             Work: grid with category filter
    work/[slug]/page.tsx      Project: gallery, info panel, prev/next, related
    answers/page.tsx          FAQ from lib/data/answers.json
    contact/page.tsx          Contact details + form
  admin/
    login/page.tsx            Sign-in form (server action in admin/actions.ts)
    (dashboard)/              Projects table, project form + image manager, messages
  api/
    contact/                  Public contact-form endpoint
    admin/...                 JSON endpoints used by the admin UI (guarded by proxy.ts)
components/                   Public-site UI
lib/
  projects.ts                 Public read model over Prisma + revalidation helper
  auth.ts                     Signed-cookie session for the single admin account
  validation.ts               Zod schemas shared by API routes and the admin form
  uploads.ts, imageInfo.ts    Local-disk image storage and dimension/format detection
  notifications.ts            Telegram + SMTP senders
  youtube.ts, site.ts         Small helpers and site-wide constants
prisma/                       Schema, migrations, seed
proxy.ts                      Redirects unauthenticated /admin requests, 401s /api/admin
```

- **Public pages are static.** Every admin mutation calls
  `revalidatePublicSite()`, which invalidates the whole public tree; the
  next visit re-renders with fresh data. An hourly `revalidate` window in
  `app/(site)/layout.tsx` covers changes made outside the admin.
- **Auth** is a signed, expiring cookie (HMAC-SHA256 via Web Crypto) checked
  in `proxy.ts`. There is no user table.
- **Images** are stored under `public/uploads` and served as static files.
  Format and dimensions are read from the file bytes (JPG, PNG, WEBP, GIF),
  so a renamed file cannot spoof its type. GIFs are served unoptimised so
  the animation survives. YouTube links are stored as embed URLs.
- **Grid layout.** Home/Work use a uniform 2-column grid; the project
  gallery uses `grid-auto-flow: dense` with tile spans chosen by position so
  server and client markup match.

## Deploying

1. Point `DATABASE_URL` at a hosted Postgres and run `npm run db:deploy`.
   `next build` prerenders the public pages and needs database access.
2. `public/uploads` only survives on a single persistent server. For a
   serverless host, reimplement `prepareUpload`/`storeUpload`/`removeUpload`
   in `lib/uploads.ts` against S3, R2 or Cloudinary.
3. Set real `ADMIN_PASSWORD` and `AUTH_SECRET` values.
