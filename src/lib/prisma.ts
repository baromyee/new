import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function connectionString() {
  const raw = (process.env.DATABASE_URL || process.env.DIRECT_URL || "")
    .trim()
    .replace(/^["']|["']$/g, "");

  if (!raw) {
    throw new Error(
      "DATABASE_URL이 없습니다. Vercel Environment Variables에 Neon pooled 연결 문자열을 넣으세요.",
    );
  }

  return raw
    .replace(/[?&]channel_binding=require/gi, "")
    .replace(/\?&/, "?")
    .replace(/[?&]$/, "");
}

function createPrisma() {
  const adapter = new PrismaNeon({
    connectionString: connectionString(),
    connectionTimeoutMillis: 30_000,
  });
  return new PrismaClient({ adapter, log: ["error"] });
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
