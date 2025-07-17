"use client";
import { useState, useEffect, useRef } from "react";
import { Chess } from "chess.js";
import ChessboardDisplay from "./ChessboardDisplay";
import SoundManager from "../../../../components/SoundManager";

const levels = [
  {
    id: 1,
    type: "bishop-path",
    title: "Bishop's Path 1",
    description: "Collect the star with your bishop!",
    fen: "K7/8/8/8/8/8/8/2B5 w - - 0 1", // King on a8, bishop on c1
    goalSquares: ["e3"], // light square
    maxMoves: 2,
    pieceType: "b",
    cartoon: "\u241426",
  },
  {
    id: 2,
    type: "bishop-path",
    title: "Bishop's Path 2",
    description: "Collect both stars with your bishop!",
    fen: "8/8/8/8/8/8/8/2B5 w - - 0 1",
    goalSquares: ["e3", "g5"], // both light squares
    maxMoves: 4,
    pieceType: "b",
    cartoon: "\u241426",
  },
  {
    id: 3,
    type: "bishop-path",
    title: "Bishop's Path 3",
    description: "Collect all three stars!",
    fen: "8/8/8/8/8/8/8/2B5 w - - 0 1",
    goalSquares: ["e3", "g5", "a7"], // all light squares
    maxMoves: 6,
    pieceType: "b",
    cartoon: "\u241426",
  },
  {
    id: 4,
    type: "bishop-path",
    title: "Bishop's Path 4",
    description: "Collect four stars!",
    fen: "8/8/8/8/8/8/8/2B5 w - - 0 1",
    goalSquares: ["e3", "g5", "a7", "c5"], // all light squares
    maxMoves: 8,
    pieceType: "b",
    cartoon: "\u241426",
  },
  {
    id: 5,
    type: "bishop-path",
    title: "Bishop's Path 5",
    description: "Collect five scattered stars!",
    fen: "8/8/8/8/8/8/8/2B5 w - - 0 1",
    goalSquares: ["e3", "g5", "a7", "c5", "e7"], // all light squares
    maxMoves: 12,
    pieceType: "b",
    cartoon: "\u241426",
  },
  {
    id: 6,
    type: "bishop-path",
    title: "Bishop's Path 6",
    description: "Collect all six stars!",
    fen: "8/8/8/8/8/8/8/2B5 w - - 0 1",
    goalSquares: ["e3", "g5", "a7", "c5", "e7", "g1"], // all light squares
    maxMoves: 16,
    pieceType: "b",
    cartoon: "\u241426",
  },
  // Rook's Road Levels (no stars on a8, c1, h1)
  {
    id: 7,
    type: "rook-road",
    title: "Rook’s Road 1",
    description: "Collect the star with your rook!",
    fen: "K7/8/8/8/8/8/8/2R5 w - - 0 1", // King on a8, rook on c1
    goalSquares: ["c8"], // up the file
    maxMoves: 2,
    pieceType: "r",
    cartoon: "\u2416A7", // 🛧
  },
  {
    id: 8,
    type: "rook-road",
    title: "Rook’s Road 2",
    description: "Collect both stars with your rook!",
    fen: "8/8/8/8/8/8/8/2R5 w - - 0 1",
    goalSquares: ["c8", "h8"], // up the file and across the top rank
    maxMoves: 4,
    pieceType: "r",
    cartoon: "\u2416A7",
  },
  {
    id: 9,
    type: "rook-road",
    title: "Rook’s Road 3",
    description: "Collect all three stars!",
    fen: "8/8/8/8/8/8/8/2R5 w - - 0 1",
    goalSquares: ["c8", "h8", "a4"], // up, across, and to a new file
    maxMoves: 6,
    pieceType: "r",
    cartoon: "\u2416A7",
  },
  {
    id: 10,
    type: "rook-road",
    title: "Rook’s Road 4",
    description: "Collect four stars!",
    fen: "8/8/8/8/8/8/8/2R5 w - - 0 1",
    goalSquares: ["c8", "h8", "a4", "f5"], // up, across, and two more
    maxMoves: 8,
    pieceType: "r",
    cartoon: "\u2416A7",
  },
  {
    id: 11,
    type: "rook-road",
    title: "Rook’s Road 5",
    description: "Collect five scattered stars!",
    fen: "8/8/8/8/8/8/8/2R5 w - - 0 1",
    goalSquares: ["c8", "h8", "a4", "f5", "c5"], // up, across, and more
    maxMoves: 12,
    pieceType: "r",
    cartoon: "\u2416A7",
  },
  {
    id: 12,
    type: "rook-road",
    title: "Rook’s Road 6",
    description: "Collect all six stars!",
    fen: "8/8/8/8/8/8/8/2R5 w - - 0 1",
    goalSquares: ["c8", "h8", "a4", "f5", "c5", "g1"], // up, across, and more
    maxMoves: 16,
    pieceType: "r",
    cartoon: "\u2416A7",
  },
  // Knight's Journey Levels (no stars on c1)
  {
    id: 25,
    type: "knight-journey",
    title: "Knight’s Journey 1",
    description: "Collect the star with your knight!",
    fen: "8/8/8/8/8/8/8/2N5 w - - 0 1", // Knight on c1
    goalSquares: ["d3"], // one knight move
    maxMoves: 2,
    pieceType: "n",
    cartoon: "\u24140E",
  },
  {
    id: 26,
    type: "knight-journey",
    title: "Knight’s Journey 2",
    description: "Collect both stars with your knight!",
    fen: "8/8/8/8/8/8/8/2N5 w - - 0 1",
    goalSquares: ["d3", "e2"], // two knight moves
    maxMoves: 4,
    pieceType: "n",
    cartoon: "\u24140E",
  },
  {
    id: 27,
    type: "knight-journey",
    title: "Knight’s Journey 3",
    description: "Collect all three stars!",
    fen: "8/8/8/8/8/8/8/2N5 w - - 0 1",
    goalSquares: ["d3", "e2", "b3"],
    maxMoves: 6,
    pieceType: "n",
    cartoon: "\u24140E",
  },
  {
    id: 28,
    type: "knight-journey",
    title: "Knight’s Journey 4",
    description: "Collect four stars!",
    fen: "8/8/8/8/8/8/8/2N5 w - - 0 1",
    goalSquares: ["d3", "e2", "b3", "a2"],
    maxMoves: 8,
    pieceType: "n",
    cartoon: "\u24140E",
  },
  {
    id: 29,
    type: "knight-journey",
    title: "Knight’s Journey 5",
    description: "Collect five scattered stars!",
    fen: "8/8/8/8/8/8/8/2N5 w - - 0 1",
    goalSquares: ["d3", "e2", "b3", "a2", "f3"],
    maxMoves: 12,
    pieceType: "n",
    cartoon: "\u24140E",
  },
  {
    id: 30,
    type: "knight-journey",
    title: "Knight’s Journey 6",
    description: "Collect all six stars!",
    fen: "8/8/8/8/8/8/8/2N5 w - - 0 1",
    goalSquares: ["d3", "e2", "b3", "a2", "f3", "g2"],
    maxMoves: 16,
    pieceType: "n",
    cartoon: "\u24140E",
  },
  // Queen's Quest Levels (no stars on a8, c1, h1)
  {
    id: 13,
    type: "queen-quest",
    title: "Queen’s Quest 1",
    description: "Collect the star with your queen!",
    fen: "K7/8/8/8/8/8/8/2Q5 w - - 0 1", // King on a8, queen on c1
    goalSquares: ["h6"], // diagonal
    maxMoves: 2,
    pieceType: "q",
    cartoon: "\u241451", // 👑
  },
  {
    id: 14,
    type: "queen-quest",
    title: "Queen’s Quest 2",
    description: "Collect both stars with your queen!",
    fen: "8/8/8/8/8/8/8/2Q5 w - - 0 1",
    goalSquares: ["h6", "a6"], // both diagonals
    maxMoves: 4,
    pieceType: "q",
    cartoon: "\u241451",
  },
  {
    id: 15,
    type: "queen-quest",
    title: "Queen’s Quest 3",
    description: "Collect all three stars!",
    fen: "8/8/8/8/8/8/8/2Q5 w - - 0 1",
    goalSquares: ["h6", "a6", "g1"], // diagonal, diagonal, rank
    maxMoves: 6,
    pieceType: "q",
    cartoon: "\u241451",
  },
  {
    id: 16,
    type: "queen-quest",
    title: "Queen’s Quest 4",
    description: "Collect four stars!",
    fen: "8/8/8/8/8/8/8/2Q5 w - - 0 1",
    goalSquares: ["h6", "a6", "g1", "c8"], // diagonal, diagonal, rank, file
    maxMoves: 8,
    pieceType: "q",
    cartoon: "\u241451",
  },
  {
    id: 17,
    type: "queen-quest",
    title: "Queen’s Quest 5",
    description: "Collect five scattered stars!",
    fen: "8/8/8/8/8/8/8/2Q5 w - - 0 1",
    goalSquares: ["h6", "a6", "g1", "c8", "f4"], // diagonal, diagonal, rank, file, random
    maxMoves: 12,
    pieceType: "q",
    cartoon: "\u241451",
  },
  {
    id: 18,
    type: "queen-quest",
    title: "Queen’s Quest 6",
    description: "Collect all six stars!",
    fen: "8/8/8/8/8/8/8/2Q5 w - - 0 1",
    goalSquares: ["h6", "a6", "g1", "c8", "f4", "b7"], // diagonal, diagonal, rank, file, random, random
    maxMoves: 16,
    pieceType: "q",
    cartoon: "\u241451",
  },
  // King's Safety Levels (only white king)
  {
    id: 19,
    type: "king-journey",
    title: "King’s Journey 1",
    description: "Move the king to the star square!",
    fen: "8/8/8/8/8/8/8/2K5 w - - 0 1", // Only white king on c1
    goalSquares: ["d2"], // one move away
    maxMoves: 2,
    pieceType: "k",
    cartoon: "\u241451", // 👑
  },
  {
    id: 20,
    type: "king-journey",
    title: "King’s Journey 2",
    description: "Move the king to the star square!",
    fen: "8/8/8/8/8/8/8/2K5 w - - 0 1",
    goalSquares: ["d2", "b2"], // both adjacent
    maxMoves: 4,
    pieceType: "k",
    cartoon: "\u241451",
  },
  {
    id: 21,
    type: "king-journey",
    title: "King’s Journey 3",
    description: "Move the king to the star square!",
    fen: "8/8/8/8/8/8/8/2K5 w - - 0 1",
    goalSquares: ["d2", "b2", "d1"], // two adjacent, one on rank
    maxMoves: 6,
    pieceType: "k",
    cartoon: "\u241451",
  },
  {
    id: 22,
    type: "king-journey",
    title: "King’s Journey 4",
    description: "Move the king to the star square!",
    fen: "8/8/8/8/8/8/8/2K5 w - - 0 1",
    goalSquares: ["d2", "b2", "d1", "b1"], // all adjacent
    maxMoves: 8,
    pieceType: "k",
    cartoon: "\u241451",
  },
  {
    id: 23,
    type: "king-journey",
    title: "King’s Journey 5",
    description: "Move the king to the star square!",
    fen: "8/8/8/8/8/8/8/2K5 w - - 0 1",
    goalSquares: ["d2", "b2", "d1", "b1", "c2"], // all adjacent squares
    maxMoves: 12,
    pieceType: "k",
    cartoon: "\u241451",
  },
  {
    id: 24,
    type: "king-journey",
    title: "King’s Journey 6",
    description: "Move the king to the star square!",
    fen: "8/8/8/8/8/8/8/2K5 w - - 0 1",
    goalSquares: ["d2", "b2", "d1", "b1", "c2", "d3"], // all reachable squares around c1
    maxMoves: 16,
    pieceType: "k",
    cartoon: "\u241451",
  },
];

