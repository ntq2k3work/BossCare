import { NextResponse, type NextRequest } from "next/server";
import { logoutUser } from "@/lib/auth/service";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { getAuthStore } from "@/lib/auth/store";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  await logoutUser(getAuthStore(), request.cookies.get(SESSION_COOKIE)?.value);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
