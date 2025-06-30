"use client";

import { useEffect, useState } from "react";

export default function GoogleFormModal({ isOpen, onClose }) {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      {/* Modal container */}
      <div className="relative w-full max-w-2xl h-[70vh] bg-white rounded-xl overflow-hidden border-2 border-gray-300 shadow-2xl">
        {/* Modal header */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg">
          <h2 className="text-lg font-bold text-black">
            Book Your Free Demo Class
          </h2>
          <button
            onClick={onClose}
            className="text-black hover:text-gray-700 transition-colors duration-200 p-1 rounded-full hover:bg-white hover:bg-opacity-20"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Loading Screen */}
        {!iframeLoaded && (
          <div className="flex items-center justify-center h-full bg-white">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Wait a sec...
              </h3>
              <p className="text-gray-600">Form is getting ready...</p>
            </div>
          </div>
        )}
        <div className="w-full h-full bg-transparent">
          <iframe
            src="https://forms.gle/RGYKvt6qQfLWqwrg8?embedded=true"
            title="Book Demo Class Form"
            className="w-full h-full border-0 bg-transparent"
            frameBorder="0"
            allowFullScreen
            loading="eager"
            style={{ display: iframeLoaded ? "block" : "none" }}
            onLoad={() => setIframeLoaded(true)}
          ></iframe>
        </div>
      </div>
    </div>
  );
}
