import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

let prisma: PrismaClient | null = null;

export function getPrisma() {
  if (!prisma) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error("DATABASE_URL is required when AUTH_STORE is prisma.");
    }

    prisma = new PrismaClient({
      adapter: new PrismaPg(url),
    });
  }

  return prisma;
}
