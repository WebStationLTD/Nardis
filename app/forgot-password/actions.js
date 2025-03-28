"use server";

import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Моля, въведете валиден имейл адрес" }).trim(),
});

export async function requestPasswordReset(prevState, formData) {
  const result = forgotPasswordSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
      email: null
    };
  }

  const { email } = result.data;

  try {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        errors: {
          email: [errorData.error || "Възникна грешка при изпращането на имейл за възстановяване"],
        },
        email: null
      };
    }

    return {
      success: true,
      errors: null,
      email: email
    };
  } catch (error) {
    console.error("Password reset request error:", error);
    return {
      success: false,
      errors: {
        email: ["Възникна неочаквана грешка. Моля, опитайте отново по-късно."],
      },
      email: null
    };
  }
} 