import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, code, newPassword } = await request.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { error: "Email, code, and new password are required" },
        { status: 400 }
      );
    }

    // Call WordPress API to reset password using the format from the screenshot
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/?rest_route=/simple-jwt-login/v1/user/reset_password&email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}&new_password=${encodeURIComponent(newPassword)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error("WordPress password reset error:", data);
      return NextResponse.json(
        { 
          error: data.message || "Failed to reset password. Invalid code or expired link." 
        },
        { status: data.statusCode || 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: "Password has been reset successfully"
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
} 