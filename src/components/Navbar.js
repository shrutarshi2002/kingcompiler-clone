"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import GoogleFormModal from "./GoogleFormModal";

export default function Navbar() {
  const [arenaOpen, setArenaOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleCoursesClick = () => {
    // Close mobile menu if open
    setMenuOpen(false);

    // If we're not on the homepage, navigate there first
    if (pathname !== "/") {
      router.push("/#courses");
    } else {
      // If we're already on homepage, just scroll to courses
      const coursesSection = document.getElementById("courses");
      if (coursesSection) {
        coursesSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  };

  const openFormModal = () => {
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6"
      style={{ background: "var(--surface)" }}
    >
      <div className="flex items-center">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="KingCompiler Logo"
            width={250}
            height={250}
            className="rounded-lg cursor-pointer"
          />
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-4 text-base font-bold items-center">
        <button
          onClick={handleCoursesClick}
          className="px-4 py-2 rounded transition-all duration-150 text-black font-bold hover:bg-[#fbbf24] hover:scale-105 active:bg-[#fbbf24] active:scale-95 active:border-2 active:border-[#fbbf24]"
          style={{ background: "none" }}
        >
          Courses
        </button>
        <Link href="/about">
          <button
            className="px-4 py-2 rounded transition-all duration-150 text-black font-bold hover:bg-[#fbbf24] hover:scale-105 active:bg-[#fbbf24] active:scale-95 active:border-2 active:border-[#fbbf24]"
            style={{ background: "none" }}
          >
            About Us
          </button>
        </Link>
        <Link href="/blog">
          <button
            className="px-4 py-2 rounded transition-all duration-150 text-black font-bold hover:bg-[#fbbf24] hover:scale-105 active:bg-[#fbbf24] active:scale-95 active:border-2 active:border-[#fbbf24]"
            style={{ background: "none" }}
          >
            Blogs
          </button>
        </Link>
        <div className="relative">
          <button
            onClick={() => setArenaOpen((open) => !open)}
            className="px-4 py-2 rounded transition-all duration-150 text-black font-bold flex items-center gap-1 focus:outline-none hover:bg-[#fbbf24] hover:scale-105 active:bg-[#fbbf24] active:scale-95 active:border-2 active:border-[#fbbf24]"
            style={{ background: "none" }}
          >
            Arena
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {arenaOpen && (
            <div
              className="absolute right-0 mt-2 w-40 rounded shadow-lg z-10"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--primary)",
              }}
            >
              <button
                className="block w-full text-left px-4 py-2 rounded transition-all duration-150 text-black font-bold hover:bg-[#fbbf24] hover:scale-105 active:bg-[#fbbf24] active:scale-95 active:border-2 active:border-[#fbbf24]"
                style={{ background: "none" }}
              >
                Learning Games
              </button>
              <hr className="my-1 border-t border-gray-300 w-3/4 mx-auto" />
              <button
                className="block w-full text-left px-4 py-2 rounded transition-all duration-150 text-black font-bold hover:bg-[#fbbf24] hover:scale-105 active:bg-[#fbbf24] active:scale-95 active:border-2 active:border-[#fbbf24]"
                style={{ background: "none" }}
              >
                Learning Quize
              </button>
              <hr className="my-1 border-t border-gray-300 w-3/4 mx-auto" />
              <button
                className="block w-full text-left px-4 py-2 rounded transition-all duration-150 text-black font-bold hover:bg-[#fbbf24] hover:scale-105 active:bg-[#fbbf24] active:scale-95 active:border-2 active:border-[#fbbf24]"
                style={{ background: "none" }}
              >
                Hackathon
              </button>
              <hr className="my-1 border-t border-gray-300 w-3/4 mx-auto" />
              <button
                className="block w-full text-left px-4 py-2 rounded transition-all duration-150 text-black font-bold hover:bg-[#fbbf24] hover:scale-105 active:bg-[#fbbf24] active:scale-95 active:border-2 active:border-[#fbbf24]"
                style={{ background: "none" }}
              >
                Battle ground
              </button>
            </div>
          )}
        </div>
        <Link href="/contact">
          <button
            className="px-4 py-2 rounded transition-all duration-150 text-black font-bold hover:bg-[#fbbf24] hover:scale-105 active:bg-[#fbbf24] active:scale-95 active:border-2 active:border-[#fbbf24]"
            style={{ background: "none" }}
          >
            Contact Us
          </button>
        </Link>
        <Link href="/privacy-policy">
          <button
            className="px-4 py-2 rounded transition-all duration-150 text-black font-bold hover:bg-[#fbbf24] hover:scale-105 active:bg-[#fbbf24] active:scale-95 active:border-2 active:border-[#fbbf24]"
            style={{ background: "none" }}
          >
            Privacy Policy
          </button>
        </Link>
      </div>
      {/* Burger Menu Icon */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setMenuOpen((open) => !open)}
          className="p-2 rounded focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="absolute top-full left-0 w-full bg-white shadow-lg z-20 flex flex-col md:hidden animate-fade-in space-y-2 overflow-y-auto"
          style={{ maxHeight: "80vh", padding: "1rem 0" }}
        >
          <button
            onClick={handleCoursesClick}
            className="w-full text-left px-4 py-2 rounded transition-all duration-150 text-black font-bold hover:bg-[#fbbf24] hover:scale-105 active:bg-[#fbbf24] active:scale-95 active:border-2 active:border-[#fbbf24]"
            style={{ background: "none" }}
          >
            Courses
          </button>
          <Link href="/about">
            <button
              className="w-full text-left px-4 py-2 rounded transition-all duration-150 text-black font-bold hover:bg-[#fbbf24] hover:scale-105 active:bg-[#fbbf24] active:scale-95 active:border-2 active:border-[#fbbf24]"
              style={{ background: "none" }}
            >
              About Us
            </button>
          </Link>
          <Link href="/blog">
            <button
              className="w-full text-left px-4 py-2 rounded transition-all duration-150 text-black font-bold hover:bg-[#fbbf24] hover:scale-105 active:bg-[#fbbf24] active:scale-95 active:border-2 active:border-[#fbbf24]"
              style={{ background: "none" }}
            >
              Blogs
            </button>
          </Link>
          <div className="w-full relative">
            <button
              onClick={() => setArenaOpen((open) => !open)}
              className="w-full text-left px-4 py-2 rounded transition-all duration-150 text-black font-bold flex items-center gap-1 focus:outline-none hover:bg-[#fbbf24] hover:scale-105 active:bg-[#fbbf24] active:scale-95 active:border-2 active:border-[#fbbf24]"
              style={{ background: "none" }}
            >
              Arena
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {arenaOpen && (
              <div className="w-full rounded shadow-lg z-30 bg-white border border-primary mt-1 flex flex-col space-y-2">
                <button
                  className="block w-full text-left px-4 py-2 rounded transition-all duration-150 text-black font-bold hover:bg-[#fbbf24] hover:scale-105 active:bg-[#fbbf24] active:scale-95 active:border-2 active:border-[#fbbf24]"
                  style={{ background: "none" }}
                >
                  Learning Games
                </button>
                <hr className="my-1 border-t border-gray-300 w-3/4 mx-auto" />
                <button
                  className="block w-full text-left px-4 py-2 rounded transition-all duration-150 text-black font-bold hover:bg-[#fbbf24] hover:scale-105 active:bg-[#fbbf24] active:scale-95 active:border-2 active:border-[#fbbf24]"
                  style={{ background: "none" }}
                >
                  Learning Quize
                </button>
                <hr className="my-1 border-t border-gray-300 w-3/4 mx-auto" />
                <button
                  className="block w-full text-left px-4 py-2 rounded transition-all duration-150 text-black font-bold hover:bg-[#fbbf24] hover:scale-105 active:bg-[#fbbf24] active:scale-95 active:border-2 active:border-[#fbbf24]"
                  style={{ background: "none" }}
                >
                  Hackathon
                </button>
                <hr className="my-1 border-t border-gray-300 w-3/4 mx-auto" />
                <button
                  className="block w-full text-left px-4 py-2 rounded transition-all duration-150 text-black font-bold hover:bg-[#fbbf24] hover:scale-105 active:bg-[#fbbf24] active:scale-95 active:border-2 active:border-[#fbbf24]"
                  style={{ background: "none" }}
                >
                  Battle ground
                </button>
              </div>
            )}
          </div>
          <Link href="/contact">
            <button
              className="w-full text-left px-4 py-2 rounded transition-all duration-150 text-black font-bold hover:bg-[#fbbf24] hover:scale-105 active:bg-[#fbbf24] active:scale-95 active:border-2 active:border-[#fbbf24]"
              style={{ background: "none" }}
            >
              Contact Us
            </button>
          </Link>
          <Link href="/privacy-policy">
            <button
              className="w-full text-left px-4 py-2 rounded transition-all duration-150 text-black font-bold hover:bg-[#fbbf24] hover:scale-105 active:bg-[#fbbf24] active:scale-95 active:border-2 active:border-[#fbbf24]"
              style={{ background: "none" }}
            >
              Privacy Policy
            </button>
          </Link>
        </div>
      )}

      <GoogleFormModal isOpen={isFormModalOpen} onClose={closeFormModal} />
    </nav>
  );
}
