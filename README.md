# Dizegno

A dark-themed portfolio site built with Next.js (App Router), TypeScript,
Tailwind CSS and Framer Motion, backed by Postgres via Prisma and a
self-hosted admin panel at `/admin`. The layout patterns and motion
(collage grid, hover reveal, page transitions, expandable info panel,
lightbox) were modeled on the UX/structure of a well-known design-studio
portfolio site — no text, images, or branding from that site are
included.

## Stack

- Next.js App Router + TypeScript + Tailwind CSS + Framer Motion (frontend)
- Prisma ORM + PostgreSQL (data)
- NextAuth.js (Auth.js v5) — single hardcoded admin account, credentials login
- Local disk storage for uploaded images (`public/uploads`), behind a
  swappable `Storage` interface (`lib/storage.ts`) so it can move to
  S3/Cloudinary later without touching callers
- Telegram Bot API + Resend/Nodemailer for contact-form notifications
  (both optional and independent of each other)

## Getting started

### 1. Start Postgres

A `docker-compose.yml` is included for local development:

```bash
docker compose up -d db
```

This starts Postgres 16 on **host port 5433** (not the default 5432, to
avoid clashing with any other local Postgres instance) with a persistent
named volume. If you'd rather use a hosted free-tier database instead of
Docker (e.g. [Neon](https://neon.tech) or
[Supabase](https://supabase.com)), skip this step and just point
`DATABASE_URL` at that instance in the next step.

### 2. Configure environment variables

```bash
cp .env.example .env
```

Then edit `.env`. See [Environment variables](#environment-variables)
below for the full list and what each one does.

Generate `NEXTAUTH_SECRET` with:

```bash
openssl rand -base64 32
```

### 3. Install dependencies, run migrations, seed demo data

```bash
npm install
npx prisma migrate dev
npx prisma db seed
```

`prisma migrate dev` creates the database schema (`Project`,
`ProjectImage`, `ProjectField`, `ContactMessage`). `prisma db seed` runs
`prisma/seed.ts`, which inserts ~10 demo projects using picsum.photos
placeholder images so the homepage grid isn't empty on first run. It's
safe to re-run — it upserts by `slug`.

### 4. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000. Sign in to the admin panel at
`/admin/login` with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in
`.env` — there's no separate account/seed step, that env pair *is* the
account.

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # eslint
```

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Postgres connection string, e.g. `postgresql://dizegno:dizegno@localhost:5433/dizegno` |
| `ADMIN_EMAIL` | Yes | The only email allowed to sign in at `/admin/login` |
| `ADMIN_PASSWORD` | Yes | The password for that account |
| `NEXTAUTH_SECRET` | Yes | Random secret NextAuth uses to sign session tokens — generate with `openssl rand -base64 32` |
| `TELEGRAM_BOT_TOKEN` | No | Enables Telegram notifications on contact-form submit |
| `TELEGRAM_CHAT_ID` | No | Chat to send those notifications to |
| `RESEND_API_KEY` | No | Enables email notifications via Resend (takes priority over SMTP if both are set) |
| `EMAIL_HOST` / `EMAIL_PORT` / `EMAIL_USER` / `EMAIL_PASS` | No | SMTP credentials for email notifications via Nodemailer (used only if `RESEND_API_KEY` is unset) |
| `EMAIL_TO` | No | Where notification emails are sent — defaults to `EMAIL_USER` if unset |

Every "No" row above is independently optional: if its variables are
absent, that notification channel is silently skipped — the contact form
still saves to the database and returns success either way. See
`lib/notifications.ts`.

### Setting up Telegram notifications

1. Open a chat with [@BotFather](https://t.me/BotFather) on Telegram.
2. Send `/newbot` and follow the prompts (choose a name and a username
   ending in `bot`). BotFather replies with a token — this is
   `TELEGRAM_BOT_TOKEN`.
3. Send a message to your new bot (anything, e.g. "hi") so it has a chat
   to talk back to.
4. Get your chat ID by visiting
   `https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getUpdates` in a
   browser (with your real token in the URL) right after sending that
   message — look for `"chat":{"id": ...}` in the JSON response. That
   number is `TELEGRAM_CHAT_ID`.
5. Add both values to `.env` and restart the dev server.

### Setting up email notifications

Pick **one**:

- **Resend** (simplest): sign up at [resend.com](https://resend.com),
  create an API key, set `RESEND_API_KEY`. The sender address in
  `lib/notifications.ts` uses Resend's shared `onboarding@resend.dev`
  domain, which works immediately without DNS setup — verify your own
  domain in the Resend dashboard later if you want mail from your own
  address.
- **SMTP via Nodemailer**: set `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`,
  `EMAIL_PASS` (and optionally `EMAIL_TO`) to your mail provider's SMTP
  credentials (Gmail app password, SendGrid SMTP, your own mail server,
  etc).

## Admin panel

`/admin` is a self-contained, protected section — separate visual style
from the public site, no shared components. Everything under `/admin/*`
(pages and `/api/admin/*` routes) redirects to `/admin/login` (or
returns `401` for API calls) unless signed in; see `proxy.ts`.

- `/admin` — projects table: thumbnail, title, published/draft toggle,
  created date, drag handle to reorder the homepage grid, edit link,
  delete
- `/admin/projects/new` — create a project (title, slug, category, year,
  description, production, grid span, free-form extra fields)
- `/admin/projects/[id]` — edit those same fields, plus an image manager:
  upload, drag-to-reorder, delete
- `/admin/messages` — contact-form submissions, mark read/unread, delete

## Replacing/extending content

- **Projects, images, and contact messages** now live in Postgres and are
  managed entirely through `/admin` — there's no JSON file to hand-edit
  for these anymore.
- `lib/data/answers.json` is still a plain JSON file (FAQ accordion on
  `/answers/`) — there was no request to move this into the database, so
  it stays as-is; edit it directly.
- `lib/projects.ts` is the only place the public site reads project data
  from — `getAllProjects`, `getProject`, `getAdjacentProjects` all query
  Prisma and return the same shape the components have always expected
  (see `lib/types.ts`). If you ever swap Postgres/Prisma for something
  else, this is the one file to reimplement.
- Uploaded images are written to `public/uploads` and served directly by
  Next as static files. To move to S3-compatible storage or Cloudinary
  later, implement the `Storage` interface in `lib/storage.ts` and swap
  the `storage` export — nothing else in the app references the
  filesystem directly.

## Project structure

```
app/
  layout.tsx                     Root layout: Header, PageTransition, EndCTA, ContactPopup
  page.tsx                        Home — the work grid, no hero
  work/page.tsx                    Full work grid
  work/[slug]/page.tsx              Project template
  answers/page.tsx                  FAQ accordion
  contact/page.tsx                  Contact page
  api/contact/route.ts               Contact form endpoint (DB + notifications)
  api/auth/[...nextauth]/route.ts    NextAuth handlers
  admin/
    login/page.tsx                   Sign-in form
    (dashboard)/layout.tsx           Sidebar shell (Projects / Messages / Sign out)
    (dashboard)/page.tsx              Projects table
    (dashboard)/projects/new/         Create project
    (dashboard)/projects/[id]/        Edit project + image manager
    (dashboard)/messages/             Contact messages
  api/admin/
    projects/                          CRUD + reorder
    projects/[id]/images/               Upload, delete, reorder
    messages/                           List, mark read, delete
components/                          Public-site UI — untouched by this backend work
lib/
  types.ts                           Shared Project/Answer/etc. shapes (public contract)
  projects.ts                        Prisma-backed data layer for the public site
  auth.ts                            NextAuth config (single credentials-based admin)
  prisma.ts                          Prisma client singleton
  storage.ts                         Image storage abstraction (local disk today)
  notifications.ts                   Telegram + email senders (both optional)
  validation.ts                      Zod contact-form schema
  data/answers.json                  Still-static FAQ content
proxy.ts                            Protects /admin/* and /api/admin/*
prisma/
  schema.prisma                      Project / ProjectImage / ProjectField / ContactMessage
  seed.ts                            Demo data (picsum.photos images)
prisma.config.ts                    Prisma CLI config (datasource URL, seed command — Prisma 7)
docker-compose.yml                  Local Postgres for development
```

## Notable implementation details

- **The public-facing markup, animations, lightbox, and masonry/grid
  layout were not touched by the backend work.** Only the data-fetching
  layer (`lib/projects.ts`) changed internally, from reading
  `lib/data/projects.json` to querying Prisma — the exported function
  signatures and the shape of data they return are unchanged, so every
  component in `components/` works exactly as before.
- **No more per-section light/dark switching.** An earlier version tried
  to invert the header color based on which page section was in view.
  That broke on pages taller than the viewport, so it was removed;
  `Header` is just always dark.
- **Homepage/work grid** uses CSS Grid with `grid-auto-flow: dense` and
  per-item `col-span`/`row-span` driven by each project's `span` field
  (`normal` | `wide` | `tall`, editable per-project in `/admin`) — an
  asymmetric collage, not a uniform table.
- **Project gallery** uses the same dense-grid technique, but spans are
  computed from each image's actual `width`/`height` (captured
  automatically at upload time via `image-size`) instead of a hand-picked
  field.
- **Page transitions** are implemented via Framer Motion
  `AnimatePresence` keyed by pathname — Next's App Router doesn't
  guarantee the outgoing route stays mounted, so this is the standard
  workaround, not a hard guarantee of every exit animation completing.

## What's still needed for production

Everything above is enough to run this fully functional locally. Before
deploying for real, you'll still need to:

1. **Create the actual Telegram bot** via @BotFather and get a real
   `TELEGRAM_CHAT_ID` (see steps above) — the `.env.example` values are
   placeholders.
2. **Choose a production database host.** Local Docker Postgres is
   dev-only. [Neon](https://neon.tech) and [Supabase](https://supabase.com)
   both have free tiers that work as-is with `DATABASE_URL`; run
   `npx prisma migrate deploy` (not `migrate dev`) against it once.
3. **Choose a production image host.** `public/uploads` works for a
   single-server deployment but won't survive redeploys on most
   serverless hosts (e.g. Vercel's filesystem is ephemeral/read-only in
   production). Implement `lib/storage.ts`'s `Storage` interface against
   S3, R2, or Cloudinary and swap the `storage` export before deploying
   there.
4. **Set a real `ADMIN_PASSWORD` and `NEXTAUTH_SECRET`** in production
   env vars — don't reuse local dev values.
5. **Set up email notifications for real** (Resend domain verification,
   or production SMTP credentials) if you want that channel live —
   otherwise contact messages still save to the database and Telegram
   notifications (if configured) still work without it.
# dizegnowebsite
