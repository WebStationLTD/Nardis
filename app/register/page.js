"use client";

import { useActionState } from "react";
import Link from "next/link";
import { register } from "./actions";
import { useFormStatus } from "react-dom";

export default function RegisterPage() {
  const [state, registerAction] = useActionState(register, undefined);

  return (
    <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Създайте своя акаунт
          </h2>
        </div>
        <form className="mt-8 space-y-6" action={registerAction}>
          <div className="rounded-md shadow-sm space-y-4">
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
                type="email"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Вашият имейл адрес"
              />
              {state?.errors?.email && (
                <p className="text-red-500 text-xs mt-1">
                  {state.errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Парола
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Парола"
              />
              {state?.errors?.password && (
                <p className="text-red-500 text-xs mt-1">
                  {state.errors.password}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Потвърдете паролата
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Потвърдете паролата"
              />
              {state?.errors?.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {state.errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <div>
            <SubmitButton />
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Вече имате акаунт?{" "}
            <Link href="/login" className="font-medium text-[#b3438f]">
              Вход
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
      {pending ? "Регистриране..." : "Регистрирайте се"}
    </button>
  );
}
