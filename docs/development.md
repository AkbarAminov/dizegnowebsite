# Development

## Run
- **Docker (recommended):** `make up` — brings up `node:22-alpine` + `mysql:8.0`, installs deps, applies migrations, starts `next dev` on http://localhost:3000. Admin at `/admin`.
- **App on host:** `npm install && npm run db:migrate && npm run dev`, pointing `DATABASE_URL` at the compose MySQL (host port 3307) or any MySQL.

## Config — `.env` is the single source
`make env` copies `.env.example` → `.env` (unquoted `KEY=value`, random `AUTH_SECRET`). Docker Compose reads it for `MYSQL_*`, `MYSQL_PORT`, `APP_PORT` and builds the container `DATABASE_URL` from `MYSQL_*`; the `DATABASE_URL` line is only for running the app on the host.

| Var | Purpose |
|-----|---------|
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | the only admin login |
| `AUTH_SECRET` | signs the session cookie |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | optional contact-form Telegram alerts |
| `EMAIL_HOST`/`PORT`/`USER`/`PASS`/`TO` | optional contact-form email alerts |

Adding an env var? It must also be wired for production — see [deployment.md](deployment.md).

## Commands (`make help` lists all)
| Command | Does |
|---------|------|
| `make up` / `down` / `logs` / `ps` | stack lifecycle (`down` keeps data) |
| `make shell` / `mysql` / `studio` | shell in the app container / MySQL session / Prisma Studio (:5555) |
| `make seed` | insert demo projects (idempotent) |
| `make migrate name=<change>` | create + apply a migration after editing `prisma/schema.prisma` |
| `make check` | lint + typecheck |
| `make clean` | stop and delete all volumes (DB, node_modules, .next) |

Host equivalents: `npm run dev` / `build` / `start` / `lint` / `typecheck` / `db:migrate` / `db:deploy` / `db:seed`.

## Verify a change (do this before calling anything done)
```bash
npm run typecheck && npm run lint && npm run build
```
`next build` prerenders the public pages, so it needs a reachable database. In Docker: `make check` covers lint + typecheck; run the build inside the container (`make build`).

## Gotchas
- `npm audit` flags transitive issues inside the Prisma CLI (dev-only); a real fix needs Prisma 8.
- The `<!-- BEGIN/END:nextjs-agent-rules -->` block in `AGENTS.md` is rewritten by `next dev`. Leave it; commit it with your work to keep the tree clean.
