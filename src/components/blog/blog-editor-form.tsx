"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, ButtonLink, Card, fieldClass, labelClass } from "@/components/ui/pet-ui";
import type { BlogPost } from "@/lib/blog/types";

const RichTextEditor = dynamic(() => import("./rich-text-editor").then((module) => module.RichTextEditor), {
  ssr: false,
  loading: () => <div className="min-h-80 animate-pulse rounded-[var(--bc-radius-md)] bg-slate-100" />,
});

const emptyContent = { type: "doc", content: [{ type: "paragraph" }] };

export function BlogEditorForm({ post, locale }: { post?: BlogPost; locale: "vi" | "en" }) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(post?.coverImageUrl ?? "");
  const [postLocale, setPostLocale] = useState<"vi" | "en">(post?.locale ?? locale);
  const [contentJson, setContentJson] = useState<Record<string, unknown>>(post?.contentJson ?? emptyContent);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function save(status: "draft" | "published") {
    setPending(true);
    setError("");
    try {
      const response = await fetch(post ? `/api/admin/blog/${post.id}` : "/api/admin/blog", {
        method: post ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title, slug, excerpt, coverImageUrl, locale: postLocale, status, contentJson }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.error?.message ?? (locale === "vi" ? "Không thể lưu bài viết." : "Unable to save post."));
      router.push("/admin/blog");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to save post.");
    } finally {
      setPending(false);
    }
  }

  async function remove() {
    if (!post || !window.confirm(locale === "vi" ? "Xóa vĩnh viễn bài viết này?" : "Permanently delete this post?")) return;
    setPending(true);
    const response = await fetch(`/api/admin/blog/${post.id}`, { method: "DELETE" });
    if (response.ok) {
      router.push("/admin/blog");
      router.refresh();
      return;
    }
    setPending(false);
    setError(locale === "vi" ? "Không thể xóa bài viết." : "Unable to delete post.");
  }

  function updateTitle(value: string) {
    setTitle(value);
    if (!post && (!slug || slug === slugify(title))) setSlug(slugify(value));
  }

  const vi = locale === "vi";
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <Card className="grid gap-6">
        {error ? <div role="alert" className="rounded-[var(--bc-radius-md)] bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</div> : null}
        <label className={labelClass}>
          {vi ? "Tiêu đề" : "Title"}
          <input autoFocus className={fieldClass} value={title} onChange={(event) => updateTitle(event.target.value)} maxLength={180} />
        </label>
        <label className={labelClass}>
          Slug
          <input className={fieldClass} value={slug} onChange={(event) => setSlug(slugify(event.target.value))} maxLength={180} />
          <span className="text-xs font-normal text-[var(--bc-muted)]">/blog/{slug || "..."}</span>
        </label>
        <label className={labelClass}>
          {vi ? "Mô tả ngắn" : "Excerpt"}
          <textarea className={`${fieldClass} min-h-24 py-3`} value={excerpt} onChange={(event) => setExcerpt(event.target.value)} maxLength={320} />
          <span className="text-right text-xs font-normal text-[var(--bc-muted)]">{excerpt.length}/320</span>
        </label>
        <div>
          <p className={labelClass}>{vi ? "Nội dung bài viết" : "Article content"}</p>
          <RichTextEditor value={contentJson} onChange={setContentJson} locale={locale} />
        </div>
      </Card>

      <div className="grid content-start gap-4">
        <Card className="grid gap-5">
          <label className={labelClass}>
            {vi ? "Ngôn ngữ" : "Language"}
            <select className={fieldClass} value={postLocale} onChange={(event) => setPostLocale(event.target.value as "vi" | "en")}>
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </label>
          <label className={labelClass}>
            {vi ? "URL ảnh bìa" : "Cover image URL"}
            <input className={fieldClass} type="url" placeholder="https://..." value={coverImageUrl} onChange={(event) => setCoverImageUrl(event.target.value)} />
          </label>
          {coverImageUrl ? <img src={coverImageUrl} alt="" className="aspect-[16/9] w-full rounded-[var(--bc-radius-md)] object-cover" /> : null}
          <div className="grid gap-2">
            <Button disabled={pending} onClick={() => save("published")} className="w-full">
              {pending ? (vi ? "Đang lưu..." : "Saving...") : vi ? "Xuất bản" : "Publish"}
            </Button>
            <Button disabled={pending} onClick={() => save("draft")} variant="secondary" className="w-full">
              {vi ? "Lưu bản nháp" : "Save draft"}
            </Button>
            {post?.status === "published" ? <Button disabled={pending} onClick={() => save("draft")} variant="ghost" className="w-full">{vi ? "Chuyển về nháp" : "Unpublish"}</Button> : null}
          </div>
        </Card>
        <div className="flex gap-2">
          <ButtonLink href="/admin/blog" variant="secondary" className="flex-1">{vi ? "Hủy" : "Cancel"}</ButtonLink>
          {post ? <Button disabled={pending} onClick={remove} variant="ghost" className="text-rose-700">{vi ? "Xóa" : "Delete"}</Button> : null}
        </div>
      </div>
    </div>
  );
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
