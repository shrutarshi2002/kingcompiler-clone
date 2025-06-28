"use client";

export default function OurOfferingsSection() {
  return (
    <section className="py-8 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-black">
          Our Offerings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Group Class */}
          <div
            className="rounded-xl shadow-lg p-4 flex flex-col items-center hover:shadow-2xl transition-shadow duration-300"
            style={{ backgroundColor: "#FFE565" }}
          >
            <div className="mb-2">
              <svg
                width="32"
                height="32"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="text-yellow-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m13-3.13a4 4 0 10-8 0 4 4 0 008 0zm-13 0a4 4 0 108 0 4 4 0 00-8 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-1 text-black">Group Class</h3>
            <p className="text-gray-700 text-center text-sm">
              Collaborative learning in small groups, interactive sessions, and
              peer motivation. Perfect for students who enjoy teamwork and group
              activities.
            </p>
          </div>
          {/* One-to-One */}
          <div
            className="rounded-xl shadow-lg p-4 flex flex-col items-center hover:shadow-2xl transition-shadow duration-300"
            style={{ backgroundColor: "#FFE565" }}
          >
            <div className="mb-2">
              <svg
                width="32"
                height="32"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="text-yellow-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5zm0 7v-6m0 6a9 9 0 110-18 9 9 0 010 18z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-1 text-black">One-to-One</h3>
            <p className="text-gray-700 text-center text-sm">
              Personalized attention, flexible scheduling, and customized lesson
              plans. Ideal for students seeking focused, individual guidance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
