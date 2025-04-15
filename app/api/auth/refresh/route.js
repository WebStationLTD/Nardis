import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function POST() {
  try {
    // Get the current session JWT
    const currentJwt = await getSession();
    
    if (!currentJwt) {
      return NextResponse.json(
        { error: "No active session found" },
        { status: 401 }
      );
    }

    // Make request to WordPress JWT refresh endpoint
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/?rest_route=/simple-jwt-login/v1/auth/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          JWT: currentJwt,
          // Include AUTH_CODE if required by your WordPress setup
          ...(process.env.WP_JWT_SECRET && { AUTH_CODE: process.env.WP_JWT_SECRET }),
        }),
      }
    );

    const data = await res.json();

    if (!res.ok || !data.success) {
      return NextResponse.json(
        { error: data.error || "Failed to refresh token" },
        { status: res.status || 401 }
      );
    }

    return NextResponse.json(
      { 
        message: "Token refreshed successfully", 
        jwt: data.data.jwt 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Token refresh error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 