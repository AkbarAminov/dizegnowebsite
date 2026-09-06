import { defineConfig } from "prisma/config";

// The Prisma CLI does not read .env on its own. Node's built-in loader
// replaces dotenv; the file is optional so CI/production can rely on real
// environment variables instead.
try {
  process.loadEnvFile();
} catch {}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.mts",
  },
  datasource: {
    // Not read by `prisma generate` (runs on postinstall), so it must not
    // throw when the variable is absent; migrate/seed fail clearly instead.
    url: process.env.DATABASE_URL ?? "",
  },
});
