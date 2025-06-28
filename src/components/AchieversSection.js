"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function AchieversSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const achievers = [
    { id: 1, image: "/Achievers/1.png" },
    { id: 2, image: "/Achievers/2.png" },
    { id: 3, image: "/Achievers/3.png" },
    { id: 4, image: "/Achievers/4.png" },
    { id: 5, image: "/Achievers/5.png" },
    { id: 6, image: "/Achievers/6.png" },
    { id: 7, image: "/Achievers/7.png" },
    { id: 8, image: "/Achievers/8.png" },
    { id: 9, image: "/Achievers/9.png" },
    { id: 10, image: "/Achievers/10.png" },
  ];

  // Create duplicated array for infinite scroll effect
  const duplicatedAchievers = [...achievers, ...achievers, ...achievers];

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Auto-slide every 3 seconds with infinite loop
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        // Reset to beginning of second set when reaching end of first set
        if (nextIndex >= achievers.length) {
          return 0;
        }
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [achievers.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      // Reset to beginning of second set when reaching end of first set
      if (nextIndex >= achievers.length) {
        return 0;
      }
      return nextIndex;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex - 1;
      // Jump to end of first set when going below 0
      if (nextIndex < 0) {
        return achievers.length - 1;
      }
      return nextIndex;
    });
  };

  const getTransformValue = () => {
    const slideWidth = isMobile ? 100 : 100 / 3; // 100% on mobile, 33.33% on desktop
    return currentIndex * slideWidth;
  };

  return (
    <section
      id="achievers"
      className="py-16"
      style={{ background: "var(--background)" }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">
            Our Achievers
          </h2>
          <p className="text-xl mb-8" style={{ color: "var(--secondary)" }}>
            Trusted by 5,000+ students across 10+ countries.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow duration-200"
            aria-label="Previous achiever"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow duration-200"
            aria-label="Next achiever"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Carousel */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${getTransformValue()}%)`,
              }}
            >
              {/* First set of achievers */}
              {achievers.map((achiever, index) => (
                <div
                  key={`first-${achiever.id}`}
                  className="w-full md:w-1/3 flex-shrink-0 px-1 md:px-2"
                >
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-fit mx-auto">
                    {/* Student Image */}
                    <div className="relative w-[350px] h-[350px] md:w-[450px] md:h-[450px]">
                      <Image
                        src={achiever.image}
                        alt={`Achiever ${achiever.id}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 350px, 450px"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Second set of achievers (duplicate for seamless loop) */}
              {achievers.map((achiever, index) => (
                <div
                  key={`second-${achiever.id}`}
                  className="w-full md:w-1/3 flex-shrink-0 px-1 md:px-2"
                >
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-fit mx-auto">
                    {/* Student Image */}
                    <div className="relative w-[350px] h-[350px] md:w-[450px] md:h-[450px]">
                      <Image
                        src={achiever.image}
                        alt={`Achiever ${achiever.id}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 350px, 450px"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Third set of achievers (duplicate for seamless loop) */}
              {achievers.map((achiever, index) => (
                <div
                  key={`third-${achiever.id}`}
                  className="w-full md:w-1/3 flex-shrink-0 px-1 md:px-2"
                >
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-fit mx-auto">
                    {/* Student Image */}
                    <div className="relative w-[350px] h-[350px] md:w-[450px] md:h-[450px]">
                      <Image
                        src={achiever.image}
                        alt={`Achiever ${achiever.id}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 350px, 450px"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {achievers.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  currentIndex === index
                    ? "bg-blue-600"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
      </div>
    </section>
  );
}
