# Deploy

Deploys the current local working copy to the production server. No CI/CD —
you run it from your machine.

Server: `195.201.93.68` (Ubuntu 24.04), user `deploy`, key `~/.ssh/outbot_deploy`.
The same server also runs out-bot; this playbook only adds its own containers
and its own nginx vhost, and touches nothing that belongs to out-bot.

## What it does

1. creates the `dizegno` database and user in the server's **system MySQL**
   (the same instance out-bot uses) and opens it to the Docker bridge in UFW
2. rsyncs the source (no `node_modules` / `.next` / `.env`) to `/home/deploy/dizegno/repo`
3. builds the image on the server (`docker/Dockerfile`); the build applies
   `prisma migrate deploy` and prerenders the public pages against that database
4. starts the app (`dizegno-app`) on `127.0.0.1:3001`, talking to MySQL through
   `host.docker.internal`, with `/home/deploy/dizegno/uploads` bind-mounted at
   `/app/public/uploads`
5. configures the nginx vhost for `dizegnoagency.com` + `www`, and obtains a
   Let's Encrypt certificate (webroot; renewal via certbot's systemd timer)

MySQL itself is not configured here — out-bot's playbook already sets
`bind-address = 0.0.0.0` and `default_authentication_plugin = mysql_native_password`,
which is what the container and the build need.

## Vault password

`.vault_pass` (repo root, gitignored) holds the ansible-vault password: replace
the placeholder line with the password you chose in `make vault-init`, and
`make vault-edit` / `make deploy` stop asking for it. Delete the file to go back
to being prompted. Keep a copy in your password manager — if it is lost the
secrets cannot be decrypted, and the only way out is a new vault. To change the
password: `ansible-vault rekey ansible/inventory/group_vars/all/vault.yml`.

## First run

```bash
make ansible-deps          # install the Ansible collections
make vault-init            # copy vault.yml.example → vault.yml and encrypt it
echo 'your-vault-password' > .vault_pass   # optional, so nothing prompts later
make vault-edit            # fill in the real secrets
make deploy
```

DNS must already point `dizegnoagency.com` and `www` at the server before the
first deploy, otherwise certbot cannot issue the certificate (a Cloudflare
proxied record is fine — set SSL/TLS mode to **Full (strict)**). Until the
certificate exists the site is served over plain HTTP; re-run `make deploy`
after DNS propagates and the vhost switches to HTTPS.

## Later

`make deploy` again — it rebuilds and restarts. `make deploy-logs` tails the app.

## Files

- `inventory/hosts.yml` — server address and SSH key
- `inventory/group_vars/all/vars.yml` — ports, paths, domain
- `inventory/group_vars/all/vault.yml` — secrets (ansible-vault, committed encrypted)
- `roles/mysql` — database and user in the system MySQL
- `roles/app` — source sync, image build, container
- `roles/nginx` — vhost and TLS
