"use client";
import { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

const chessGames = [
  { key: "tactics", name: "Solve Tactics" },
  { key: "intuition", name: "Improve Intuition" },
  { key: "openings", name: "Opening Trainer" },
  { key: "endgames", name: "Endgame Mastery" },
  { key: "strategy", name: "Strategy Simulator" },
];

const tacticalTopics = [
  "Fork",
  "Pin",
  "Skewer",
  "Discovered Attack",
  "Double Check",
  "Discovered Check",
  "X-ray Attack",
  "Zwischenzug",
  "Overloading",
  "Deflection",
  "Decoy",
  "Trapped Piece",
  "Back Rank Mate",
  "Smothered Mate",
  "Clearance",
  "Interference",
  "Underpromotion",
  "Removing the Defender",
  "Perpetual Check",
  "Desperado",
  "Middle game tactics",
];

const lichessThemeMap = {
  Fork: "fork",
  Pin: "pin",
  Skewer: "skewer",
  "Discovered Attack": "discoveredAttack",
  "Double Check": "doubleCheck",
  "Discovered Check": "discoveredCheck",
  "X-ray Attack": "xRayAttack",
  Zwischenzug: "zwischenzug",
  Overloading: "overloading",
  Deflection: "deflection",
  Decoy: "decoy",
  "Trapped Piece": "trappedPiece",
  "Back Rank Mate": "backRankMate",
  "Smothered Mate": "smotheredMate",
  Clearance: "clearance",
  Interference: "interference",
  Underpromotion: "underPromotion",
  "Removing the Defender": "removalOfTheDefender",
  "Perpetual Check": "perpetualCheck",
  Desperado: "desperado",
  "Middle game tactics": "middlegame",
};

const gameContent = {
  tactics: <TacticsContent />,
  intuition: (
    <div className="p-8 text-center text-xl">
      Intuition Trainer (Coming Soon)
    </div>
  ),
  openings: (
    <div className="p-8 text-center text-xl">Opening Trainer (Coming Soon)</div>
  ),
  endgames: (
    <div className="p-8 text-center text-xl">Endgame Mastery (Coming Soon)</div>
  ),
  strategy: (
    <div className="p-8 text-center text-xl">
      Strategy Simulator (Coming Soon)
    </div>
  ),
};

function TacticsContent() {
  const [selectedTopic, setSelectedTopic] = useState(tacticalTopics[0]);
  const [puzzles, setPuzzles] = useState([]);
  const [currentPuzzleIdx, setCurrentPuzzleIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playedMoves, setPlayedMoves] = useState([]);
  const [showCongrats, setShowCongrats] = useState(false);
  const [pendingOpponentMove, setPendingOpponentMove] = useState(null);

  // Helper function to load multiple PGN files
  async function loadMultiplePGNFiles(filePaths) {
    try {
      const promises = filePaths.map((path) =>
        fetch(path).then((res) => res.text())
      );
      const texts = await Promise.all(promises);
      const allPuzzles = [];
      texts.forEach((text) => {
        const parsed = parsePGN(text);
        allPuzzles.push(...parsed);
      });
      return allPuzzles;
    } catch (error) {
      throw new Error(`Failed to load PGN files: ${error.message}`);
    }
  }

  // Improved PGN parser for [FEN ...] and moves, skipping comments and extra tags
  function parsePGN(pgnText) {
    const puzzles = [];
    const lines = pgnText.split(/\r?\n/);
    let fen = null;
    let moves = [];
    let collectingMoves = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith("[FEN ")) {
        fen = line.match(/\[FEN "([^"]+)"\]/)[1];
        moves = [];
        collectingMoves = false;
      } else if (
        fen &&
        line &&
        !line.startsWith("[") &&
        !line.startsWith("{")
      ) {
        // This is likely a move line
        // Remove comments in curly braces and variations in parentheses
        let moveLine = line.replace(/\{[^}]*\}/g, "").replace(/\([^)]*\)/g, "");
        moveLine = moveLine.replace(/\d+\.|\*/g, "").trim();
        if (moveLine) {
          moves = moveLine
            .split(/\s+/)
            .map(cleanMove)
            .filter((m) => m && !/^\.*$/.test(m))
            .filter((m) => !["1-0", "0-1", "1/2-1/2", "*"].includes(m)); // filter out result markers
          if (moves.length > 0) {
            puzzles.push({ fen, moves });
            fen = null;
            moves = [];
          }
        }
      }
    }
    return puzzles;
  }

  useEffect(() => {
    setPlayedMoves([]);
    setCurrentPuzzleIdx(0);
    setPuzzles([]);
    setError(null);
    if (selectedTopic === "Fork") {
      setLoading(true);
      fetch("/puzzels/tactics/fork.pgn")
        .then((res) => res.text())
        .then((text) => {
          const parsed = parsePGN(text);
          if (parsed.length === 0) throw new Error("No puzzles found in PGN");
          setPuzzles(parsed);
        })
        .catch(() => setError("Failed to load or parse fork.pgn"))
        .finally(() => setLoading(false));
    } else if (selectedTopic === "Pin") {
      setLoading(true);
      // Load all pin PGN files using the helper function
      loadMultiplePGNFiles([
        "/puzzels/tactics/pin/pin1.pgn",
        "/puzzels/tactics/pin/pin2.pgn",
      ])
        .then((allPuzzles) => {
          if (allPuzzles.length === 0)
            throw new Error("No puzzles found in PGN files");
          setPuzzles(allPuzzles);
        })
        .catch(() => setError("Failed to load or parse pin PGN files"))
        .finally(() => setLoading(false));
    }
  }, [selectedTopic]);

  // Chessboard logic (reuse from previous implementation)
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
  const pieceImages = {
    K: "♔",
    Q: "♕",
    R: "♖",
    B: "♗",
    N: "♘",
    P: "♙", // White
    k: "♚",
    q: "♛",
    r: "♜",
    b: "♝",
    n: "♞",
    p: "♟", // Black
  };

  // Map FEN piece to image filename
  function getPieceImage(piece) {
    if (!piece) return null;
    const isWhite = piece === piece.toUpperCase();
    const prefix = isWhite ? "w" : "b";
    const name = piece.toUpperCase();
    return `/chess-pieces/${prefix}${name}.png`;
  }

  // Move handling
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [board, setBoard] = useState([]);
  const [turn, setTurn] = useState("w");
  useEffect(() => {
    if (puzzles.length > 0) {
      setBoard(fenToBoard(puzzles[currentPuzzleIdx].fen));
      setSelectedSquare(null);
      setPlayedMoves([]);
      setTurn(puzzles[currentPuzzleIdx].fen.split(" ")[1] || "w");
    }
  }, [puzzles, currentPuzzleIdx]);

  // Convert user move to basic algebraic notation
  function getAlgebraicMove(board, from, to) {
    const piece = board[from.row][from.col];
    const dest = board[to.row][to.col];
    const files = "abcdefgh";
    const fromSq = files[from.col] + (8 - from.row);
    const toSq = files[to.col] + (8 - to.row);
    let move = "";
    if (piece.toUpperCase() !== "P") {
      move += piece.toUpperCase();
    }
    // Capture
    if (dest && dest !== "") {
      if (piece.toUpperCase() === "P") {
        move += files[from.col];
      }
      move += "x";
    }
    move += toSq;
    return move;
  }

  function cleanMove(move) {
    // Remove annotations, checks, mate, comments, dots, etc.
    return move
      .replace(/^\.*?\s*/, "") // remove leading ... or ..
      .replace(/[+#?!]/g, "")
      .replace(/\{.*?\}/g, "")
      .trim();
  }

  function getSolutionMoves(moveStr) {
    // Split on space, ignore empty, remove comments/annotations
    return moveStr.split(/\s+/).map(cleanMove).filter(Boolean);
  }

  // Play all opponent replies after a correct user move
  function playAllOpponentReplies(
    updatedBoard,
    updatedPlayedMoves,
    updatedTurn
  ) {
    let boardState = updatedBoard;
    let playedMovesState = updatedPlayedMoves;
    let turnState = updatedTurn;
    let idx = playedMovesState.length;
    const moves = puzzles[currentPuzzleIdx].moves;
    while (idx < moves.length) {
      // Determine whose turn it is
      const isUserTurn =
        (turnState === "w" && moves[idx][0] === moves[idx][0].toUpperCase()) ||
        (turnState === "b" && moves[idx][0] === moves[idx][0].toLowerCase());
      if (isUserTurn) break; // Stop if it's user's turn
      // Play opponent move
      const allMoves = [];
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const piece = boardState[r][c];
          if (!piece) continue;
          if (
            (turnState === "w" && piece === piece.toUpperCase()) ||
            (turnState === "b" && piece === piece.toLowerCase())
          ) {
            for (let dr = 0; dr < 8; dr++) {
              for (let dc = 0; dc < 8; dc++) {
                if (r === dr && c === dc) continue;
                const alg = getAlgebraicMove(
                  boardState,
                  { row: r, col: c },
                  { row: dr, col: dc }
                );
                if (alg === cleanMove(moves[idx])) {
                  allMoves.push({
                    from: { row: r, col: c },
                    to: { row: dr, col: dc },
                  });
                }
              }
            }
          }
        }
      }
      if (allMoves.length > 0) {
        const { from, to } = allMoves[0];
        const newBoard = boardState.map((r) => [...r]);
        newBoard[to.row][to.col] = boardState[from.row][from.col];
        newBoard[from.row][from.col] = "";
        boardState = newBoard;
        playedMovesState = [...playedMovesState, cleanMove(moves[idx])];
        turnState = turnState === "w" ? "b" : "w";
        idx++;
      } else {
        break;
      }
    }
    setBoard(boardState);
    setPlayedMoves(playedMovesState);
    setTurn(turnState);
    if (playedMovesState.length === moves.length) {
      setShowCongrats(true);
    }
  }

  function handleSquareClick(row, col) {
    if (!board.length || showCongrats) return;
    const piece = board[row][col];
    if (!selectedSquare) {
      if (
        piece &&
        ((turn === "w" && piece === piece.toUpperCase()) ||
          (turn === "b" && piece === piece.toLowerCase()))
      ) {
        setSelectedSquare({ row, col });
      }
    } else {
      // Move piece
      const from = { row: selectedSquare.row, col: selectedSquare.col };
      const to = { row, col };
      const userAlg = getAlgebraicMove(board, from, to);
      const solutionMoveStr =
        puzzles[currentPuzzleIdx].moves[playedMoves.length];
      // Accept main move or any variation in parentheses
      const solutionMoves = [cleanMove(solutionMoveStr)];
      const parenMatch = solutionMoveStr.match(/\(([^)]+)\)/);
      if (parenMatch) {
        parenMatch[1]
          .split(";")
          .forEach((m) => solutionMoves.push(cleanMove(m)));
      }
      const isCorrect = solutionMoves.some((sol) => userAlg === sol);
      window.lastMoveDebug = { userAlg, solutionMoves };
      if (isCorrect) {
        // Update board and playedMoves
        const newBoard = board.map((r) => [...r]);
        newBoard[row][col] = board[selectedSquare.row][selectedSquare.col];
        newBoard[selectedSquare.row][selectedSquare.col] = "";
        const newPlayedMoves = [...playedMoves, userAlg];
        const newTurn = turn === "w" ? "b" : "w";
        setSelectedSquare(null);
        // Play all opponent replies
        playAllOpponentReplies(newBoard, newPlayedMoves, newTurn);
      } else {
        alert(
          `Incorrect move.\nYour move: ${userAlg}\nExpected: ${solutionMoves.join(
            " or "
          )}`
        );
        setSelectedSquare(null);
      }
    }
  }

  // Ensure congratulations is shown after puzzle completion
  useEffect(() => {
    if (!puzzles.length) return;
    const moves = puzzles[currentPuzzleIdx]?.moves || [];
    if (playedMoves.length === moves.length) {
      setShowCongrats(true);
    }
  }, [playedMoves, puzzles, currentPuzzleIdx]);

  // When changing puzzle, reset playedMoves and showCongrats
  useEffect(() => {
    setPlayedMoves([]);
    setShowCongrats(false);
  }, [currentPuzzleIdx, puzzles]);

  function handleNextPuzzle() {
    setShowCongrats(false);
    if (currentPuzzleIdx < puzzles.length - 1) {
      setCurrentPuzzleIdx(currentPuzzleIdx + 1);
    } else {
      alert("Congratulations! You solved all puzzles.");
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2 text-gray-800">
          Choose Tactical Topic
        </label>
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black font-normal"
        >
          {tacticalTopics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>
      {selectedTopic !== "Fork" && selectedTopic !== "Pin" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center text-xl font-bold text-gray-900">
          Please add a PGN file for this topic in
          /public/puzzels/tactics/&lt;topic&gt;.pgn
        </div>
      )}
      {loading && <div className="text-center">Loading puzzles...</div>}
      {error && <div className="text-red-600 font-semibold mb-4">{error}</div>}
      {(selectedTopic === "Fork" || selectedTopic === "Pin") &&
        puzzles.length > 0 &&
        !loading && (
          <div>
            <div className="mb-4 font-semibold text-gray-700">
              Puzzle {currentPuzzleIdx + 1} of {puzzles.length}
            </div>
            <div className="flex flex-col items-center">
              <div className="flex">
                {/* Rank labels on the left */}
                <div className="flex flex-col justify-between mr-1 select-none">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="h-20 flex items-center justify-center text-lg font-bold text-gray-700"
                      style={{ height: "5rem", width: "2rem" }}
                    >
                      {8 - i}
                    </div>
                  ))}
                </div>
                {/* Chessboard */}
                <div
                  className="grid grid-cols-8 border-2 border-gray-800"
                  style={{ width: "40rem" }}
                >
                  {board.map((row, rowIdx) =>
                    row.map((piece, colIdx) => {
                      const isLight = (rowIdx + colIdx) % 2 === 0;
                      const isSelected =
                        selectedSquare &&
                        selectedSquare.row === rowIdx &&
                        selectedSquare.col === colIdx;
                      return (
                        <div
                          key={`${rowIdx}-${colIdx}`}
                          className={`w-20 h-20 flex items-center justify-center cursor-pointer transition-all duration-200 ${
                            isLight ? "bg-yellow-100" : "bg-yellow-800"
                          } ${
                            isSelected ? "ring-4 ring-blue-500 bg-blue-200" : ""
                          }`}
                          style={{ width: "5rem", height: "5rem" }}
                          onClick={() => handleSquareClick(rowIdx, colIdx)}
                        >
                          {piece && (
                            <span className="text-4xl font-bold">
                              <img
                                src={getPieceImage(piece)}
                                alt={piece}
                                className="w-16 h-16 object-contain"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = "none";
                                  e.target.parentNode.textContent =
                                    pieceImages[piece];
                                }}
                              />
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
              {/* File labels at the bottom */}
              <div className="flex mt-1 ml-[2.5rem] select-none">
                {[..."abcdefgh"].map((file, i) => (
                  <div
                    key={file}
                    className="w-20 flex items-center justify-center text-lg font-bold text-gray-700"
                    style={{ width: "5rem", height: "2rem" }}
                  >
                    {file}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 text-center text-gray-700">
              Moves to play:{" "}
              {puzzles[currentPuzzleIdx].moves
                .slice(playedMoves.length)
                .join(", ")}
            </div>
            {(selectedTopic === "Fork" || selectedTopic === "Pin") &&
              puzzles.length > 0 &&
              !loading && (
                <div className="mt-2 text-xs text-gray-400 text-center">
                  Debug: Last move:{" "}
                  {window.lastMoveDebug
                    ? `${
                        window.lastMoveDebug.userAlg
                      } vs ${window.lastMoveDebug.solutionMoves.join(" or ")}`
                    : ""}
                </div>
              )}
          </div>
        )}
      {showCongrats && (
        <div className="mt-4 text-center">
          <div className="text-green-600 font-bold text-xl mb-2">
            Congratulations! Puzzle solved.
          </div>
          <button
            onClick={handleNextPuzzle}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-lg mt-2"
          >
            Next Puzzle
          </button>
        </div>
      )}
    </div>
  );
}

export default function ChessDashboard() {
  const [selectedGame, setSelectedGame] = useState("tactics");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex flex-1 pt-24 pb-12 max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r rounded-l-xl shadow-lg hidden md:block">
          <div className="py-8 px-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Chess Games
            </h2>
            <ul className="space-y-2">
              {chessGames.map((game) => (
                <li key={game.key}>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                      selectedGame === game.key
                        ? "bg-yellow-400 text-black"
                        : "hover:bg-yellow-100 text-gray-800"
                    }`}
                    onClick={() => setSelectedGame(game.key)}
                  >
                    {game.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        {/* Mobile Sidebar */}
        <aside className="md:hidden w-full bg-white border-b shadow-lg sticky top-16 z-10">
          <div className="flex overflow-x-auto gap-2 px-2 py-3">
            {chessGames.map((game) => (
              <button
                key={game.key}
                className={`flex-shrink-0 px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                  selectedGame === game.key
                    ? "bg-yellow-400 text-black"
                    : "hover:bg-yellow-100 text-gray-800"
                }`}
                onClick={() => setSelectedGame(game.key)}
              >
                {game.name}
              </button>
            ))}
          </div>
        </aside>
        {/* Main Content */}
        <section className="flex-1 bg-white rounded-r-xl shadow-lg p-6 min-h-[400px] flex flex-col items-center justify-center">
          {gameContent[selectedGame]}
        </section>
      </main>
      <Footer />
    </div>
  );
}
