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

    console.log(email);
    
    // Create Basic Auth header - CoCart uses basic auth for login endpoint
    const basicAuth = Buffer.from(`${email}:${password}`).toString('base64');
    
    // Make request to WordPress authentication endpoint
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/cocart/v2/login`,
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Basic ${basicAuth}`
        },
        // Empty body or minimal body since credentials are in the header
        body: JSON.stringify({}),
      }
    );

    console.log(res);
    const data = await res.json();

    console.log(data);
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
