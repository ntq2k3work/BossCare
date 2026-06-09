import { NextResponse, type NextRequest } from "next/server";
import { requireApiAuth } from "@/lib/auth/api";
import { vaccinationErrorBody } from "@/lib/vaccinations/errors";
import { createVaccination, listVaccinations } from "@/lib/vaccinations/service";
import { getVaccinationStore } from "@/lib/vaccinations/store";

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
    return NextResponse.json({
      vaccinations: await listVaccinations(auth.context, getVaccinationStore(), id),
    });
  } catch (error) {
    const handled = vaccinationErrorBody(error);
    return NextResponse.json(handled.body, { status: handled.status });
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  const auth = await requireApiAuth(request);
  if (!auth.context) {
    return auth.response;
  }

  try {
    const { id } = await context.params;
    const record = await createVaccination(auth.context, getVaccinationStore(), id, await request.json());
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    const handled = vaccinationErrorBody(error);
    return NextResponse.json(handled.body, { status: handled.status });
  }
}
