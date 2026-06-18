CREATE TABLE "blog_posts" (
  "id" TEXT NOT NULL,
  "author_user_id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "excerpt" TEXT NOT NULL,
  "content_json" JSONB NOT NULL,
  "cover_image_url" TEXT,
  "locale" TEXT NOT NULL DEFAULT 'vi',
  "status" TEXT NOT NULL DEFAULT 'draft',
  "published_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");
CREATE INDEX "blog_posts_status_locale_published_at_idx" ON "blog_posts"("status", "locale", "published_at");
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_author_user_id_fkey"
  FOREIGN KEY ("author_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
