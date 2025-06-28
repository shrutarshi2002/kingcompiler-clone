"use client";

import { useState } from "react";
import GoogleFormModal from "./GoogleFormModal";

export default function FloatingDemoButton() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const openFormModal = () => {
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
  };

  return (
    <>
      {/* Fixed Floating Demo Button */}
      <button
        onClick={openFormModal}
        className="fixed bottom-6 right-24 z-50 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-110 border-2 border-red-600 text-sm"
      >
        BOOK A FREE DEMO CLASS
      </button>

      {/* Google Form Modal */}
      <GoogleFormModal isOpen={isFormModalOpen} onClose={closeFormModal} />
    </>
  );
}
