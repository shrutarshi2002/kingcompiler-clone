"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Chess } from "chess.js";
import ChessboardDisplay from "./ChessboardDisplay";

function StrategySimulator() {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [userColor, setUserColor] = useState("w");
  const [thinking, setThinking] = useState(false);
  const stockfish = useRef(null);

  useEffect(() => {
    // Initialize Stockfish engine
    stockfish.current = new Worker("/stockfish.js");
    stockfish.current.postMessage("uci");

    stockfish.current.onmessage = (event) => {
      const line = event.data;
      if (line === "uciok") {
        stockfish.current.postMessage("isready");
      } else if (line === "readyok") {
        // Engine ready
      } else if (line.startsWith("bestmove")) {
        const bestMove = line.split(" ")[1];
        if (bestMove) {
          makeEngineMove(bestMove);
        }
      }
    };

    return () => {
      if (stockfish.current) {
        stockfish.current.terminate();
      }
    };
  }, []);

  const makeEngineMove = useCallback(
    (move) => {
      const newGame = new Chess(game.fen());
      const from = move.substring(0, 2);
      const to = move.substring(2, 4);
      const promotion = move.length > 4 ? move[4] : undefined;
      const moveObj = { from, to };
      if (promotion) moveObj.promotion = promotion;
      const result = newGame.move(moveObj);
      if (result) {
        setGame(newGame);
        setFen(newGame.fen());
        setUserColor(newGame.turn());
      }
      setThinking(false);
    },
    [game]
  );

  const handleMove = useCallback(
    (from, to) => {
      if (thinking) return; // Prevent user move while engine thinking
      const newGame = new Chess(game.fen());
      if (newGame.game_over()) {
        setThinking(false);
        return;
      }
      const move = newGame.move({ from, to, promotion: "q" });
      if (move) {
        setGame(newGame);
        setFen(newGame.fen());
        setUserColor(newGame.turn());
        setThinking(true);
        // Send position to engine and ask for best move
        stockfish.current.postMessage("position fen " + newGame.fen());
        stockfish.current.postMessage("go depth 15");
      }
    },
    [game, thinking]
  );

  const resetPosition = () => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setUserColor(newGame.turn());
    setThinking(false);
    stockfish.current.postMessage("ucinewgame");
    stockfish.current.postMessage("isready");
  };

  const getGameStatus = () => {
    if (!game) return "";
    if (game.isCheckmate()) return "Checkmate! Game over.";
    if (game.isStalemate()) return "Stalemate! Game over.";
    if (game.isDraw()) return "Draw! Game over.";
    if (game.isCheck()) return "Check!";
    return "";
  };

  const undoMove = () => {
    if (thinking) return;
    const newGame = new Chess(game.fen());
    newGame.undo();
    newGame.undo(); // Undo both player and engine move
    setGame(newGame);
    setFen(newGame.fen());
    setUserColor(newGame.turn());
  };

  const flipBoard = () => {
    setUserColor((prev) => (prev === "w" ? "b" : "w"));
  };

  return (
    <div className="w-full flex flex-col items-center p-4">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">
        Strategy Simulator
      </h2>
      <p className="mb-4 text-gray-600 max-w-xl text-center">
        Practice strategic thinking and positional play in realistic scenarios.
      </p>
      <ChessboardDisplay fen={fen} onMove={handleMove} userColor={userColor} />
      <div className="mt-2 text-red-600 font-semibold">{getGameStatus()}</div>
      {thinking && (
        <div className="mt-2 text-yellow-600 font-semibold">
          Engine is thinking...
        </div>
      )}
      <div className="flex gap-4 mt-4">
        <button
          onClick={resetPosition}
          className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600"
        >
          Reset Position
        </button>
        <button
          onClick={undoMove}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Undo Move
        </button>
        <button
          onClick={flipBoard}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Flip Board
        </button>
      </div>
    </div>
  );
}

export default StrategySimulator;
