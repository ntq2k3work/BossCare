import { NextResponse, type NextRequest } from "next/server";
import { requireApiAuth } from "@/lib/auth/api";
import { petErrorBody } from "@/lib/pets/errors";
import { getPet, updatePet } from "@/lib/pets/service";
import { getPetStore } from "@/lib/pets/store";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const auth = await requireApiAuth(request);
  if (!auth.context) {
    return auth.response;
  }

  try {
    const { id } = await context.params;
    return NextResponse.json(await getPet(auth.context, getPetStore(), id));
  } catch (error) {
    const handled = petErrorBody(error);
    return NextResponse.json(handled.body, { status: handled.status });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = await requireApiAuth(request);
  if (!auth.context) {
    return auth.response;
  }

  try {
    const { id } = await context.params;
    const pet = await updatePet(auth.context, getPetStore(), id, await request.json());
    return NextResponse.json(pet);
  } catch (error) {
    const handled = petErrorBody(error);
    return NextResponse.json(handled.body, { status: handled.status });
  }
}
