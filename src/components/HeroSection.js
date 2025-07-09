"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function HeroSection({ onBookDemo }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: "/banner.png",
      alt: "Chess and Coding",
      title: "Strategic Thinking Development",
    },
    {
      id: 2,
      image: "/img2.png",
      alt: "Chess",
      title: "Learn Chess from Experts",
    },
    {
      id: 3,
      image: "/img3.png",
      alt: "Coding",
      title: "Master Programming Skills",
    },
  ];

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section
      className="flex flex-col lg:flex-row items-center justify-center flex-1 px-4 py-8 sm:py-12 lg:py-16 max-w-7xl mx-auto"
      style={{ color: "var(--foreground)" }}
    >
      {/* Left Side - Content */}
      <div className="lg:w-1/2 lg:pr-8 xl:pr-12 text-center lg:text-left mb-8 lg:mb-0">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 lg:mb-6 leading-tight">
          <span
            style={{
              background: "linear-gradient(90deg, #222, #444)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 800,
            }}
          >
            #1 Live Online Coding, Chess & Creative Courses
          </span>
          <span className="block" style={{ color: "var(--primary)" }}>
            for Kids & Teens
          </span>
        </h1>
        <p
          className="hero-subtitle text-base sm:text-lg lg:text-xl mb-6 lg:mb-8 leading-relaxed"
          style={{ color: "var(--foreground)" }}
        >
          Learn from expert mentors in fun, interactive, and personalized
          classes that build real-world skills for the future.
          <span
            className="block font-semibold mt-2"
            style={{ color: "var(--primary)" }}
          >
            All Fide Certified Coaches
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
          <button
            onClick={() => {
              const coursesSection = document.getElementById("courses");
              if (coursesSection) {
                coursesSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="px-6 sm:px-8 py-2 sm:py-3 rounded-full text-base sm:text-lg font-semibold shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-2xl"
            style={{
              background: "#000",
              color: "#FFD700",
              border: "2px solid #000",
            }}
          >
            Explore Courses
          </button>
          <button
            onClick={onBookDemo}
            className="border-2 px-6 sm:px-8 py-2 sm:py-3 rounded-full text-base sm:text-lg font-semibold transition-transform duration-200 hover:scale-105 hover:shadow-2xl"
            style={{
              borderColor: "var(--accent)",
              color: "#000",
              background: "#FFD700",
            }}
          >
            Book a Demo Class
          </button>
        </div>
      </div>

      {/* Right Side - Sliding Images with Animated Elements */}
      <div className="lg:w-1/2 lg:pl-8 xl:pl-12 w-full">
        <div className="relative w-full aspect-square mx-auto">
          {/* Top Animated Elements - Hidden on mobile, visible on larger screens */}
          <div
            className="hidden md:block absolute -top-8 -left-4 text-3xl animate-bounce"
            style={{ animationDelay: "0s" }}
          >
            ♟️
          </div>
          <div
            className="hidden md:block absolute -top-6 -right-6 text-2xl animate-pulse"
            style={{ animationDelay: "0.5s" }}
          >
            💻
          </div>
          <div
            className="hidden lg:block absolute -top-12 left-1/2 transform -translate-x-1/2 text-2xl animate-bounce"
            style={{ animationDelay: "1s" }}
          >
            ♞
          </div>

          {/* Animated Text Elements - Back to original positioning */}
          <div
            className="absolute block left-1 sm:left-2 lg:-left-12 top-1/4 sm:top-1/3 text-[10px] sm:text-xs font-semibold animate-pulse z-10 bg-white/80 px-2 sm:px-3 py-0.5 sm:py-1 rounded shadow"
            style={{ color: "#000" }}
          >
            Improves concentration
          </div>
          <div
            className="absolute block right-1 sm:right-2 lg:right-4 bottom-1/4 text-[10px] sm:text-xs font-semibold animate-bounce z-10 bg-white/80 px-2 sm:px-3 py-0.5 sm:py-1 rounded shadow"
            style={{ color: "#000" }}
          >
            Boosts memory
          </div>
          <div
            className="absolute block top-2 sm:top-0 left-1 sm:-left-8 xl:-left-16 text-[10px] sm:text-xs font-semibold animate-pulse z-10 bg-white/80 px-2 sm:px-3 py-0.5 sm:py-1 rounded shadow"
            style={{ color: "#000" }}
          >
            Problem-solving skills
          </div>
          <div
            className="absolute block top-6 sm:top-4 right-1 sm:-right-8 xl:-right-20 text-[10px] sm:text-xs font-semibold animate-bounce z-10 bg-white/80 px-2 sm:px-3 py-0.5 sm:py-1 rounded shadow"
            style={{ color: "#000" }}
          >
            Creative Thinking
          </div>
          <div
            className="absolute block bottom-2 sm:bottom-0 left-1 sm:-left-8 lg:-left-12 text-[10px] sm:text-xs font-semibold animate-pulse z-10 bg-white/80 px-2 sm:px-3 py-0.5 sm:py-1 rounded shadow"
            style={{ color: "#000" }}
          >
            Academic Benefits
          </div>
          <div
            className="absolute block -bottom-10 sm:-bottom-12 lg:-bottom-16 right-1 sm:right-0 text-[10px] sm:text-xs font-semibold animate-bounce z-10 bg-white/80 px-2 sm:px-3 py-0.5 sm:py-1 rounded shadow"
            style={{ color: "#000" }}
          >
            Social & Emotional Growth
          </div>

          {/* Main Carousel Container */}
          <div className="relative w-full h-full aspect-square">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-500 w-full h-full ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            ))}
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all duration-200 hover:scale-110 text-lg"
              style={{ zIndex: 2 }}
            >
              ←
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all duration-200 hover:scale-110 text-lg"
              style={{ zIndex: 2 }}
            >
              →
            </button>
            {/* Dots Indicator */}
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentSlide ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Bottom Animated Elements - Responsive visibility */}
          <div
            className="hidden sm:block absolute -bottom-6 sm:-bottom-8 -left-4 sm:-left-6 text-xl sm:text-2xl animate-bounce"
            style={{ animationDelay: "0.2s" }}
          >
            🚀
          </div>
          <div
            className="hidden sm:block absolute -bottom-4 sm:-bottom-6 -right-6 sm:-right-8 text-2xl sm:text-3xl animate-pulse"
            style={{ animationDelay: "0.7s" }}
          >
            🧠
          </div>
          <div
            className="hidden md:block absolute -bottom-8 sm:-bottom-12 left-1/3 text-xl sm:text-2xl animate-bounce"
            style={{ animationDelay: "1.2s" }}
          >
            🧩
          </div>
          <div
            className="hidden md:block absolute -bottom-6 sm:-bottom-10 right-1/4 text-xl sm:text-2xl animate-pulse"
            style={{ animationDelay: "0.9s" }}
          >
            ⚡
          </div>
        </div>
      </div>
    </section>
  );
}
