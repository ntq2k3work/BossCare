import { NextResponse, type NextRequest } from "next/server";
import { requireApiAuth } from "@/lib/auth/api";
import { getAuthStore } from "@/lib/auth/store";
import { getPetStore } from "@/lib/pets/store";
import { getPaymentStore } from "@/lib/payments/store";
import { adminStatsErrorBody, getAdminOverviewStats } from "@/lib/admin/stats";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request);
  if (!auth.context) return auth.response;

  try {
    return NextResponse.json(await getAdminOverviewStats(auth.context, {
      authStore: getAuthStore(),
      petStore: getPetStore(),
      paymentStore: getPaymentStore(),
    }));
  } catch (error) {
    const handled = adminStatsErrorBody(error);
    return NextResponse.json(handled.body, { status: handled.status });
  }
}
