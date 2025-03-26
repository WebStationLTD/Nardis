import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;

  if (!isAuthenticated) {
    const pathname = request.nextUrl.pathname;
    const callbackUrl = encodeURIComponent(pathname);
    
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, request.url)
    );
  }

  return NextResponse.next();
}

// Add protected routes here:
export const config = { matcher: ["/my-account"] };