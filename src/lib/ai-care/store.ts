import { MemoryAiCareStore } from "./memory-store";
import type { AiCareStore } from "./types";

let store: AiCareStore | null = null;

declare global {
  var petHealthyMemoryAiCareStore: MemoryAiCareStore | undefined;
}

export function getAiCareStore() {
  if (!store) {
    globalThis.petHealthyMemoryAiCareStore ??= new MemoryAiCareStore();
    store = globalThis.petHealthyMemoryAiCareStore;
  }
  return store;
}

export function setAiCareStoreForTests(nextStore: AiCareStore | null) {
  if (process.env.NODE_ENV !== "test") throw new Error("setAiCareStoreForTests can only be used in tests.");
  store = nextStore;
  if (nextStore instanceof MemoryAiCareStore) globalThis.petHealthyMemoryAiCareStore = nextStore;
}
