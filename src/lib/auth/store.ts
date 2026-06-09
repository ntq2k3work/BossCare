import { MemoryAuthStore } from "./memory-store";
import { PrismaAuthStore } from "./prisma-store";
import type { AuthStore } from "./types";

let store: AuthStore | null = null;

declare global {
  var petHealthyMemoryAuthStore: MemoryAuthStore | undefined;
}

export function getAuthStore() {
  if (!store) {
    if (process.env.AUTH_STORE === "memory") {
      globalThis.petHealthyMemoryAuthStore ??= new MemoryAuthStore();
      store = globalThis.petHealthyMemoryAuthStore;
    } else {
      store = new PrismaAuthStore();
    }
  }

  return store;
}

export function setAuthStoreForTests(nextStore: AuthStore | null) {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("setAuthStoreForTests can only be used in tests.");
  }

  store = nextStore;
  if (nextStore instanceof MemoryAuthStore) {
    globalThis.petHealthyMemoryAuthStore = nextStore;
  }
}
