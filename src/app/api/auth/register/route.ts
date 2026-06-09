import { NextResponse, type NextRequest } from "next/server";
import { errorBody } from "@/lib/auth/errors";
import { registerUser } from "@/lib/auth/service";
import { sessionCookieOptions } from "@/lib/auth/session";
import { getAuthStore } from "@/lib/auth/store";
import { SESSION_COOKIE } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const result = await registerUser(getAuthStore(), await request.json());
    const response = NextResponse.json(result.context, { status: 201 });
    response.cookies.set(SESSION_COOKIE, result.session.token, sessionCookieOptions(result.session.expiresAt));
    return response;
  } catch (error) {
    const handled = errorBody(error);
    return NextResponse.json(handled.body, { status: handled.status });
  }
}
