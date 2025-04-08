"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useEffect } from "react";
import { useActionState } from "react";
import { resetPassword } from "./actions";
import { useFormStatus } from "react-dom";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial values from URL parameters
  const initialEmail = searchParams.get("email") || "";
  const initialCode = searchParams.get("code") || "";

  const [state, resetAction] = useActionState(resetPassword, undefined);

  // Redirect to login page after successful password reset
  useEffect(() => {
    if (state?.success) {
      const redirectTimeout = setTimeout(() => {
        router.push("/login");
      }, 3000);

      return () => clearTimeout(redirectTimeout);
    }
  }, [state?.success, router]);

  return (
    <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Възстановяване на парола
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Въведете кода, който получихте на имейла си, и задайте нова парола
          </p>
        </div>

        {state?.success ? (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{state.message}</span>
          </div>
        ) : (
          <form className="mt-8 space-y-6" action={resetAction}>
            {state?.errors?.code && state.errors.code[0] && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{state.errors.code[0]}</span>
              </div>
            )}

            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Имейл адрес
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={initialEmail}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-1"
                  readOnly={!!initialEmail}
                />
                {state?.errors?.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {state.errors.email[0]}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-gray-700"
                >
                  Код за възстановяване
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  defaultValue={initialCode}
                  placeholder="Код от имейла"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-1"
                  readOnly={!!initialCode}
                />
                {state?.errors?.code &&
                  state.errors.code[0] !== "Невалиден код или изтекъл срок" && (
                    <p className="text-red-500 text-xs mt-1">
                      {state.errors.code[0]}
                    </p>
                  )}
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Нова парола
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  placeholder="Нова парола"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-1"
                />
                {state?.errors?.newPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {state.errors.newPassword[0]}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Потвърдете паролата
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Потвърдете паролата"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mt-1"
                />
                {state?.errors?.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {state.errors.confirmPassword[0]}
                  </p>
                )}
              </div>
            </div>

            <div>
              <SubmitButton />
            </div>
          </form>
        )}

        <div className="text-center">
          <p className="text-sm text-gray-600">
            <Link href="/login" className="font-medium text-[#b3438f]">
              Обратно към входа
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md bg-[#b3438f] hover:bg-[#ebedeb] text-white hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 cursor-pointer"
    >
      {pending ? "Изпращане..." : "Променете паролата"}
    </button>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-indigo-600 animate-spin mx-auto"></div>
            <p className="mt-2 text-gray-600">Зареждане...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
