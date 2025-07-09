"use client";

import { useState } from "react";

export default function WhyChooseUs() {
  const [activeCard, setActiveCard] = useState(0);

  const reasons = [
    {
      id: 1,
      title: "Expert Instructors",
      description:
        "Learn from certified chess masters and experienced coding professionals who are passionate about teaching and mentoring students.",
      icon: "👨‍🏫",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: 2,
      title: "Champion Students",
      description:
        "Our students consistently win tournaments and competitions, demonstrating the effectiveness of our proven teaching methods.",
      icon: "🏆",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      id: 3,
      title: "Live Classes",
      description:
        "Engage in real-time learning with interactive sessions, live demonstrations, and immediate feedback from instructors.",
      icon: "💻",
      color: "from-green-500 to-green-600",
    },
    {
      id: 4,
      title: "Personalized",
      description:
        "Customized learning paths tailored to each student's skill level, learning style, and specific goals.",
      icon: "📚",
      color: "from-purple-500 to-purple-600",
    },
    {
      id: 5,
      title: "Safe Environment",
      description:
        "A secure, supportive learning environment where students can explore, make mistakes, and grow with confidence.",
      icon: "🛡️",
      color: "from-red-500 to-red-600",
    },
  ];

  return (
    <section
      id="why-choose-us"
      className="py-16"
      style={{ background: "#F9FAFB" }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "#000" }}
          >
            Why Choose Us?
          </h2>
          <p className="text-xl mb-8" style={{ color: "#000" }}>
            Discover what makes Kingcompiler the preferred choice for chess and
            coding education
          </p>
        </div>

        {/* Single Row Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {reasons.map((reason, index) => (
            <div
              key={reason.id}
              className={`bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
                activeCard === index ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => setActiveCard(index)}
            >
              <div
                className={`w-12 h-12 rounded-full bg-gradient-to-r ${reason.color} flex items-center justify-center text-xl mb-3 mx-auto`}
              >
                {reason.icon}
              </div>
              <h3
                className="text-sm font-bold mb-2 text-center"
                style={{ color: "var(--foreground)" }}
              >
                {reason.title}
              </h3>
              <p className="text-gray-600 text-center text-xs leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-lg mb-6" style={{ color: "var(--secondary)" }}>
            Ready to experience the difference?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() =>
                window.open("https://wa.me/919038162791", "_blank")
              }
              className="bg-black hover:bg-gray-800 text-yellow-400 px-8 py-3 rounded-full font-semibold transition-colors duration-200"
            >
              💬 Start Learning Today
            </button>
            <button
              onClick={() => window.open("tel:+919038162791", "_blank")}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-full font-semibold transition-colors duration-200"
            >
              📞 Call for Details
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
