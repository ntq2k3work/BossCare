import { Prisma } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/db/prisma";
import type { BlogPost, BlogPostInput, BlogStore } from "./types";

type BlogRow = {
  id: string;
  authorUserId: string;
  title: string;
  slug: string;
  excerpt: string;
  contentJson: unknown;
  coverImageUrl: string | null;
  locale: string;
  status: string;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  author: { displayName: string };
};

function toBlogPost(post: BlogRow): BlogPost {
  return {
    ...post,
    authorName: post.author.displayName,
    contentJson: post.contentJson as Record<string, unknown>,
    locale: post.locale as BlogPost["locale"],
    status: post.status as BlogPost["status"],
    publishedAt: post.publishedAt?.toISOString() ?? null,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };
}

export class PrismaBlogStore implements BlogStore {
  async listAdmin() {
    const posts = await getPrisma().blogPost.findMany({ include: { author: true }, orderBy: { updatedAt: "desc" } });
    return posts.map(toBlogPost);
  }

  async listPublished(locale: "vi" | "en") {
    const posts = await getPrisma().blogPost.findMany({
      where: { status: "published", locale },
      include: { author: true },
      orderBy: { publishedAt: "desc" },
    });
    return posts.map(toBlogPost);
  }

  async findById(id: string) {
    const post = await getPrisma().blogPost.findUnique({ where: { id }, include: { author: true } });
    return post ? toBlogPost(post) : null;
  }

  async findPublishedBySlug(slug: string) {
    const post = await getPrisma().blogPost.findFirst({ where: { slug, status: "published" }, include: { author: true } });
    return post ? toBlogPost(post) : null;
  }

  async slugExists(slug: string, exceptId?: string) {
    return Boolean(await getPrisma().blogPost.findFirst({ where: { slug, ...(exceptId ? { id: { not: exceptId } } : {}) }, select: { id: true } }));
  }

  async create(authorUserId: string, _authorName: string, input: BlogPostInput, publishedAt: Date | null) {
    const post = await getPrisma().blogPost.create({
      data: { ...input, authorUserId, contentJson: input.contentJson as Prisma.InputJsonValue, publishedAt },
      include: { author: true },
    });
    return toBlogPost(post);
  }

  async update(id: string, input: BlogPostInput, publishedAt: Date | null) {
    const exists = await getPrisma().blogPost.findUnique({ where: { id }, select: { id: true } });
    if (!exists) return null;
    const post = await getPrisma().blogPost.update({
      where: { id },
      data: { ...input, contentJson: input.contentJson as Prisma.InputJsonValue, publishedAt },
      include: { author: true },
    });
    return toBlogPost(post);
  }

  async delete(id: string) {
    const result = await getPrisma().blogPost.deleteMany({ where: { id } });
    return result.count > 0;
  }
}
