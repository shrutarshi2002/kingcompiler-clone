"use client";
import { useState, useEffect, useCallback } from "react";
import { Chess } from "chess.js";

const worldChampions = [
  "Wilhelm Steinitz",
  "Emanuel Lasker",
  "José Raúl Capablanca",
  "Alexander Alekhine",
  "Max Euwe",
  "Mikhail Botvinnik",
  "Vasily Smyslov",
  "Mikhail Tal",
  "Tigran Petrosian",
  "Boris Spassky",
  "Robert James Fischer",
  "Anatoly Karpov",
  "Garry Kasparov",
  "Vladimir Kramnik",
  "Viswanathan Anand",
  "Magnus Carlsen",
  "Ding Liren",
];

function IntuitionTrainer() {
  const [selectedChampion, setSelectedChampion] = useState(worldChampions[0]);
  const [puzzles, setPuzzles] = useState([]);
  const [currentPuzzleIdx, setCurrentPuzzleIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playedMoves, setPlayedMoves] = useState([]);
  const [showCongrats, setShowCongrats] = useState(false);
  const [userColor, setUserColor] = useState("w");
  const [chess, setChess] = useState(null);
  const [flipBoard, setFlipBoard] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const positionsPerPage = 10;

  // Helper to clean up move notation
  const cleanMove = useCallback((move) => {
    return move
      .replace(/^\.*?\s*/, "")
      .replace(/[+#?!]/g, "")
      .replace(/\{.*?\}/g, "")
      .trim();
  }, []);

  // Enhanced PGN parser for champion games
  const parseChampionPGN = useCallback(
    (pgnText, championName) => {
      const puzzles = [];
      const lines = pgnText.split(/\r?\n/);
      let currentGame = null;
      let currentMoves = [];
      let gameInfo = {};
      let championColor = null;
      let championWon = false;

      // Use only the last name for partial matching
      const championLastName = championName.split(/[ ,]+/).pop().toLowerCase();

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Parse game headers
        if (line.startsWith("[Event ")) {
          // Start of a new game
          if (currentGame && currentMoves.length > 0 && championWon) {
            const gamePuzzles = extractPuzzlesFromWinningGame(
              currentMoves,
              championColor
            );
            puzzles.push(...gamePuzzles);
          }
          currentGame = new Chess();
          currentMoves = [];
          gameInfo = {};
          championColor = null;
          championWon = false;
        }
        if (line.startsWith("[White ")) {
          const whitePlayer = line.match(/\[White "([^\"]+)"\]/)?.[1] || "";
          if (whitePlayer.toLowerCase().includes(championLastName)) {
            championColor = "w";
          }
        }
        if (line.startsWith("[Black ")) {
          const blackPlayer = line.match(/\[Black "([^\"]+)"\]/)?.[1] || "";
          if (blackPlayer.toLowerCase().includes(championLastName)) {
            championColor = "b";
          }
        }
        if (line.startsWith("[Result ")) {
          const result = line.match(/\[Result "([^\"]+)"\]/)?.[1] || "";
          if (result === "1-0") {
            championWon = championColor === "w";
          } else if (result === "0-1") {
            championWon = championColor === "b";
          }
        } else if (
          currentGame &&
          line &&
          !line.startsWith("[") &&
          !line.startsWith("{")
        ) {
          // Extract moves from the game
          let moveLine = line
            .replace(/\{[^}]*\}/g, "")
            .replace(/\([^)]*\)/g, "");
          moveLine = moveLine.replace(/\d+\.|\*/g, "").trim();
          if (moveLine) {
            const gameMoves = moveLine
              .split(/\s+/)
              .map(cleanMove)
              .filter((m) => m && !/^\.*$/.test(m))
              .filter((m) => !["1-0", "0-1", "1/2-1/2", "*"].includes(m));
            currentMoves.push(...gameMoves);
          }
        }
      }

      // Process the last game
      if (currentGame && currentMoves.length > 0 && championWon) {
        const gamePuzzles = extractPuzzlesFromWinningGame(
          currentMoves,
          championColor
        );
        puzzles.push(...gamePuzzles);
      }

      return puzzles;
    },
    [cleanMove]
  );

  // Extract puzzles from FEN-based PGN files (like Kasparov.pgn, MagnusCarlsen.pgn)
  const parseFENPGN = useCallback(
    (pgnText) => {
      const puzzles = [];
      const lines = pgnText.split(/\r?\n/);
      let fen = null;
      let moves = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.startsWith("[FEN ")) {
          fen = line.match(/\[FEN "([^"]+)"\]/)[1];
          moves = [];
        } else if (
          fen &&
          line &&
          !line.startsWith("[") &&
          !line.startsWith("{")
        ) {
          const move = cleanMove(line);
          if (move && !["1-0", "0-1", "1/2-1/2", "*"].includes(move)) {
            moves = [move];
            puzzles.push({ fen, moves, userColor: fen.split(" ")[1] || "w" });
            fen = null;
            moves = [];
          }
        }
      }

      return puzzles;
    },
    [cleanMove]
  );

  // Extract puzzles from a winning game
  const extractPuzzlesFromWinningGame = useCallback((moves, championColor) => {
    const puzzles = [];
    const game = new Chess();

    for (let i = 0; i < moves.length - 1; i++) {
      try {
        const currentMove = moves[i];
        if (!currentMove || !game.moves().includes(currentMove)) {
          continue;
        }

        // Save FEN BEFORE the champion's move
        const fenBeforeMove = game.fen();
        const userColor = championColor;
        const isChampionMove =
          (userColor === "w" && game.turn() === "w") ||
          (userColor === "b" && game.turn() === "b");

        // Only create a puzzle for the champion's move
        if (i >= 6 && i % 3 === 0 && isChampionMove) {
          const moveToGuess = moves[i];
          if (game.moves().includes(moveToGuess)) {
            // Don't play the move yet; let the user play it
            puzzles.push({
              fen: fenBeforeMove,
              moves: [moveToGuess],
              userColor,
            });
          }
        }

        // Now play the move for the next iteration
        game.move(currentMove, { sloppy: true });
      } catch (e) {
        continue;
      }
    }

    return puzzles;
  }, []);

  // Helper function to get the champion folder name
  const getChampionFolder = (championName) => {
    // Normalize: lowercase, remove spaces and accents
    return championName
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/\s+/g, "");
  };

  // Helper function to load all PGN files in a champion's folder
  const loadChampionPGNsFromFolder = async (championName) => {
    const folder = getChampionFolder(championName);
    const indexUrl = `/puzzles/champions/${folder}/index.json`;
    let pgnFiles = [];
    try {
      const res = await fetch(indexUrl);
      if (res.ok) {
        pgnFiles = await res.json();
      } else {
        throw new Error("No index.json found");
      }
    } catch {
      throw new Error("No index.json found");
    }
    // Fetch all PGN files
    const texts = await Promise.all(
      pgnFiles.map(async (file) => {
        try {
          const res = await fetch(`/puzzles/champions/${folder}/${file}`);
          if (res.ok) return await res.text();
        } catch {}
        return null;
      })
    );
    // Combine all PGN text
    return texts.filter(Boolean).join("\n\n");
  };

  // Update loadChampionPGN to use the folder loader
  const loadChampionPGN = useCallback(
    async (championName) => {
      try {
        const pgnText = await loadChampionPGNsFromFolder(championName);
        if (!pgnText) throw new Error("No PGN files found for this champion");
        // Determine if it's a FEN-based PGN or full game PGN
        if (pgnText.includes("[FEN ") && !pgnText.includes("[Event ")) {
          return parseFENPGN(pgnText);
        } else {
          return parseChampionPGN(pgnText, championName);
        }
      } catch (error) {
        throw new Error(`Failed to load PGN file: ${error.message}`);
      }
    },
    [parseChampionPGN, parseFENPGN]
  );

  // Load PGN for selected champion
  useEffect(() => {
    setPlayedMoves([]);
    setCurrentPuzzleIdx(0);
    setPuzzles([]);
    setError(null);
    setLoading(true);

    loadChampionPGN(selectedChampion)
      .then((allPuzzles) => {
        if (allPuzzles.length === 0) {
          throw new Error("No winning positions found for this champion");
        }
        setPuzzles(allPuzzles);
      })
      .catch((error) => {
        setError(
          `Failed to load puzzles for ${selectedChampion}: ${error.message}`
        );
      })
      .finally(() => setLoading(false));
  }, [selectedChampion, loadChampionPGN]);

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
      const puzzle = puzzles[currentPuzzleIdx];
      const fen = puzzle.fen;
      // Use the userColor from the puzzle data (champion's winning color)
      const puzzleUserColor = puzzle.userColor || fen.split(" ")[1] || "w";
      setUserColor(puzzleUserColor);
      const game = new Chess();
      game.load(fen);
      setChess(game);
      setBoard(fenToBoard(fen));
      setSelectedSquare(null);
      setPlayedMoves([]);
      setTurn(puzzleUserColor);
      setFlipBoard(puzzleUserColor === "b"); // Flip board if user plays as black
    }
  }, [puzzles, currentPuzzleIdx, fenToBoard]);

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

      // Check if it's the same square
      if (fromSq === toSq) {
        setSelectedSquare(null);
        return;
      }

      const game = new Chess(chess.fen());

      // Try to find a valid move
      let moveResult = null;
      const legalMoves = game.moves({ verbose: true });

      // First try with queen promotion
      const moveObj = { from: fromSq, to: toSq, promotion: "q" };
      try {
        moveResult = game.move(moveObj);
      } catch (e) {
        // If queen promotion fails, try without promotion
        try {
          moveResult = game.move({ from: fromSq, to: toSq });
        } catch (e2) {
          // If that fails too, check if it's a valid move at all
          const validMove = legalMoves.find(
            (m) => m.from === fromSq && m.to === toSq
          );
          if (validMove) {
            try {
              moveResult = game.move(validMove);
            } catch (e3) {
              console.error("Move validation failed:", e3);
              setSelectedSquare(null);
              return;
            }
          } else {
            setSelectedSquare(null);
            return;
          }
        }
      }

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
        setAttempts(0);
        setShowSolution(false);
        playAllOpponentReplies(game, newPlayedMoves);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setSelectedSquare(null);

        if (newAttempts >= 5) {
          setShowSolution(true);
        }
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
      attempts,
      setAttempts,
      setShowSolution,
    ]
  );

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
    setAttempts(0);
    setShowSolution(false);
  }, [currentPuzzleIdx, puzzles]);

  const handleNextPuzzle = useCallback(() => {
    setShowCongrats(false);
    setAttempts(0);
    setShowSolution(false);
    if (currentPuzzleIdx < puzzles.length - 1) {
      setCurrentPuzzleIdx(currentPuzzleIdx + 1);
    } else {
      alert("Congratulations! You solved all puzzles.");
    }
  }, [currentPuzzleIdx, puzzles.length]);

  // Pagination functions
  const totalPages = Math.ceil(puzzles.length / positionsPerPage);
  const startIdx = currentPage * positionsPerPage;
  const endIdx = Math.min(startIdx + positionsPerPage, puzzles.length);
  const currentPagePuzzles = puzzles.slice(startIdx, endIdx);

  const handlePrevPage = () => {
    setCurrentPage(Math.max(0, currentPage - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(Math.min(totalPages - 1, currentPage + 1));
  };

  const handleViewSolution = () => {
    setShowSolution(true);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-center gap-8 mb-6">
        {/* Main content left, filters right */}
        <div className="flex-1 flex flex-col items-center">
          {/* ...chessboard and board UI... */}
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
        {/* Filters and controls on right */}
        <div className="flex flex-col items-start mt-4 min-w-[260px] w-[300px]">
          <div className="w-full mb-2">
            <label className="block text-lg font-semibold mb-2 text-gray-800">
              Choose Champion
            </label>
            <select
              value={selectedChampion}
              onChange={(e) => setSelectedChampion(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black font-normal"
            >
              {worldChampions.map((champion) => (
                <option key={champion} value={champion}>
                  {champion}
                </option>
              ))}
            </select>
          </div>
          {/* Flip Board Button */}
          <button
            onClick={() => setFlipBoard((f) => !f)}
            className="w-full mb-2 px-4 py-2 rounded-lg font-semibold border border-gray-300 bg-gray-100 hover:bg-yellow-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            Flip Board
          </button>
          {puzzles.length > 0 && (
            <div className="mb-4 w-full">
              <div className="font-semibold text-gray-800 mb-1">Position:</div>
              <div className="flex items-center gap-2 mb-2">
                {currentPage > 0 && (
                  <button
                    onClick={handlePrevPage}
                    className="w-8 h-8 rounded-full font-bold border-2 flex items-center justify-center transition-colors duration-150 bg-white border-gray-300 text-gray-700 hover:bg-yellow-100"
                    style={{ minWidth: "2rem", minHeight: "2rem" }}
                  >
                    ←
                  </button>
                )}
                <div className="flex flex-wrap gap-2">
                  {currentPagePuzzles.map((_, idx) => {
                    const actualIdx = startIdx + idx;
                    return (
                      <button
                        key={actualIdx}
                        onClick={() => setCurrentPuzzleIdx(actualIdx)}
                        className={`w-8 h-8 rounded-full font-bold border-2 flex items-center justify-center transition-colors duration-150 ${
                          actualIdx === currentPuzzleIdx
                            ? "bg-yellow-500 border-yellow-700 text-black scale-110"
                            : "bg-white border-gray-300 text-gray-700 hover:bg-yellow-100"
                        }`}
                        style={{ minWidth: "2rem", minHeight: "2rem" }}
                      >
                        {actualIdx + 1}
                      </button>
                    );
                  })}
                </div>
                {currentPage < totalPages - 1 && (
                  <button
                    onClick={handleNextPage}
                    className="w-8 h-8 rounded-full font-bold border-2 flex items-center justify-center transition-colors duration-150 bg-white border-gray-300 text-gray-700 hover:bg-yellow-100"
                    style={{ minWidth: "2rem", minHeight: "2rem" }}
                  >
                    →
                  </button>
                )}
              </div>
              <div className="text-sm text-gray-600 font-semibold">
                {selectedChampion} - {currentPuzzleIdx + 1} of {puzzles.length}
              </div>
              <div className="text-sm text-gray-600 font-semibold mt-1">
                Attempts: {attempts}/5
              </div>
            </div>
          )}
          {error && (
            <div className="text-red-600 font-semibold mb-4">{error}</div>
          )}
          {showSolution && (
            <div className="mt-4 w-full text-center">
              <div className="text-red-600 font-bold text-xl mb-2">
                Solution:{" "}
                {puzzles[currentPuzzleIdx]?.moves[playedMoves.length] ||
                  "No solution available"}
              </div>
              <button
                onClick={handleNextPuzzle}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-lg mt-2"
              >
                Next Position
              </button>
            </div>
          )}
          {showCongrats && (
            <div className="mt-4 w-full text-center">
              <div className="text-green-600 font-bold text-xl mb-2">
                Congratulations! You found the champion&apos;s move.
              </div>
              <button
                onClick={handleNextPuzzle}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-lg mt-2"
              >
                Next Position
              </button>
            </div>
          )}
          {attempts >= 5 && !showSolution && !showCongrats && (
            <div className="mt-4 w-full text-center">
              <button
                onClick={handleViewSolution}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg"
              >
                View Solution
              </button>
            </div>
          )}
        </div>
      </div>
      {loading && <div className="text-center">Loading positions...</div>}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center text-xl font-bold text-gray-900">
          Please add a PGN file for this champion in
          /public/puzzels/champions/&lt;champion&gt;.pgn
        </div>
      )}
      {puzzles.length > 0 && !loading && (
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
  );
}

export default IntuitionTrainer;
