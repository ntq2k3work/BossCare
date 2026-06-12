import { NextResponse, type NextRequest } from "next/server";
import { paymentErrorBody, PaymentError } from "@/lib/payments/errors";
import { processSepayWebhook } from "@/lib/payments/service";
import { verifySepaySignature } from "@/lib/payments/security";
import { getPaymentStore } from "@/lib/payments/store";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const raw = await request.text();
  if (!verifySepaySignature(raw, request.headers.get("x-sepay-signature"))) {
    return NextResponse.json(
      { error: { code: "invalid_signature", message: "Webhook signature is invalid." } },
      { status: 401 },
    );
  }
  try {
    const result = await processSepayWebhook(getPaymentStore(), JSON.parse(raw));
    return NextResponse.json(result);
  } catch (error) {
    const handled = paymentErrorBody(error instanceof SyntaxError ? new PaymentError("invalid_json", "Webhook JSON is invalid.", 400) : error);
    return NextResponse.json(handled.body, { status: handled.status });
  }
}
