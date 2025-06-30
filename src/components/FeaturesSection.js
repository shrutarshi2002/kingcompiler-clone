"use client";

import Image from "next/image";

export default function FeaturesSection() {
  const features = [
    {
      icon: "/globe.svg",
      title: "Online Chess Classes for Kids",
      description:
        "Master chess strategies, tactics, and advanced techniques with expert guidance.",
    },
    {
      icon: "/window.svg",
      title: "Coding Classes",
      description:
        "Learn programming languages and software development from scratch to advanced levels.",
    },
    {
      icon: "/file.svg",
      title: "Online Platform",
      description:
        "Access your lessons anytime, anywhere with our comprehensive online learning system.",
    },
  ];

  return (
    <section
      id="features"
      className="py-16"
      style={{ background: "var(--background)" }}
    >
      <div className="max-w-5xl mx-auto px-4">
        <h2
          className="text-3xl font-bold text-center mb-10"
          style={{ color: "var(--primary)" }}
        >
          Our Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-lg shadow hover:shadow-lg transition"
              style={{ background: "var(--surface)", color: "var(--primary)" }}
            >
              <Image
                src={feature.icon}
                alt={feature.title}
                width={48}
                height={48}
              />
              <h3
                className="font-semibold text-xl mt-4 mb-2"
                style={{ color: "var(--accent)" }}
              >
                {feature.title}
              </h3>
              <p style={{ color: "var(--secondary)" }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
