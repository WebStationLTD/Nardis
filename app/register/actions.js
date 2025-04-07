"use server";

import { z } from "zod";
import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";

const registerSchema = z.object({
  email: z.string().email({ message: "Невалиден имейл адрес" }).trim(),
  password: z
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
    .trim(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Паролите не съвпадат",
  path: ["confirmPassword"],
});

export async function register(prevState, formData) {
  const result = registerSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email, password } = result.data;

  let registrationSuccessful = false;

  try {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        errors: {
          email: [data.error || "Регистрацията неуспешна"],
        },
      };
    }

    const data = await response.json();

    // Now login with the credentials
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    if (!loginResponse.ok) {
      return {
        errors: {
          email: ["Регистрацията успешна, но автоматичното влизане е неуспешно. Моля, влезте ръчно."],
        },
      };
    }

    const loginData = await loginResponse.json();
    
    // Get JWT token and create session
    // Check for both jwt_token in extras and data.jwt in the response
    const jwt = loginData.user?.extras?.jwt_token || loginData.user?.data?.jwt || loginData.jwt;
    
    if (!jwt) {
      return {
        errors: {
          email: ["Регистрацията успешна, но автоматичното влизане е неуспешно. JWT токенът липсва в отговора."],
        },
      };
    }
    
    // Create session with JWT token
    const sessionCreated = await createSession(jwt);
    
    if (!sessionCreated) {
      return {
        errors: {
          email: ["Регистрацията успешна, но създаването на сесия е неуспешно. Моля, влезте ръчно."],
        },
      };
    }
    
    registrationSuccessful = true;
  } catch (error) {
    console.error("Register error:", error);
    return {
      errors: {
        email: ["Възникна неочаквана грешка при регистрацията"],
      },
    };
  }

  // Only redirect if registration was successful
  if (registrationSuccessful) {
    redirect("/my-account");
  }
  
  // Fallback error (should never reach here)
  return { errors: { email: ["Нещо се обърка"] } };
} 