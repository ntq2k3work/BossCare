import { ZodError } from "zod";
import type { AuthContext } from "@/lib/auth/types";
import { BlogError } from "./errors";
import type { BlogLocale, BlogStore } from "./types";
import { blogContentHasText, parseBlogInput } from "./validation";

function requireAdmin(context: AuthContext) {
  if (context.activeHousehold?.role !== "OWNER") throw new BlogError("forbidden", "Only household owners can manage blog posts.", 403);
}

function parseInput(input: unknown) {
  try {
    const parsed = parseBlogInput(input);
    if (parsed.status === "published" && !blogContentHasText(parsed.contentJson)) {
      throw new BlogError("empty_content", "Published posts must include article content.", 400);
    }
    return parsed;
  } catch (error) {
    if (error instanceof BlogError) throw error;
    if (error instanceof ZodError || error instanceof Error) {
      throw new BlogError("invalid_post", "Check the blog post fields and rich-text content.", 400);
    }
    throw error;
  }
}

export async function listAdminPosts(context: AuthContext, store: BlogStore) {
  requireAdmin(context);
  return store.listAdmin();
}

export async function getAdminPost(context: AuthContext, store: BlogStore, id: string) {
  requireAdmin(context);
  const post = await store.findById(id);
  if (!post) throw new BlogError("post_not_found", "Blog post was not found.", 404);
  return post;
}

export async function createPost(context: AuthContext, store: BlogStore, input: unknown) {
  requireAdmin(context);
  const parsed = parseInput(input);
  if (await store.slugExists(parsed.slug)) throw new BlogError("slug_exists", "This slug is already in use.", 409);
  return store.create(context.user.id, context.user.displayName, parsed, parsed.status === "published" ? new Date() : null);
}

export async function updatePost(context: AuthContext, store: BlogStore, id: string, input: unknown) {
  requireAdmin(context);
  const current = await store.findById(id);
  if (!current) throw new BlogError("post_not_found", "Blog post was not found.", 404);
  const parsed = parseInput(input);
  if (await store.slugExists(parsed.slug, id)) throw new BlogError("slug_exists", "This slug is already in use.", 409);
  const publishedAt = parsed.status === "published" ? new Date(current.publishedAt ?? Date.now()) : null;
  return store.update(id, parsed, publishedAt);
}

export async function deletePost(context: AuthContext, store: BlogStore, id: string) {
  requireAdmin(context);
  if (!(await store.delete(id))) throw new BlogError("post_not_found", "Blog post was not found.", 404);
}

export function listPublishedPosts(store: BlogStore, locale: BlogLocale) {
  return store.listPublished(locale);
}

export async function getPublishedPost(store: BlogStore, slug: string) {
  const post = await store.findPublishedBySlug(slug);
  if (!post) throw new BlogError("post_not_found", "Blog post was not found.", 404);
  return post;
}
