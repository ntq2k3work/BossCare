import { NextResponse, type NextRequest } from "next/server";
import { requireApiAuth } from "@/lib/auth/api";
import { healthLogErrorBody } from "@/lib/health-logs/errors";
import { createHealthLog, listHealthLogs } from "@/lib/health-logs/service";
import { getHealthLogStore } from "@/lib/health-logs/store";

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
    const type = request.nextUrl.searchParams.get("type");
    return NextResponse.json({
      logs: await listHealthLogs(auth.context, getHealthLogStore(), id, type),
    });
  } catch (error) {
    const handled = healthLogErrorBody(error);
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
    const log = await createHealthLog(auth.context, getHealthLogStore(), id, await request.json());
    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    const handled = healthLogErrorBody(error);
    return NextResponse.json(handled.body, { status: handled.status });
  }
}
