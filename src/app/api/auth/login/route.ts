import { NextResponse, type NextRequest } from "next/server";
import { errorBody } from "@/lib/auth/errors";
import { loginUser } from "@/lib/auth/service";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";
import { getAuthStore } from "@/lib/auth/store";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const result = await loginUser(getAuthStore(), await request.json());
    const response = NextResponse.json(result.context);
    response.cookies.set(SESSION_COOKIE, result.session.token, sessionCookieOptions(result.session.expiresAt));
    return response;
  } catch (error) {
    const handled = errorBody(error);
    return NextResponse.json(handled.body, { status: handled.status });
  }
}
