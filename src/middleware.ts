import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const pathname = request.nextUrl.pathname;

    const isAuthPage =
        pathname.startsWith("/login") ||
        pathname.startsWith("/register");
    const isDashboardPage = pathname.startsWith("/dashboard");
    const isHomePage = pathname === "/";

    // Logged-out users cannot access protected pages.
    if (!token && isDashboardPage) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // Logged-in users should skip home/auth and go to dashboard.
    if (token && (isAuthPage || isHomePage)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/dashboard/:path*", "/login", "/register"],
};
