import { PrismaClient } from "@prisma/client";

function withPoolerParams(url: string) {
  let next = url;
  if (next.includes("-pooler") && !next.includes("pgbouncer=")) {
    next += next.includes("?") ? "&pgbouncer=true" : "?pgbouncer=true";
  }
  if (!next.includes("connect_timeout=")) {
    next += next.includes("?") ? "&connect_timeout=15" : "?connect_timeout=15";
  }
  return next;
}

if (process.env.DATABASE_URL) {
  process.env.DATABASE_URL = withPoolerParams(process.env.DATABASE_URL);
}

if (!process.env.DIRECT_URL && process.env.DATABASE_URL) {
  process.env.DIRECT_URL = process.env.DATABASE_URL;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ log: ["error"] });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
