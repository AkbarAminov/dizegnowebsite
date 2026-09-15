# Deployment

Production: **https://dizegnoagency.com**. Ansible from your own machine, no CI/CD.

```bash
make deploy
```

Rsyncs the **working copy** (not git HEAD — uncommitted changes ship too), builds the image **on the server**, applies migrations, restarts the container. Everything lives in `ansible/`; see `ansible/README.md` for first-run (`make ansible-deps`, `make vault-init`, `make vault-edit`) and the vault password file `.vault_pass`.

## Server
Hetzner `195.201.93.68`, Ubuntu 24.04, user `deploy`, key `~/.ssh/outbot_deploy`.
**Shared with the unrelated `out-bot` project — never touch its container, vhost, database, or `/home/deploy/app`.**

- app: container `dizegno-app` on `127.0.0.1:3001`, image `dizegno-web:latest`, compose project `dizegno` in `/home/deploy/dizegno`
- database: the host's **system MySQL**, database + user `dizegno`
- uploads: `/home/deploy/dizegno/uploads` bind-mounted at `/app/public/uploads` — survive redeploys
- nginx: `sites-available/dizegno` (name-based vhost; out-bot keeps `default_server`), TLS via Let's Encrypt webroot, renewed by certbot's systemd timer
- DNS/CDN: Cloudflare proxy in front, SSL mode Full (strict)

## What a deploy does (in order)
1. Assert the vault has no placeholder values.
2. Create/ensure the MySQL database and user.
3. Rsync source.
4. `docker build --network=host` — the build runs `prisma migrate deploy` **and** prerenders the public pages, so it needs the real database.
5. `docker compose up -d`.
6. Render the nginx vhost, validate with `nginx -t` before any reload, then the certificate.

## When changing things, remember
- **New env vars don't travel with the code.** The server `.env` is rendered from `ansible/roles/app/templates/env.j2` with secrets in the vault. Add the variable there **and** in `inventory/group_vars/all/vars.yml` + `vault.yml`, or it's missing in production.
- That `.env` is read through Compose `env_file`, which interpolates `$`; the template escapes it as `$$`. Keep that.
- Passwords in connection strings go through `mysql_password_url` (`urlencode` plus explicit `/` → `%2F`).
- **Migrations run during the image build**, ~a minute before the new container takes over — additive changes are safe; plan destructive ones accordingly.
- Redeploying recreates the container: expect a few seconds of 502.
- Public pages are prerendered from the DB **as it is at build time**; later admin edits refresh them via `revalidatePublicSite()`.
- Rsync excludes: `.git`, `node_modules`, `.next`, `.env`, `.vault_pass`, `ansible/`, `.idea`, `.claude`, `public/uploads`, `*.tsbuildinfo`.

## Checks
- `make deploy-logs` — tail the app.
- `ssh -i ~/.ssh/outbot_deploy deploy@195.201.93.68 'docker ps'` — shows both projects.
