"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import MostPopularCoursesSection from "../components/MostPopularCoursesSection";
import OurOfferingsSection from "../components/OurOfferingsSection";
import WhyChooseUs from "../components/WhyChooseUs";
import BlogSection from "../components/BlogSection";
import AchieversSection from "../components/AchieversSection";
import TestimonialsSection from "../components/TestimonialsSection";
import StatsSection from "../components/StatsSection";
import Footer from "../components/Footer";
import GoogleFormModal from "../components/GoogleFormModal";
import FloatingDemoButton from "../components/FloatingDemoButton";

export default function Home() {
  const [showModal, setShowModal] = useState(false);

  // Handle hash navigation to courses section
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash === "#courses") {
        setTimeout(() => {
          const coursesSection = document.getElementById("courses");
          if (coursesSection) {
            coursesSection.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 100); // Small delay to ensure page is loaded
      }
    }
  }, []);

  const handleBookDemo = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <Navbar onBookDemo={handleBookDemo} />
      <HeroSection onBookDemo={handleBookDemo} />
      <AchieversSection />
      <StatsSection />
      <WhyChooseUs />
      <OurOfferingsSection />
      <MostPopularCoursesSection />
      <TestimonialsSection />
      <Footer />
      <GoogleFormModal isOpen={showModal} onClose={handleCloseModal} />
      <FloatingDemoButton />
    </div>
  );
}
