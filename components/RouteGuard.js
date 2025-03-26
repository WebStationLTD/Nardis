"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

// Protects routes that require authentication
export function ProtectedRoute({ children }) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect if explicitly unauthenticated (not during loading)
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [status, router, pathname]);

  // Show loading spinner while checking authentication
  if (status === "loading") {
    return <LoadingSpinner />;
  }

  // Only render the children if the user is authenticated
  return status === "authenticated" ? children : null;
}

// Redirects authenticated users away from routes like login/register
export function PublicRoute({ children }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/my-account");
    }
  }, [status, router]);

  // Show loading spinner while checking authentication
  if (status === "loading") {
    return <LoadingSpinner />;
  }

  // Only render children if user is not authenticated
  return status === "unauthenticated" ? children : null;
} 