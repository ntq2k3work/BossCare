import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/blog/blog-article";
import { PublicBlogHeader } from "@/components/blog/public-blog-header";
import { ButtonLink, Card, dogPhoto } from "@/components/ui/pet-ui";
import { BlogError } from "@/lib/blog/errors";
import { getPublishedPost } from "@/lib/blog/service";
import { getBlogStore } from "@/lib/blog/store";
import { getRequestLocale } from "@/lib/request-locale";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const post = await getPublishedPost(getBlogStore(), (await params).slug);
    return { title: `${post.title} | BossCare`, description: post.excerpt, alternates: { canonical: `/blog/${post.slug}` }, openGraph: { title: post.title, description: post.excerpt, type: "article", images: post.coverImageUrl ? [post.coverImageUrl] : [] } };
  } catch {
    return { title: "Không tìm thấy bài viết | BossCare" };
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const locale = await getRequestLocale();
  const vi = locale === "vi";
  try {
    const post = await getPublishedPost(getBlogStore(), (await params).slug);
    return (
      <main className="min-h-[100dvh] pb-24 text-[var(--bc-ink)]">
        <div className="pt-3"><PublicBlogHeader locale={locale} /></div>
        <article className="mx-auto w-full max-w-5xl px-5 pt-16 lg:px-8">
          <Link href="/blog" className="text-sm font-bold text-[var(--bc-accent)] hover:underline">← {vi ? "Tất cả bài viết" : "All articles"}</Link>
          <header className="mx-auto mt-10 max-w-4xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--bc-accent)]">BossCare Journal · {post.locale}</p>
            <h1 className="mt-5 text-4xl font-black leading-[1.02] tracking-[-0.055em] sm:text-6xl">{post.title}</h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[var(--bc-muted)]">{post.excerpt}</p>
            <p className="mt-5 text-sm font-semibold text-[var(--bc-meta)]">{post.authorName} · {new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", { dateStyle: "long" }).format(new Date(post.publishedAt ?? post.createdAt))}</p>
          </header>
          <img src={post.coverImageUrl ?? dogPhoto} alt="" className="mt-12 aspect-[16/8] w-full rounded-[var(--bc-radius-lg)] object-cover shadow-[var(--bc-elev-raised)]" />
          <Card className="mx-auto mt-8 max-w-4xl p-7 sm:p-12"><BlogArticle content={post.contentJson} /></Card>
          <Card className="mx-auto mt-8 grid max-w-4xl gap-6 bg-[var(--bc-accent)] p-7 text-white sm:grid-cols-[1fr_auto] sm:items-center"><div><h2 className="text-2xl font-black">{vi ? "Biến kiến thức thành lịch chăm sóc rõ ràng." : "Turn knowledge into a clear care routine."}</h2><p className="mt-2 text-sm leading-6 text-white/75">{vi ? "Tạo hồ sơ pet miễn phí và để BossCare giúp bạn theo dõi." : "Create a free pet profile and let BossCare help you stay on track."}</p></div><ButtonLink href="/register" variant="secondary">{vi ? "Bắt đầu miễn phí" : "Start free"}</ButtonLink></Card>
        </article>
      </main>
    );
  } catch (error) {
    if (error instanceof BlogError && error.status === 404) notFound();
    throw error;
  }
}
