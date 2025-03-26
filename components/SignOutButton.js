'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      // Sign out with redirect to home page
      await signOut({ 
        redirect: false, 
        callbackUrl: '/' 
      });
      
      // Clear any local storage items if needed
      // localStorage.removeItem('cart');
      
      // Manual redirect after cleanup
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className="bg-red-600 hover:bg-red-700 cursor-pointer text-white font-medium py-2 px-4 rounded-md transition duration-300 disabled:opacity-50"
    >
      {isLoading ? 'Изчакайте...' : 'Излизане от профила'}
    </button>
  );
} 