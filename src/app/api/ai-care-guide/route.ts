import { NextResponse, type NextRequest } from "next/server";
import { requireApiAuth } from "@/lib/auth/api";
import { aiCareErrorBody } from "@/lib/ai-care/errors";
import { askAiCareGuide } from "@/lib/ai-care/service";
import { getAiCareStore } from "@/lib/ai-care/store";
import { LOCALE_COOKIE, normalizeLocale } from "@/lib/i18n";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request);
  if (!auth.context) return auth.response;
  try {
    const locale = normalizeLocale(request.cookies.get(LOCALE_COOKIE)?.value);
    const body = await request.json();
    return NextResponse.json(await askAiCareGuide(auth.context, getAiCareStore(), { ...body, locale }));
  } catch (error) {
    const handled = aiCareErrorBody(error);
    return NextResponse.json(handled.body, { status: handled.status });
  }
}
