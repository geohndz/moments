import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Legacy `/album/:id/...` URLs → flat `/memories/...` routes. */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const match = pathname.match(/^\/album\/([^/]+)(?:\/(.*))?$/);
  if (!match) return NextResponse.next();

  const rest = (match[2] ?? "").replace(/\/$/, "");

  if (rest === "" || rest === "month") {
    return NextResponse.redirect(new URL("/memories", request.url));
  }
  if (rest === "timeline") {
    return NextResponse.redirect(new URL("/memories/timeline", request.url));
  }
  if (rest === "year") {
    return NextResponse.redirect(new URL("/memories/year", request.url));
  }
  if (rest === "new") {
    return NextResponse.redirect(new URL("/memories/new", request.url));
  }

  const mem = rest.match(/^memory\/(.+)$/);
  if (mem?.[1]) {
    return NextResponse.redirect(new URL(`/memories/${mem[1]}`, request.url));
  }

  return NextResponse.redirect(new URL("/memories", request.url));
}

export const config = {
  matcher: ["/album/:path*"],
};
