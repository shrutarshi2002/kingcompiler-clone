"use client";
import { useState } from "react";
import styles from "./ChessboardDisplay.module.css";

function ChessboardDisplay({
  fen,
  board: customBoard = null, // new prop
  onMove,
  userColor = "w",
  allowMove = true,
  highlightSquares = [],
  currentTurn = "w", // New prop for turn validation
  freeMove = false, // New prop for free move
  selectablePieceType = null, // New prop for restricting selectable piece type
  legalMovesForSelected = null, // New prop for restricting legal destination squares
  starSquares = [], // New prop for star overlays
  starActive = true, // New prop: only show star if true
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
  const board = customBoard ? customBoard : fenToBoard(fen);
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
        (freeMove ||
          (currentTurn === "w" && piece === piece.toUpperCase()) ||
          (currentTurn === "b" && piece === piece.toLowerCase())) &&
        (!selectablePieceType || piece.toLowerCase() === selectablePieceType)
      ) {
        setSelectedSquare({ row, col });
      }
      return;
    }

    // Only allow moving to legal destination squares if provided
    if (legalMovesForSelected) {
      const files = "abcdefgh";
      const toAlg = `${files[to.col]}${8 - to.row}`;
      if (!legalMovesForSelected.includes(toAlg)) {
        setSelectedSquare(null);
        return;
      }
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

  // Remove JS-based isMobile, use Tailwind responsive classes instead
  return (
    <div className="flex flex-col items-center">
      <div className="flex">
        <div className="flex flex-col justify-between mr-1 select-none">
          {ranks.map((rank) => (
            <div
              key={rank}
              className="flex items-center justify-center text-lg font-bold text-gray-700 h-10 w-5 md:h-20 md:w-8"
            >
              {rank}
            </div>
          ))}
        </div>
        <div
          className={`grid grid-cols-8 border-2 border-gray-800 ${styles.chessboard}`}
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
              const isLegalDest =
                selectedSquare && legalMovesForSelected
                  ? legalMovesForSelected.includes(
                      `${files[colIdx]}${8 - rowIdx}`
                    )
                  : false;
              // Star overlay logic
              const squareAlg = `${files[colIdx]}${8 - rowIdx}`;
              const isStar =
                starActive && starSquares && starSquares.includes(squareAlg);

              return (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  className={`flex items-center justify-center cursor-pointer transition-all duration-200 ${
                    styles.square
                  } ${isLight ? "bg-yellow-100" : ""} ${
                    isSelected ? "ring-4 ring-blue-500 bg-blue-200" : ""
                  } ${isHighlighted ? "ring-4 ring-green-500" : ""} ${
                    isLegalDest ? "ring-4 ring-yellow-400" : ""
                  }`}
                  style={{
                    backgroundColor: isLight ? undefined : "#B58863",
                    position: "relative",
                  }}
                  onClick={() => handleSquareClick(actualRow, actualCol)}
                >
                  {piece && (
                    <span className="font-bold" style={{ fontSize: undefined }}>
                      <img
                        src={getPieceImage(piece)}
                        alt={piece}
                        className={`object-contain ${styles.piece}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = "none";
                          e.target.parentNode.textContent = pieceImages[piece];
                        }}
                      />
                    </span>
                  )}
                  {/* Star overlay */}
                  {isStar && (
                    <span
                      className={`absolute text-2xl md:text-5xl pointer-events-none select-none flex items-center justify-center w-full h-full star-fade`}
                      style={{
                        top: 0,
                        left: 0,
                        color: "#FFD700",
                        textShadow: "0 0 8px #fff, 0 0 2px #FFD700",
                        zIndex: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                        transition: "opacity 0.4s cubic-bezier(0.4,0,0.2,1)",
                        opacity: isStar ? 1 : 0,
                      }}
                    >
                      ⭐
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
      <div className="flex mt-1 ml-2 md:ml-[2.5rem] select-none">
        {files.map((file) => (
          <div
            key={file}
            className={`flex items-center justify-center text-lg font-bold text-gray-700 ${styles.filelabel}`}
          >
            {file}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChessboardDisplay;
