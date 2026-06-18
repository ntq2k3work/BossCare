import { notFound, redirect } from "next/navigation";
import { getCurrentAuthContext } from "@/lib/auth/current";
import { getAdminPost } from "@/lib/blog/service";
import { BlogError } from "@/lib/blog/errors";
import { getBlogStore } from "@/lib/blog/store";
import { AppShell } from "@/components/ui/app-shell";
import { PageHeader } from "@/components/ui/pet-ui";
import { BlogEditorForm } from "@/components/blog/blog-editor-form";
import { LogoutButton } from "@/app/dashboard/logout-button";
import { getRequestLocale } from "@/lib/request-locale";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const context = await getCurrentAuthContext();
  if (!context) redirect("/login");
  const locale = await getRequestLocale();
  try {
    const post = await getAdminPost(context, getBlogStore(), (await params).id);
    return (
      <AppShell userName={context.user.displayName} actions={<LogoutButton />} activeKey="blog">
        <div className="grid gap-6">
          <PageHeader eyebrow="Content" title={locale === "vi" ? "Chỉnh sửa bài viết" : "Edit blog post"} description={post.title} />
          <BlogEditorForm post={post} locale={locale} />
        </div>
      </AppShell>
    );
  } catch (error) {
    if (error instanceof BlogError && error.status === 404) notFound();
    throw error;
  }
}
