import { NextResponse, type NextRequest } from "next/server";
import { requireApiAuth } from "@/lib/auth/api";
import { blogErrorBody } from "@/lib/blog/errors";
import { deletePost, getAdminPost, updatePost } from "@/lib/blog/service";
import { getBlogStore } from "@/lib/blog/store";

export const runtime = "nodejs";
type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const auth = await requireApiAuth(request);
  if (!auth.context) return auth.response;
  try {
    return NextResponse.json(await getAdminPost(auth.context, getBlogStore(), (await context.params).id));
  } catch (error) {
    const handled = blogErrorBody(error);
    return NextResponse.json(handled.body, { status: handled.status });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = await requireApiAuth(request);
  if (!auth.context) return auth.response;
  try {
    return NextResponse.json(await updatePost(auth.context, getBlogStore(), (await context.params).id, await request.json()));
  } catch (error) {
    const handled = blogErrorBody(error);
    return NextResponse.json(handled.body, { status: handled.status });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = await requireApiAuth(request);
  if (!auth.context) return auth.response;
  try {
    await deletePost(auth.context, getBlogStore(), (await context.params).id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const handled = blogErrorBody(error);
    return NextResponse.json(handled.body, { status: handled.status });
  }
}
