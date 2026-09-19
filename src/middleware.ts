import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === "/login" || path === "/register" || path === "/";

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();

      if (isExpired && !isPublicPath) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("access_token");
        return response;
      }

      // Fallback for legacy tokens without a role claim
      const userRole = decoded.role || "patient";

      // If user is authenticated and tries to access login/register, redirect to their dashboard
      if (isPublicPath && !isExpired) {
        return NextResponse.redirect(
          new URL(`/${userRole}/dashboard`, request.url),
        );
      }

      // Role-based access control
      if (path.startsWith("/patient") && userRole !== "patient") {
        return NextResponse.redirect(
          new URL(`/${userRole}/dashboard`, request.url),
        );
      }
      if (path.startsWith("/doctor") && userRole !== "doctor") {
        return NextResponse.redirect(
          new URL(`/${userRole}/dashboard`, request.url),
        );
      }
      if (path.startsWith("/admin") && userRole !== "admin") {
        return NextResponse.redirect(
          new URL(`/${userRole}/dashboard`, request.url),
        );
      }
    } catch (e) {
      if (!isPublicPath) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("access_token");
        return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/patient/:path*",
    "/doctor/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
