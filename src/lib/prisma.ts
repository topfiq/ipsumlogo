import { PrismaClient } from "@/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | null | undefined };

function createPrismaClient(): PrismaClient | null {
  if (!process.env.DATABASE_URL) {
    console.warn("[prisma] DATABASE_URL not set — running without database");
    return null;
  }
  try {
    return new PrismaClient({
      adapter: new PrismaPg(process.env.DATABASE_URL),
    });
  } catch (e) {
    console.error("[prisma] Failed to create client:", e);
    return null;
  }
}

const _prisma = globalForPrisma.prisma ?? createPrismaClient();
if (globalForPrisma.prisma === undefined) {
  globalForPrisma.prisma = _prisma;
}

export const prisma = _prisma;
