"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Зареждане...</p>;
  }

  if (!session) {
    return <p>Пренасочване...</p>;
  }

  return (
    <div>
      <h1>Здравей, {session.user.name}!</h1>
      <p>Имейл: {session.user.email}</p>
    </div>
  );
}
