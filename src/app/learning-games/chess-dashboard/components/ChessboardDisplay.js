"use client";
import { useState } from "react";

function ChessboardDisplay({
  fen,
  onMove,
  userColor = "w",
  allowMove = true,
  highlightSquares = [],
  currentTurn = "w", // New prop for turn validation
}) {
  // fenToBoard and getPieceImage logic
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
    P: "♙",
    k: "♚",
    q: "♛",
    r: "♜",
    b: "♝",
    n: "♞",
    p: "♟",
  };

  function getPieceImage(piece) {
    if (!piece) return null;
    const isWhite = piece === piece.toUpperCase();
    const prefix = isWhite ? "w" : "b";
    const name = piece.toUpperCase();
    return `/chess-pieces/${prefix}${name}.png`;
  }

  // Board state
  const board = fenToBoard(fen);
  const [selectedSquare, setSelectedSquare] = useState(null);

  // Move handling
  function handleSquareClick(row, col) {
    if (!allowMove) return;
    if (!board.length) return;

    const from = selectedSquare || { row, col };
    const to = { row, col };

    if (!selectedSquare) {
      const piece = board[row][col];
      if (
        piece &&
        ((currentTurn === "w" && piece === piece.toUpperCase()) ||
          (currentTurn === "b" && piece === piece.toLowerCase()))
      ) {
        setSelectedSquare({ row, col });
      }
      return;
    }

    setSelectedSquare(null);

    if (onMove) {
      const files = "abcdefgh";
      const fromAlg = `${files[from.col]}${8 - from.row}`;
      const toAlg = `${files[to.col]}${8 - to.row}`;
      onMove(fromAlg, toAlg);
    }
  }

  const orientedBoard =
    userColor === "w"
      ? board
      : [...board].reverse().map((row) => [...row].reverse());
  const ranks =
    userColor === "w"
      ? [...Array(8)].map((_, i) => 8 - i)
      : [...Array(8)].map((_, i) => i + 1);
  const files = userColor === "w" ? [..."abcdefgh"] : [..."hgfedcba"];

  return (
    <div className="flex flex-col items-center">
      <div className="flex">
        <div className="flex flex-col justify-between mr-1 select-none">
          {ranks.map((rank) => (
            <div
              key={rank}
              className="h-20 flex items-center justify-center text-lg font-bold text-gray-700"
              style={{ height: "5rem", width: "2rem" }}
            >
              {rank}
            </div>
          ))}
        </div>
        <div
          className="grid grid-cols-8 border-2 border-gray-800"
          style={{ width: "40rem" }}
        >
          {orientedBoard.map((row, rowIdx) =>
            row.map((piece, colIdx) => {
              const actualRow = userColor === "w" ? rowIdx : 7 - rowIdx;
              const actualCol = userColor === "w" ? colIdx : 7 - colIdx;

              const isLight = (actualRow + actualCol) % 2 === 0;
              const isSelected =
                selectedSquare &&
                selectedSquare.row === actualRow &&
                selectedSquare.col === actualCol;
              const isHighlighted = highlightSquares.some(
                ([r, c]) => r === actualRow && c === actualCol
              );

              return (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  className={`w-20 h-20 flex items-center justify-center cursor-pointer transition-all duration-200 ${
                    isLight ? "bg-yellow-100" : ""
                  } ${isSelected ? "ring-4 ring-blue-500 bg-blue-200" : ""} ${
                    isHighlighted ? "ring-4 ring-green-500" : ""
                  }`}
                  style={{
                    width: "5rem",
                    height: "5rem",
                    backgroundColor: isLight ? undefined : "#B58863",
                  }}
                  onClick={() => handleSquareClick(actualRow, actualCol)}
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
                          e.target.parentNode.textContent = pieceImages[piece];
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
        {files.map((file) => (
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
  );
}

export default ChessboardDisplay;