const pieceMovementTopics = [
  { key: "bishop-path", label: "Bishop’s Path" },
  { key: "rook-road", label: "Rook’s Road" },
  { key: "queen-quest", label: "Queen’s Quest" },
  { key: "king-journey", label: "King’s Journey" },
  { key: "knight-journey", label: "Knight’s Journey" },
];

function getPieceIcon(type) {
  switch (type) {
    case "p":
      return " 9F1"; // 🧱
    case "n":
      return " 40E"; // 🐎
    case "b":
      return " 426"; // 🐦
    case "r":
      return " 6A7"; // 🛧
    case "q":
      return " 451"; // 👑
    case "k":
      return " 451"; // 👑
    default:
      return " 9F1";
  }
}

export default function LearnChessAdventure() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [stars, setStars] = useState(Array(levels.length).fill(0));
  const [moveCount, setMoveCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [showStars, setShowStars] = useState(false);
  const [unlockedLevel, setUnlockedLevel] = useState(0);
  const audioRef = useRef(null);
  // Add state for collected stars
  const [collectedStars, setCollectedStars] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("chessAdventureProgress");
    if (saved) {
      const { stars: savedStars, unlockedLevel: savedUnlocked } =
        JSON.parse(saved);
      if (savedStars) {
        // Pad or reinitialize stars array to match levels.length
        const paddedStars = Array(levels.length)
          .fill(0)
          .map((_, i) => (savedStars[i] !== undefined ? savedStars[i] : 0));
        setStars(paddedStars);
      }
      if (typeof savedUnlocked === "number") setUnlockedLevel(savedUnlocked);
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem(
      "chessAdventureProgress",
      JSON.stringify({ stars, unlockedLevel })
    );
  }, [stars, unlockedLevel]);

  // Reset collectedStars only when the level changes
  useEffect(() => {
    setCollectedStars([]);
  }, [currentLevel]);

  // Play sound helper
  function playSound(type) {
    if (typeof window !== "undefined" && window.playChessSound) {
      window.playChessSound(type);
    }
  }

  // Helper: parse FEN to board array
  function fenToBoard(fen) {
    const board = [];
    const parts = fen.split(" ");
    const ranks = parts[0].split("/");
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
      board.push(row);
    }
    return board;
  }

  const level = levels[currentLevel];
  // Guard: if level is undefined, reset currentLevel and show fallback
  useEffect(() => {
    if (!level) {
      setCurrentLevel(0);
    }
  }, [level]);

  // Detect if this is a learning level (not a real chess game)
  const isLearningLevel = [
    "bishop-path",
    "rook-road",
    "queen-quest",
    "knight-journey",
    "king-journey",
  ].includes(level.type);

  // Only initialize chess.js for real chess games (none in this adventure)
  const [game, setGame] = useState(null);

  // Board state for all learning levels (including king-journey)
  const [customBoard, setCustomBoard] = useState(() => fenToBoard(level.fen));

  // Reset custom board on level change
  useEffect(() => {
    setCustomBoard(fenToBoard(level.fen));
  }, [currentLevel, level.fen]);

  // Custom move logic for all learning levels (including king)
  function isLegalMove(piece, from, to, board) {
    if (!piece) return false;
    const dr = to.row - from.row;
    const dc = to.col - from.col;
    switch (piece.toLowerCase()) {
      case "b": // bishop
        return Math.abs(dr) === Math.abs(dc) && isPathClear(from, to, board);
      case "r": // rook
        return (dr === 0 || dc === 0) && isPathClear(from, to, board);
      case "q": // queen
        return (
          (Math.abs(dr) === Math.abs(dc) || dr === 0 || dc === 0) &&
          isPathClear(from, to, board)
        );
      case "n": // knight
        return (
          (Math.abs(dr) === 2 && Math.abs(dc) === 1) ||
          (Math.abs(dr) === 1 && Math.abs(dc) === 2)
        );
      case "k": // king
        return Math.abs(dr) <= 1 && Math.abs(dc) <= 1 && (dr !== 0 || dc !== 0);
      default:
        return false;
    }
  }
  function isPathClear(from, to, board) {
    const dr = Math.sign(to.row - from.row);
    const dc = Math.sign(to.col - from.col);
    let r = from.row + dr,
      c = from.col + dc;
    while (r !== to.row || c !== to.col) {
      if (board[r][c]) return false;
      r += dr;
      c += dc;
    }
    return true;
  }

  // Custom move handler for all learning levels (including king)
  function handleCustomMove(fromAlg, toAlg) {
    if (completed) return;
    const files = "abcdefgh";
    const from = {
      col: files.indexOf(fromAlg[0]),
      row: 8 - parseInt(fromAlg[1]),
    };
    const to = { col: files.indexOf(toAlg[0]), row: 8 - parseInt(toAlg[1]) };
    const piece = customBoard[from.row][from.col];
    if (!isLegalMove(piece, from, to, customBoard)) {
      setMessage("That’s not a legal move for this piece. Try again!");
      playSound("wrongMove");
      return;
    }
    // Check if this is a capture (moving to a square with a piece)
    const isCapture = customBoard[to.row][to.col] !== "";
    // Move the piece
    const newBoard = customBoard.map((row) => [...row]);
    newBoard[to.row][to.col] = piece;
    newBoard[from.row][from.col] = "";
    setCustomBoard(newBoard);
    setMoveCount(moveCount + 1);
    setSelectedSquare(null);
    // Play appropriate sound
    if (isCapture) {
      playSound("capture");
    } else {
      playSound("move");
    }
    // Star collection logic (same as before)
    const toLower = toAlg.toLowerCase();
    if (
      level.goalSquares.includes(toLower) &&
      !collectedStars.includes(toLower)
    ) {
      const newCollected = [...collectedStars, toLower];
      setCollectedStars(newCollected);
      playSound("starCollect");
      if (newCollected.length === level.goalSquares.length) {
        let earned = 1;
        if (moveCount + 1 <= level.maxMoves) earned = 3;
        else if (moveCount + 1 <= level.maxMoves + 2) earned = 2;
        const newStars = [...stars];
        newStars[currentLevel] = Math.max(newStars[currentLevel], earned);
        setStars(newStars);
        setCompleted(true);
        setMessage(
          `Great job! You collected all stars and earned ${earned} star${
            earned > 1 ? "s" : ""
          }!`
        );
        setShowStars(true);
        playSound("success");
        playSound("levelComplete");
        if (
          currentLevel === unlockedLevel &&
          currentLevel < levels.length - 1
        ) {
          setUnlockedLevel(currentLevel + 1);
        }
        setTimeout(() => setShowStars(false), 1800);
        return;
      }
    }
    // If not all stars collected, just update message
    if (collectedStars.length + 1 < level.goalSquares.length) {
      setMessage(
        `Great! You collected a star. ${
          level.goalSquares.length - (collectedStars.length + 1)
        } left!`
      );
    }
    // If too many moves, fail
    else if (moveCount + 1 >= level.maxMoves + 2) {
      setCompleted(true);
      setMessage("Try again! You can do it in fewer moves.");
    } else {
      setMessage("");
    }
  }

  function handleNextLevel() {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
      if (!isLearningLevel) setGame(new Chess(levels[currentLevel + 1].fen));
      setMoveCount(0);
      setCompleted(false);
      setMessage("");
      setSelectedSquare(null);
    }
  }

  function handleReset() {
    if (!isLearningLevel) setGame(new Chess(level.fen));
    if (isLearningLevel) setCustomBoard(fenToBoard(level.fen));
    setMoveCount(0);
    setCompleted(false);
    setMessage("");
    setSelectedSquare(null);
  }

  // Determine if the star should be active (bishop not on goal square)
  const uncollectedStars = level.goalSquares.filter(
    (sq) =>
      !collectedStars.map((s) => s.toLowerCase()).includes(sq.toLowerCase())
  );
  const starActive = uncollectedStars.length > 0;

  // Find all levels for the selected topic
  const selectedTopic = (() => {
    const found = pieceMovementTopics.find(
      (t) => levels[currentLevel].type === t.key
    );
    return found ? found.key : "";
  })();
  const topicLevels = levels
    .map((lvl, idx) => ({ ...lvl, idx }))
    .filter((lvl) => lvl.type === selectedTopic);
  const topicLevelIdx = topicLevels.findIndex(
    (lvl) => lvl.idx === currentLevel
  );

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <SoundManager enabled={soundEnabled} />
      {/* Audio for success sound */}
      <audio ref={audioRef} src="/sounds/success.mp3" preload="auto" />
      <div className="flex gap-8">
        {/* Main content */}
        <div className="flex-1 flex flex-col items-center">
          {/* Level Info */}
          <div className="mb-2 text-lg font-bold text-blue-700">
            {level.description}
          </div>
          <ChessboardDisplay
            {...(isLearningLevel
              ? { board: customBoard, onMove: handleCustomMove, fen: undefined }
              : { fen: game.fen(), onMove: handleMove })}
            userColor={"w"}
            allowMove={true}
            currentTurn={"w"}
            highlightSquares={uncollectedStars.map((sq) => {
              const files = "abcdefgh";
              const col = files.indexOf(sq[0]);
              const row = 8 - parseInt(sq[1]);
              return [row, col];
            })}
            selectablePieceType={level.pieceType}
            legalMovesForSelected={null}
            starSquares={uncollectedStars}
            starActive={starActive}
          />
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition"
            >
              Reset
            </button>
            {completed && currentLevel < levels.length - 1 && (
              <button
                onClick={handleNextLevel}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Next Level
              </button>
            )}
          </div>
          {/* Animated Stars */}
          {showStars && (
            <div className="flex gap-2 mt-4 animate-pop-stars">
              {[...Array(stars[currentLevel] || 0)].map((_, i) => (
                <span
                  key={i}
                  className="text-5xl text-yellow-400 drop-shadow-lg"
                >
                  ★
                </span>
              ))}
            </div>
          )}
          {message && (
            <div className="mt-3 text-lg font-bold text-green-700">
              {message}
            </div>
          )}
        </div>
        {/* Right sidebar: Piece movement dropdown */}
        <div className="w-full md:w-64 flex flex-col gap-4 items-start mt-8 md:mt-0">
          <div className="w-full">
            <label
              htmlFor="piece-move-topic"
              className="block mb-1 font-semibold text-gray-700"
            >
              Piece movement
            </label>
            <select
              id="piece-move-topic"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white shadow-sm"
              value={selectedTopic}
              onChange={(e) => {
                const idx = levels.findIndex(
                  (lvl) => lvl.type === e.target.value
                );
                if (idx !== -1) {
                  setCurrentLevel(idx);
                  if (levels[idx].type.startsWith("king-journey")) {
                    setCustomBoard(fenToBoard(levels[idx].fen));
                  } else {
                    setCustomBoard(fenToBoard(levels[idx].fen));
                  }
                  setMoveCount(0);
                  setCompleted(false);
                  setMessage("");
                  setSelectedSquare(null);
                }
              }}
            >
              <option value="">Select a topic…</option>
              {pieceMovementTopics.map((topic) => (
                <option key={topic.key} value={topic.key}>
                  {topic.label}
                </option>
              ))}
            </select>
          </div>
          {/* Sub-level selector for topic */}
          {topicLevels.length > 1 && (
            <div className="w-full mt-2">
              <label className="block mb-1 font-semibold text-gray-700">
                Level
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white shadow-sm"
                value={topicLevelIdx}
                onChange={(e) => {
                  const idx = topicLevels[parseInt(e.target.value, 10)].idx;
                  setCurrentLevel(idx);
                  if (levels[idx].type.startsWith("king-journey")) {
                    setCustomBoard(fenToBoard(levels[idx].fen));
                  } else {
                    setCustomBoard(fenToBoard(levels[idx].fen));
                  }
                  setMoveCount(0);
                  setCompleted(false);
                  setMessage("");
                  setSelectedSquare(null);
                }}
              >
                {topicLevels.map((lvl, i) => (
                  <option key={lvl.id} value={i}>
                    {lvl.title.replace(/^[^\d]+/, "Level ")}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
      {/* CSS for star pop animation */}
      <style jsx>{`
        .animate-pop-stars {
          animation: pop-stars 1.2s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes pop-stars {
          0% {
            transform: scale(0.5) rotate(-20deg);
            opacity: 0;
          }
          40% {
            transform: scale(1.2) rotate(10deg);
            opacity: 1;
          }
          70% {
            transform: scale(1) rotate(-5deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
