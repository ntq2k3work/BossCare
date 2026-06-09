import { MemoryHealthLogStore } from "./memory-store";
import { PrismaHealthLogStore } from "./prisma-store";
import type { HealthLogStore } from "./types";

let store: HealthLogStore | null = null;

declare global {
  var petHealthyMemoryHealthLogStore: MemoryHealthLogStore | undefined;
}

export function getHealthLogStore() {
  if (!store) {
    if (process.env.AUTH_STORE === "memory") {
      globalThis.petHealthyMemoryHealthLogStore ??= new MemoryHealthLogStore();
      store = globalThis.petHealthyMemoryHealthLogStore;
    } else {
      store = new PrismaHealthLogStore();
    }
  }

  return store;
}

export function setHealthLogStoreForTests(nextStore: HealthLogStore | null) {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("setHealthLogStoreForTests can only be used in tests.");
  }

  store = nextStore;
  if (nextStore instanceof MemoryHealthLogStore) {
    globalThis.petHealthyMemoryHealthLogStore = nextStore;
  }
}
