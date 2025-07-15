"use client";
import { useState, useEffect, useCallback } from "react";
import { Chess } from "chess.js";

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

function TacticsContent() {
  const [selectedTopic, setSelectedTopic] = useState(tacticalTopics[0]);
  const [puzzles, setPuzzles] = useState([]);
  const [currentPuzzleIdx, setCurrentPuzzleIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playedMoves, setPlayedMoves] = useState([]);
  const [showCongrats, setShowCongrats] = useState(false);
  const [pendingOpponentMove, setPendingOpponentMove] = useState(null);
  const [userColor, setUserColor] = useState("w");
  const [chess, setChess] = useState(null);
  const [flipBoard, setFlipBoard] = useState(false);

  // Add levels
  const levels = [
    { label: "Elo: 400-900", value: "400-900" },
    { label: "Elo: 900-1200", value: "900-1200" },
    { label: "Elo: 1200-1400", value: "1200-1400" },
    { label: "Elo: 1400-1600", value: "1400-1600" },
  ];
  const [selectedLevel, setSelectedLevel] = useState(levels[0].value);

  // Helper function to load multiple PGN files
  const loadMultiplePGNFiles = useCallback(async (filePaths) => {
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
  }, []);

  // Improved PGN parser for [FEN ...] and moves, skipping comments and extra tags
  const parsePGN = useCallback((pgnText) => {
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
        let moveLine = line.replace(/\{[^}]*\}/g, "").replace(/\([^)]*\)/g, "");
        moveLine = moveLine.replace(/\d+\.|\*/g, "").trim();
        if (moveLine) {
          moves = moveLine
            .split(/\s+/)
            .map(cleanMove)
            .filter((m) => m && !/^\.*$/.test(m))
            .filter((m) => !["1-0", "0-1", "1/2-1/2", "*"].includes(m));
          if (moves.length > 0) {
            puzzles.push({ fen, moves });
            fen = null;
            moves = [];
          }
        }
      }
    }
    return puzzles;
  }, []);

  // Update PGN loading logic to use topic and level
  useEffect(() => {
    setPlayedMoves([]);
    setCurrentPuzzleIdx(0);
    setPuzzles([]);
    setError(null);
    const topic = selectedTopic.toLowerCase();
    const level = selectedLevel;
    if (topic && level) {
      setLoading(true);
      const filePaths = Array.from(
        { length: 10 },
        (_, i) => `/puzzels/tactics/${topic}/${level}/${topic}${i + 1}.pgn`
      );
      Promise.all(
        filePaths.map((path) =>
          fetch(path)
            .then((res) => (res.ok ? res.text() : null))
            .catch(() => null)
        )
      )
        .then((texts) => {
          const allPuzzles = [];
          texts.forEach((text) => {
            if (text) {
              const parsed = parsePGN(text);
              allPuzzles.push(...parsed);
            }
          });
          if (allPuzzles.length === 0)
            throw new Error("No puzzles found in PGN files");
          setPuzzles(allPuzzles);
        })
        .catch(() =>
          setError(
            `Failed to load or parse PGN files for ${selectedTopic} (${selectedLevel})`
          )
        )
        .finally(() => setLoading(false));
    }
  }, [selectedTopic, selectedLevel, parsePGN]);

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
  }, [selectedTopic, parsePGN, loadMultiplePGNFiles]);

  // Chessboard logic
  const fenToBoard = useCallback((fen) => {
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
  }, []);

  const pieceImages = {
    K: "♔",
    Q: "♕",
    R: "♖",
    B: "♗",
    N: "♘",
    P: "♙",
    k: "♚",
    q: "♛",
    r: "♜",
    b: "♝",
    n: "♞",
    p: "♟",
  };

  // Map FEN piece to image filename
  const getPieceImage = useCallback((piece) => {
    if (!piece) return null;
    const isWhite = piece === piece.toUpperCase();
    const prefix = isWhite ? "w" : "b";
    const name = piece.toUpperCase();
    return `/chess-pieces/${prefix}${name}.png`;
  }, []);

  // Move handling
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [board, setBoard] = useState([]);
  const [turn, setTurn] = useState("w");

  useEffect(() => {
    if (puzzles.length > 0) {
      const fen = puzzles[currentPuzzleIdx].fen;
      const fenTurn = fen.split(" ")[1] || "w";
      setUserColor(fenTurn);
      const game = new Chess();
      game.load(fen);
      setChess(game);
      setBoard(fenToBoard(fen));
      setSelectedSquare(null);
      setPlayedMoves([]);
      setTurn(fenTurn);
    }
  }, [puzzles, currentPuzzleIdx, fenToBoard]);

  // Convert user move to basic algebraic notation
  const getAlgebraicMove = useCallback((board, from, to) => {
    const piece = board[from.row][from.col];
    const dest = board[to.row][to.col];
    const files = "abcdefgh";
    const fromSq = files[from.col] + (8 - from.row);
    const toSq = files[to.col] + (8 - to.row);
    let move = "";
    if (piece.toUpperCase() !== "P") {
      move += piece.toUpperCase();
    }
    if (dest && dest !== "") {
      if (piece.toUpperCase() === "P") {
        move += files[from.col];
      }
      move += "x";
    }
    move += toSq;
    return move;
  }, []);

  const cleanMove = useCallback((move) => {
    return move
      .replace(/^\.*?\s*/, "")
      .replace(/[+#?!]/g, "")
      .replace(/\{.*?\}/g, "")
      .trim();
  }, []);

  const getSolutionMoves = useCallback(
    (moveStr) => {
      return moveStr.split(/\s+/).map(cleanMove).filter(Boolean);
    },
    [cleanMove]
  );

  // Use chess.js for move validation and board state
  const playAllOpponentReplies = useCallback(
    (updatedChess, updatedPlayedMoves) => {
      let game = new Chess();
      game.load(puzzles[currentPuzzleIdx].fen);
      for (let move of updatedPlayedMoves) {
        game.move(move, { sloppy: true });
      }
      let playedMovesState = [...updatedPlayedMoves];
      let idx = playedMovesState.length;
      const moves = puzzles[currentPuzzleIdx].moves;
      if (idx >= moves.length) {
        setChess(game);
        setBoard(fenToBoard(game.fen()));
        setPlayedMoves(playedMovesState);
        setTurn(game.turn());
        setShowCongrats(true);
        return;
      }
      while (idx < moves.length) {
        const isUserTurn =
          (userColor === "w" && game.turn() === "w") ||
          (userColor === "b" && game.turn() === "b");
        if (isUserTurn) break;
        const moveAlg = moves[idx];
        const moveResult = game.move(moveAlg, { sloppy: true });
        if (!moveResult) break;
        playedMovesState.push(moveAlg);
        idx++;
      }
      setChess(game);
      setBoard(fenToBoard(game.fen()));
      setPlayedMoves(playedMovesState);
      setTurn(game.turn());
      if (playedMovesState.length === moves.length) {
        setShowCongrats(true);
      }
    },
    [puzzles, currentPuzzleIdx, userColor, fenToBoard]
  );

  const handleSquareClick = useCallback(
    (row, col) => {
      if (!board.length || showCongrats || !chess) return;
      const files = "abcdefgh";
      const from = selectedSquare || { row, col };
      const to = { row, col };
      if (!selectedSquare) {
        const piece = board[row][col];
        if (
          piece &&
          ((turn === "w" && piece === piece.toUpperCase()) ||
            (turn === "b" && piece === piece.toLowerCase()))
        ) {
          setSelectedSquare({ row, col });
        }
        return;
      }
      const fromSq = files[from.col] + (8 - from.row);
      const toSq = files[to.col] + (8 - to.row);
      const moveObj = { from: fromSq, to: toSq, promotion: "q" };
      const game = new Chess(chess.fen());
      const moveResult = game.move(moveObj);
      if (!moveResult) {
        setSelectedSquare(null);
        return;
      }
      const solutionMoveStr =
        puzzles[currentPuzzleIdx].moves[playedMoves.length];
      const solutionMoves = [cleanMove(solutionMoveStr)];
      const parenMatch = solutionMoveStr.match(/\(([^)]+)\)/);
      if (parenMatch) {
        parenMatch[1]
          .split(";")
          .forEach((m) => solutionMoves.push(cleanMove(m)));
      }
      function stripCheckSymbols(move) {
        return move.replace(/[+#]/g, "");
      }
      const isCorrect = solutionMoves.some(
        (sol) =>
          stripCheckSymbols(moveResult.san) === stripCheckSymbols(sol) ||
          moveResult.from + moveResult.to === sol.toLowerCase()
      );
      window.lastMoveDebug = { userAlg: moveResult.san, solutionMoves };
      if (isCorrect) {
        const newPlayedMoves = [...playedMoves, moveResult.san];
        setSelectedSquare(null);
        playAllOpponentReplies(game, newPlayedMoves);
      } else {
        alert(
          `Incorrect move.\nYour move: ${
            moveResult.san
          }\nExpected: ${solutionMoves.join(" or ")}`
        );
        setSelectedSquare(null);
      }
    },
    [
      board,
      showCongrats,
      chess,
      selectedSquare,
      turn,
      puzzles,
      currentPuzzleIdx,
      playedMoves,
      cleanMove,
      playAllOpponentReplies,
    ]
  );

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

  const handleNextPuzzle = useCallback(() => {
    setShowCongrats(false);
    if (currentPuzzleIdx < puzzles.length - 1) {
      setCurrentPuzzleIdx(currentPuzzleIdx + 1);
    } else {
      alert("Congratulations! You solved all puzzles.");
    }
  }, [currentPuzzleIdx, puzzles.length]);

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex flex-row items-start justify-center gap-8 mt-2">
        <div className="flex flex-col items-center">
          <button
            onClick={() => setFlipBoard((f) => !f)}
            className="mb-2 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-xl"
            title="Flip board"
          >
            ♾️
          </button>
          <div className="mb-4 w-full text-left">
            <span
              className={`text-2xl font-extrabold tracking-wide ${
                turn === "w" ? "text-yellow-700" : "text-black"
              }`}
              style={{ letterSpacing: "2px" }}
            >
              {turn === "w" ? "WHITE TO MOVE" : "BLACK TO MOVE"}
            </span>
          </div>
          <div className="flex">
            <div className="flex flex-col justify-between mr-1 select-none">
              {(flipBoard
                ? [...Array(8).keys()].reverse()
                : [...Array(8).keys()]
              ).map((i) => (
                <div
                  key={i}
                  className="h-20 flex items-center justify-center text-lg font-bold text-gray-700"
                  style={{ height: "5rem", width: "2rem" }}
                >
                  {8 - i}
                </div>
              ))}
            </div>
            <div
              className="grid grid-cols-8 border-2 border-gray-800"
              style={{ width: "40rem" }}
            >
              {(flipBoard ? [...board].reverse() : board).map((row, rowIdx) =>
                (flipBoard ? [...row].reverse() : row).map((piece, colIdx) => {
                  const displayRowIdx = flipBoard ? 7 - rowIdx : rowIdx;
                  const displayColIdx = flipBoard ? 7 - colIdx : colIdx;
                  const isLight = (displayRowIdx + displayColIdx) % 2 === 0;
                  const isSelected =
                    selectedSquare &&
                    selectedSquare.row === displayRowIdx &&
                    selectedSquare.col === displayColIdx;
                  return (
                    <div
                      key={`${rowIdx}-${colIdx}`}
                      className={`w-20 h-20 flex items-center justify-center cursor-pointer transition-all duration-200 ${
                        isLight ? "bg-yellow-100" : ""
                      } ${
                        isSelected ? "ring-4 ring-blue-500 bg-blue-200" : ""
                      }`}
                      style={{
                        width: "5rem",
                        height: "5rem",
                        backgroundColor: isLight ? undefined : "#B58863",
                      }}
                      onClick={() =>
                        handleSquareClick(displayRowIdx, displayColIdx)
                      }
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
          <div className="flex mt-1 ml-[2.5rem] select-none">
            {(flipBoard ? [..."abcdefgh"].reverse() : [..."abcdefgh"]).map(
              (file, i) => (
                <div
                  key={file}
                  className="w-20 flex items-center justify-center text-lg font-bold text-gray-700"
                  style={{ width: "5rem", height: "2rem" }}
                >
                  {file}
                </div>
              )
            )}
          </div>
        </div>
        <div className="flex flex-col items-start mt-4 min-w-[260px] w-[300px]">
          <div className="flex flex-row gap-6 w-full mb-2">
            <div className="flex-1">
              <label className="block text-lg font-semibold mb-2 text-gray-800">
                Choose Topic
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
            <div className="flex-1">
              <label className="block text-lg font-semibold mb-2 text-gray-800">
                Choose Level
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black font-normal"
              >
                {levels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {puzzles.length > 0 && (
            <div className="mb-4 w-full">
              <div className="font-semibold text-gray-800 mb-1">Position:</div>
              <div className="flex flex-wrap gap-2 mb-2">
                {puzzles.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPuzzleIdx(idx)}
                    className={`w-8 h-8 rounded-full font-bold border-2 flex items-center justify-center transition-colors duration-150 ${
                      idx === currentPuzzleIdx
                        ? "bg-yellow-500 border-yellow-700 text-black scale-110"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-yellow-100"
                    }`}
                    style={{ minWidth: "2rem", minHeight: "2rem" }}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <div className="text-sm text-gray-600 font-semibold">
                {selectedTopic} - {currentPuzzleIdx + 1}
              </div>
            </div>
          )}
          {error && (
            <div className="text-red-600 font-semibold mb-4">{error}</div>
          )}
          {showCongrats && (
            <div className="mt-4 w-full text-center">
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
      </div>
      {selectedTopic !== "Fork" && selectedTopic !== "Pin" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center text-xl font-bold text-gray-900">
          Please add a PGN file for this topic in
          /public/puzzels/tactics/&lt;topic&gt;.pgn
        </div>
      )}
      {loading && <div className="text-center">Loading puzzles...</div>}
      {(selectedTopic === "Fork" || selectedTopic === "Pin") &&
        puzzles.length > 0 &&
        !loading && (
          <div>
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
    </div>
  );
}

export default TacticsContent;
