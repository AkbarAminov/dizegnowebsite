# Production image. Built on the server by ansible/playbooks/deploy.yml.
#
# The public pages are prerendered at build time (src/app/(site)/layout.tsx
# sets `revalidate`), so `next build` needs a reachable database with the
# current schema. The playbook therefore builds with `--network=host` and a
# DATABASE_URL pointing at the server's system MySQL on 127.0.0.1; migrations
# run in the same step, right before the build.

FROM node:22-alpine AS build
WORKDIR /app
RUN apk add --no-cache openssl
COPY package.json package-lock.json prisma.config.ts ./
COPY prisma ./prisma
# postinstall runs `prisma generate`, hence the schema above.
RUN npm ci --no-audit --no-fund
COPY . .
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx prisma migrate deploy && npm run build

FROM node:22-alpine AS runtime
# Lets the deploy prune only this project's old images (see roles/app).
LABEL project=dizegno
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
# node (uid 1000) matches the deploy user on the server, so the bind-mounted
# uploads directory stays writable without a chown at runtime.
COPY --from=build --chown=node:node /app ./
USER node
EXPOSE 3000
CMD ["npm", "run", "start"]
