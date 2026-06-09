import { NextResponse, type NextRequest } from "next/server";
import { requireApiAuth } from "@/lib/auth/api";
import { petErrorBody } from "@/lib/pets/errors";
import { createPet, listPets } from "@/lib/pets/service";
import { getPetStore } from "@/lib/pets/store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request);
  if (!auth.context) {
    return auth.response;
  }

  return NextResponse.json({ pets: await listPets(auth.context, getPetStore()) });
}

export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request);
  if (!auth.context) {
    return auth.response;
  }

  try {
    const pet = await createPet(auth.context, getPetStore(), await request.json());
    return NextResponse.json(pet, { status: 201 });
  } catch (error) {
    const handled = petErrorBody(error);
    return NextResponse.json(handled.body, { status: handled.status });
  }
}
