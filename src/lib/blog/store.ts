import { MemoryBlogStore } from "./memory-store";
import { PrismaBlogStore } from "./prisma-store";
import type { BlogStore } from "./types";

let store: BlogStore | null = null;

declare global {
  var bossCareMemoryBlogStore: MemoryBlogStore | undefined;
}

export function getBlogStore() {
  if (!store) {
    if (process.env.AUTH_STORE === "memory") {
      globalThis.bossCareMemoryBlogStore ??= new MemoryBlogStore();
      store = globalThis.bossCareMemoryBlogStore;
    } else {
      store = new PrismaBlogStore();
    }
  }
  return store;
}

export function setBlogStoreForTests(nextStore: BlogStore | null) {
  if (process.env.NODE_ENV !== "test") throw new Error("setBlogStoreForTests can only be used in tests.");
  store = nextStore;
  if (nextStore instanceof MemoryBlogStore) globalThis.bossCareMemoryBlogStore = nextStore;
}
