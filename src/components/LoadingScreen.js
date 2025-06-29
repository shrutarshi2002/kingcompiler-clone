"use client";

import { useState, useEffect } from "react";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time and hide loading screen
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show loading for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center transition-opacity duration-500">
      <div className="text-center">
        <img
          src="/loding.gif"
          alt="Loading..."
          className="mx-auto mb-4"
          style={{ maxWidth: "200px", height: "auto" }}
        />
        <p className="text-gray-600 text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
}
