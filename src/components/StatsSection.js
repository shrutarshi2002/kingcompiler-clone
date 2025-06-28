"use client";

import { useState, useEffect, useMemo } from "react";

export default function StatsSection() {
  const [counts, setCounts] = useState({
    students: 0,
    countries: 0,
    tournaments: 0,
    fidePlayers: 0,
  });

  const [isVisible, setIsVisible] = useState(false);

  const stats = useMemo(
    () => [
      {
        key: "students",
        target: 5000,
        suffix: "+",
        label: "Students Worldwide",
      },
      { key: "countries", target: 10, suffix: "+", label: "Countries" },
      {
        key: "tournaments",
        target: 100,
        suffix: "+",
        label: "Tournaments Won",
      },
      {
        key: "fidePlayers",
        target: 60,
        suffix: "+",
        label: "FIDE Rated Players",
      },
    ],
    []
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById("stats-section");
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    const intervals = {};

    stats.forEach(({ key, target }) => {
      let current = 0;
      const increment = target / steps;

      intervals[key] = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(intervals[key]);
        }

        setCounts((prev) => ({
          ...prev,
          [key]: Math.floor(current),
        }));
      }, stepDuration);
    });

    return () => {
      Object.values(intervals).forEach((interval) => clearInterval(interval));
    };
  }, [isVisible, stats]);

  return (
    <section
      id="stats-section"
      className="py-8"
      style={{ backgroundColor: "#FFD700" }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ key, target, suffix, label }) => (
            <div key={key} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-black mb-1">
                {counts[key].toLocaleString()}
                {suffix}
              </div>
              <div className="text-gray-800 text-xs md:text-sm font-bold">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
