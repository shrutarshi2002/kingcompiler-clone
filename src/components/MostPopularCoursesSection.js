"use client";

import Image from "next/image";
import { useState } from "react";
import GoogleFormModal from "./GoogleFormModal";

const courses = [
  {
    name: "Chess Genius Training",
    image: "/Courses/1.png",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    goal: "Boost logic, memory, focus, and long-term planning.",
    category: "Chess",
    details: [
      "Age: 5+",
      "Format: Live Online",
      "Level: Beginner / Intermediate / Advanced / Master",
    ],
  },
  {
    name: "Coding Logic for Kids (Scratch + Python)",
    image: "/Courses/2.png",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    goal: "Teach programming logic through fun, visual tools.",
    category: "Coding",
    details: [
      "Age: 6+",
      "Format: Live Online",
      "Level: Beginner / Intermediate / Advanced",
    ],
  },
  {
    name: "Web Dev Explorer (HTML, CSS, JS)",
    image: "/Courses/3.png",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    goal: "Build digital creation skills and design mindset.",
    category: "Web Development",
    details: [
      "Age: 8+",
      "Format: Live Online",
      "Level: Beginner / Intermediate / Advanced",
    ],
  },

  {
    name: "Generative AI for Kids",
    image: "/Courses/4.png",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    goal: "Introduce creative + responsible use of AI tools.",
    category: "AI & Technology",
    details: [
      "Age: 8+",
      "Format: Live Online",
      "Level: Beginner / Intermediate / Advanced",
    ],
  },
  {
    name: "Become Prompt Engineer",
    image: "/Courses/5.png",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    goal: "Master the art of crafting effective prompts for AI and LLMs.",
    category: "AI & Technology",
    details: [
      "Age: 12+",
      "Format: Live Online",
      "Level: Beginner / Intermediate / Advanced",
    ],
  },
  {
    name: "Creative Brain Designer",
    image: "/Courses/6.png",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    goal: "Merge design thinking with tech tools.",
    category: "Design",
    details: [
      "Age: 7+",
      "Format: Live Online",
      "Level: Beginner / Intermediate / Advanced",
    ],
  },
  {
    name: "SQL Zero to Hero (Data Mindset)",
    image: "/Courses/7.png",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    goal: "Build analytical and data thinking from scratch.",
    category: "Data Science",
    details: [
      "Age: 10+",
      "Format: Live Online",
      "Level: Beginner / Intermediate / Advanced",
    ],
  },
  {
    name: "App Development for Kids",
    image: "/Courses/8.png",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    goal: "Turn creative ideas into real mobile apps.",
    category: "App Development",
    details: [
      "Age: 9+",
      "Format: Live Online",
      "Level: Beginner / Intermediate / Advanced",
    ],
  },
  {
    name: "Game Development for Young Coders",
    image: "/Courses/9.png",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    goal: "Learn how games are built and coded.",
    category: "Game Development",
    details: [
      "Age: 8+",
      "Format: Live Online",
      "Level: Beginner / Intermediate / Advanced",
    ],
  },
  {
    name: "Robotics with Code & Sensors",
    image: "/Courses/10.png",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    goal: "Combine hands-on building with logical control.",
    category: "Robotics",
    details: [
      "Age: 7+",
      "Format: Live Online",
      "Level: Beginner / Intermediate / Advanced",
    ],
  },
  {
    name: "Vedic Maths Mastery",
    image: "/Courses/11.png",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    goal: "Improve speed, accuracy, and brain agility in math.",
    category: "Mathematics",
    details: [
      "Age: 6+",
      "Format: Live Online",
      "Level: Beginner / Intermediate / Advanced",
    ],
  },
];

const categories = [
  "All",
  "Chess",
  "Coding",
  "Web Development",
  "AI & Technology",
  "Design",
  "Data Science",
  "App Development",
  "Game Development",
  "Robotics",
  "Mathematics",
];

