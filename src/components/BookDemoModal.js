/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";

const countryCodes = [
  { code: "+1", name: "USA/Canada" },
  { code: "+91", name: "India" },
  { code: "+44", name: "UK" },
  { code: "+61", name: "Australia" },
  { code: "+971", name: "UAE" },
  { code: "+81", name: "Japan" },
  { code: "+49", name: "Germany" },
  { code: "+86", name: "China" },
  { code: "+33", name: "France" },
  { code: "+7", name: "Russia" },
  // Add more as needed
];

export default function BookDemoModal({ isOpen, onClose }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCode, setSelectedCode] = useState("+91");
  const [course, setCourse] = useState("");
  const [otherCourse, setOtherCourse] = useState("");

  // Loading screen effect when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000); // Show loading for 2 seconds
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    formData.set("country_code", selectedCode);
    if (course === "Other") {
      formData.set("course", otherCourse);
    } else {
      formData.set("course", course);
    }
    try {
      const response = await fetch("https://formspree.io/f/your-form-id", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });
      if (response.ok) {
        setIsSubmitted(true);
        e.target.reset();
        setCourse("");
        setOtherCourse("");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    onClose();
    setIsSubmitted(false);
    setIsLoading(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white/95 backdrop-blur-md rounded-lg shadow-2xl p-8 w-full max-w-md relative border-2 border-gray-300">
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Wait a sec...
            </h3>
            <p className="text-gray-600">Form is getting ready...</p>
          </div>
        ) : !isSubmitted ? (
          <>
            <h3 className="text-2xl font-bold mb-4 text-center">
              Book a Demo Class
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="border-2 border-gray-300 rounded px-4 py-2 bg-white/80 backdrop-blur-sm focus:border-indigo-500 focus:outline-none transition-colors"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="border-2 border-gray-300 rounded px-4 py-2 bg-white/80 backdrop-blur-sm focus:border-indigo-500 focus:outline-none transition-colors"
                required
              />
              <div className="flex gap-2">
                <select
                  name="country_code"
                  value={selectedCode}
                  onChange={(e) => setSelectedCode(e.target.value)}
                  className="border-2 border-gray-300 rounded px-2 py-2 bg-white/80 backdrop-blur-sm focus:border-indigo-500 focus:outline-none transition-colors"
                  required
                >
                  {countryCodes.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} ({c.name})
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  className="border-2 border-gray-300 rounded px-4 py-2 flex-1 bg-white/80 backdrop-blur-sm focus:border-indigo-500 focus:outline-none transition-colors"
                  required
                />
              </div>
              <input
                type="tel"
                name="whatsapp"
                placeholder="WhatsApp Number (optional)"
                className="border-2 border-gray-300 rounded px-4 py-2 bg-white/80 backdrop-blur-sm focus:border-indigo-500 focus:outline-none transition-colors"
              />
              <div>
                <label className="block mb-1 font-medium">
                  Course Interested In
                </label>
                <select
                  name="course"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="border-2 border-gray-300 rounded px-4 py-2 w-full bg-white/80 backdrop-blur-sm focus:border-indigo-500 focus:outline-none transition-colors"
                  required
                >
                  <option value="">Select a course</option>
                  <option value="Chess">Chess</option>
                  <option value="Coding">Coding</option>
                  <option value="Other">Other</option>
                </select>
                {course === "Other" && (
                  <input
                    type="text"
                    name="other_course"
                    value={otherCourse}
                    onChange={(e) => setOtherCourse(e.target.value)}
                    placeholder="Please specify"
                    className="border-2 border-gray-300 rounded px-4 py-2 mt-2 w-full bg-white/80 backdrop-blur-sm focus:border-indigo-500 focus:outline-none transition-colors"
                    required
                  />
                )}
              </div>
              <input
                type="datetime-local"
                name="preferred_time"
                className="border-2 border-gray-300 rounded px-4 py-2 bg-white/80 backdrop-blur-sm focus:border-indigo-500 focus:outline-none transition-colors"
                required
              />
              <textarea
                name="message"
                placeholder="Any specific topics you'd like to cover? (optional)"
                className="border-2 border-gray-300 rounded px-4 py-2 h-20 resize-none bg-white/80 backdrop-blur-sm focus:border-indigo-500 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h3 className="text-2xl font-bold mb-2 text-green-600">
              Thank You!
            </h3>
            <p className="text-gray-600 mb-4">
              Your demo class request has been submitted successfully.
            </p>
            <p className="text-sm text-gray-500">
              We'll contact you within 24 hours to confirm your demo class.
            </p>
            <button
              onClick={closeModal}
              className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded font-semibold hover:bg-indigo-700 transition"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
