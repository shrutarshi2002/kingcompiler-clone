"use client";
import { useRef, useState, useCallback, useEffect } from "react";
import { Chess } from "chess.js";
import createStockfishWorker from "./stockfishWorker";
import ChessboardDisplay from "./ChessboardDisplay";

export default function GameAnalyzer() {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [bestMove, setBestMove] = useState("");
  const [info, setInfo] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userColor, setUserColor] = useState("w");
  const [playing, setPlaying] = useState(false); // Play/Pause state
  const workerRef = useRef(null);

  // Initialize Stockfish worker
  function initWorker() {
    if (!workerRef.current) {
      workerRef.current = createStockfishWorker();
      workerRef.current.onmessage = (event) => {
        const line =
          typeof event.data === "string" ? event.data : event.data?.data;
        if (line?.startsWith("info")) setInfo(line);
        if (line?.startsWith("bestmove")) {
          setBestMove(line.split(" ")[1]);
          setIsAnalyzing(false);
        }
      };
      workerRef.current.onerror = (error) => {
        setInfo("Error: Failed to load Stockfish engine");
        setIsAnalyzing(false);
      };
    }
  }

  // Handle moves on the chessboard
  const handleMove = useCallback(
    (from, to) => {
      const newGame = new Chess(fen);
      try {
        const move = newGame.move({ from, to, promotion: "q" });
        if (move) {
          setGame(newGame);
          setFen(newGame.fen());
          setBestMove("");
          setInfo("");
          // If playing, auto-analyze after move
          if (playing) {
            setTimeout(() => analyzePosition(newGame.fen()), 100); // slight delay to ensure state update
          }
        }
      } catch (e) {
        // Invalid move
      }
    },
    [fen, playing]
  );

  // Get current turn from FEN
  const getCurrentTurn = useCallback(() => {
    const parts = fen.split(" ");
    return parts[1] || "w";
  }, [fen]);

  // Analyze current position
  function analyzePosition(fenOverride) {
    initWorker();
    setBestMove("");
    setInfo("Analyzing...");
    setIsAnalyzing(true);
    const fenToAnalyze = fenOverride || fen;
    workerRef.current.postMessage("ucinewgame");
    workerRef.current.postMessage(`position fen ${fenToAnalyze}`);
    workerRef.current.postMessage("go depth 15");
  }

  // Reset to starting position
  function resetPosition() {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setBestMove("");
    setInfo("");
    setIsAnalyzing(false);
  }

  // Flip board
  function flipBoard() {
    setUserColor((prev) => (prev === "w" ? "b" : "w"));
  }

  // Play/Pause toggle
  function togglePlaying() {
    setPlaying((prev) => !prev);
  }

  // If play is turned on, analyze immediately
  useEffect(() => {
    if (playing) {
      analyzePosition();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  return (
    <div className="relative p-6 max-w-7xl mx-auto">
      {/* Stylish label at the top, above the board */}
      <div className="mb-4">
        <span
          className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-extrabold shadow-md tracking-widest uppercase border border-yellow-600"
          style={{ letterSpacing: "0.1em" }}
        >
          The Game Analyzer by kingmaster
        </span>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center">
          <ChessboardDisplay
            fen={fen}
            onMove={handleMove}
            userColor={userColor}
            allowMove={true}
            currentTurn={getCurrentTurn()}
          />
          <div className="flex gap-2 mt-4">
            <button
              onClick={resetPosition}
              className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition"
            >
              Reset
            </button>
            <button
              onClick={flipBoard}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
            >
              Flip Board
            </button>
            <button
              onClick={togglePlaying}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                playing ? "bg-red-500 text-white" : "bg-green-500 text-white"
              }`}
            >
              {playing ? "Pause" : "Play"}
            </button>
          </div>
        </div>
        <div className="flex-1 space-y-4">
          {/* Removed FEN input */}
          <div className="bg-gray-50 rounded-lg shadow p-4 h-48 flex flex-col justify-between">
            <div className="font-semibold mb-1">Best Move:</div>
            <div className="text-lg font-mono break-all mb-2 min-h-[28px] flex items-center">
              {bestMove || (
                <span className="text-gray-400">&nbsp;No move found&nbsp;</span>
              )}
            </div>
            <div className="font-mono text-xs text-gray-600 bg-white rounded p-2 h-24 overflow-y-auto border border-gray-200 transition-all duration-200 flex items-start">
              {info ? (
                info
              ) : (
                <span className="text-gray-400">
                  &nbsp;No analysis info yet&nbsp;
                </span>
              )}
              {/* Invisible placeholder to reserve space */}
              <span className="invisible select-none">
                info depth 15 seldepth 20 multipv 1 score cp 37 nodes 163190 nps
                1226992 hashfull 63 time 133 pv d2d4 e5d4 f3d4 g8f6 d4c6 d7c6
                d1d8 e8d8 f2f3 c8e6 b1d2 a7a5 f1c4 a5a4 c4e6 f7e6
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
