"use server";

import { z } from "zod";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
});

export async function login(prevState, formData) {
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password } = result.data;

  let loginSuccessful = false;
  let jwtToken = null;

  try {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        errors: {
          email: ["Invalid email or password"],
        },
      };
    }

    const data = await response.json();
    
    // The JWT is now in the user.extras.jwt_token field based on the response example
    const jwt = data.user.extras?.jwt_token;

    if (!jwt) {
      console.error("Missing JWT in response:", data);
      return {
        errors: {
          email: ["Authentication failed - missing token"],
        },
      };
    }

    jwtToken = jwt;

    // Create session with the JWT
    const sessionCreated = await createSession(jwt);
    
    if (!sessionCreated) {
      return {
        errors: {
          email: ["Failed to create session"],
        },
      };
    }
    
    loginSuccessful = true;
  } catch (error) {
    console.error("Login error:", error);
    return {
      errors: {
        email: ["An unexpected error occurred"],
      },
    };
  }

  // Only redirect if login was successful
  if (loginSuccessful) {
    redirect("/my-account");
  }
  
  // Fallback error (should never reach here)
  return { errors: { email: ["Something went wrong"] } };
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
