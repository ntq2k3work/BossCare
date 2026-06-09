import { NextResponse, type NextRequest } from "next/server";
import { requireApiAuth } from "@/lib/auth/api";
import { healthLogErrorBody } from "@/lib/health-logs/errors";
import { deleteHealthLog, updateHealthLog } from "@/lib/health-logs/service";
import { getHealthLogStore } from "@/lib/health-logs/store";

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
    return NextResponse.json(await updateHealthLog(auth.context, getHealthLogStore(), id, await request.json()));
  } catch (error) {
    const handled = healthLogErrorBody(error);
    return NextResponse.json(handled.body, { status: handled.status });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = await requireApiAuth(request);
  if (!auth.context) {
    return auth.response;
  }

  try {
    const { id } = await context.params;
    return NextResponse.json(await deleteHealthLog(auth.context, getHealthLogStore(), id));
  } catch (error) {
    const handled = healthLogErrorBody(error);
    return NextResponse.json(handled.body, { status: handled.status });
  }
}
