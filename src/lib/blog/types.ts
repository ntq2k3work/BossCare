export type BlogLocale = "vi" | "en";
export type BlogStatus = "draft" | "published";
export type BlogContent = Record<string, unknown>;

export type BlogPost = {
  id: string;
  authorUserId: string;
  authorName: string;
  title: string;
  slug: string;
  excerpt: string;
  contentJson: BlogContent;
  coverImageUrl: string | null;
  locale: BlogLocale;
  status: BlogStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BlogPostInput = Pick<
  BlogPost,
  "title" | "slug" | "excerpt" | "contentJson" | "coverImageUrl" | "locale" | "status"
>;

export interface BlogStore {
  listAdmin(): Promise<BlogPost[]>;
  listPublished(locale: BlogLocale): Promise<BlogPost[]>;
  findById(id: string): Promise<BlogPost | null>;
  findPublishedBySlug(slug: string): Promise<BlogPost | null>;
  slugExists(slug: string, exceptId?: string): Promise<boolean>;
  create(authorUserId: string, authorName: string, input: BlogPostInput, publishedAt: Date | null): Promise<BlogPost>;
  update(id: string, input: BlogPostInput, publishedAt: Date | null): Promise<BlogPost | null>;
  delete(id: string): Promise<boolean>;
}
