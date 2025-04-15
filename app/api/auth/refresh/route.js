import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Get token from request body
    const body = await request.json();
    const currentJwt = body.token;
    
    if (!currentJwt) {
      return NextResponse.json(
        { error: "No token provided in request body" },
        { status: 401 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL || "http://localhost:3000";
    
    // Make request to WordPress JWT refresh endpoint
    const res = await fetch(
      `${baseUrl}/?rest_route=/simple-jwt-login/v1/auth/refresh`,
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${currentJwt}`
        },
        body: JSON.stringify({
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

    // Return the new JWT token
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