"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import GoogleFormModal from "../../components/GoogleFormModal";
import FloatingDemoButton from "../../components/FloatingDemoButton";

export default function AboutPage() {
  const [isClient, setIsClient] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // SEO optimization - Add structured data only on client
  useEffect(() => {
    if (!isClient) return;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "KingCompiler Academy",
      alternateName: "KingCompiler",
      description:
        "Leading online academy for chess, coding, and AI education for kids. Trusted by 5,000+ students across 10+ countries.",
      url: "https://kingcompiler.com",
      logo: "https://kingcompiler.com/logo.png",
      sameAs: [
        "https://kingcompiler.substack.com",
        "https://linkedin.com/company/kingcompiler",
        "https://twitter.com/kingcompiler",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+91-9038162791",
        contactType: "customer service",
        availableLanguage: ["English", "Hindi"],
      },
      address: {
        "@type": "PostalAddress",
        addressCountry: "India",
        addressLocality: "Dubai",
        addressRegion: "UAE",
      },
      founder: {
        "@type": "Person",
        name: "KingCompiler Team",
        jobTitle: "Founder & CEO",
      },
      foundingDate: "2020",
      numberOfEmployees: "50+",
      knowsAbout: [
        "Chess Education",
        "Coding for Kids",
        "AI Training",
        "Online Learning",
        "Child Development",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Educational Courses",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Course",
              name: "Chess Genius Training",
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
              name: "Generative AI for Kids",
            },
          },
        ],
      },
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [isClient]);

  const stats = [
    { number: "5,000+", label: "Happy Students", icon: "👨‍🎓" },
    { number: "10+", label: "Countries", icon: "🌍" },
    { number: "4.9/5", label: "Average Rating", icon: "⭐" },
    { number: "100%", label: "Satisfaction Rate", icon: "💯" },
    { number: "50+", label: "Expert Coaches", icon: "👨‍🏫" },
    { number: "11", label: "Specialized Courses", icon: "📚" },
  ];

  const values = [
    {
      icon: "🎯",
      title: "Excellence in Education",
      description:
        "We maintain the highest standards in our curriculum and teaching methodologies, ensuring every child receives world-class education.",
    },
    {
      icon: "🤝",
      title: "Personalized Learning",
      description:
        "Every child is unique. We tailor our approach to match individual learning styles and pace, ensuring maximum engagement and growth.",
    },
    {
      icon: "🚀",
      title: "Innovation First",
      description:
        "We stay ahead of educational trends, incorporating cutting-edge technology and modern teaching techniques into our programs.",
    },
    {
      icon: "❤️",
      title: "Child-Centric Approach",
      description:
        "Children's happiness and development are at the heart of everything we do. We create a safe, nurturing environment for learning.",
    },
  ];

  const team = [
    {
      name: "Chess Masters",
      role: "International Chess Coaches",
      image: "/Expert/1.png",
      description: "FIDE-rated players with years of teaching experience",
    },
    {
      name: "Tech Experts",
      role: "Senior Software Engineers",
      image: "/Expert/2.png",
      description: "Industry professionals from top tech companies",
    },
    {
      name: "AI Specialists",
      role: "Machine Learning Engineers",
      image: "/Expert/3.png",
      description: "Experts in AI and emerging technologies",
    },
    {
      name: "Education Leaders",
      role: "Child Development Specialists",
      image: "/Expert/4.png",
      description: "Certified educators with psychology backgrounds",
    },
  ];

  const studentJourney = [
    {
      stage: "Stage 1",
      title: "Complete Beginner",
      description:
        "Students start with zero knowledge, learning basic concepts and building confidence through fun, interactive lessons.",
      icon: "🌱",
      duration: "0-3 months",
    },
    {
      stage: "Stage 2",
      title: "Foundation Builder",
      description:
        "Students develop core skills and understanding, practicing regularly and building a strong foundation for advanced learning.",
      icon: "🏗️",
      duration: "3-6 months",
    },
    {
      stage: "Stage 3",
      title: "Skill Developer",
      description:
        "Students master intermediate concepts, participate in competitions, and start applying their knowledge to real-world projects.",
      icon: "⚡",
      duration: "6-12 months",
    },
    {
      stage: "Stage 4",
      title: "Advanced Learner",
      description:
        "Students tackle complex challenges, mentor others, and develop leadership skills while preparing for championship-level competitions.",
      icon: "🚀",
      duration: "12-18 months",
    },
    {
      stage: "Stage 5",
      title: "Champion",
      description:
        "Students become experts in their field, win competitions, and serve as role models for new learners joining the academy.",
      icon: "🏆",
      duration: "18+ months",
    },
  ];

  const openFormModal = () => {
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-yellow-50 to-orange-50 overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h1
              className="text-5xl md:text-7xl font-bold mb-6 text-yellow-500"
              style={{ WebkitTextStroke: "2px black", textStroke: "2px black" }}
            >
              About KingCompiler
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
              Empowering the next generation through innovative education in
              chess, coding, and AI. We&apos;re building future leaders, one
              child at a time.
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              <button className="bg-black hover:bg-gray-900 text-yellow-400 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 transform hover:scale-105">
                🎯 Our Mission
              </button>
              <button className="bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-800 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 transform hover:scale-105">
                📞 Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900">
                Our Mission & Vision
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
                    🎯 Our Mission
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    To democratize quality education by making world-class
                    chess, coding, and AI training accessible to every child,
                    regardless of their location or background. We believe every
                    child deserves the opportunity to develop critical thinking,
                    creativity, and technical skills.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-purple-600 flex items-center">
                    🔮 Our Vision
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    To become the global leader in online education for
                    children, creating a world where every child is equipped
                    with the skills, confidence, and mindset to thrive in the
                    21st century and beyond.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div
                className="rounded-2xl p-8 text-black font-bold"
                style={{ backgroundColor: "#FFE565" }}
              >
                <h3 className="text-2xl font-bold mb-6">
                  Why Choose KingCompiler?
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">✅</span>
                    <span>
                      Expert coaches with international certifications
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">✅</span>
                    <span>Personalized learning paths for every child</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">✅</span>
                    <span>Cutting-edge technology and modern curriculum</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">✅</span>
                    <span>
                      Proven track record with 5,000+ successful students
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-2xl mr-3">✅</span>
                    <span>24/7 support and flexible scheduling</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do and shape the learning
              experience we provide to our students.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Meet Our Expert Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our team consists of certified professionals, industry experts,
              and passionate educators dedicated to your child&apos;s success.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  {member.name}
                </h3>
                <p className="text-gray-800 font-semibold mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Journey Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Student Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From complete beginner to champion - see how our students
              transform through our structured learning path.
            </p>
          </div>
          <div className="relative">
            {/* Timeline line: visible on all screens, centered. Thinner and shorter on mobile. */}
            <div
              className="absolute left-1/2 top-0 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-green-400 to-blue-600 z-0"
              style={{ minHeight: "100%" }}
            ></div>
            <div className="space-y-12 relative z-10">
              {studentJourney.map((stage, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center sm:flex-row ${
                    index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                >
                  {/* Timeline dot for mobile, centered above card */}
                  <div className="flex flex-col items-center w-full sm:hidden mb-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  {/* Card */}
                  <div className="w-full sm:w-1/2 px-2 sm:px-8 flex justify-center sm:justify-start">
                    <div
                      className={`bg-white w-full max-w-xs sm:max-w-full p-2 sm:p-6 rounded-xl shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-all duration-300 ${
                        index % 2 === 0 ? "sm:text-right" : "sm:text-left"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <div className="text-xl sm:text-3xl">{stage.icon}</div>
                        <div className="text-xs sm:text-sm font-semibold text-green-600 bg-green-50 px-2 sm:px-3 py-1 rounded-full">
                          {stage.duration}
                        </div>
                      </div>
                      <div className="text-sm sm:text-lg font-bold text-green-600 mb-1 sm:mb-2">
                        {stage.stage}
                      </div>
                      <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-2 text-gray-900">
                        {stage.title}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-base leading-relaxed">
                        {stage.description}
                      </p>
                    </div>
                  </div>
                  {/* Timeline dot for desktop, between cards */}
                  <div className="hidden sm:flex w-6 h-6 bg-gradient-to-r from-green-400 to-blue-600 rounded-full border-4 border-white shadow-lg my-2 sm:my-0"></div>
                  <div className="hidden sm:block w-1/2 px-8"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ backgroundColor: "#FFE565" }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">
            Ready to Start Your Child&apos;s Journey?
          </h2>
          <p className="text-xl text-gray-800 mb-8 max-w-3xl mx-auto">
            Join thousands of parents who have already chosen KingCompiler for
            their child&apos;s education. Start with a free trial today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={openFormModal}
              className="bg-black text-yellow-400 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-900 transition-all duration-200 transform hover:scale-105"
            >
              🎯 Start Free Trial
            </button>
            <button
              onClick={openFormModal}
              className="bg-transparent text-black border-2 border-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-black hover:text-yellow-400 transition-all duration-200 transform hover:scale-105"
            >
              📞 Talk to Expert
            </button>
          </div>
        </div>
      </section>

      <GoogleFormModal isOpen={isFormModalOpen} onClose={closeFormModal} />
      <FloatingDemoButton />
      <Footer />
    </div>
  );
}
