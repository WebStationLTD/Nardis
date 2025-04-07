import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { decrypt } from "./lib/session";

// Using patterns instead of exact strings
const protectedRoutePatterns = [/^\/my-account(\/.*)?$/];
const publicRoutes = ["/login", "/register"];

export default async function middleware(req) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutePatterns.some((pattern) =>
    pattern.test(path)
  );
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = await cookies();
  const sessionCookie = cookie.get("session")?.value;
  
  // Check if session cookie exists before trying to decrypt
  let session = null;
  if (sessionCookie) {
    session = await decrypt(sessionCookie);
  }

  // Check if user is authenticated by looking for data.user.id in the decoded token
  const userId = session?.data?.user?.id;

  if (isProtectedRoute && !userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicRoute && userId) {
    return NextResponse.redirect(new URL("/my-account", req.nextUrl));
  }

  return NextResponse.next();
}
