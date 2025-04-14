import { NextResponse } from 'next/server';

// Define any protected routes that require authentication
const protectedRoutePatterns = [
  /^\/my-account/, 
  /^\/checkout/
];

// Define public routes that should redirect to my-account if user is logged in
const publicRoutes = ["/login", "/register"];

export function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // Check if request is for a protected route
  const isProtectedRoute = protectedRoutePatterns.some((pattern) =>
    pattern.test(path)
  );
  
  // Check if request is for a public route
  const isPublicRoute = publicRoutes.includes(path);
  
  // Get session cookie - just check if it exists, without decoding
  const sessionCookie = request.cookies.get("session");
  const hasSession = !!sessionCookie?.value;
  
  // Redirect to login if trying to access protected route without session
  if (isProtectedRoute && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // Redirect to my-account if trying to access public route with session
  if (isPublicRoute && hasSession) {
    return NextResponse.redirect(new URL("/my-account", request.nextUrl));
  }

  return NextResponse.next();
}

// Define which paths this middleware should run on
export const config = {
  matcher: [
    // Apply to login and register routes
    '/login',
    '/register',
    // Apply to all protected routes
    '/my-account/:path*',
    '/checkout/:path*',
  ],
};