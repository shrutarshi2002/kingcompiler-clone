"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import GoogleFormModal from "../../components/GoogleFormModal";

export default function LearningGamesPage() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const games = [
    {
      id: "chess",
      title: "Practice Chess",
      description:
        "Sharpen your chess skills with interactive puzzles and practice games.",
      image: "/Courses/1.png",
      category: "Chess",
      rating: 4.9,
    },
    {
      id: "coding",
      title: "Practice Coding",
      description:
        "Solve coding challenges and improve your programming logic in a fun way.",
      image: "/Courses/2.png",
      category: "Coding",
      rating: 4.7,
      link: "/learning-games/practice-coding",
    },
    {
      id: "webdev",
      title: "Practice Web Dev",
      description:
        "Build and debug websites with hands-on web development mini-games.",
      image: "/Courses/10.png",
      category: "Web Dev",
      rating: 4.8,
    },
    {
      id: "ai",
      title: "Practice A.I",
      description:
        "Explore artificial intelligence concepts through interactive games and quizzes.",
      image: "/Courses/11.png",
      category: "Artificial Intelligence",
      rating: 4.8,
    },
    {
      id: 5,
      title: "Build-a-Story",
      description:
        "Create interactive stories using code and logic",
      image: "/Courses/12.png",
      category: "Storytelling",
      rating: 4.9,
    },
    {
      id: 6,
      title: "Practice Mathematics",
      description:
        "Tackle math puzzles and games to boost your problem-solving skills.",
      image: "/Courses/12.png",
      category: "Mathematics",
      rating: 5.0,
    },
    {
      id: 6,
      title: "Practice English",
      description:
        "Enhance your English language skills with vocabulary and grammar games.",
      image: "/Courses/9.png",
      category: "English",
      rating: 4.7,
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Chess",
    "Coding",
    "Web Dev",
    "Artificial Intelligence",
    "Mathematics",
    "English",
  ];

  const filteredGames = games.filter((game) => {
    return selectedCategory === "All" || game.category === selectedCategory;
  });

  const openFormModal = () => {
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
  };

  const handlePlayNow = (game) => {
    if (game.title === "Practice Chess") {
      window.location.href = "/learning-games/chess-dashboard";
    } else if (game.title === "Practice Coding") {
      window.location.href = "/learning-games/practice-coding";
    } else {
      openFormModal();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-12" style={{ background: "#FFD700" }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-4">
            Learning Games
          </h1>
          <p className="text-xl md:text-2xl text-black mb-8 max-w-3xl mx-auto">
            Master chess and coding through interactive games designed to make
            learning fun and engaging
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div
              className="bg-white/80 rounded-lg px-6 py-3 border-2"
              style={{ borderColor: "#FFA500", color: "#000" }}
            >
              <p className="font-semibold">{games.length} Games Available</p>
            </div>
            <div
              className="bg-white/80 rounded-lg px-6 py-3 border-2"
              style={{ borderColor: "#FFA500", color: "#000" }}
            >
              <p className="font-semibold">Free to Play</p>
            </div>
            <div
              className="bg-white/80 rounded-lg px-6 py-3 border-2"
              style={{ borderColor: "#FFA500", color: "#000" }}
            >
              <p className="font-semibold">Progress Tracking</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black font-normal"
                style={{ color: "#000" }}
              >
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                    className="text-black hover:bg-[#FFD700] hover:font-bold hover:text-black"
                    style={{ color: "#000" }}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Game Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                  <Image
                    src={game.image}
                    alt={game.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">
                    {game.category}
                  </div>
                  <div className="absolute top-2 left-2 bg-white/90 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <span className="text-yellow-500">★</span> {game.rating}/5
                  </div>
                </div>

                {/* Game Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {game.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {game.description}
                  </p>

                  {/* Game Details */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {game.difficulty}
                    </span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {game.duration}
                    </span>
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                      {game.players} players
                    </span>
                  </div>

                  {/* Play Now Button */}
                  <button
                    onClick={() => handlePlayNow(game)}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <span>🎮</span>
                    Play Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredGames.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No games found with the selected category.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                }}
                className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Clear Filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Playing?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of students who are already learning through our
            interactive games
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={openFormModal}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 px-8 rounded-lg transition-colors duration-200 text-lg"
            >
              🎯 Start Free Trial
            </button>
            <button
              onClick={() =>
                window.open("https://wa.me/919038162791", "_blank")
              }
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-200 text-lg"
            >
              💬 Chat with Us
            </button>
          </div>
        </div>
      </section>

      {/* Modal */}
      <GoogleFormModal isOpen={isFormModalOpen} onClose={closeFormModal} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
