import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrisma() {
  const raw = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!raw) {
    throw new Error("DATABASE_URL 환경 변수가 없습니다.");
  }
  const url = raw.replace("-pooler.", ".");
  return new PrismaClient({
    log: ["error"],
    datasources: { db: { url } },
  });
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
