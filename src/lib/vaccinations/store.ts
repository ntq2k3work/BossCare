import { MemoryVaccinationStore } from "./memory-store";
import { PrismaVaccinationStore } from "./prisma-store";
import type { VaccinationStore } from "./types";

let store: VaccinationStore | null = null;

declare global {
  var petHealthyMemoryVaccinationStore: MemoryVaccinationStore | undefined;
}

export function getVaccinationStore() {
  if (!store) {
    if (process.env.AUTH_STORE === "memory") {
      globalThis.petHealthyMemoryVaccinationStore ??= new MemoryVaccinationStore();
      store = globalThis.petHealthyMemoryVaccinationStore;
    } else {
      store = new PrismaVaccinationStore();
    }
  }

  return store;
}

export function setVaccinationStoreForTests(nextStore: VaccinationStore | null) {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("setVaccinationStoreForTests can only be used in tests.");
  }

  store = nextStore;
  if (nextStore instanceof MemoryVaccinationStore) {
    globalThis.petHealthyMemoryVaccinationStore = nextStore;
  }
}
