import { NextResponse, type NextRequest } from "next/server";
import { requireApiAuth } from "@/lib/auth/api";
import { paymentErrorBody } from "@/lib/payments/errors";
import { reconcileSepayTransactions } from "@/lib/payments/service";
import { getPaymentStore } from "@/lib/payments/store";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request);
  if (!auth.context) return auth.response;
  try {
    const report = await reconcileSepayTransactions(getPaymentStore(), await request.json());
    return NextResponse.json(report);
  } catch (error) {
    const handled = paymentErrorBody(error);
    return NextResponse.json(handled.body, { status: handled.status });
  }
}
