"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Parent",
      studentName: "Arjun (8 years)",
      course: "Chess Genius Training",
      location: "Mumbai, India",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      text: "Arjun's strategic thinking has improved dramatically. The coaches are amazing and the online platform is so convenient!",
    },
    {
      id: 2,
      name: "Rahul Mehta",
      role: "Student",
      age: "12 years",
      course: "Coding Logic for Kids",
      location: "Delhi, India",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      text: "I love learning Python! The teachers make coding fun and I've already built my first game. Can't wait for the next class!",
    },
    {
      id: 3,
      name: "Sarah Johnson",
      role: "Parent",
      studentName: "Emma (10 years)",
      course: "Web Dev Explorer",
      location: "New York, USA",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      text: "Emma is so excited about creating websites! The teachers are patient and the curriculum is perfectly designed for kids.",
    },
    {
      id: 4,
      name: "Ahmed Hassan",
      role: "Student",
      age: "14 years",
      course: "Generative AI for Kids",
      location: "Dubai, UAE",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      text: "Learning about AI is fascinating! The teachers explain complex concepts in simple ways. I'm creating amazing AI art now!",
    },
    {
      id: 5,
      name: "Lisa Chen",
      role: "Parent",
      studentName: "Michael (9 years)",
      course: "Become Prompt Engineer",
      location: "Toronto, Canada",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      text: "Michael is learning skills that will be valuable for his future. The prompt engineering course is ahead of its time!",
    },
    {
      id: 6,
      name: "David Kim",
      role: "Student",
      age: "11 years",
      course: "Creative Brain Designer",
      location: "Seoul, South Korea",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      text: "I love combining design and technology! The teachers encourage creativity and I've learned so many new skills.",
    },
    {
      id: 7,
      name: "Maria Rodriguez",
      role: "Parent",
      studentName: "Sofia (7 years)",
      course: "SQL Zero to Hero",
      location: "Madrid, Spain",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
      text: "Sofia is developing excellent analytical thinking skills. The data mindset course is perfect for her age!",
    },
    {
      id: 8,
      name: "James Wilson",
      role: "Student",
      age: "13 years",
      course: "App Development for Kids",
      location: "London, UK",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      text: "I've created my first mobile app! The teachers are supportive and the projects are really fun to build.",
    },
    {
      id: 9,
      name: "Yuki Tanaka",
      role: "Parent",
      studentName: "Kenji (8 years)",
      course: "Game Development for Young Coders",
      location: "Tokyo, Japan",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=150&h=150&fit=crop&crop=face",
      text: "Kenji is so excited about creating games! The course structure is excellent and the teachers are very knowledgeable.",
    },
    {
      id: 10,
      name: "Anna Kowalski",
      role: "Student",
      age: "10 years",
      course: "Robotics with Code & Sensors",
      location: "Warsaw, Poland",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      text: "Building robots is amazing! I love combining hardware and software. The sensors make everything so interactive!",
    },
    {
      id: 11,
      name: "Carlos Mendez",
      role: "Parent",
      studentName: "Isabella (6 years)",
      course: "Vedic Maths Mastery",
      location: "Mexico City, Mexico",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      text: "Isabella's math skills have improved tremendously! The Vedic methods are fascinating and very effective.",
    },
    {
      id: 12,
      name: "Sophie Martin",
      role: "Student",
      age: "15 years",
      course: "Chess Genius Training",
      location: "Paris, France",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
      text: "My chess rating has improved by 200 points! The strategic thinking skills I've learned are valuable in all areas.",
    },
    {
      id: 13,
      name: "Raj Patel",
      role: "Parent",
      studentName: "Aisha (9 years)",
      course: "Coding Logic for Kids",
      location: "Bangalore, India",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      text: "Aisha is developing excellent problem-solving skills. The coding course is perfectly structured for young learners.",
    },
    {
      id: 14,
      name: "Emma Thompson",
      role: "Student",
      age: "12 years",
      course: "Web Dev Explorer",
      location: "Melbourne, Australia",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      text: "I've built my own website! The HTML, CSS, and JavaScript classes are so much fun and very practical.",
    },
    {
      id: 15,
      name: "Hiroshi Yamamoto",
      role: "Parent",
      studentName: "Yuki (11 years)",
      course: "Generative AI for Kids",
      location: "Osaka, Japan",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      text: "Yuki is fascinated by AI! The course introduces complex topics in an age-appropriate way. Highly recommended!",
    },
    {
      id: 16,
      name: "Lucas Silva",
      role: "Student",
      age: "13 years",
      course: "Become Prompt Engineer",
      location: "São Paulo, Brazil",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      text: "Learning prompt engineering is like learning a new language! The teachers make it easy to understand.",
    },
    {
      id: 17,
      name: "Nina Petrov",
      role: "Parent",
      studentName: "Dimitri (8 years)",
      course: "Creative Brain Designer",
      location: "Moscow, Russia",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      text: "Dimitri's creativity has blossomed! The design thinking approach is wonderful for developing innovative minds.",
    },
    {
      id: 18,
      name: "Alex Johnson",
      role: "Student",
      age: "14 years",
      course: "SQL Zero to Hero",
      location: "Stockholm, Sweden",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      text: "Data analysis is so interesting! I can now work with databases and understand how information is organized.",
    },
    {
      id: 19,
      name: "Fatima Al-Zahra",
      role: "Parent",
      studentName: "Omar (10 years)",
      course: "App Development for Kids",
      location: "Cairo, Egypt",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
      text: "Omar is so proud of his first app! The development process is well-structured and the results are impressive.",
    },
    {
      id: 20,
      name: "Maya Singh",
      role: "Student",
      age: "11 years",
      course: "Game Development for Young Coders",
      location: "Singapore",
      rating: 5,
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      text: "Creating games is my favorite hobby now! The teachers explain game mechanics in such an engaging way.",
    },
  ];

  const stats = [
    { number: "5,000+", label: "Happy Students" },
    { number: "10+", label: "Countries" },
    { number: "4.9/5", label: "Average Rating" },
    { number: "100%", label: "Satisfaction Rate" },
  ];

  // Calculate total number of slides (2 testimonials per slide)
  const totalSlides = Math.ceil(testimonials.length / 2);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= totalSlides - 1 ? 0 : prevIndex + 1
    );
  }, [totalSlides]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalSlides - 1 : prevIndex - 1
    );
  };

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section
      id="testimonials"
      className="py-16"
      style={{ background: "#FFE565" }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">
            What Our Students & Parents Say
          </h2>
          <p className="text-xl mb-8 text-black opacity-90">
            Trusted by 5,000+ students across 10+ countries.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow duration-200"
            aria-label="Previous testimonial"
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
            aria-label="Next testimonial"
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
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {/* Create slides with 2 testimonials each */}
              {Array.from({ length: totalSlides }, (_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0 flex">
                  {/* First testimonial in the slide */}
                  <div className="w-1/2 px-2">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
                      <div className="p-6">
                        {/* Header */}
                        <div className="flex items-center mb-4">
                          <Image
                            src={testimonials[slideIndex * 2].image}
                            alt={testimonials[slideIndex * 2].name}
                            className="w-12 h-12 rounded-full object-cover mr-4"
                            width={48}
                            height={48}
                          />
                          <div>
                            <h3 className="font-bold text-gray-900">
                              {testimonials[slideIndex * 2].name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {testimonials[slideIndex * 2].role === "Parent"
                                ? `${
                                    testimonials[slideIndex * 2].studentName
                                  } • ${testimonials[slideIndex * 2].course}`
                                : `${testimonials[slideIndex * 2].age} • ${
                                    testimonials[slideIndex * 2].course
                                  }`}
                            </p>
                            <p className="text-xs text-gray-500">
                              {testimonials[slideIndex * 2].location}
                            </p>
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center mb-4">
                          {[...Array(testimonials[slideIndex * 2].rating)].map(
                            (_, i) => (
                              <svg
                                key={i}
                                className="w-5 h-5 text-yellow-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            )
                          )}
                          <span className="ml-2 text-sm font-semibold text-gray-700">
                            {testimonials[slideIndex * 2].rating}/5
                          </span>
                        </div>

                        {/* Testimonial Text */}
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          &ldquo;{testimonials[slideIndex * 2].text}&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Second testimonial in the slide (if exists) */}
                  {slideIndex * 2 + 1 < testimonials.length && (
                    <div className="w-1/2 px-2">
                      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
                        <div className="p-6">
                          {/* Header */}
                          <div className="flex items-center mb-4">
                            <Image
                              src={testimonials[slideIndex * 2 + 1].image}
                              alt={testimonials[slideIndex * 2 + 1].name}
                              className="w-12 h-12 rounded-full object-cover mr-4"
                              width={48}
                              height={48}
                            />
                            <div>
                              <h3 className="font-bold text-gray-900">
                                {testimonials[slideIndex * 2 + 1].name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {testimonials[slideIndex * 2 + 1].role ===
                                "Parent"
                                  ? `${
                                      testimonials[slideIndex * 2 + 1]
                                        .studentName
                                    } • ${
                                      testimonials[slideIndex * 2 + 1].course
                                    }`
                                  : `${
                                      testimonials[slideIndex * 2 + 1].age
                                    } • ${
                                      testimonials[slideIndex * 2 + 1].course
                                    }`}
                              </p>
                              <p className="text-xs text-gray-500">
                                {testimonials[slideIndex * 2 + 1].location}
                              </p>
                            </div>
                          </div>

                          {/* Rating */}
                          <div className="flex items-center mb-4">
                            {[
                              ...Array(testimonials[slideIndex * 2 + 1].rating),
                            ].map((_, i) => (
                              <svg
                                key={i}
                                className="w-5 h-5 text-yellow-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="ml-2 text-sm font-semibold text-gray-700">
                              {testimonials[slideIndex * 2 + 1].rating}/5
                            </span>
                          </div>

                          {/* Testimonial Text */}
                          <p className="text-gray-700 mb-4 leading-relaxed">
                            &ldquo;{testimonials[slideIndex * 2 + 1].text}
                            &rdquo;
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalSlides }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  currentIndex === index
                    ? "bg-black"
                    : "bg-black opacity-50 hover:opacity-75"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-black mb-2">
                {stat.number}
              </div>
              <div className="text-black opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
