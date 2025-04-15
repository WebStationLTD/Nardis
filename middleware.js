import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Secret key for JWT verification
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const encodedKey = new TextEncoder().encode(JWT_SECRET);

// Define any protected routes that require authentication
const protectedRoutePatterns = [
  /^\/my-account/, 
  /^\/checkout/
];

// Define public routes that should redirect to my-account if user is logged in
const publicRoutes = ["/login", "/register"];

// Verify JWT token validity
async function verifyToken(token) {
  if (!token) return null;
  
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    // Token is invalid or expired
    return null;
  }
}

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // Check if request is for a protected route
  const isProtectedRoute = protectedRoutePatterns.some((pattern) =>
    pattern.test(path)
  );
  
  // Check if request is for a public route
  const isPublicRoute = publicRoutes.includes(path);
  
  // Get session cookie
  const sessionCookie = request.cookies.get("session");
  const sessionToken = sessionCookie?.value;
  
  // If we have a token, verify it
  let isValidSession = false;
  if (sessionToken) {
    const payload = await verifyToken(sessionToken);
    isValidSession = !!payload;
  }
  
  // Redirect to login if trying to access protected route without valid session
  if (isProtectedRoute && !isValidSession) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // Redirect to my-account if trying to access public route with valid session
  if (isPublicRoute && isValidSession) {
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