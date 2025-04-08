"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "./actions";
import { useFormStatus } from "react-dom";

export default function LoginForm() {
  const [state, loginAction] = useActionState(login, undefined);

  return (
    <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Вход във вашия акаунт
          </h2>
        </div>
        <form className="mt-8 space-y-6" action={loginAction}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Имейл адрес
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Имейл адрес"
              />
              <p className="text-red-500 text-xs">{state?.errors?.email}</p>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Парола
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Парола"
              />
              <p className="text-red-500 text-xs">{state?.errors?.password}</p>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-[#b3438f]"
              >
                Забравена парола?
              </Link>
            </div>
          </div>
          <div>
            <SubmitButton />
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Нямате акаунт?{" "}
            <Link href="/register" className="font-medium text-[#b3438f]">
              Регистрация
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
      {pending ? "Влизане..." : "Вход"}
    </button>
  );
}
