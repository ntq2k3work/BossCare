import { MemoryPetStore } from "./memory-store";
import { PrismaPetStore } from "./prisma-store";
import type { PetStore } from "./types";

let store: PetStore | null = null;

declare global {
  var petHealthyMemoryPetStore: MemoryPetStore | undefined;
}

export function getPetStore() {
  if (!store) {
    if (process.env.AUTH_STORE === "memory") {
      globalThis.petHealthyMemoryPetStore ??= new MemoryPetStore();
      store = globalThis.petHealthyMemoryPetStore;
    } else {
      store = new PrismaPetStore();
    }
  }

  return store;
}

export function setPetStoreForTests(nextStore: PetStore | null) {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("setPetStoreForTests can only be used in tests.");
  }

  store = nextStore;
  if (nextStore instanceof MemoryPetStore) {
    globalThis.petHealthyMemoryPetStore = nextStore;
  }
}
