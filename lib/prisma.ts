import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Reuse a single client across hot reloads in dev so `next dev` doesn't
// open a fresh Postgres connection pool on every file save.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
  // Fail fast instead of hanging indefinitely if the DB is unreachable or
  // a query stalls server-side — surfaces a real error in the logs
  // rather than an SSR request that never resolves.
  connectionTimeoutMillis: 10_000,
  statement_timeout: 10_000,
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
