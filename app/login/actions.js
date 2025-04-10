"use server";

import { z } from "zod";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email({ message: "Невалиден имейл адрес" }).trim(),
  password: z
    .string()
    .min(8, { message: "Паролата трябва да бъде поне 8 символа" })
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

  try {
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
          email: ["Невалиден имейл или парола"],
        },
      };
    }

    const data = await response.json();

    // Access JWT from the correct path in the response
    const jwt = data.user.data.jwt;

    if (!jwt) {
      console.error("Missing JWT in response:", data);
      return {
        errors: {
          email: ["Неуспешно удостоверяване - липсва токен"],
        },
      };
    }

    // Create session with the JWT
    const sessionCreated = await createSession(jwt);

    if (!sessionCreated) {
      return {
        errors: {
          email: ["Неуспешно създаване на сесия"],
        },
      };
    }

    loginSuccessful = true;
  } catch (error) {
    console.error("Грешка при вход:", error);
    return {
      errors: {
        email: ["Възникна неочаквана грешка"],
      },
    };
  }

  // Only redirect if login was successful
  if (loginSuccessful) {
    redirect("/my-account");
  }

  // Fallback error (should never reach here)
  return { errors: { email: ["Възникна грешка"] } };
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
