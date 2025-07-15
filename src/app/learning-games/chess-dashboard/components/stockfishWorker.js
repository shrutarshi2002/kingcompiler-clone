// src/app/learning-games/chess-dashboard/components/stockfishWorker.js
export default function createStockfishWorker() {
  try {
    const worker = new Worker("/engine/stockfish-17-lite-single.js", {
      type: "module",
    });

    // Add error handling
    worker.onerror = (error) => {
      console.error("Stockfish worker error:", error);
    };

    return worker;
  } catch (error) {
    console.error("Failed to create Stockfish worker:", error);
    throw error;
  }
}
