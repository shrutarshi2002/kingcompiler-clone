const { Chess } = require("chess.js");

const endgamePuzzles = [
  {
    fen: "8/8/8/8/8/4k3/8/2K1R3 w - - 0 1",
    solution: { from: "e1", to: "e3" },
    description: "Rook and King vs King: A fundamental checkmate.",
    topic: "Rook Endgame - Basic Checkmate",
  },
  {
    fen: "8/8/8/8/8/k7/8/K1R5 w - - 0 1",
    solution: { from: "c1", to: "b1" },
    description: "Rook and King vs King: Force the king to the edge.",
    topic: "Rook Endgame - King to Edge",
  },
  {
    fen: "8/8/8/8/2k5/8/8/K2R4 w - - 0 1",
    solution: { from: "d2", to: "c2" },
    description: "Rook and King vs King: The box method.",
    topic: "Rook Endgame - Box Method",
  },
  {
    fen: "8/8/8/8/8/8/pk6/K7 w - - 0 1",
    solution: { from: "a1", to: "a2" },
    description: "Pawn Endgame: King activity is key.",
    topic: "Pawn Endgame - King Activity",
  },
  {
    fen: "8/k7/P7/8/8/8/8/K7 w - - 0 1",
    solution: { from: "a1", to: "b2" },
    description: "Pawn Endgame: Opposition.",
    topic: "Pawn Endgame - Opposition",
  },
  {
    fen: "4k3/8/8/8/8/8/4P3/4K3 w - - 0 1",
    solution: { from: "e2", to: "e4" },
    description: "Pawn Endgame: Creating a passed pawn.",
    topic: "Pawn Endgame - Passed Pawn",
  },
  {
    fen: "8/8/8/8/8/k7/1p6/K7 w - - 0 1",
    solution: { from: "a1", to: "b1" },
    description: "Pawn Endgame: Race to queen.",
    topic: "Pawn Endgame - Pawn Race",
  },
  {
    fen: "8/8/8/8/8/8/1P6/k1K5 w - - 0 1",
    solution: { from: "b2", to: "b4" },
    description: "Pawn Endgame: Shouldering.",
    topic: "Pawn Endgame - Shouldering",
  },
  {
    fen: "8/8/8/8/8/4k3/8/2K1Q3 w - - 0 1",
    solution: { from: "e1", to: "e3" },
    description: "Queen and King vs King: Basic checkmate pattern.",
    topic: "Queen Endgame - Basic Checkmate",
  },
  {
    fen: "8/8/8/8/8/k7/8/K1B5 w - - 0 1",
    solution: { from: "c1", to: "b2" },
    description: "Bishop and King vs King: Diagonal control.",
    topic: "Bishop Endgame - Diagonal Control",
  },
];

console.log("Testing all endgame puzzles...\n");

endgamePuzzles.forEach((puzzle, index) => {
  console.log(`Puzzle ${index + 1}: ${puzzle.topic}`);
  console.log(`FEN: ${puzzle.fen}`);
  console.log(`Solution: ${puzzle.solution.from}-${puzzle.solution.to}`);

  try {
    const game = new Chess(puzzle.fen);
    console.log(`✓ Game created successfully`);

    const legalMoves = game.moves({ verbose: true });
    console.log(`✓ Legal moves: ${legalMoves.length}`);

    const solutionMove = legalMoves.find(
      (move) =>
        move.from === puzzle.solution.from && move.to === puzzle.solution.to
    );

    if (solutionMove) {
      console.log(`✓ Solution is legal: ${solutionMove.san}`);
    } else {
      console.log(`✗ Solution is NOT legal!`);
      console.log(
        `Available moves: ${legalMoves.map((m) => m.from + m.to).join(", ")}`
      );
    }

    // Show board state
    console.log("Board state:");
    for (let rank = 8; rank >= 1; rank--) {
      let row = "";
      for (let file = 0; file < 8; file++) {
        const square = String.fromCharCode(97 + file) + rank;
        const piece = game.get(square);
        row += piece ? piece.type.toUpperCase() : ".";
      }
      console.log(`${rank}: ${row}`);
    }
  } catch (error) {
    console.log(`✗ Error: ${error.message}`);
  }

  console.log("---\n");
});
