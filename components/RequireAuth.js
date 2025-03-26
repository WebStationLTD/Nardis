"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Client component that protects routes by checking session status
 * and redirecting if not authenticated
 */
export default function RequireAuth({ children }) {
  const { status, data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If user is not authenticated and the status is no longer loading,
    // redirect to login page
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-indigo-600 animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Зареждане...</p>
        </div>
      </div>
    );
  }

  // Only render children when authenticated
  if (status === "authenticated") {
    return children;
  }

  // Return null while redirecting
  return null;
} 