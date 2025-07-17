"use client";

import { useState } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import DragDropGameWithTopics from "./DragDropGameWithTopics";
import FunCoding from "./FunCoding"; // Import the new FunCoding game

const codingGames = [
  { key: "dragdrop", name: "Drag & Drop Challenge" },
  { key: "funcoding", name: "Fun Coding" },
];

export default function PracticeCoding() {
  const [selectedGame, setSelectedGame] = useState("dragdrop");

  const gameContent = {
    dragdrop: <DragDropGameWithTopics />,
    funcoding: <FunCoding />,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row">
          <aside className="flex-shrink-0 w-full md:w-64 bg-white rounded-lg shadow-lg p-6 pr-4 fixed top-24 left-0 h-[calc(100vh-6rem)] z-20">
            <h2 className="text-2xl font-semibold mb-4">Coding Games</h2>
            <div className="space-y-2">
              {codingGames.map((game) => (
                <button
                  key={game.key}
                  onClick={() => setSelectedGame(game.key)}
                  className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                    selectedGame === game.key
                      ? "bg-yellow-400 text-black"
                      : "hover:bg-yellow-100 text-gray-800"
                  }`}
                >
                  {game.name}
                </button>
              ))}
            </div>
          </aside>
          <div className="flex-1 ml-0 md:ml-64 pl-0 pt-16">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full">
              {gameContent[selectedGame]}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
