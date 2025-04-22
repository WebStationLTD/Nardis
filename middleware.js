import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Secret key for JWT verification
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const encodedKey = new TextEncoder().encode(JWT_SECRET);

// Define any protected routes that require authentication
const protectedRoutePatterns = [
  /^\/my-account/,
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

// Check if token is approaching expiration (within 5 minutes)
async function isTokenExpiringSoon(token) {
  if (!token) return false;
  
  try {
    const payload = await verifyToken(token);
    if (!payload || !payload.exp) return false;
    
    // Check if token expires in less than 5 minutes
    const expiryTime = payload.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const timeToExpiry = expiryTime - currentTime;
    
    // Return true if token expires in less than 5 minutes
    return timeToExpiry < 5 * 60 * 1000 && timeToExpiry > 0;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return false;
  }
}

// Refresh the token if needed
async function refreshToken(token) {
  if (!token) return null;
  
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    
    // Call the refresh token API endpoint
    const response = await fetch(`${baseUrl}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
      }),
    });
    
    if (!response.ok) {
      console.error('Failed to refresh token:', response.status);
      return null;
    }
    
    const data = await response.json();
    
    if (data.jwt) {
      return data.jwt;
    }
    
    return null;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // Skip API routes to avoid infinite loops when calling the refresh endpoint
  if (path.startsWith('/api')) {
    return NextResponse.next();
  }
  
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
  let newToken = null;
  
  if (sessionToken) {
    const payload = await verifyToken(sessionToken);
    isValidSession = !!payload;
    
    // If session is valid, check if token is about to expire
    if (isValidSession) {
      const isExpiring = await isTokenExpiringSoon(sessionToken);
      
      // If token is expiring soon, refresh it
      if (isExpiring) {
        newToken = await refreshToken(sessionToken);
      }
    }
  }
  
  // Redirect to login if trying to access protected route without valid session
  if (isProtectedRoute && !isValidSession) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // Redirect to my-account if trying to access public route with valid session
  if (isPublicRoute && isValidSession) {
    return NextResponse.redirect(new URL("/my-account", request.nextUrl));
  }

  // Continue with the request but update token if needed
  const response = NextResponse.next();
  
  // If we have a new token, update the cookie
  if (newToken) {
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    response.cookies.set("session", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: expiresAt,
      path: "/",
    });
  }
  
  return response;
}

// Define which paths this middleware should run on
export const config = {
  matcher: [
    // Skip API routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};