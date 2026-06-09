import { NextResponse, type NextRequest } from "next/server";
import { requireApiAuth } from "@/lib/auth/api";
import { checkInErrorBody } from "@/lib/checkins/errors";
import { createCheckIn, listCheckIns } from "@/lib/checkins/service";
import { getCheckInStore } from "@/lib/checkins/store";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const auth = await requireApiAuth(request);
  if (!auth.context) return auth.response;

  try {
    const { id } = await context.params;
    return NextResponse.json({ checkIns: await listCheckIns(auth.context, getCheckInStore(), id) });
  } catch (error) {
    const handled = checkInErrorBody(error);
    return NextResponse.json(handled.body, { status: handled.status });
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  const auth = await requireApiAuth(request);
  if (!auth.context) return auth.response;

  try {
    const { id } = await context.params;
    const checkIn = await createCheckIn(auth.context, getCheckInStore(), id, await request.json());
    return NextResponse.json(checkIn, { status: 201 });
  } catch (error) {
    const handled = checkInErrorBody(error);
    return NextResponse.json(handled.body, { status: handled.status });
  }
}
