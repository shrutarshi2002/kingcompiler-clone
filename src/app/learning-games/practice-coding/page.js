"use client";

import { useState } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import DragDropGameWithTopics from "./DragDropGameWithTopics";
import FunCoding from "./FunCoding";

const codingGames = [
  { key: "dragdrop", name: "Drag & Drop Challenge" },
  { key: "funcoding", name: "Fun Coding" },
];

export default function PracticeCoding() {
  const [selectedGame, setSelectedGame] = useState("dragdrop");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const gameContent = {
    dragdrop: <DragDropGameWithTopics />,
    funcoding: <FunCoding />,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <aside className="fixed top-24 left-0 w-64 bg-white rounded-lg shadow-lg p-4 h-[calc(100vh-6rem)] overflow-y-auto md:block hidden">
          <h2 className="text-xl font-semibold mb-4">Coding Games</h2>
          <nav>
            <ul className="space-y-2">
              {codingGames.map((game) => (
                <li key={game.key}>
                  <button
                    onClick={() => setSelectedGame(game.key)}
                    className={`w-full text-left p-2 rounded-lg ${
                      selectedGame === game.key
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {game.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden fixed top-16 left-4 z-50 p-2 bg-yellow-400 rounded-lg shadow-lg"
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Mobile menu */}
        <div
          className={`fixed top-24 right-0 w-full h-[calc(100vh-6rem)] bg-transparent backdrop-blur-sm rounded-lg shadow-lg p-4 overflow-y-auto transform transition-transform duration-300 z-50 ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          } md:hidden`}
        >
          <h2 className="text-xl font-semibold mb-4">Coding Games</h2>
          <nav>
            <ul className="space-y-2">
              {codingGames.map((game) => (
                <li key={game.key}>
                  <button
                    onClick={() => {
                      setSelectedGame(game.key);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg ${
                      selectedGame === game.key
                        ? "bg-blue-500 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {game.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex-1 ml-0 md:ml-64 pl-0 pt-16">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full">
            {gameContent[selectedGame]}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
