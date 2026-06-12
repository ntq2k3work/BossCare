import { MemoryPaymentStore } from "./memory-store";
import { PrismaPaymentStore } from "./prisma-store";
import type { PaymentStore } from "./types";

let store: PaymentStore | null = null;

declare global {
  var petHealthyMemoryPaymentStore: MemoryPaymentStore | undefined;
}

export function getPaymentStore() {
  if (!store) {
    if (process.env.AUTH_STORE === "memory") {
      globalThis.petHealthyMemoryPaymentStore ??= new MemoryPaymentStore();
      store = globalThis.petHealthyMemoryPaymentStore;
    } else {
      store = new PrismaPaymentStore();
    }
  }
  return store;
}

export function setPaymentStoreForTests(nextStore: PaymentStore | null) {
  if (process.env.NODE_ENV !== "test") throw new Error("setPaymentStoreForTests can only be used in tests.");
  store = nextStore;
  if (nextStore instanceof MemoryPaymentStore) globalThis.petHealthyMemoryPaymentStore = nextStore;
}
