"use client";
import { useState, useEffect, useCallback } from "react";
import { Chess } from "chess.js";
import ChessboardDisplay from "./ChessboardDisplay";

const LICHESS_API_URL = "https://explorer.lichess.ovh/lichess";

function OpeningTrainer() {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [openingData, setOpeningData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userColor, setUserColor] = useState("w");

  const fetchOpeningData = useCallback(async (currentFen) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${LICHESS_API_URL}?variant=standard&fen=${currentFen}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setOpeningData(data);
    } catch (e) {
      setError("Failed to fetch opening data. Please try again later.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOpeningData(fen);
  }, [fen, fetchOpeningData]);

  const handleMove = (from, to) => {
    const newGame = new Chess(fen);
    try {
      const move = newGame.move({
        from,
        to,
        promotion: "q", // Default to queen promotion
      });
      if (move) {
        setGame(newGame);
        setFen(newGame.fen());
      }
    } catch (e) {
      // Invalid move
    }
  };

  const handleOpeningMoveClick = (move) => {
    const newGame = new Chess(fen);
    try {
      const result = newGame.move(move.san);
      if (result) {
        setGame(newGame);
        setFen(newGame.fen());
      }
    } catch (e) {
      // Move is invalid for some reason
    }
  };

  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setUserColor("w");
  };

  const undoMove = () => {
    const newGame = new Chess(fen);
    newGame.undo();
    setGame(newGame);
    setFen(newGame.fen());
  };

  const flipBoard = () => {
    setUserColor((prev) => (prev === "w" ? "b" : "w"));
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 p-4">
      <div className="lg:w-2/3 flex justify-center items-center">
        <ChessboardDisplay
          fen={fen}
          onMove={handleMove}
          userColor={userColor}
        />
      </div>
      <div className="lg:w-1/3">
        <h2 className="text-2xl font-bold mb-4">Opening Explorer</h2>
        <div className="flex gap-2 mb-4">
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition"
          >
            Reset
          </button>
          <button
            onClick={undoMove}
            disabled={game.history().length === 0}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition disabled:opacity-50"
          >
            Undo
          </button>
          <button
            onClick={flipBoard}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
          >
            Flip Board
          </button>
        </div>
        {isLoading && <p>Loading opening moves...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {openingData && (
          <div>
            <h3 className="text-xl font-semibold mb-2">Top Moves</h3>
            <div className="space-y-2">
              {openingData.moves.slice(0, 5).map((move, index) => (
                <div
                  key={index}
                  onClick={() => handleOpeningMoveClick(move)}
                  className="p-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition"
                >
                  <span className="font-bold text-lg">{move.san}</span>
                  <div className="text-sm text-gray-600">
                    <span>W: {move.white}% | </span>
                    <span>D: {move.draws}% | </span>
                    <span>B: {move.black}%</span>
                  </div>
                </div>
              ))}
            </div>
            {openingData.opening && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="font-bold text-lg">{openingData.opening.name}</p>
                <p className="text-sm text-gray-700">
                  ECO: {openingData.opening.eco}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default OpeningTrainer;
