"use client";
import { useState, useEffect, useMemo } from "react";
import { Chess } from "chess.js";
import ChessboardDisplay from "./ChessboardDisplay";

// Curated 6-piece endgame FENs for demo (KQ vs KR, KRB vs KN, KBN vs K, etc.)
const syzygyEndgames = [
  {
    fen: "8/8/8/8/8/8/5k2/6K1 w - - 0 1", // K vs K
    desc: "King vs King (draw)",
  },
  {
    fen: "8/8/8/8/8/8/5k2/6KQ w - - 0 1", // KQ vs K
    desc: "King and Queen vs King (mate in 1)",
  },
  {
    fen: "8/8/8/8/8/8/5k2/6KR w - - 0 1", // KR vs K
    desc: "King and Rook vs King (mate in 2)",
  },
  {
    fen: "8/8/8/8/8/8/5k2/6KB w - - 0 1", // KB vs K
    desc: "King and Bishop vs King (draw)",
  },
  {
    fen: "8/8/8/8/8/8/5k2/6KN w - - 0 1", // KN vs K
    desc: "King and Knight vs King (draw)",
  },
  {
    fen: "8/8/8/8/8/8/5k2/6KP w - - 0 1", // KP vs K
    desc: "King and Pawn vs King (draw if not queening)",
  },
  {
    fen: "8/8/8/8/8/8/5k2/6KR w - - 0 1", // KR vs K
    desc: "King and Rook vs King (mate in 2)",
  },
  {
    fen: "8/8/8/8/8/8/5k2/6KQ w - - 0 1", // KQ vs K
    desc: "King and Queen vs King (mate in 1)",
  },
  {
    fen: "8/8/8/8/8/8/5k2/6KP w - - 0 1", // KP vs K
    desc: "King and Pawn vs King (draw if not queening)",
  },
  // Add more interesting 6-piece endgames as desired
];

function EndgameMastery() {
  const [fen, setFen] = useState(null);
  const [desc, setDesc] = useState("");
  const [game, setGame] = useState(null);
  const [message, setMessage] = useState("");
  const [solution, setSolution] = useState(null); // {from, to, uci, san}
  const [highlightSquares, setHighlightSquares] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // Load a new random endgame position from the curated set and fetch solution
  async function loadNewSyzygyPosition() {
    setLoading(true);
    setMessage("Loading new endgame from Syzygy Tablebase...");
    setSolution(null);
    setHighlightSquares([]);
    try {
      const idx = Math.floor(Math.random() * syzygyEndgames.length);
      const { fen, desc } = syzygyEndgames[idx];
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

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-2 text-center">Endgame Mastery</h2>
      <h3 className="text-lg font-semibold mb-2 text-center text-blue-600">
        Syzygy Tablebase Endgame
      </h3>
      <p className="mb-4 text-center">{desc}</p>
      <div className="flex justify-center gap-8">
        <ChessboardDisplay
          fen={fen}
          onMove={handleMove}
          highlightSquares={highlightSquares}
        />
        <div className="w-64">
          <div className="bg-gray-100 p-4 rounded-lg shadow">
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
          {message && (
            <div className="bg-gray-100 p-4 rounded-lg shadow mt-4">
              <h3 className="font-bold text-lg mb-2">Info</h3>
              <p className="text-md font-semibold">{message}</p>
            </div>
          )}
          <div className="bg-gray-100 p-4 rounded-lg shadow mt-4">
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
