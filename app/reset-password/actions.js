"use server";

import { z } from "zod";

const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Моля, въведете валиден имейл адрес" }).trim(),
  code: z.string().min(1, { message: "Кодът за възстановяване е задължителен" }).trim(),
  newPassword: z
    .string()
    .min(8, { message: "Паролата трябва да бъде поне 8 символа" })
    .regex(/[A-Z]/, { 
      message: "Паролата трябва да съдържа поне една главна буква" 
    })
    .regex(/[a-z]/, { 
      message: "Паролата трябва да съдържа поне една малка буква" 
    })
    .regex(/[0-9]/, { 
      message: "Паролата трябва да съдържа поне една цифра" 
    })
    .trim(),
  confirmPassword: z
    .string()
    .min(1, { message: "Моля, потвърдете паролата" })
    .trim()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Паролите не съвпадат",
  path: ["confirmPassword"]
});

export async function resetPassword(prevState, formData) {
  const result = resetPasswordSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
      message: null
    };
  }

  const { email, code, newPassword } = result.data;

  try {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        code,
        newPassword
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        errors: {
          code: [errorData.error || "Невалиден код или изтекъл срок"]
        },
        message: null
      };
    }

    return {
      success: true,
      errors: null,
      message: "Паролата е променена успешно! Можете да влезете с новата си парола."
    };
  } catch (error) {
    console.error("Password reset error:", error);
    return {
      success: false,
      errors: {
        code: ["Възникна неочаквана грешка. Моля, опитайте отново по-късно."]
      },
      message: null
    };
  }
} 