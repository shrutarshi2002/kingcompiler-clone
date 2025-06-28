"use client";

import { useEffect } from "react";

export default function GoogleFormModal({ isOpen, onClose }) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Modal container */}
      <div className="relative w-full max-w-2xl h-[70vh] bg-transparent rounded-xl overflow-hidden">
        {/* Modal header */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-t-xl shadow-lg">
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

        {/* Google Form iframe */}
        <div className="w-full h-full bg-transparent">
          <iframe
            src="https://forms.gle/RGYKvt6qQfLWqwrg8?embedded=true"
            title="Book Demo Class Form"
            className="w-full h-full border-0 bg-transparent"
            frameBorder="0"
            allowFullScreen
            loading="eager"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
