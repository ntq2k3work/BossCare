import { redirect } from "next/navigation";
import { getCurrentAuthContext } from "@/lib/auth/current";
import { AppShell } from "@/components/ui/app-shell";
import { PageHeader } from "@/components/ui/pet-ui";
import { BlogEditorForm } from "@/components/blog/blog-editor-form";
import { LogoutButton } from "@/app/dashboard/logout-button";
import { getRequestLocale } from "@/lib/request-locale";

export default async function NewBlogPostPage() {
  const context = await getCurrentAuthContext();
  if (!context) redirect("/login");
  if (context.activeHousehold?.role !== "OWNER") redirect("/dashboard");
  const locale = await getRequestLocale();
  return (
    <AppShell userName={context.user.displayName} actions={<LogoutButton />} activeKey="blog">
      <div className="grid gap-6">
        <PageHeader eyebrow="Content" title={locale === "vi" ? "Viết bài mới" : "New blog post"} description={locale === "vi" ? "Soạn nội dung, lưu nháp hoặc xuất bản ngay." : "Write content, save a draft, or publish immediately."} />
        <BlogEditorForm locale={locale} />
      </div>
    </AppShell>
  );
}
