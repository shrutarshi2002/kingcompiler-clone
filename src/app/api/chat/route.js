export const dynamic = "force-static";

const chessFAQs = [
  {
    q: [
      "how do you play chess",
      "what are the rules of chess",
      "how to play chess",
      "chess rules",
    ],
    a: "Chess is a game for two players. Each player starts with 16 pieces and the goal is to checkmate the opponent's king. Pieces move in different ways. Would you like to know how a specific piece moves?",
  },
  {
    q: [
      "how does the knight move",
      "knight movement",
      "how does a knight move",
    ],
    a: "The knight moves in an L-shape: two squares in one direction and then one square perpendicular. Knights are the only pieces that can jump over others!",
  },
  {
    q: ["what is castling", "how to castle", "castling in chess"],
    a: "Castling is a special move to protect your king and connect your rooks. Move your king two squares toward a rook, then move that rook to the square next to the king. There are some rules: no pieces between, neither piece has moved, and you can't castle out of, through, or into check.",
  },
  {
    q: ["what is checkmate", "what does checkmate mean", "checkmate in chess"],
    a: "Checkmate means the king is in danger and cannot escape! The game ends and the player whose king is checkmated loses.",
  },
  {
    q: ["how do pawns move", "pawn movement", "how does a pawn move"],
    a: "Pawns move forward one square, but capture diagonally. On their first move, they can move forward two squares. When a pawn reaches the other side, it can become any other piece except a king!",
  },
  {
    q: ["what is stalemate", "stalemate in chess"],
    a: "Stalemate is when a player has no legal moves and their king is not in check. The game is a draw—nobody wins!",
  },
];

const codingFAQs = [
  {
    q: ["what is coding", "what is programming", "what does coding mean"],
    a: "Coding is telling a computer what to do by giving it instructions in a language it understands, like Scratch, Python, or JavaScript!",
  },
  {
    q: [
      "how do i start coding",
      "how to start coding",
      "how can kids learn coding",
    ],
    a: "Kids can start coding with fun tools like Scratch or Code.org. You can also try simple Python or JavaScript projects. Start with small games or animations!",
  },
  {
    q: [
      "what is a variable",
      "explain variable",
      "what does variable mean in coding",
    ],
    a: "A variable is like a box where you can store information, such as a number or a word, so you can use it later in your code.",
  },
  {
    q: ["what is a loop", "explain loop", "what does loop mean in coding"],
    a: "A loop is a way to repeat actions in your code. For example, you can use a loop to make a character move 10 steps or say hello 5 times!",
  },
  {
    q: [
      "what is an if statement",
      "explain if statement",
      "what does if statement mean in coding",
    ],
    a: "An if statement lets your code make decisions. It checks if something is true, and if it is, it does something special!",
  },
];

function findFAQ(faqs, message) {
  const lower = message.toLowerCase();
  for (const faq of faqs) {
    for (const q of faq.q) {
      if (lower.includes(q)) {
        return faq.a;
      }
    }
  }
  return null;
}

const chessPieceDescriptions = {
  king: "The king is the most important piece in chess. The goal is to protect your king from checkmate! The king moves one square in any direction.",
  queen:
    "The queen is the most powerful piece. She can move any number of squares in any direction: horizontally, vertically, or diagonally.",
  rook: "The rook moves in straight lines, either horizontally or vertically, across the board. Each player starts with two rooks.",
  bishop:
    "The bishop moves diagonally any number of squares. Each player has two bishops, one on light squares and one on dark squares.",
  knight:
    "The knight moves in an L-shape: two squares in one direction and then one square perpendicular. Knights can jump over other pieces!",
  pawn: "Pawns move forward one square, but capture diagonally. On their first move, they can move forward two squares. When a pawn reaches the other side, it can become any other piece except a king!",
};

const CHATBOT_NAME = "King Master";

export async function POST(req) {
  const { message, recentContext } = await req.json();

  // Respond to greetings
  const lower = message.toLowerCase();
  if (["hi", "hello", "hey"].some((greet) => lower.trim().startsWith(greet))) {
    return Response.json({
      reply: "I am King Master, welcome! How can I help you?",
    });
  }

  // Check chess FAQs
  let reply = findFAQ(chessFAQs, message);
  if (reply) return Response.json({ reply });

  // Check coding FAQs
  reply = findFAQ(codingFAQs, message);
  if (reply) return Response.json({ reply });

  // Check for chess piece keywords
  for (const piece of ["king", "queen", "rook", "bishop", "knight", "pawn"]) {
    if (lower.includes(piece)) {
      return Response.json({ reply: chessPieceDescriptions[piece] });
    }
  }

  // Use recent context to provide more relevant responses
  const hasRecentChessContext =
    recentContext && recentContext.toLowerCase().includes("chess");
  const hasRecentCodingContext =
    recentContext && recentContext.toLowerCase().includes("code");

  // Fallback to keyword-based logic with context awareness
  if (lower.includes("chess") || hasRecentChessContext) {
    reply = `Did you know? The longest chess game theoretically possible is 5,949 moves! Ask ${CHATBOT_NAME} anything about chess openings, tactics, or famous players.`;
  } else if (
    lower.includes("code") ||
    lower.includes("coding") ||
    hasRecentCodingContext
  ) {
    reply = `Coding tip from ${CHATBOT_NAME}: Break problems into smaller pieces and write pseudocode before you start coding. Ask me about programming languages, algorithms, or debugging!`;
  } else if (lower.includes("website")) {
    reply = `This website is a platform to explore AI-powered tools and learn about chess and coding with ${CHATBOT_NAME}. Let me know if you want a tour or have questions about features!`;
  } else {
    reply = `I am ${CHATBOT_NAME}, your assistant! I can help with chess, coding, or questions about this website. For more complex questions or personalized guidance, our expert FIDE-certified coaches are here to help!`;
  }
  return Response.json({ reply });
}
