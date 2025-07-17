"use client";
import { useState, useEffect, useMemo } from "react";
import { Chess } from "chess.js";
import ChessboardDisplay from "./ChessboardDisplay";

// Endgame categories with descriptions
const endgameCategories = [
  {
    key: "basic-endgames",
    name: "Basic Endgames",
    description: "Fundamental endgame concepts with minimal pieces",
    difficulty: "Beginner",
  },
  {
    key: "pawn-endgames",
    name: "Pawn Endgames",
    description: "King and pawn vs king scenarios",
    difficulty: "Beginner",
  },
  {
    key: "queen-endgames",
    name: "Queen Endgames",
    description: "King and queen vs king checkmate patterns",
    difficulty: "Beginner",
  },
  {
    key: "rook-endgames",
    name: "Rook Endgames",
    description: "King and rook vs king checkmate patterns",
    difficulty: "Intermediate",
  },
  {
    key: "bishop-endgames",
    name: "Bishop Endgames",
    description: "King and bishop vs king scenarios",
    difficulty: "Intermediate",
  },
  {
    key: "knight-endgames",
    name: "Knight Endgames",
    description: "King and knight vs king scenarios",
    difficulty: "Intermediate",
  },
  {
    key: "minor-piece-endgames",
    name: "Minor Piece Endgames",
    description: "Combinations of bishops and knights",
    difficulty: "Advanced",
  },
  {
    key: "major-piece-endgames",
    name: "Major Piece Endgames",
    description: "Combinations of rooks and other pieces",
    difficulty: "Advanced",
  },
  {
    key: "complex-endgames",
    name: "Complex Endgames",
    description: "Multiple piece combinations",
    difficulty: "Expert",
  },
  {
    key: "advanced-endgames",
    name: "Advanced Endgames",
    description: "Maximum piece coordination scenarios",
    difficulty: "Master",
  },
];

// Curated 6-piece endgame FENs for demo (fallback when PGN files aren't available)
const syzygyEndgames = [
  {
    fen: "8/8/8/8/8/8/5k2/6K1 w - - 0 1", // K vs K
    desc: "King vs King (draw)",
    category: "basic-endgames",
  },
  {
    fen: "8/8/8/8/8/8/5k2/6KQ w - - 0 1", // KQ vs K
    desc: "King and Queen vs King (mate in 1)",
    category: "queen-endgames",
  },
  {
    fen: "8/8/8/8/8/8/5k2/6KR w - - 0 1", // KR vs K
    desc: "King and Rook vs King (mate in 2)",
    category: "rook-endgames",
  },
  {
    fen: "8/8/8/8/8/8/5k2/6KB w - - 0 1", // KB vs K
    desc: "King and Bishop vs King (draw)",
    category: "bishop-endgames",
  },
  {
    fen: "8/8/8/8/8/8/5k2/6KN w - - 0 1", // KN vs K
    desc: "King and Knight vs King (draw)",
    category: "knight-endgames",
  },
  {
    fen: "8/8/8/8/8/8/5k2/6KP w - - 0 1", // KP vs K
    desc: "King and Pawn vs King (draw if not queening)",
    category: "pawn-endgames",
  },
  {
    fen: "8/8/8/8/8/8/5k2/6KBN w - - 0 1", // KBN vs K
    desc: "King, Bishop and Knight vs King (checkmate possible)",
    category: "minor-piece-endgames",
  },
  {
    fen: "8/8/8/8/8/8/5k2/6KRB w - - 0 1", // KRB vs K
    desc: "King, Rook and Bishop vs King (powerful combination)",
    category: "major-piece-endgames",
  },
  {
    fen: "8/8/8/8/8/8/5k2/6KQR w - - 0 1", // KQR vs K
    desc: "King, Queen and Rook vs King (overwhelming force)",
    category: "complex-endgames",
  },
  {
    fen: "8/8/8/8/8/8/5k2/6KQBN w - - 0 1", // KQBN vs K
    desc: "King, Queen, Bishop and Knight vs King (maximum coordination)",
    category: "advanced-endgames",
  },
];

