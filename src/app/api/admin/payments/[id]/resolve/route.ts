import { NextResponse, type NextRequest } from "next/server";
import { requireApiAuth } from "@/lib/auth/api";
import { paymentErrorBody } from "@/lib/payments/errors";
import { resolvePaymentReview } from "@/lib/payments/service";
import { getPaymentStore } from "@/lib/payments/store";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  const auth = await requireApiAuth(request);
  if (!auth.context) return auth.response;
  try {
    const { id } = await context.params;
    const body = await request.json();
    return NextResponse.json(await resolvePaymentReview(auth.context, getPaymentStore(), { ...body, transactionId: id }));
  } catch (error) {
    const handled = paymentErrorBody(error);
    return NextResponse.json(handled.body, { status: handled.status });
  }
}
