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
import SEOHead from "../components/SEOHead";

export default function Home() {
  const [showModal, setShowModal] = useState(false);

  // SEO structured data for homepage
  const homepageStructuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "KingCompiler Academy",
    url: "https://kingmaster.com",
    logo: "https://kingmaster.com/logo.png",
    description:
      "Leading online academy offering expert-led courses in chess, coding, AI, and robotics for children aged 5+",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "English",
    },
    sameAs: [
      "https://facebook.com/kingcompiler",
      "https://twitter.com/kingcompiler",
      "https://instagram.com/kingcompiler",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Online Courses for Kids",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Course",
            name: "Online Chess Classes for Kids",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Course",
            name: "Coding Logic for Kids",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Course",
            name: "Machine Learning and AI for Kids",
          },
        },
      ],
    },
  };

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
      <SEOHead
        title="KingCompiler - Online Academy for Chess, Coding, AI & Robotics for Kids"
        description="Transform your child's future with expert-led online classes in Chess, Coding, AI, Robotics, and more. Free trial available. Join 1000+ happy students!"
        keywords="online chess classes, coding for kids, AI classes, robotics for children, online education, kids programming, chess academy, STEM education, online learning"
        image="https://kingmaster.com/banner.png"
        url="https://kingmaster.com"
        type="website"
        structuredData={homepageStructuredData}
      />
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
