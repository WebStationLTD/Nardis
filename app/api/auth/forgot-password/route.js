import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }
    // Call WordPress API to reset password
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/?rest_route=/simple-jwt-login/v1/user/reset_password&email=${encodeURIComponent(email)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok || data.error) {
      return NextResponse.json(
        { 
          error: data.message || "Failed to send reset email" 
        },
        { status: data.statusCode || 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
} 