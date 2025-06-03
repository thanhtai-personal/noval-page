import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const protectedPaths = ["/dashboard", "/profile"];
  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const locale = request.cookies.get("NEXT_LOCALE")?.value || "vi";

  const response = NextResponse.next();
  response.headers.set("x-next-intl-locale", locale);

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
