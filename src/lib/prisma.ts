import { PrismaClient } from "@prisma/client";

function databaseUrl() {
  const direct = process.env.DIRECT_URL;
  const pooled = process.env.DATABASE_URL;
  const url = direct || pooled;
  if (!url) {
    throw new Error("DATABASE_URL 또는 DIRECT_URL 환경 변수가 없습니다.");
  }
  return url.includes("-pooler") ? url.replace("-pooler", "") : url;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error"],
    datasources: { db: { url: databaseUrl() } },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
