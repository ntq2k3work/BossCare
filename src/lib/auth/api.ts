import { NextResponse, type NextRequest } from "next/server";
import { getContextFromToken } from "./service";
import { SESSION_COOKIE } from "./session";
import { getAuthStore } from "./store";

export async function requireApiAuth(request: NextRequest) {
  const context = await getContextFromToken(getAuthStore(), request.cookies.get(SESSION_COOKIE)?.value);
  if (!context) {
    return {
      context: null,
      response: NextResponse.json(
        { error: { code: "unauthorized", message: "Sign in to continue." } },
        { status: 401 },
      ),
    };
  }

  return { context, response: null };
}
