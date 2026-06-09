import { NextResponse, type NextRequest } from "next/server";
import { getContextFromToken } from "@/lib/auth/service";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { getAuthStore } from "@/lib/auth/store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const context = await getContextFromToken(getAuthStore(), request.cookies.get(SESSION_COOKIE)?.value);
  if (!context) {
    return NextResponse.json(
      { error: { code: "unauthorized", message: "Sign in to continue." } },
      { status: 401 },
    );
  }

  return NextResponse.json(context);
}
