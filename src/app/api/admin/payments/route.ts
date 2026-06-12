import { NextResponse, type NextRequest } from "next/server";
import { requireApiAuth } from "@/lib/auth/api";
import { paymentErrorBody } from "@/lib/payments/errors";
import { listPaymentReviewItems } from "@/lib/payments/service";
import { getPaymentStore } from "@/lib/payments/store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request);
  if (!auth.context) return auth.response;
  try {
    return NextResponse.json(await listPaymentReviewItems(auth.context, getPaymentStore()));
  } catch (error) {
    const handled = paymentErrorBody(error);
    return NextResponse.json(handled.body, { status: handled.status });
  }
}
