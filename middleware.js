import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // Augment the request handler
  function middleware(req) {
    // You can add custom logic here if needed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Only allow access if the user has a valid token
        return !!token;
      },
    },
    pages: {
      signIn: '/login',
      error: '/login',
    },
  }
);

// Protect all account-related routes
export const config = { 
  matcher: [
    "/my-account/:path*",
    "/checkout",
    "/profile",
    "/orders/:path*"
  ] 
};
