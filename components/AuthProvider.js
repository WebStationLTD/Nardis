"use client";

import { SessionProvider } from "next-auth/react";

/**
 * Client Authentication Provider 
 * Wraps the SessionProvider from next-auth to provide session context
 * to client components using the App Router
 */
export default function AuthProvider({ children, session }) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
} 