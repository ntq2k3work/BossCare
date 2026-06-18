import type { BlogPost, BlogPostInput, BlogStore } from "./types";

function id() {
  return `post_${Math.random().toString(36).slice(2, 10)}`;
}

export class MemoryBlogStore implements BlogStore {
  private posts = new Map<string, BlogPost>();

  async listAdmin() {
    return this.sorted([...this.posts.values()]);
  }

  async listPublished(locale: "vi" | "en") {
    return this.sorted([...this.posts.values()].filter((post) => post.status === "published" && post.locale === locale));
  }

  async findById(id: string) {
    return this.posts.get(id) ?? null;
  }

  async findPublishedBySlug(slug: string) {
    return [...this.posts.values()].find((post) => post.slug === slug && post.status === "published") ?? null;
  }

  async slugExists(slug: string, exceptId?: string) {
    return [...this.posts.values()].some((post) => post.slug === slug && post.id !== exceptId);
  }

  async create(authorUserId: string, authorName: string, input: BlogPostInput, publishedAt: Date | null) {
    const timestamp = new Date().toISOString();
    const post: BlogPost = {
      ...input,
      id: id(),
      authorUserId,
      authorName,
      publishedAt: publishedAt?.toISOString() ?? null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.posts.set(post.id, post);
    return post;
  }

  async update(id: string, input: BlogPostInput, publishedAt: Date | null) {
    const current = this.posts.get(id);
    if (!current) return null;
    const post: BlogPost = { ...current, ...input, publishedAt: publishedAt?.toISOString() ?? null, updatedAt: new Date().toISOString() };
    this.posts.set(id, post);
    return post;
  }

  async delete(id: string) {
    return this.posts.delete(id);
  }

  private sorted(posts: BlogPost[]) {
    return posts.toSorted((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
}
