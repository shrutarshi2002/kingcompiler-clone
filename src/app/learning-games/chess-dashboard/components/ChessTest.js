"use client";
import { useState, useEffect } from "react";
import { Chess } from "chess.js";

function ChessTest() {
  const [testResults, setTestResults] = useState([]);
  const [game, setGame] = useState(null);

  useEffect(() => {
    runTests();
  }, []);

  function runTests() {
    const results = [];

    try {
      // Test 1: Create a new game
      const newGame = new Chess();
      results.push("✓ Chess game created successfully");
      setGame(newGame);

      // Test 2: Get initial position
      const fen = newGame.fen();
      results.push(`✓ Initial FEN: ${fen}`);

      // Test 3: Get legal moves
      const moves = newGame.moves();
      results.push(`✓ Legal moves: ${moves.length} moves available`);
      if (moves.length > 0) {
        results.push(`✓ Sample moves: ${moves.slice(0, 5).join(", ")}`);
      }

      // Test 4: Make a move
      const move = newGame.move("e4");
      if (move) {
        results.push(`✓ Move successful: ${move.san}`);
        results.push(`✓ New FEN: ${newGame.fen()}`);
      } else {
        results.push("✗ Move failed");
      }

      // Test 5: Test with a specific FEN
      const testGame = new Chess(
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
      );
      const testMoves = testGame.moves();
      results.push(`✓ Test FEN moves: ${testMoves.length} moves available`);

      // Test 6: Test endgame puzzle FEN
      const puzzleFen = "8/8/8/8/8/4k3/8/2K1R3 w - - 0 1";
      const puzzleGame = new Chess(puzzleFen);
      const puzzleMoves = puzzleGame.moves();
      results.push(`✓ Puzzle FEN moves: ${puzzleMoves.length} moves available`);
      if (puzzleMoves.length > 0) {
        results.push(`✓ Puzzle moves: ${puzzleMoves.join(", ")}`);
      }
    } catch (error) {
      results.push(`✗ Error: ${error.message}`);
    }

    setTestResults(results);
  }

  function testMove(from, to) {
    if (!game) return;

    try {
      const move = game.move({ from, to, promotion: "q" });
      if (move) {
        setTestResults((prev) => [
          ...prev,
          `✓ Move ${from}-${to} successful: ${move.san}`,
        ]);
      } else {
        setTestResults((prev) => [...prev, `✗ Move ${from}-${to} failed`]);
      }
    } catch (error) {
      setTestResults((prev) => [
        ...prev,
        `✗ Move ${from}-${to} error: ${error.message}`,
      ]);
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Chess.js Test</h2>

      <div className="mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={runTests}
        >
          Run Tests
        </button>
      </div>

      <div className="mb-4">
        <h3 className="font-bold mb-2">Test Moves:</h3>
        <div className="flex gap-2">
          <button
            className="bg-green-500 text-white px-2 py-1 rounded text-sm"
            onClick={() => testMove("e2", "e4")}
          >
            e2-e4
          </button>
          <button
            className="bg-green-500 text-white px-2 py-1 rounded text-sm"
            onClick={() => testMove("d2", "d4")}
          >
            d2-d4
          </button>
          <button
            className="bg-green-500 text-white px-2 py-1 rounded text-sm"
            onClick={() => testMove("g1", "f3")}
          >
            g1-f3
          </button>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h3 className="font-bold mb-2">Test Results:</h3>
        <div className="space-y-1">
          {testResults.map((result, index) => (
            <div key={index} className="text-sm">
              {result}
            </div>
          ))}
        </div>
      </div>

      {game && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <h3 className="font-bold mb-2">Current Game State:</h3>
          <p className="text-sm">FEN: {game.fen()}</p>
          <p className="text-sm">Legal Moves: {game.moves().length}</p>
          <p className="text-sm">
            Game Over: {game.isGameOver() ? "Yes" : "No"}
          </p>
          <p className="text-sm">Check: {game.isCheck() ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  );
}

export default ChessTest;
