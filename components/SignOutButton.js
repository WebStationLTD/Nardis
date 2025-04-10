"use client";

import { logout } from "@/app/login/actions";

export default function SignOutButton() {
  const handleSignOut = async () => {
    await logout();
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