function EndgameMastery() {
  const [fen, setFen] = useState(null);
  const [desc, setDesc] = useState("");
  const [game, setGame] = useState(null);
  const [message, setMessage] = useState("");
  const [solution, setSolution] = useState(null); // {from, to, uci, san}
  const [highlightSquares, setHighlightSquares] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("basic-endgames");
  const [availableEndgames, setAvailableEndgames] = useState([]);

  // Helper to fetch best move from Lichess Tablebase
  async function fetchSyzygySolution(fen) {
    const url = `https://tablebase.lichess.ovh/standard?fen=${encodeURIComponent(
      fen
    )}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Tablebase API error");
    const data = await res.json();
    if (!data.moves || !data.moves.length) throw new Error("No solution found");
    // Pick the first best move
    const move = data.moves[0];
    return move; // {uci, san, dtz, ...}
  }

  // Load available endgames for selected category
  useEffect(() => {
    async function loadCategoryEndgames() {
      try {
        const response = await fetch(
          `/endgames/${selectedCategory}/index.json`
        );
        if (response.ok) {
          const data = await response.json();
          setAvailableEndgames(data.endgames || []);
        } else {
          // Fallback to filtered syzygy endgames
          const filtered = syzygyEndgames.filter(
            (endgame) => endgame.category === selectedCategory
          );
          setAvailableEndgames(
            filtered.map((endgame, index) => ({
              name: endgame.desc,
              file: `syzygy-${index}.pgn`,
              difficulty: "Mixed",
              description: endgame.desc,
              fen: endgame.fen,
            }))
          );
        }
      } catch (error) {
        console.log("Using fallback endgames for category:", selectedCategory);
        const filtered = syzygyEndgames.filter(
          (endgame) => endgame.category === selectedCategory
        );
        setAvailableEndgames(
          filtered.map((endgame, index) => ({
            name: endgame.desc,
            file: `syzygy-${index}.pgn`,
            difficulty: "Mixed",
            description: endgame.desc,
            fen: endgame.fen,
          }))
        );
      }
    }

    loadCategoryEndgames();
  }, [selectedCategory]);

  // Load a new random endgame position from the selected category
  async function loadNewSyzygyPosition() {
    setLoading(true);
    setMessage("Loading new endgame from Syzygy Tablebase...");
    setSolution(null);
    setHighlightSquares([]);

    try {
      // Filter endgames by selected category
      const categoryEndgames = syzygyEndgames.filter(
        (endgame) => endgame.category === selectedCategory
      );

      if (categoryEndgames.length === 0) {
        throw new Error("No endgames available for this category");
      }

      const idx = Math.floor(Math.random() * categoryEndgames.length);
      const { fen, desc } = categoryEndgames[idx];
      setFen(fen);
      setDesc(desc);
      const gameObj = new Chess(fen);
      setGame(gameObj);

      // Fetch best move from Syzygy Tablebase
      const move = await fetchSyzygySolution(fen);
      // Parse move for highlighting
      const from = move.uci.substring(0, 2);
      const to = move.uci.substring(2, 4);
      setSolution({ from, to, uci: move.uci, san: move.san });
      setMessage("");
    } catch (e) {
      setMessage("Failed to load from Syzygy Tablebase: " + e.message);
      setSolution(null);
    } finally {
      setLoading(false);
    }
  }

  // Load specific endgame from PGN file
  async function loadEndgameFromFile(filename) {
    setLoading(true);
    setMessage("Loading endgame from PGN file...");
    setSolution(null);
    setHighlightSquares([]);

    try {
      const response = await fetch(`/endgames/${selectedCategory}/${filename}`);
      if (!response.ok) {
        throw new Error("PGN file not found");
      }

      const pgnText = await response.text();
      const gameObj = new Chess();
      gameObj.loadPgn(pgnText);

      const fen = gameObj.fen();
      setFen(fen);
      setDesc(`Loaded from ${filename}`);
      setGame(gameObj);

      // Fetch best move from Syzygy Tablebase
      const move = await fetchSyzygySolution(fen);
      const from = move.uci.substring(0, 2);
      const to = move.uci.substring(2, 4);
      setSolution({ from, to, uci: move.uci, san: move.san });
      setMessage("");
    } catch (e) {
      setMessage("Failed to load PGN file: " + e.message);
      setSolution(null);
    } finally {
      setLoading(false);
    }
  }

  // Show solution: highlight and display best move
  function handleShowSolution() {
    if (!solution || !game) return;
    const { from, to, san } = solution;
    // Highlight move
    const files = "abcdefgh";
    const fromCol = files.indexOf(from[0]);
    const fromRow = 8 - parseInt(from[1]);
    const toCol = files.indexOf(to[0]);
    const toRow = 8 - parseInt(to[1]);
    setHighlightSquares([
      [fromRow, fromCol],
      [toRow, toCol],
    ]);
    // Get piece name
    const piece = game.get(from);
    let pieceName = "Piece";
    if (piece) {
      const pieceNames = {
        k: "King",
        q: "Queen",
        r: "Rook",
        b: "Bishop",
        n: "Knight",
        p: "Pawn",
      };
      const color = piece.color === "w" ? "White" : "Black";
      const type = pieceNames[piece.type] || "Piece";
      pieceName = `${color} ${type}`;
    }
    setMessage(`Solution: ${pieceName} plays ${san} (${from} to ${to})`);
  }

  // On mount, load a position
  useEffect(() => {
    loadNewSyzygyPosition();
    // eslint-disable-next-line
  }, []);

  // Handle user move (optional: can be made stricter)
  function handleMove(from, to) {
    if (!game || !solution) return;
    const legalMoves = game.moves({ verbose: true });
    const isLegal = legalMoves.some(
      (move) => move.from === from && move.to === to
    );
    if (!isLegal) {
      setMessage(`Invalid move: ${from}-${to}. Try a different move.`);
      return;
    }
    const move = game.move({ from, to, promotion: "q" });
    setFen(game.fen());
    if (from === solution.from && to === solution.to) {
      setMessage("Correct! You found the tablebase move.");
    } else {
      setMessage("Not the best move. Try again or view solution.");
      setTimeout(() => {
        game.undo();
        setFen(game.fen());
      }, 1000);
    }
  }

  if (!fen) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

  const selectedCategoryInfo = endgameCategories.find(
    (cat) => cat.key === selectedCategory
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-2 text-center">Endgame Mastery</h2>
      <p className="mb-4 text-center">{desc}</p>

      <div className="flex justify-center gap-8">
        <ChessboardDisplay
          fen={fen}
          onMove={handleMove}
          highlightSquares={highlightSquares}
        />
        <div className="w-80">
          {/* Category Filter Dropdown */}
          <div className="bg-gray-100 p-4 rounded-lg shadow mb-4">
            <h3 className="font-bold text-lg mb-2">Endgame Category</h3>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {endgameCategories.map((category) => (
                <option key={category.key} value={category.key}>
                  {category.name} ({category.difficulty})
                </option>
              ))}
            </select>
            {selectedCategoryInfo && (
              <p className="text-sm text-gray-600 mt-2">
                {selectedCategoryInfo.description}
              </p>
            )}
          </div>

          <div className="bg-gray-100 p-4 rounded-lg shadow mb-4">
            <h3 className="font-bold text-lg mb-2">Controls</h3>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-2 hover:bg-blue-600 transition-colors"
              onClick={loadNewSyzygyPosition}
              disabled={loading}
            >
              {loading ? "Loading..." : "New Position"}
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600 transition-colors"
              onClick={handleShowSolution}
              disabled={loading || !solution}
            >
              View Solution
            </button>
          </div>

          {/* Available Endgames List */}
          <div className="bg-gray-100 p-4 rounded-lg shadow mb-4">
            <h3 className="font-bold text-lg mb-2">Available Endgames</h3>
            <div className="max-h-40 overflow-y-auto">
              {availableEndgames.length > 0 ? (
                availableEndgames.map((endgame, index) => (
                  <button
                    key={index}
                    onClick={() => loadEndgameFromFile(endgame.file)}
                    className="block w-full text-left p-2 hover:bg-gray-200 rounded mb-1 text-sm"
                    disabled={loading}
                  >
                    <div className="font-semibold">{endgame.name}</div>
                    <div className="text-xs text-gray-600">
                      {endgame.description}
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-sm text-gray-600">
                  No endgames available for this category
                </p>
              )}
            </div>
          </div>

          {message && (
            <div className="bg-gray-100 p-4 rounded-lg shadow mb-4">
              <h3 className="font-bold text-lg mb-2">Info</h3>
              <p className="text-md font-semibold">{message}</p>
            </div>
          )}

          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">Puzzle Info</h3>
            <p className="text-sm">Current FEN: {fen}</p>
            <p className="text-sm">
              Best Move:{" "}
              {solution
                ? solution.san + ` (${solution.from}-${solution.to})`
                : "?"}
            </p>
            <p className="text-sm">Description: {desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EndgameMastery;
