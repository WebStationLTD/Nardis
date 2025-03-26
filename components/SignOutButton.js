'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const data = await signOut({ redirect: true, callbackUrl: '/' });
    router.push(data.url);
  };

  return (
    <button
      onClick={handleSignOut}
      className="bg-red-600 hover:bg-red-700 cursor-pointer text-white font-medium py-2 px-4 rounded-md transition duration-300"
    >
      Излизане от профила
    </button>
  );
} 