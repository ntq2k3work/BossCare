import { NextResponse, type NextRequest } from "next/server";
import { requireApiAuth } from "@/lib/auth/api";
import { blogErrorBody } from "@/lib/blog/errors";
import { createPost, listAdminPosts } from "@/lib/blog/service";
import { getBlogStore } from "@/lib/blog/store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request);
  if (!auth.context) return auth.response;
  try {
    return NextResponse.json({ posts: await listAdminPosts(auth.context, getBlogStore()) });
  } catch (error) {
    const handled = blogErrorBody(error);
    return NextResponse.json(handled.body, { status: handled.status });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request);
  if (!auth.context) return auth.response;
  try {
    return NextResponse.json(await createPost(auth.context, getBlogStore(), await request.json()), { status: 201 });
  } catch (error) {
    const handled = blogErrorBody(error);
    return NextResponse.json(handled.body, { status: handled.status });
  }
}
