'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();
  const { update } = useSession();

  const handleSignOut = async () => {
    try {
      // Sign out without redirect
      await signOut({ redirect: false });
      
      // Update the session data
      await update();
      
      // Navigate to home page
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
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