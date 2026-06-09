import { NextResponse, type NextRequest } from "next/server";
import { requireApiAuth } from "@/lib/auth/api";
import { vaccinationErrorBody } from "@/lib/vaccinations/errors";
import { updateVaccination } from "@/lib/vaccinations/service";
import { getVaccinationStore } from "@/lib/vaccinations/store";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  const auth = await requireApiAuth(request);
  if (!auth.context) {
    return auth.response;
  }

  try {
    const { id } = await context.params;
    return NextResponse.json(await updateVaccination(auth.context, getVaccinationStore(), id, await request.json()));
  } catch (error) {
    const handled = vaccinationErrorBody(error);
    return NextResponse.json(handled.body, { status: handled.status });
  }
}
