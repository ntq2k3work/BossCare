import { NextResponse, type NextRequest } from "next/server";
import { ZodError } from "zod";
import { errorBody } from "@/lib/auth/errors";
import { consumeRegistrationOtp } from "@/lib/auth/otp";
import { registerUser } from "@/lib/auth/service";
import { sessionCookieOptions } from "@/lib/auth/session";
import { getAuthStore } from "@/lib/auth/store";
import { SESSION_COOKIE } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = body?.otp ? consumeRegistrationOtp(body) : body;
    if (!body?.otp && process.env.NODE_ENV !== "test") {
      return NextResponse.json(
        { error: { code: "otp_required", message: "Verify your email before creating an account." } },
        { status: 428 },
      );
    }
    const result = await registerUser(getAuthStore(), input);
    const response = NextResponse.json(result.context, { status: 201 });
    response.cookies.set(SESSION_COOKIE, result.session.token, sessionCookieOptions(result.session.expiresAt));
    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: { code: "invalid_input", message: "Check the verification code and try again." } },
        { status: 400 },
      );
    }
    const handled = errorBody(error);
    return NextResponse.json(handled.body, { status: handled.status });
  }
}
