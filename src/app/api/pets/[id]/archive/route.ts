import { NextResponse, type NextRequest } from "next/server";
import { requireApiAuth } from "@/lib/auth/api";
import { petErrorBody } from "@/lib/pets/errors";
import { archivePet } from "@/lib/pets/service";
import { getPetStore } from "@/lib/pets/store";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const auth = await requireApiAuth(request);
  if (!auth.context) {
    return auth.response;
  }

  try {
    const { id } = await context.params;
    return NextResponse.json(await archivePet(auth.context, getPetStore(), id));
  } catch (error) {
    const handled = petErrorBody(error);
    return NextResponse.json(handled.body, { status: handled.status });
  }
}
