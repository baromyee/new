import { PrismaClient } from "@prisma/client";
import { getDatabaseUrl } from "@/lib/db-url";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrisma() {
  const url = getDatabaseUrl();
  process.env.DATABASE_URL = url;
  return new PrismaClient({
    datasources: { db: { url } },
    log: ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrisma();
globalForPrisma.prisma = prisma;
