"use client";

import { Suspense } from "react";
import { ProtectedRoute } from "@/components/RouteGuard";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function MyAccountLayout({ children }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProtectedRoute>
        {children}
      </ProtectedRoute>
    </Suspense>
  );
} 