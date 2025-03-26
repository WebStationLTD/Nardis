"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter } from "next/navigation";
import { RegisterSchema } from "@/utils/validationSchemas";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    setServerError("");
    setStatus(null);

    try {
      // Register the user
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Регистрацията неуспешна");
      }

      // If registration is successful, sign in the user
      await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: true,
        callbackUrl: "/my-account",
      });

      // Redirect to my-account page
      router.push("/my-account");
    } catch (err) {
      setServerError(err.message || "Регистрацията неуспешна");
      setStatus({ success: false });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Създайте своя акаунт
          </h2>
        </div>

        <Formik
          initialValues={{
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, status, errors, touched }) => (
            <Form className="mt-8 space-y-6">
              {serverError && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <span className="block sm:inline">{serverError}</span>
                </div>
              )}

              <div className="rounded-md shadow-sm space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Имейл адрес
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    className={`appearance-none relative block w-full px-3 py-2 border ${
                      errors.email && touched.email
                        ? "border-red-500"
                        : "border-gray-300"
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                    placeholder="Вашият имейл адрес"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Парола
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    className={`appearance-none relative block w-full px-3 py-2 border ${
                      errors.password && touched.password
                        ? "border-red-500"
                        : "border-gray-300"
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                    placeholder="Парола"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Потвърдете паролата
                  </label>
                  <Field
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className={`appearance-none relative block w-full px-3 py-2 border ${
                      errors.confirmPassword && touched.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                    placeholder="Потвърдете паролата"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Регистриране..." : "Регистрирайте се"}
                </button>
              </div>
            </Form>
          )}
        </Formik>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Вече имате акаунт?{" "}
            <Link
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Вход
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
