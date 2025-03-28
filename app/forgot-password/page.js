"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset } from "./actions";
import { useFormStatus } from "react-dom";

export default function ForgotPasswordPage() {
  const [state, resetAction] = useActionState(requestPasswordReset, undefined);
  
  if (state?.success) {
    const email = state.email;
    
    return (
      <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Възстановяване на парола
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Получихте имейл с код за възстановяване на паролата.
            </p>
          </div>
          
          <div className="mt-8 space-y-6">
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">
                Проверете имейла си за инструкции за възстановяване на паролата
              </span>
            </div>

            <div className="text-center space-y-4">
              <p className="text-gray-700">
                Проверете вашата електронна поща за код за възстановяване и
                следвайте инструкциите.
              </p>

              <Link
                href={`/reset-password?email=${encodeURIComponent(email)}`}
                className="inline-block w-full text-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
              >
                Въведете код за възстановяване
              </Link>

              <p className="text-sm text-gray-600 mt-4">
                Не получихте имейл? Проверете папката със спам или{" "}
                <button
                  onClick={() => resetAction(undefined)}
                  className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
                >
                  опитайте отново
                </button>
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              <Link
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Обратно към входа
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Възстановяване на парола
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Моля, въведете имейла, с който сте се регистрирали. Ще получите инструкции за възстановяване на паролата си.
          </p>
        </div>

        <form className="mt-8 space-y-6" action={resetAction}>
          {/* {state?.errors?.email && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{state.errors.email}</span>
            </div>
          )} */}
          
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Имейл адрес
            </label>
            <input
              id="email"
              name="email"
              type="text"
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Вашият имейл адрес"
            />
            {state?.errors?.email && (
              <p className="text-red-500 text-xs mt-1">{state.errors.email}</p>
            )}
          </div>

          <div>
            <SubmitButton />
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            <Link
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
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
      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 cursor-pointer"
    >
      {pending ? "Изпращане..." : "Изпрати инструкции"}
    </button>
  );
}
