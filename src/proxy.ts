import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/login" || path === "/register" || path === "/";

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!token) return NextResponse.next();

  try {
    const decoded = jwtDecode<{ exp?: number; role?: string }>(token);
    if (!decoded.exp || decoded.exp * 1000 <= Date.now() || !["patient", "doctor", "admin"].includes(decoded.role || "")) {
      const response = isPublicPath ? NextResponse.next() : NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("access_token");
      return response;
    }
    const userRole = decoded.role || "patient";
    if (isPublicPath) return NextResponse.redirect(new URL(`/${userRole}/dashboard`, request.url));
    if (path.startsWith("/patient") && userRole !== "patient") return NextResponse.redirect(new URL(`/${userRole}/dashboard`, request.url));
    if (path.startsWith("/doctor") && userRole !== "doctor") return NextResponse.redirect(new URL(`/${userRole}/dashboard`, request.url));
    if (path.startsWith("/admin") && userRole !== "admin") return NextResponse.redirect(new URL(`/${userRole}/dashboard`, request.url));
  } catch {
    const response = isPublicPath ? NextResponse.next() : NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("access_token");
    return response;
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/patient/:path*", "/doctor/:path*", "/admin/:path*", "/consultation/:path*", "/notifications/:path*", "/dashboard", "/login", "/register"],
};