export default function MostPopularCoursesSection() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const openVideoModal = (course) => {
    setSelectedVideo(course);
    setIsModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  const openFormModal = () => {
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
  };

  // Filter courses based on selected category
  const filteredCourses =
    selectedCategory === "All"
      ? courses
      : courses.filter((course) => course.category === selectedCategory);

  return (
    <>
      <section id="courses" className="py-12 bg-yellow-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-2 text-black">
            Our Most Popular Courses
          </h2>
          <p className="text-center text-gray-700 mb-8 text-base md:text-lg">
            A wide range of certified courses designed by experts for the
            holistic development of your child!
          </p>

          {/* Course Filter Navbar */}
          <div className="mb-10">
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-semibold text-sm md:text-base transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white shadow-lg transform scale-105"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Course Count */}
          <div className="text-center mb-6">
            <p className="text-gray-600 text-sm">
              Showing {filteredCourses.length} of {courses.length} courses
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.name}
                className="bg-white rounded-xl shadow-md p-0 flex flex-col items-stretch hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="w-full relative" style={{ height: 180 }}>
                  <Image
                    src={course.image}
                    alt={course.name}
                    fill
                    style={{ objectFit: "cover" }}
                    className="w-full h-full object-cover"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      {course.category}
                    </span>
                  </div>
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                    <button
                      onClick={() => openVideoModal(course)}
                      className="border-2 border-white hover:border-black rounded-full p-4 shadow-lg transform hover:scale-110 transition-all duration-200 backdrop-blur-sm bg-transparent"
                    >
                      <svg
                        className="w-8 h-8 text-white drop-shadow-lg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="mb-3">
                    <h3 className="text-lg font-bold mb-2 text-black">
                      {course.name}
                    </h3>
                    <div className="text-gray-700 text-sm font-medium mb-3">
                      {course.goal}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.details.map((d, i) => {
                      if (d.includes(":")) {
                        const [label, ...descParts] = d.split(":");
                        const desc = descParts.join(":").trim();
                        return (
                          <div
                            key={i}
                            className="flex items-center bg-gray-100 border border-gray-300 rounded px-2 py-1 text-xs font-semibold text-black"
                          >
                            <span>{label}:</span>
                            <span className="ml-1 text-black">{desc}</span>
                          </div>
                        );
                      }
                      return null;
                    })}
                    {/* Class Duration Box */}
                    <div className="flex items-center bg-gray-100 border border-gray-300 rounded px-2 py-1 text-xs font-semibold text-black">
                      <svg
                        className="w-4 h-4 mr-1 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                      <span>Class Duration:</span>
                      <span className="ml-1 text-black">55 min</span>
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="mt-auto flex flex-col gap-2 w-full">
                    <button
                      onClick={openFormModal}
                      className="w-full bg-gradient-to-r from-yellow-300 to-yellow-400 border-2 border-yellow-400 text-black font-bold py-2 px-4 rounded shadow-lg transition-transform duration-200 hover:scale-105 hover:-translate-y-1"
                    >
                      BOOK A Free Trial
                    </button>
                    <button className="w-auto mx-auto flex items-center justify-center bg-white border border-yellow-400 text-black font-bold py-1.5 px-3 rounded shadow-lg hover:bg-yellow-100 transition-colors duration-200 text-sm">
                      Explore more
                      <span className="ml-2 flex items-center">
                        <span className="inline-flex items-center justify-center rounded-full bg-gray-200 w-6 h-6">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="inline-block align-middle"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 17L17 7M7 7h10v10"
                            />
                          </svg>
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No courses found message */}
          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-2xl font-bold text-gray-600 mb-4">
                No courses found
              </h3>
              <p className="text-gray-500">
                Try selecting a different category or browse all courses.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Video Modal */}
      {isModalOpen && selectedVideo && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl rounded-lg overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-t-lg">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedVideo.name}
              </h3>
              <button
                onClick={closeVideoModal}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Video Container */}
            <div
              className="relative w-full"
              style={{ paddingBottom: "56.25%" }}
            >
              <iframe
                src={selectedVideo.videoUrl}
                title={selectedVideo.name}
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-b-lg">
              <p className="text-gray-700 text-sm">{selectedVideo.goal}</p>
            </div>
          </div>
        </div>
      )}

      {/* Google Form Modal */}
      <GoogleFormModal isOpen={isFormModalOpen} onClose={closeFormModal} />
    </>
  );
}
