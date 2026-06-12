import { NextResponse, type NextRequest } from "next/server";
import { requireApiAuth } from "@/lib/auth/api";
import { aiCareErrorBody } from "@/lib/ai-care/errors";
import { askAiCareGuide } from "@/lib/ai-care/service";
import { getAiCareStore } from "@/lib/ai-care/store";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request);
  if (!auth.context) return auth.response;
  try {
    return NextResponse.json(await askAiCareGuide(auth.context, getAiCareStore(), await request.json()));
  } catch (error) {
    const handled = aiCareErrorBody(error);
    return NextResponse.json(handled.body, { status: handled.status });
  }
}
