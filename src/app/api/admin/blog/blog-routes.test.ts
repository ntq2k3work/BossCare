import { beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { MemoryAuthStore } from "@/lib/auth/memory-store";
import { setAuthStoreForTests } from "@/lib/auth/store";
import { MemoryBlogStore } from "@/lib/blog/memory-store";
import { setBlogStoreForTests } from "@/lib/blog/store";
import { POST as register } from "../../auth/register/route";
import { GET as listPosts, POST as createPost } from "./route";
import { DELETE as deletePost, GET as getPost, PATCH as updatePost } from "./[id]/route";

function request(path: string, method: string, body?: unknown, cookie?: string) {
  return new NextRequest(`http://localhost${path}`, {
    method,
    headers: { ...(body ? { "content-type": "application/json" } : {}), ...(cookie ? { cookie } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
}

async function authCookie() {
  const response = await register(request("/api/auth/register", "POST", {
    email: "editor@example.com",
    displayName: "BossCare Editor",
    password: "password123",
    householdName: "Editorial household",
  }));
  return response.headers.get("set-cookie")?.split(";")[0] ?? "";
}

const validPost = {
  title: "Lịch tiêm cho chó con",
  slug: "lich-tiem-cho-cho-con",
  excerpt: "Các mốc tiêm quan trọng trong năm đầu đời.",
  coverImageUrl: "https://images.example.com/puppy.jpg",
  locale: "vi",
  status: "draft",
  contentJson: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Nội dung bài viết" }] }] },
};

beforeEach(() => {
  setAuthStoreForTests(new MemoryAuthStore());
  setBlogStoreForTests(new MemoryBlogStore());
});

describe("admin blog route handlers", () => {
  it("requires authentication", async () => {
    expect((await listPosts(request("/api/admin/blog", "GET"))).status).toBe(401);
  });

  it("creates, publishes, reads, lists, and deletes a post", async () => {
    const cookie = await authCookie();
    const created = await createPost(request("/api/admin/blog", "POST", validPost, cookie));
    expect(created.status).toBe(201);
    const post = await created.json();

    const published = await updatePost(
      request(`/api/admin/blog/${post.id}`, "PATCH", { ...validPost, status: "published" }, cookie),
      { params: Promise.resolve({ id: post.id }) },
    );
    await expect(published.json()).resolves.toMatchObject({ status: "published", publishedAt: expect.any(String) });

    const read = await getPost(request(`/api/admin/blog/${post.id}`, "GET", undefined, cookie), { params: Promise.resolve({ id: post.id }) });
    await expect(read.json()).resolves.toMatchObject({ title: validPost.title });

    const listed = await listPosts(request("/api/admin/blog", "GET", undefined, cookie));
    await expect(listed.json()).resolves.toMatchObject({ posts: [{ slug: validPost.slug }] });

    expect((await deletePost(request(`/api/admin/blog/${post.id}`, "DELETE", undefined, cookie), { params: Promise.resolve({ id: post.id }) })).status).toBe(204);
  });

  it("rejects duplicate slugs and unsafe editor URLs", async () => {
    const cookie = await authCookie();
    expect((await createPost(request("/api/admin/blog", "POST", validPost, cookie))).status).toBe(201);
    expect((await createPost(request("/api/admin/blog", "POST", validPost, cookie))).status).toBe(409);
    const unsafe = {
      ...validPost,
      slug: "unsafe-link",
      contentJson: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Click", marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }] }] }] },
    };
    expect((await createPost(request("/api/admin/blog", "POST", unsafe, cookie))).status).toBe(400);
  });
});
