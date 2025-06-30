"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { courses, getCourseById } from "../../../data/courseData";
import Navbar from "../../../components/Navbar";
import GoogleFormModal from "../../../components/GoogleFormModal";
import Footer from "../../../components/Footer";

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    const courseId = parseInt(params.id);
    const foundCourse = getCourseById(courseId);

    if (!foundCourse) {
      router.push("/courses");
      return;
    }

    setCourse(foundCourse);

    // Add structured data for SEO
    if (foundCourse) {
      const courseStructuredData = {
        "@context": "https://schema.org",
        "@type": "Course",
        name: foundCourse.name,
        description: foundCourse.description,
        url: `https://kingmaster.com/courses/${foundCourse.id}`,
        provider: {
          "@type": "Organization",
          name: "KingCompiler Academy",
          url: "https://kingmaster.com",
          logo: "https://kingmaster.com/logo.png",
        },
        courseMode: "online",
        educationalLevel:
          foundCourse.details[2]?.replace("Level: ", "") || "Beginner",
        inLanguage: "en",
        timeRequired: foundCourse.duration,
        teaches: foundCourse.curriculum,
        coursePrerequisites: foundCourse.requirements,
        educationalCredentialAwarded: "Certificate of Completion",
        offers: {
          "@type": "Offer",
          price: foundCourse.price,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          validFrom: new Date().toISOString(),
          url: `https://kingmaster.com/courses/${foundCourse.id}`,
        },
        audience: {
          "@type": "Audience",
          audienceType: "Children aged 5+",
        },
      };

      // Add FAQ structured data
      const faqStructuredData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: foundCourse.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      };

      // Add breadcrumb structured data
      const breadcrumbData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://kingmaster.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Courses",
            item: "https://kingmaster.com/courses",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: foundCourse.name,
            item: `https://kingmaster.com/courses/${foundCourse.id}`,
          },
        ],
      };

      // Inject structured data
      const script1 = document.createElement("script");
      script1.type = "application/ld+json";
      script1.text = JSON.stringify(courseStructuredData);
      document.head.appendChild(script1);

      const script2 = document.createElement("script");
      script2.type = "application/ld+json";
      script2.text = JSON.stringify(faqStructuredData);
      document.head.appendChild(script2);

      const script3 = document.createElement("script");
      script3.type = "application/ld+json";
      script3.text = JSON.stringify(breadcrumbData);
      document.head.appendChild(script3);

      return () => {
        if (document.head.contains(script1)) document.head.removeChild(script1);
        if (document.head.contains(script2)) document.head.removeChild(script2);
        if (document.head.contains(script3)) document.head.removeChild(script3);
      };
    }
  }, [params.id, router]);

  const openFormModal = () => {
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
  };

  const openVideoModal = (e) => {
    e.stopPropagation();
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => setIsVideoModalOpen(false);

  if (!course) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Course Image */}
            <div className="relative">
              <Image
                src={course.image}
                alt={course.name}
                width={600}
                height={400}
                className="rounded-xl shadow-2xl"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {course.category}
                </span>
              </div>
              {/* Play Button Overlay */}
              <button
                onClick={openVideoModal}
                className="absolute inset-0 flex items-center justify-center bg-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer rounded-xl"
                style={{ zIndex: 2 }}
                aria-label="Play Course Video"
              >
                <span className="bg-white bg-opacity-80 rounded-full p-4 shadow-lg">
                  <svg
                    className="w-10 h-10 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </button>
            </div>

            {/* Course Info */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                {course.name}
              </h1>
              <p className="text-xl text-gray-600 mb-6">{course.goal}</p>

              {/* Course Details */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {course.details.map((detail, index) => (
                  <div key={index} className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                    {detail}
                  </div>
                ))}
              </div>

              {/* Price and CTA */}
              <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                  <div>
                    <span className="text-3xl font-bold text-gray-900">
                      {course.price}
                    </span>
                    <span className="text-gray-600 ml-2">per month</span>
                  </div>
                  <div className="text-green-600 font-semibold">
                    {course.trialClass}
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={openFormModal}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    Book Free Trial
                  </button>
                  <button
                    onClick={() => router.push("/courses")}
                    className="bg-white border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    View All Courses
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content Tabs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          {/* Tab Navigation */}
          <div className="flex overflow-x-auto no-scrollbar sm:flex-wrap justify-center mb-8 border-b border-gray-200 gap-2 sm:gap-0">
            {[
              { id: "overview", label: "Overview" },
              { id: "curriculum", label: "Curriculum" },
              { id: "benefits", label: "Benefits" },
              { id: "requirements", label: "Requirements" },
              { id: "reviews", label: "Reviews" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-4 py-2 sm:px-6 sm:py-3 font-semibold text-base sm:text-lg transition-colors duration-200 whitespace-nowrap rounded-t-md sm:rounded-none ${
                  activeTab === tab.id
                    ? "text-yellow-600 border-b-2 border-yellow-600 bg-yellow-50"
                    : "text-gray-600 hover:text-gray-900 bg-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto w-full">
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">
                    Course Description
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Duration</h4>
                    <p className="text-gray-700">{course.duration}</p>
                  </div>
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">Sessions</h4>
                    <p className="text-gray-700">{course.sessionsPerWeek}</p>
                  </div>
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-2">
                      Session Length
                    </h4>
                    <p className="text-gray-700">{course.sessionDuration}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "curriculum" && (
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900">
                  What You&apos;ll Learn
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {course.curriculum.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start p-4 bg-gray-50 rounded-lg"
                    >
                      <span className="text-yellow-600 font-bold mr-3 mt-1">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "benefits" && (
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900">
                  Course Benefits
                </h3>
                <div className="space-y-3">
                  {course.benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-start p-4 bg-green-50 rounded-lg text-base sm:text-lg"
                    >
                      <span className="text-green-600 mr-3 mt-1">
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "requirements" && (
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900">
                  Requirements
                </h3>
                <div className="space-y-3">
                  {course.requirements.map((requirement, index) => (
                    <div
                      key={index}
                      className="flex items-start p-4 bg-blue-50 rounded-lg text-base sm:text-lg"
                    >
                      <span className="text-blue-600 mr-3 mt-1">
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      <span className="text-gray-700">{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-6 text-gray-900">
                  Student Reviews
                </h3>
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 sm:p-8 rounded-xl">
                  <div className="grid gap-4 sm:gap-6">
                    {course.reviews.map((review, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-blue-500 pl-4"
                      >
                        <div className="flex items-center mb-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                  i < review.rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            {review.rating}/5
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{review.comment}</p>
                        <p className="text-sm font-medium text-gray-800">
                          - {review.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of students who have already transformed their skills
            with our expert-led courses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={openFormModal}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-8 rounded-lg transition-colors duration-200 text-lg"
            >
              Book Your Free Trial Class
            </button>
            <button
              onClick={() => router.push("/contact")}
              className="bg-white border-2 border-gray-300 text-gray-700 font-semibold py-4 px-8 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-lg"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {course.faqs && course.faqs.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <div itemScope itemType="https://schema.org/FAQPage">
              <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {course.faqs.slice(0, 20).map((faq, idx) => (
                  <details
                    key={idx}
                    className="bg-white rounded-lg shadow-md p-6 group"
                    itemScope
                    itemProp="mainEntity"
                    itemType="https://schema.org/Question"
                  >
                    <summary
                      className="cursor-pointer text-lg font-semibold text-gray-800 group-open:text-yellow-600 flex items-center justify-between"
                      itemProp="name"
                    >
                      {faq.question}
                      <svg
                        className="w-5 h-5 transform transition-transform group-open:rotate-180"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </summary>
                    <div
                      className="mt-4 text-gray-700 leading-relaxed"
                      itemScope
                      itemProp="acceptedAnswer"
                      itemType="https://schema.org/Answer"
                    >
                      <span itemProp="text">{faq.answer}</span>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* You May Be Interested In Other Courses */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
            Students also search for
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {courses
              .filter((c) => c.id !== course.id)
              .slice(0, 3)
              .map((other) => (
                <div
                  key={other.id}
                  className="bg-gray-50 rounded-xl shadow p-6 flex flex-col"
                >
                  <Image
                    src={other.image}
                    alt={other.name}
                    width={400}
                    height={220}
                    className="rounded-lg mb-4 object-cover"
                  />
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    {other.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {other.description}
                  </p>
                  <button
                    onClick={() => router.push(`/courses/${other.id}`)}
                    className="mt-auto bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
                  >
                    Explore More
                  </button>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      <GoogleFormModal isOpen={isFormModalOpen} onClose={closeFormModal} />

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent px-2 sm:px-0">
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative border-4 border-yellow-500 mx-auto"
            style={{ borderWidth: 5, maxWidth: "95vw" }}
          >
            <button
              onClick={closeVideoModal}
              className="absolute -top-5 -right-5 bg-white border-4 border-yellow-500 rounded-full text-gray-700 hover:text-black text-2xl font-bold z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shadow-lg"
              aria-label="Close Video"
              style={{ borderWidth: 5 }}
            >
              &times;
            </button>
            <div className="relative w-full aspect-video max-h-[80vh]">
              <iframe
                src="https://www.youtube.com/embed/lxIFwQ6GaZI?si=jn8mYOaAkz5MnQ62"
                title="Course Video"
                className="absolute top-0 left-0 w-full h-full rounded-b-lg max-h-[80vh]"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
