import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// List of paths that don't require authentication
const publicPaths = ["/login", "/register"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is public
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path))

  // Check if trying to access profile
  const isProfilePath = pathname.startsWith("/profile")

  // Get auth cookie to check if user is logged in or guest
  const authCookie = request.cookies.get("FOOTBALLSESSION")
  const guestCookie = request.cookies.get("GUEST_MODE")

  // If trying to access profile as guest, redirect to login
  if (isProfilePath && !authCookie && guestCookie) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Matcher for paths that the middleware should run on
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
}
