"use client";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-indigo-600 animate-spin mx-auto"></div>
        <p className="mt-2 text-gray-600">Зареждане...</p>
      </div>
    </div>
  );
} 