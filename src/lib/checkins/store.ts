import { MemoryCheckInStore } from "./memory-store";
import { PrismaCheckInStore } from "./prisma-store";
import type { CheckInStore } from "./types";

let store: CheckInStore | null = null;

declare global {
  var petHealthyMemoryCheckInStore: MemoryCheckInStore | undefined;
}

export function getCheckInStore() {
  if (!store) {
    if (process.env.AUTH_STORE === "memory") {
      globalThis.petHealthyMemoryCheckInStore ??= new MemoryCheckInStore();
      store = globalThis.petHealthyMemoryCheckInStore;
    } else {
      store = new PrismaCheckInStore();
    }
  }
  return store;
}

export function setCheckInStoreForTests(nextStore: CheckInStore | null) {
  if (process.env.NODE_ENV !== "test") throw new Error("setCheckInStoreForTests can only be used in tests.");
  store = nextStore;
  if (nextStore instanceof MemoryCheckInStore) globalThis.petHealthyMemoryCheckInStore = nextStore;
}
