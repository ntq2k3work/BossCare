import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAuthContext } from "@/lib/auth/current";
import { listAdminPosts } from "@/lib/blog/service";
import { getBlogStore } from "@/lib/blog/store";
import { AppShell } from "@/components/ui/app-shell";
import { Badge, ButtonLink, Card, EmptyState, PageHeader, StatCard } from "@/components/ui/pet-ui";
import { LogoutButton } from "@/app/dashboard/logout-button";
import { getRequestLocale } from "@/lib/request-locale";

export default async function AdminBlogPage() {
  const context = await getCurrentAuthContext();
  if (!context) redirect("/login");
  const locale = await getRequestLocale();
  const vi = locale === "vi";
  const posts = await listAdminPosts(context, getBlogStore());
  const published = posts.filter((post) => post.status === "published").length;

  return (
    <AppShell userName={context.user.displayName} actions={<LogoutButton />} activeKey="blog">
      <div className="grid gap-6">
        <PageHeader
          eyebrow="Content"
          title={vi ? "Quản lý blog" : "Blog management"}
          description={vi ? "Viết, xem trước và xuất bản nội dung chăm sóc thú cưng." : "Write, preview, and publish pet-care content."}
          action={<ButtonLink href="/admin/blog/new">{vi ? "Viết bài mới" : "New post"}</ButtonLink>}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label={vi ? "Tổng bài" : "All posts"} value={posts.length} />
          <StatCard label={vi ? "Đã xuất bản" : "Published"} value={published} />
          <StatCard label={vi ? "Bản nháp" : "Drafts"} value={posts.length - published} />
        </div>
        <Card className="p-4 sm:p-6">
          {posts.length ? (
            <div className="grid gap-3">
              {posts.map((post) => (
                <article key={post.id} className="grid gap-4 rounded-[var(--bc-radius-md)] border border-[var(--bc-border-soft)] bg-white/72 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={post.status === "published" ? "good" : "warn"}>{post.status === "published" ? (vi ? "Đã xuất bản" : "Published") : (vi ? "Bản nháp" : "Draft")}</Badge>
                      <span className="text-xs font-bold uppercase text-[var(--bc-muted)]">{post.locale}</span>
                    </div>
                    <h2 className="mt-3 truncate text-lg font-black text-[var(--bc-ink)]">{post.title}</h2>
                    <p className="mt-1 line-clamp-1 text-sm text-[var(--bc-muted)]">{post.excerpt}</p>
                    <p className="mt-2 text-xs text-[var(--bc-meta)]">{new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", { dateStyle: "medium" }).format(new Date(post.updatedAt))}</p>
                  </div>
                  <div className="flex gap-2">
                    {post.status === "published" ? <ButtonLink href={`/blog/${post.slug}`} variant="ghost">{vi ? "Xem" : "View"}</ButtonLink> : null}
                    <ButtonLink href={`/admin/blog/${post.id}/edit`} variant="secondary">{vi ? "Chỉnh sửa" : "Edit"}</ButtonLink>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title={vi ? "Chưa có bài viết" : "No posts yet"} description={vi ? "Tạo bài đầu tiên để bắt đầu xây dựng thư viện nội dung BossCare." : "Create the first post to start the BossCare content library."} action={<Link href="/admin/blog/new">{vi ? "Viết bài mới" : "New post"}</Link>} />
          )}
        </Card>
      </div>
    </AppShell>
  );
}
