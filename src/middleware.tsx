import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.pathname;

  // Allow API and static assets
  if (path.startsWith("/api") || path.startsWith("/_next") || path === "/favicon.ico") {
    return NextResponse.next();
  }

  const consented = req.cookies.get("consented")?.value === "1";
  if (!consented && path !== "/consent") {
    url.pathname = "/consent";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
