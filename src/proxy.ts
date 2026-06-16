import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/app" || pathname.startsWith("/app/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/app/, "/dashboard");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app", "/app/:path*"],
};
