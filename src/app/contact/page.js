"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import GoogleFormModal from "../../components/GoogleFormModal";
import FloatingDemoButton from "../../components/FloatingDemoButton";

export default function ContactPage() {
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
      "@type": "ContactPage",
      name: "Contact KingCompiler Academy",
      description:
        "Get in touch with KingCompiler Academy for chess, coding, and AI education. Contact us via phone, email, or fill out our contact form.",
      url: "https://kingcompiler.com/contact",
      mainEntity: {
        "@type": "Organization",
        name: "KingCompiler Academy",
        alternateName: "KingCompiler",
        description:
          "Leading online academy for chess, coding, and AI education for kids",
        url: "https://kingcompiler.com",
        logo: "https://kingcompiler.com/logo.png",
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+91-9038162791",
            contactType: "customer service",
            availableLanguage: ["English", "Hindi"],
            areaServed: "Worldwide",
            hoursAvailable: {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ],
              opens: "00:00",
              closes: "23:59",
            },
          },
          {
            "@type": "ContactPoint",
            email: "kingcompiler.official@gmail.com",
            contactType: "customer service",
            availableLanguage: ["English", "Hindi"],
          },
        ],
        address: {
          "@type": "PostalAddress",
          addressCountry: "India",
          addressLocality: "Dubai",
          addressRegion: "UAE",
        },
        sameAs: [
          "https://kingcompiler.substack.com",
          "https://linkedin.com/company/kingcompiler",
          "https://twitter.com/kingcompiler",
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

  const contactMethods = [
    {
      icon: "📞",
      title: "Phone Support",
      details: "+91 90381 62791",
      description: "24/7 customer support available",
      action: "tel:+919038162791",
      actionText: "Call Now",
    },
    {
      icon: "✉️",
      title: "Email Support",
      details: "kingcompiler.official@gmail.com",
      description: "Get detailed responses within 24 hours",
      action: "mailto:kingcompiler.official@gmail.com",
      actionText: "Send Email",
    },
    {
      icon: "🌍",
      title: "Global Reach",
      details: "Dubai, UAE",
      description: "Serving students worldwide",
      action: "#",
      actionText: "Learn More",
    },
    {
      icon: "⏰",
      title: "24/7 Availability",
      details: "Always Open",
      description: "Support available round the clock",
      action: "#",
      actionText: "Get Help",
    },
  ];

  const faqs = [
    {
      question: "What courses do you offer?",
      answer:
        "We offer comprehensive courses in Online Chess Classes for Kids, Coding for Kids, AI & Robotics, Python Programming, Web Development, Game Development, Database Management, and Machine Learning & AI for Kids.",
    },
    {
      question: "How do I enroll my child?",
      answer:
        "You can enroll by calling us at +91 90381 62791, emailing kingcompiler.official@gmail.com, or filling out our contact form above.",
    },
    {
      question: "Do you offer free trials?",
      answer:
        "Yes! We offer free trial sessions for all our courses. Contact us to schedule your child's free trial class.",
    },
    {
      question: "What age groups do you teach?",
      answer:
        "We teach children from ages 6-18, with programs tailored to different age groups and skill levels.",
    },
    {
      question: "Are the classes online or offline?",
      answer:
        "We primarily offer online classes with interactive sessions, but also have hybrid options available.",
    },
    {
      question: "What makes KingCompiler different?",
      answer:
        "We combine expert coaching, personalized learning paths, cutting-edge technology, and proven results with 5,000+ successful students.",
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
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
              Ready to start your child&apos;s journey with KingCompiler? Get in
              touch with us today!
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              <a
                href="tel:+919038162791"
                className="bg-black hover:bg-gray-900 text-yellow-400 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 transform hover:scale-105"
              >
                📞 Call Now
              </a>
              <a
                href="mailto:kingcompiler.official@gmail.com"
                className="bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-800 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 transform hover:scale-105"
              >
                ✉️ Send Email
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Multiple ways to reach us. We&apos;re here to help you and your
              child succeed!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 hover:shadow-lg transition-all duration-300 border border-yellow-200"
              >
                <div className="text-5xl mb-4">{method.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  {method.title}
                </h3>
                <p className="text-sm font-semibold text-gray-800 mb-2 break-words overflow-hidden">
                  {method.details}
                </p>
                <p className="text-gray-600 mb-4">{method.description}</p>
                <a
                  href={method.action}
                  className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  {method.actionText}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-gray-900">
                Send us a Message
              </h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
                    <option value="">Select a subject</option>
                    <option value="enrollment">Course Enrollment</option>
                    <option value="trial">Free Trial Request</option>
                    <option value="support">Technical Support</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-gray-900">
                Contact Information
              </h2>
              <div className="space-y-8">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold mb-4 text-gray-900">
                    Primary Contact
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">📞</div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Phone Number
                        </p>
                        <a
                          href="tel:+919038162791"
                          className="text-yellow-600 hover:text-yellow-700 text-lg"
                        >
                          +91 90381 62791
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">✉️</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">
                          Email Address
                        </p>
                        <a
                          href="mailto:kingcompiler.official@gmail.com"
                          className="text-yellow-600 hover:text-yellow-700 text-sm break-words overflow-hidden block"
                        >
                          kingcompiler.official@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold mb-4 text-gray-900">
                    Business Hours
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monday - Sunday</span>
                      <span className="font-semibold">24/7 Available</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      We&apos;re always here to help you and your child succeed!
                    </p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold mb-4 text-gray-900">
                    Location
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">🌍</div>
                    <div>
                      <p className="font-semibold text-gray-900">Dubai, UAE</p>
                      <p className="text-gray-600">Global Online Academy</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Serving students worldwide through our online platform
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Find answers to common questions about our services
            </p>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-300"
              >
                <h3 className="text-lg font-bold mb-3 text-gray-900">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ backgroundColor: "#FFE565" }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-800 mb-8 max-w-3xl mx-auto">
            Join thousands of parents who have already chosen KingCompiler for
            their child&apos;s education. Contact us today to begin your
            child&apos;s learning journey!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={openFormModal}
              className="bg-black text-yellow-400 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-900 transition-all duration-200 transform hover:scale-105"
            >
              🎯 Book Free Trial
            </button>
            <a
              href="tel:+919038162791"
              className="bg-transparent text-black border-2 border-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-black hover:text-yellow-400 transition-all duration-200 transform hover:scale-105"
            >
              📞 Call +91 90381 62791
            </a>
          </div>
        </div>
      </section>

      <GoogleFormModal isOpen={isFormModalOpen} onClose={closeFormModal} />
      <FloatingDemoButton />
      <Footer />
    </div>
  );
}
