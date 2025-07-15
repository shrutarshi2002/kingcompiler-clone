"use client";

import { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import GoogleFormModal from "../../../components/GoogleFormModal";

export default function ChessPuzzleChallengePage() {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("beginner");
  const [puzzles, setPuzzles] = useState([]);
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const levels = [
    { value: "beginner", label: "Beginner", rating: "1000-1200" },
    { value: "intermediate", label: "Intermediate", rating: "1200-1600" },
    { value: "advanced", label: "Advanced", rating: "1600-2000" },
    { value: "expert", label: "Expert", rating: "2000+" },
  ];

  // Fix hydration by ensuring client-side only rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch puzzles from API based on selected level
  useEffect(() => {
    if (!isClient) return;

    const fetchPuzzles = async () => {
      setLoading(true);
      setError(null);
      try {
        // Try multiple free chess APIs
        let puzzleData = null;

        // First try: Chess.com API
        try {
          const chessComResponse = await fetch(
            "https://api.chess.com/pub/puzzle/random"
          );
          if (chessComResponse.ok) {
            puzzleData = await chessComResponse.json();
          }
        } catch (e) {
          console.log("Chess.com API failed, trying Lichess...");
        }

        // Second try: Lichess API
        if (!puzzleData) {
          try {
            const lichessResponse = await fetch(
              "https://lichess.org/api/puzzle/daily"
            );
            if (lichessResponse.ok) {
              const lichessData = await lichessResponse.json();
              puzzleData = {
                fen: lichessData.game.fen,
                rating: lichessData.game.rating || 1200,
                pgn: lichessData.puzzle.moves,
              };
            }
          } catch (e) {
            console.log("Lichess API failed, using fallback...");
          }
        }

        // Third try: Alternative Chess.com endpoint
        if (!puzzleData) {
          try {
            const altResponse = await fetch(
              "https://api.chess.com/pub/puzzle/random"
            );
            if (altResponse.ok) {
              puzzleData = await altResponse.json();
            }
          } catch (e) {
            console.log("Alternative API failed, using fallback...");
          }
        }

        if (!puzzleData || !puzzleData.fen) {
          throw new Error("No puzzle data available from APIs");
        }

        // Create multiple puzzles based on the fetched puzzle
        const generatedPuzzles = Array.from({ length: 10 }, (_, index) => ({
          id: index + 1,
          title: `Tactical Puzzle ${index + 1}`,
          description: `Solve this tactical position (Rating: ${
            puzzleData.rating || 1200
          })`,
          difficulty:
            selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1),
          points: (index + 1) * 50,
          fen: puzzleData.fen,
          moves: puzzleData.pgn || puzzleData.moves || "e2e4",
          rating: puzzleData.rating || 1200,
          hint: "Look for the best tactical move",
        }));

        setPuzzles(generatedPuzzles);
        setCurrentPuzzle(0);
        setScore(0);
        setGameStarted(false);
      } catch (err) {
        console.error("Error fetching puzzles:", err);
        setError("Using fallback puzzles. API temporarily unavailable.");

        // Enhanced fallback puzzles with more variety
        const fallbackPuzzles = [
          {
            id: 1,
            title: "Fork Attack",
            description: "Find the move that attacks two pieces at once",
            difficulty:
              selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1),
            points: 100,
            fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
            moves: "e4e5",
            rating: 1200,
            hint: "Look for a move that attacks multiple pieces",
          },
          {
            id: 2,
            title: "Pin the Queen",
            description: "Pin the opponent's queen to the king",
            difficulty:
              selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1),
            points: 150,
            fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2",
            moves: "d4d5",
            rating: 1400,
            hint: "Use your bishop to pin the queen",
          },
          {
            id: 3,
            title: "Checkmate in 2",
            description: "Find the checkmate sequence",
            difficulty:
              selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1),
            points: 200,
            fen: "r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1",
            moves: "e1e2",
            rating: 1600,
            hint: "Look for a discovered check",
          },
          {
            id: 4,
            title: "Tactical Combination",
            description: "Find the winning combination",
            difficulty:
              selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1),
            points: 175,
            fen: "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1",
            moves: "d2d4",
            rating: 1300,
            hint: "Control the center with pawn moves",
          },
          {
            id: 5,
            title: "Piece Development",
            description: "Develop your pieces effectively",
            difficulty:
              selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1),
            points: 125,
            fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            moves: "e2e4",
            rating: 1100,
            hint: "Start with a strong center pawn move",
          },
        ];
        setPuzzles(fallbackPuzzles);
      } finally {
        setLoading(false);
      }
    };

    fetchPuzzles();
  }, [selectedLevel, isClient]);

  const pieceImages = {
    k: "♔", // White King
    q: "♕", // White Queen
    r: "♖", // White Rook
    b: "♗", // White Bishop
    n: "♘", // White Knight
    p: "♙", // White Pawn
    K: "♚", // Black King
    Q: "♛", // Black Queen
    R: "♜", // Black Rook
    B: "♝", // Black Bishop
    N: "♞", // Black Knight
    P: "♟", // Black Pawn
  };

  // Convert FEN to board array
  const fenToBoard = (fen) => {
    // Validate FEN input
    if (!fen || typeof fen !== "string") {
      console.warn("Invalid FEN provided:", fen);
      // Return empty board if FEN is invalid
      return Array(8)
        .fill()
        .map(() => Array(8).fill(""));
    }

    const board = [];
    const parts = fen.split(" ");

    // Validate parts
    if (!parts || parts.length === 0) {
      console.warn("Invalid FEN format:", fen);
      return Array(8)
        .fill()
        .map(() => Array(8).fill(""));
    }

    const ranks = parts[0].split("/");

    // Validate ranks
    if (!ranks || ranks.length !== 8) {
      console.warn("Invalid FEN ranks:", ranks);
      return Array(8)
        .fill()
        .map(() => Array(8).fill(""));
    }

    for (let rank of ranks) {
      const row = [];
      for (let char of rank) {
        if (isNaN(char)) {
          row.push(char);
        } else {
          for (let i = 0; i < parseInt(char); i++) {
            row.push("");
          }
        }
      }
      // Ensure each row has exactly 8 squares
      while (row.length < 8) {
        row.push("");
      }
      if (row.length > 8) {
        row.splice(8);
      }
      board.push(row);
    }

    // Ensure board has exactly 8 rows
    while (board.length < 8) {
      board.push(Array(8).fill(""));
    }
    if (board.length > 8) {
      board.splice(8);
    }

    return board;
  };

  useEffect(() => {
    let timer;
    if (isClient && gameStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isClient, gameStarted, timeLeft]);

  const startGame = () => {
    if (puzzles.length === 0) return;
    setGameStarted(true);
    setTimeLeft(300);
    setScore(0);
    setCurrentPuzzle(0);
  };

  const handleSquareClick = (row, col) => {
    if (!gameStarted || puzzles.length === 0) return;

    // Safety check for current puzzle
    if (!puzzles[currentPuzzle] || !puzzles[currentPuzzle].fen) {
      console.warn("Current puzzle or FEN is undefined");
      return;
    }

    const currentBoard = fenToBoard(puzzles[currentPuzzle].fen);
    const piece = currentBoard[row][col];

    // If no piece is selected yet
    if (selectedPiece === null) {
      // Check if there's a piece on this square and it's white (uppercase)
      if (piece && piece === piece.toUpperCase() && piece !== ".") {
        setSelectedPiece({ row, col, piece });
        setSelectedSquare({ row, col });
        console.log(`Selected piece: ${piece} at ${row},${col}`);
      }
    } else {
      // A piece is already selected, try to make a move

      // Don't allow selecting the same square
      if (selectedPiece.row === row && selectedPiece.col === col) {
        setSelectedPiece(null);
        setSelectedSquare(null);
        return;
      }

      // Create move notation
      const fromSquare = `${String.fromCharCode(97 + selectedPiece.col)}${
        8 - selectedPiece.row
      }`;
      const toSquare = `${String.fromCharCode(97 + col)}${8 - row}`;
      const userMove = fromSquare + toSquare;

      console.log(`Attempting move: ${userMove}`);

      // Check if move matches the solution
      if (!puzzles[currentPuzzle].moves) {
        console.warn("Puzzle moves are undefined");
        setSelectedPiece(null);
        setSelectedSquare(null);
        return;
      }

      // Get the expected move (first 4 characters of the moves string)
      const expectedMove = puzzles[currentPuzzle].moves
        .substring(0, 4)
        .toLowerCase();
      const userMoveLower = userMove.toLowerCase();

      console.log(`Expected: ${expectedMove}, User: ${userMoveLower}`);

      if (userMoveLower === expectedMove) {
        // Correct move!
        console.log("Correct move!");
        setScore((prev) => prev + puzzles[currentPuzzle].points);

        // Move to next puzzle or end game
        if (currentPuzzle < puzzles.length - 1) {
          setCurrentPuzzle((prev) => prev + 1);
          setSelectedPiece(null);
          setSelectedSquare(null);
        } else {
          // Game completed
          setGameStarted(false);
          alert(
            `Congratulations! You completed all puzzles with a score of ${
              score + puzzles[currentPuzzle].points
            }!`
          );
        }
      } else {
        // Wrong move
        console.log("Wrong move!");
        setScore((prev) => Math.max(0, prev - 10));
        alert("Wrong move! Try again.");
      }

      setSelectedPiece(null);
      setSelectedSquare(null);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const openFormModal = () => {
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
  };

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 pb-8" style={{ background: "#FFD700" }}>
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-black mb-4">
              Chess Puzzle Challenge
            </h1>
            <p className="text-xl md:text-2xl text-black mb-8 max-w-3xl mx-auto">
              Test your tactical skills with challenging chess puzzles
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading game...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const currentBoard =
    puzzles.length > 0 && puzzles[currentPuzzle] && puzzles[currentPuzzle].fen
      ? fenToBoard(puzzles[currentPuzzle].fen)
      : Array(8)
          .fill()
          .map(() => Array(8).fill(""));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-8" style={{ background: "#FFD700" }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-4">
            Chess Puzzle Challenge
          </h1>
          <p className="text-xl md:text-2xl text-black mb-8 max-w-3xl mx-auto">
            Test your tactical skills with challenging chess puzzles
          </p>
        </div>
      </section>

      {/* Level Selection */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Choose Your Level
            </h2>
            <p className="text-gray-600">
              Select a difficulty level to start solving puzzles
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {levels.map((level) => (
              <button
                key={level.value}
                onClick={() => setSelectedLevel(level.value)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedLevel === level.value
                    ? "border-yellow-500 bg-yellow-50 text-yellow-800"
                    : "border-gray-200 bg-white text-gray-700 hover:border-yellow-300"
                }`}
              >
                <div className="font-bold text-lg mb-1">{level.label}</div>
                <div className="text-sm opacity-75">Rating: {level.rating}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Game Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading puzzles...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => setSelectedLevel(selectedLevel)}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Game Board */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Puzzle {currentPuzzle + 1} of {puzzles.length}
                    </h2>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-700">
                        Score: {score}
                      </p>
                      <p className="text-sm text-gray-600">
                        Time: {formatTime(timeLeft)}
                      </p>
                    </div>
                  </div>

                  {/* Chess Board */}
                  <div className="w-full max-w-md mx-auto">
                    <div className="grid grid-cols-8 border-2 border-gray-800">
                      {currentBoard.map((row, rowIndex) =>
                        row.map((piece, colIndex) => {
                          const isLight = (rowIndex + colIndex) % 2 === 0;
                          const isSelected =
                            selectedSquare &&
                            selectedSquare.row === rowIndex &&
                            selectedSquare.col === colIndex;

                          return (
                            <div
                              key={`${rowIndex}-${colIndex}`}
                              className={`
                                w-12 h-12 md:w-16 md:h-16 flex items-center justify-center cursor-pointer transition-all duration-200
                                ${isLight ? "bg-yellow-100" : "bg-yellow-800"}
                                ${
                                  isSelected
                                    ? "ring-4 ring-blue-500 bg-blue-200"
                                    : ""
                                }
                                ${
                                  selectedPiece && !isSelected
                                    ? "hover:ring-2 hover:ring-green-400"
                                    : "hover:ring-2 hover:ring-yellow-400"
                                }
                              `}
                              onClick={() =>
                                handleSquareClick(rowIndex, colIndex)
                              }
                            >
                              {piece && (
                                <div
                                  className={`text-2xl md:text-3xl font-bold ${
                                    piece === piece.toUpperCase()
                                      ? "text-gray-800"
                                      : "text-white"
                                  }`}
                                  style={{
                                    textShadow:
                                      piece === piece.toUpperCase()
                                        ? "1px 1px 2px rgba(0,0,0,0.5)"
                                        : "1px 1px 2px rgba(255,255,255,0.5)",
                                  }}
                                >
                                  {pieceImages[piece]}
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Game Status */}
                  <div className="mt-4 text-center">
                    {selectedPiece ? (
                      <p className="text-blue-600 font-semibold">
                        Selected: {pieceImages[selectedPiece.piece]} - Click a
                        square to move
                      </p>
                    ) : (
                      <p className="text-gray-600">
                        Click on a white piece to select it, then click a square
                        to move
                      </p>
                    )}
                  </div>

                  {/* Game Controls */}
                  <div className="flex justify-center gap-4 mt-6">
                    {!gameStarted ? (
                      <button
                        onClick={startGame}
                        disabled={puzzles.length === 0}
                        className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 text-black font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                      >
                        Start Game
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => setShowHint(!showHint)}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                        >
                          {showHint ? "Hide Hint" : "Show Hint"}
                        </button>
                        <button
                          onClick={() => window.location.reload()}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                        >
                          Reset Game
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Game Info */}
              <div className="space-y-6">
                {/* Current Puzzle Info */}
                {puzzles.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {puzzles[currentPuzzle].title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {puzzles[currentPuzzle].description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {puzzles[currentPuzzle].difficulty}
                      </span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {puzzles[currentPuzzle].points} pts
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Rating: {puzzles[currentPuzzle].rating}
                      </span>
                    </div>

                    {showHint && (
                      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 font-semibold">
                          💡 Hint: {puzzles[currentPuzzle].hint}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Instructions */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    How to Play
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Select your difficulty level above</li>
                    <li>• Click &quot;Start Game&quot; to begin</li>
                    <li>• Click on a white piece (♔♕♖♗♘♙) to select it</li>
                    <li>• Click on a square to move the selected piece</li>
                    <li>
                      • Find the correct tactical move to solve the puzzle
                    </li>
                    <li>• Use hints if you get stuck</li>
                    <li>
                      • Correct moves earn points, wrong moves lose points
                    </li>
                  </ul>
                </div>

                {/* Level Info */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Current Level:{" "}
                    {levels.find((l) => l.value === selectedLevel)?.label}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Rating Range:{" "}
                    {levels.find((l) => l.value === selectedLevel)?.rating}
                  </p>
                  <p className="text-gray-600">
                    Puzzles loaded: {puzzles.length}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">
            Want More Chess Challenges?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join our advanced chess courses and master the game
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
              💬 Chat with Coach
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
