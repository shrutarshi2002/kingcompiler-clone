"use client";
import { useEffect, useState, useRef } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

export default function CustomChessVsEngine() {
  const [game, setGame] = useState(new Chess());
  const [userColor, setUserColor] = useState(null); // 'w' or 'b'
  const [isEngineThinking, setIsEngineThinking] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [gameResult, setGameResult] = useState("");
  const engineRef = useRef(null);

  useEffect(() => {
    const sf = new Worker("/engine/stockfish-17-lite-single.js");
    engineRef.current = sf;
    sf.postMessage("uci");
    sf.onmessage = (e) => {
      if (typeof e.data !== "string") return;
      if (e.data.startsWith("bestmove")) {
        setIsEngineThinking(false);
        const bestMove = e.data.split(" ")[1];
        if (bestMove && bestMove !== "(none)") {
          const moveObj = {
            from: bestMove.slice(0, 2),
            to: bestMove.slice(2, 4),
            promotion: bestMove.length > 4 ? bestMove[4] : "q",
          };
          const newGame = new Chess(game.fen());
          const move = newGame.move(moveObj);
          if (move) {
            setGame(new Chess(newGame.fen()));
            setMoveHistory(newGame.history({ verbose: true }));
            if (newGame.isGameOver()) {
              setGameResult(getGameResult(newGame));
            }
          }
        }
      }
    };
    sf.onerror = (e) => {
      console.error("Stockfish worker error:", e);
    };
    return () => sf.terminate();
    // eslint-disable-next-line
  }, []);

  // If user chooses black, engine plays first
  useEffect(() => {
    if (userColor === "b" && game.fen() === new Chess().fen()) {
      setIsEngineThinking(true);
      engineRef.current.postMessage(`position fen ${game.fen()}`);
      engineRef.current.postMessage("go depth 15");
    }
    // eslint-disable-next-line
  }, [userColor, game.fen()]);

  const onDrop = (sourceSquare, targetSquare) => {
    if (!userColor) return false;
    if (isEngineThinking || game.isGameOver()) return false;
    const currentTurn = game.turn();
    if (
      (userColor === "w" && currentTurn !== "w") ||
      (userColor === "b" && currentTurn !== "b")
    )
      return false;
    // Always use a new Chess instance for state updates
    const newGame = new Chess(game.fen());
    const move = newGame.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
    if (move === null) return false;
    setGame(new Chess(newGame.fen()));
    setMoveHistory(newGame.history({ verbose: true }));
    if (newGame.isGameOver()) {
      setGameResult(getGameResult(newGame));
      return true;
    }
    setIsEngineThinking(true);
    engineRef.current.postMessage(`position fen ${newGame.fen()}`);
    engineRef.current.postMessage("go depth 15");
    return true;
  };

  const handleColorSelect = (color) => {
    setUserColor(color);
    // Always reset the game to starting position
    const newGame = new Chess();
    setGame(newGame);
    setMoveHistory([]);
    setGameResult("");
    setIsEngineThinking(false);
  };

  const handleReset = () => {
    setUserColor(null);
    setGame(new Chess());
    setMoveHistory([]);
    setGameResult("");
    setIsEngineThinking(false);
  };

  function getGameResult(chess) {
    if (chess.isCheckmate()) {
      return chess.turn() === "w"
        ? "Black wins by checkmate!"
        : "White wins by checkmate!";
    } else if (chess.isDraw()) {
      return "Draw!";
    } else if (chess.isStalemate()) {
      return "Stalemate!";
    } else if (chess.isThreefoldRepetition()) {
      return "Draw by threefold repetition!";
    } else if (chess.isInsufficientMaterial()) {
      return "Draw by insufficient material!";
    }
    return "";
  }

  if (!userColor) {
    return (
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">You vs Engine</h1>
        <div className="mb-4">Choose your color:</div>
        <div className="flex gap-4">
          <button
            className="px-6 py-3 bg-white text-black border-2 border-black rounded-lg hover:bg-gray-200 transition"
            onClick={() => handleColorSelect("w")}
          >
            White
          </button>
          <button
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            onClick={() => handleColorSelect("b")}
          >
            Black
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">You vs Engine</h1>
      <div className="w-[320px] mx-auto">
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          arePiecesDraggable={
            !isEngineThinking &&
            !game.isGameOver() &&
            ((userColor === "w" && game.turn() === "w") ||
              (userColor === "b" && game.turn() === "b"))
          }
          boardWidth={320}
          boardOrientation={userColor === "b" ? "black" : "white"}
        />
      </div>
      {isEngineThinking && (
        <div className="mt-2 text-blue-600 font-semibold">
          Engine is thinking...
        </div>
      )}
      {gameResult && (
        <div className="mt-2 text-red-600 font-semibold">{gameResult}</div>
      )}
      <div className="mt-4 w-full max-w-xs">
        <h2 className="font-semibold mb-2">Move History</h2>
        <div className="bg-gray-100 rounded p-2 h-32 overflow-y-auto text-sm">
          {moveHistory.length === 0 ? (
            <span className="text-gray-400">No moves yet.</span>
          ) : (
            <ol className="list-decimal pl-4">
              {moveHistory.map((move, idx) => (
                <li key={idx}>{move.san}</li>
              ))}
            </ol>
          )}
        </div>
      </div>
      <button
        className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition"
        onClick={handleReset}
      >
        Reset
      </button>
    </div>
  );
}
