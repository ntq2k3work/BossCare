import type { Metadata } from "next";
import Link from "next/link";
import { listPublishedPosts } from "@/lib/blog/service";
import { getBlogStore } from "@/lib/blog/store";
import { getRequestLocale } from "@/lib/request-locale";
import { Card, dogPhoto } from "@/components/ui/pet-ui";
import { PublicBlogHeader } from "@/components/blog/public-blog-header";

export const metadata: Metadata = {
  title: "Blog chăm sóc thú cưng | BossCare",
  description: "Kiến thức thực tế về sức khỏe, tiêm phòng và chăm sóc chó mèo từ BossCare.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const locale = await getRequestLocale();
  const vi = locale === "vi";
  const posts = await listPublishedPosts(getBlogStore(), locale);
  const [featured, ...rest] = posts;

  return (
    <main className="min-h-[100dvh] pb-24 text-[var(--bc-ink)]">
      <div className="pt-3"><PublicBlogHeader locale={locale} /></div>
      <section className="mx-auto w-full max-w-7xl px-5 pb-12 pt-20 lg:px-8">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--bc-accent)]">BossCare Journal</p>
        <h1 className="mt-4 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.06em] sm:text-7xl">{vi ? "Kiến thức để chăm boss chủ động hơn." : "Knowledge for more proactive pet care."}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--bc-muted)]">{vi ? "Hướng dẫn rõ ràng về hồ sơ sức khỏe, tiêm phòng, dấu hiệu cần chú ý và cuộc sống hằng ngày cùng thú cưng." : "Clear guidance on health records, vaccinations, warning signs, and everyday life with pets."}</p>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 lg:px-8">
        {featured ? (
          <Link href={`/blog/${featured.slug}`} className="group grid overflow-hidden rounded-[var(--bc-radius-lg)] border border-white/80 bg-white/82 shadow-[var(--bc-elev-raised)] lg:grid-cols-[1.1fr_0.9fr]">
            <img src={featured.coverImageUrl ?? dogPhoto} alt="" className="aspect-[16/10] h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
            <div className="flex flex-col justify-center p-7 lg:p-12">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--bc-accent)]">{vi ? "Bài nổi bật" : "Featured"}</p>
              <h2 className="mt-5 text-3xl font-black leading-tight tracking-[-0.045em] sm:text-5xl">{featured.title}</h2>
              <p className="mt-5 text-base leading-7 text-[var(--bc-muted)]">{featured.excerpt}</p>
              <BlogMeta post={featured} locale={locale} />
            </div>
          </Link>
        ) : (
          <Card className="py-20 text-center"><h2 className="text-2xl font-black">{vi ? "Bài viết đầu tiên đang được chuẩn bị." : "The first article is being prepared."}</h2><p className="mt-3 text-sm text-[var(--bc-muted)]">{vi ? "Hãy quay lại sớm để đọc nội dung mới từ BossCare." : "Check back soon for new BossCare content."}</p></Card>
        )}
      </section>

      {rest.length ? <section className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-16 md:grid-cols-2 lg:grid-cols-3 lg:px-8">{rest.map((post) => <Link key={post.id} href={`/blog/${post.slug}`} className="group"><Card className="h-full overflow-hidden p-0"><img src={post.coverImageUrl ?? dogPhoto} alt="" className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.02]" /><div className="p-6"><p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--bc-accent)]">{post.locale}</p><h2 className="mt-3 text-2xl font-black leading-tight tracking-[-0.035em]">{post.title}</h2><p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--bc-muted)]">{post.excerpt}</p><BlogMeta post={post} locale={locale} /></div></Card></Link>)}</section> : null}
    </main>
  );
}

function BlogMeta({ post, locale }: { post: Awaited<ReturnType<typeof listPublishedPosts>>[number]; locale: "vi" | "en" }) {
  return <p className="mt-6 text-xs font-semibold text-[var(--bc-meta)]">{post.authorName} · {new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", { dateStyle: "medium" }).format(new Date(post.publishedAt ?? post.createdAt))}</p>;
}
