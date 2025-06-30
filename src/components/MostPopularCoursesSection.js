"use client";

import Image from "next/image";
import { useState } from "react";
import GoogleFormModal from "./GoogleFormModal";
import { useRouter } from "next/navigation";
import { courses, categories } from "../data/courseData";

const YOUTUBE_LINK =
  "https://www.youtube.com/embed/lxIFwQ6GaZI?si=jn8mYOaAkz5MnQ62";

export default function MostPopularCoursesSection() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const router = useRouter();

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
                  <div className="absolute inset-0 flex items-center justify-center bg-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
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
                    <button
                      onClick={() => router.push(`/courses/${course.id}`)}
                      className="w-auto mx-auto flex items-center justify-center bg-white border border-yellow-400 text-black font-bold py-1.5 px-3 rounded shadow-lg hover:bg-yellow-100 transition-colors duration-200 text-sm"
                    >
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
        </div>
      </section>

      {/* Video Modal */}
      {isModalOpen && selectedVideo && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4 bg-transparent">
          <div
            className="relative w-full max-w-xl rounded-lg overflow-hidden border-4 border-yellow-500 mx-auto"
            style={{ borderWidth: 5, maxWidth: "95vw" }}
          >
            {/* Cross Button - always visible, outside header */}
            <button
              onClick={closeVideoModal}
              className="absolute top-2 right-2 bg-white border-2 border-gray-400 rounded-full text-black hover:text-yellow-600 text-2xl font-bold z-50 w-10 h-10 flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              aria-label="Close Video"
            >
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-t-lg">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedVideo.name}
              </h3>
            </div>

            {/* Video Container */}
            <div className="relative w-full aspect-video max-h-[80vh]">
              <iframe
                src={YOUTUBE_LINK}
                title={selectedVideo.name}
                className="absolute top-0 left-0 w-full h-full max-h-[80vh]"
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
