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

    // Make request to WordPress authentication endpoint
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/?rest_route=/simple-jwt-login/v1/auth&email=${email}&password=${password}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok || data.code) {
      return NextResponse.json(
        { error: data.message || "Invalid credentials" },
        { status: res.status || 401 }
      );
    }

    return NextResponse.json(
      { message: "Login successful", user: data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
