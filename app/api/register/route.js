import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }
    
    // Additional email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Password strength validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Make request to WordPress registration endpoint
    const apiUrl = `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/?rest_route=/simple-jwt-login/v1/users&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&AUTH_KEY_NEXTJS=${process.env.WP_JWT_SECRET}`;
    
    const response = await fetch(
      apiUrl,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    // Log for debugging (remove in production)
    console.log("WordPress registration response:", JSON.stringify(data));

    if (!response.ok || data.code) {
      // Check for common errors
      if (data.message && data.message.includes("already exists")) {
        return NextResponse.json(
          { error: "This email is already registered" },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: data.message || "Registration failed" },
        { status: response.status || 400 }
      );
    }

    return NextResponse.json(
      { 
        message: "Registration successful", 
        user: {
          id: data.user_id || data.ID || data.id,
          email: email
        } 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
