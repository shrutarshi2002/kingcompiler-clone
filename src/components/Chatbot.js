import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

const KingIcon = () => (
  <Image
    src="/bot.png"
    alt="King Master bot logo"
    width={40}
    height={40}
    style={{ borderRadius: "50%" }}
  />
);

const voiceCommands = [
  {
    keywords: ["go to home", "open home", "home page"],
    action: () => (window.location.pathname = "/"),
  },
  {
    keywords: ["open courses", "go to courses", "show courses"],
    action: () => {
      // Try to click a Courses button if it exists
      const btn = Array.from(document.querySelectorAll("button")).find((b) =>
        /courses/i.test(b.textContent)
      );
      if (btn) btn.click();
    },
  },
  {
    keywords: ["scroll down"],
    action: () => window.scrollBy({ top: 300, behavior: "smooth" }),
  },
  {
    keywords: ["scroll up"],
    action: () => window.scrollBy({ top: -300, behavior: "smooth" }),
  },
  // Add more commands as needed
];

// Chess and coding FAQs for local command matching
const chessFAQs = [
  {
    q: [
      "how do you play chess",
      "what are the rules of chess",
      "how to play chess",
      "chess rules",
      "basic chess rules",
      "chess basics",
    ],
    a: "Chess is a game for two players. Each player starts with 16 pieces and the goal is to checkmate the opponent's king. Pieces move in different ways. Would you like to know how a specific piece moves?",
  },
  {
    q: [
      "how does the knight move",
      "knight movement",
      "how does a knight move",
      "knight chess",
      "knight rules",
    ],
    a: "The knight moves in an L-shape: two squares in one direction and then one square perpendicular. Knights are the only pieces that can jump over others! They can move from e4 to f6, g5, c5, or d6.",
  },
  {
    q: [
      "how does the queen move",
      "queen movement",
      "how does a queen move",
      "queen chess",
      "queen rules",
    ],
    a: "The queen is the most powerful piece! She can move any number of squares in any direction: horizontally, vertically, or diagonally. She combines the moves of both the rook and bishop.",
  },
  {
    q: [
      "how does the king move",
      "king movement",
      "how does a king move",
      "king chess",
      "king rules",
    ],
    a: "The king moves one square in any direction: horizontally, vertically, or diagonally. He's the most important piece - protect him! The goal is to checkmate the opponent's king.",
  },
  {
    q: [
      "how does the rook move",
      "rook movement",
      "how does a rook move",
      "rook chess",
      "rook rules",
    ],
    a: "The rook moves in straight lines: horizontally or vertically, any number of squares. Each player starts with two rooks in the corners. Rooks are powerful in open positions!",
  },
  {
    q: [
      "how does the bishop move",
      "bishop movement",
      "how does a bishop move",
      "bishop chess",
      "bishop rules",
    ],
    a: "The bishop moves diagonally any number of squares. Each player has two bishops - one on light squares and one on dark squares. Bishops work well together!",
  },
  {
    q: [
      "how do pawns move",
      "pawn movement",
      "how does a pawn move",
      "pawn chess",
      "pawn rules",
    ],
    a: "Pawns move forward one square, but capture diagonally. On their first move, they can move forward two squares. When a pawn reaches the other side, it can become any other piece except a king!",
  },
  {
    q: [
      "what is castling",
      "how to castle",
      "castling in chess",
      "castle chess",
      "castling rules",
    ],
    a: "Castling is a special move to protect your king and connect your rooks. Move your king two squares toward a rook, then move that rook to the square next to the king. Rules: no pieces between, neither piece has moved, and you can't castle out of, through, or into check.",
  },
  {
    q: [
      "what is checkmate",
      "what does checkmate mean",
      "checkmate in chess",
      "checkmate rules",
      "how to checkmate",
    ],
    a: "Checkmate means the king is in danger and cannot escape! The game ends and the player whose king is checkmated loses. It's the ultimate goal in chess!",
  },
  {
    q: [
      "what is check",
      "check in chess",
      "what does check mean",
      "check rules",
    ],
    a: "Check means the king is under attack! The player must move their king out of check, block the attack, or capture the attacking piece. You cannot leave your king in check.",
  },
  {
    q: [
      "what is stalemate",
      "stalemate in chess",
      "stalemate rules",
      "what does stalemate mean",
    ],
    a: "Stalemate is when a player has no legal moves and their king is not in check. The game is a draw—nobody wins! It's a way to save a losing position.",
  },
  {
    q: [
      "what is en passant",
      "en passant chess",
      "en passant rules",
      "how to en passant",
    ],
    a: "En passant is a special pawn capture. If a pawn moves two squares forward and lands next to an enemy pawn, the enemy pawn can capture it as if it moved only one square. This must be done immediately on the next move.",
  },
  {
    q: [
      "what is promotion",
      "pawn promotion",
      "promotion chess",
      "promotion rules",
    ],
    a: "When a pawn reaches the opposite side of the board, it can be promoted to any other piece (queen, rook, bishop, or knight). Most players choose to promote to a queen since it's the most powerful piece!",
  },
  {
    q: [
      "what is the center",
      "center chess",
      "control the center",
      "center importance",
    ],
    a: "The center consists of the four squares in the middle of the board (e4, e5, d4, d5). Controlling the center is important because pieces have more mobility and can attack both sides of the board from there.",
  },
  {
    q: [
      "what is development",
      "piece development",
      "develop pieces",
      "development chess",
    ],
    a: "Development means moving your pieces from their starting positions to active squares where they can control the center and attack. Good development is crucial in the opening phase of the game.",
  },
  {
    q: [
      "what is the opening",
      "chess opening",
      "opening phase",
      "opening principles",
    ],
    a: "The opening is the first phase of the game. Key principles: control the center, develop your pieces, protect your king (usually by castling), and don't move the same piece twice unnecessarily.",
  },
  {
    q: ["what is the middlegame", "middlegame chess", "middlegame strategy"],
    a: "The middlegame is the phase after the opening when most pieces are developed. This is where most of the tactical and strategic battles happen. Look for attacks, control key squares, and coordinate your pieces.",
  },
  {
    q: ["what is the endgame", "endgame chess", "endgame strategy"],
    a: "The endgame is the final phase when few pieces remain. King activity becomes important, pawns become more valuable, and precise calculation is crucial. Basic endgames like king and pawn vs king are essential to learn.",
  },
  {
    q: ["what is a fork", "fork chess", "fork tactic", "how to fork"],
    a: "A fork is a tactic where one piece attacks two or more enemy pieces at the same time. The opponent can only save one piece, so you win the other. Knights are great at forking!",
  },
  {
    q: ["what is a pin", "pin chess", "pin tactic", "how to pin"],
    a: "A pin is when a piece cannot move because it would expose a more valuable piece behind it. Bishops, rooks, and queens can create pins. The pinned piece becomes less effective.",
  },
  {
    q: ["what is a skewer", "skewer chess", "skewer tactic", "how to skewer"],
    a: "A skewer is like a pin, but the more valuable piece is in front. When it moves, you can capture the piece behind it. Rooks and queens are great at creating skewers.",
  },
  {
    q: [
      "what is a discovered attack",
      "discovered attack chess",
      "discovered attack tactic",
    ],
    a: "A discovered attack happens when you move one piece and reveal an attack from another piece behind it. This can be very powerful, especially when both pieces are attacking valuable targets.",
  },
  {
    q: ["what is a double check", "double check chess", "double check tactic"],
    a: "A double check is when the king is attacked by two pieces at the same time. The only way to escape is to move the king. Double checks are very powerful because they force the king to move.",
  },
  {
    q: [
      "what is a sacrifice",
      "sacrifice chess",
      "sacrificial attack",
      "when to sacrifice",
    ],
    a: "A sacrifice is giving up material (pieces or pawns) for a tactical or positional advantage. Common sacrifices include sacrificing a pawn for development or a piece for a mating attack.",
  },
  {
    q: ["what is tempo", "tempo chess", "losing tempo", "gaining tempo"],
    a: "Tempo is a unit of time in chess - one move. Gaining a tempo means forcing your opponent to make a move they don't want to make. Losing a tempo means making an unnecessary move.",
  },
  {
    q: ["what is a zugzwang", "zugzwang chess", "zugzwang position"],
    a: "Zugzwang is when any move a player makes makes their position worse. It's common in endgames, especially pawn endgames. The player would prefer to pass their turn, but they must move.",
  },
  {
    q: [
      "opening",
      "chess opening",
      "opening moves",
      "chess openings",
      "opening recommendations",
    ],
    a: "Great! Let me help you find the perfect chess opening. What type of player are you?\n\n1. Attacking - You love aggressive play and quick attacks\n2. Positional - You prefer strategic control and piece placement\n3. Defensive - You like solid, safe positions\n4. Strategic - You enjoy long-term planning and complex positions\n\nPlease choose your style (1-4):",
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

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I am King Master, your chess and coding assistant. You can type or use your voice to ask me anything about chess, coding for kids, or our website! Try saying 'opening' for chess opening recommendations.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const [openingState, setOpeningState] = useState(null); // Track opening selection state
  const [selectedStyle, setSelectedStyle] = useState(null); // Track selected style
  const [showOptions, setShowOptions] = useState(false); // Track if options should be shown
  const [currentOptions, setCurrentOptions] = useState([]); // Current options to display

  // Chess opening recommendations
  const openingRecommendations = {
    attacking: {
      white: [
        "King's Gambit: 1.e4 e5 2.f4 - A bold attacking opening that sacrifices a pawn for rapid development and attacking chances.",
        "Danish Gambit: 1.e4 e5 2.d4 exd4 3.c3 - Another aggressive gambit that creates immediate attacking opportunities.",
        "Evans Gambit: 1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.b4 - A classic attacking opening that sacrifices a pawn for quick development.",
        "Latvian Gambit: 1.e4 e5 2.Nf3 f5 - A risky but exciting attacking opening for Black.",
      ],
      black: [
        "Sicilian Defense: 1.e4 c5 - A sharp, attacking defense that leads to complex positions.",
        "King's Indian Defense: 1.d4 Nf6 2.c4 g6 - An aggressive defense that aims for kingside attacks.",
        "Dutch Defense: 1.d4 f5 - A bold attacking defense that can lead to sharp tactical battles.",
        "Benko Gambit: 1.d4 Nf6 2.c4 c5 3.d5 b5 - An aggressive gambit that gives Black attacking chances.",
      ],
    },
    positional: {
      white: [
        "Queen's Gambit: 1.d4 d5 2.c4 - A positional opening that focuses on controlling the center.",
        "English Opening: 1.c4 - A flexible positional opening that can transpose into many different structures.",
        "Reti Opening: 1.Nf3 - A hypermodern opening that controls the center from a distance.",
        "Catalan Opening: 1.d4 Nf6 2.c4 e6 3.g3 - A positional opening with fianchettoed bishop.",
      ],
      black: [
        "French Defense: 1.e4 e6 - A solid positional defense that creates a strong pawn structure.",
        "Caro-Kann Defense: 1.e4 c6 - A positional defense that maintains solid pawn structure.",
        "Slav Defense: 1.d4 d5 2.c4 c6 - A solid positional defense in the Queen's Gambit.",
        "Nimzo-Indian Defense: 1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 - A positional defense with strategic complexity.",
      ],
    },
    defensive: {
      white: [
        "London System: 1.d4 d5 2.Bf4 - A solid, defensive system that's easy to learn.",
        "Colle System: 1.d4 d5 2.e3 - A defensive system that aims for a solid pawn structure.",
        "Stonewall Attack: 1.d4 d5 2.e3 c6 3.c4 e6 4.Nc3 f5 - A defensive system with a strong pawn formation.",
        "Barry Attack: 1.d4 Nf6 2.Nf3 g6 3.Nc3 d5 4.Bf4 - A solid defensive system.",
      ],
      black: [
        "Petroff Defense: 1.e4 e5 2.Nf3 Nf6 - A solid defensive response that avoids sharp lines.",
        "Berlin Defense: 1.e4 e5 2.Nf3 Nc6 3.Bb5 Nf6 - A solid defensive line in the Ruy Lopez.",
        "Semi-Slav Defense: 1.d4 d5 2.c4 c6 3.Nc3 e6 - A solid defensive system.",
        "Queen's Indian Defense: 1.d4 Nf6 2.c4 e6 3.Nf3 b6 - A solid defensive system.",
      ],
    },
    strategic: {
      white: [
        "Ruy Lopez: 1.e4 e5 2.Nf3 Nc6 3.Bb5 - A strategic opening with deep positional ideas.",
        "Queen's Indian Attack: 1.Nf3 d5 2.g3 - A strategic opening with flexible development.",
        "King's Indian Attack: 1.Nf3 d5 2.g3 c5 3.Bg2 - A strategic opening with kingside fianchetto.",
        "Catalan Opening: 1.d4 Nf6 2.c4 e6 3.g3 - A strategic opening with complex positional play.",
      ],
      black: [
        "Grünfeld Defense: 1.d4 Nf6 2.c4 g6 3.Nc3 d5 - A strategic defense with dynamic counterplay.",
        "King's Indian Defense: 1.d4 Nf6 2.c4 g6 - A strategic defense with kingside attacking chances.",
        "Benoni Defense: 1.d4 Nf6 2.c4 c5 - A strategic defense that creates imbalanced positions.",
        "Pirc Defense: 1.e4 d6 2.d4 Nf6 3.Nc3 g6 - A strategic defense with flexible development.",
      ],
    },
  };

  // Handle option button clicks
  const handleOptionClick = (option) => {
    const userMessage = { sender: "user", text: option };
    setMessages((msgs) => [...msgs, userMessage]);

    // Process the option selection
    if (openingState === "style") {
      let style = null;
      if (option.includes("1") || option.includes("Attacking"))
        style = "attacking";
      else if (option.includes("2") || option.includes("Positional"))
        style = "positional";
      else if (option.includes("3") || option.includes("Defensive"))
        style = "defensive";
      else if (option.includes("4") || option.includes("Strategic"))
        style = "strategic";

      if (style) {
        setSelectedStyle(style);
        setOpeningState("color");
        const colorOptions = [
          { text: "White", value: "white" },
          { text: "Black", value: "black" },
        ];
        setCurrentOptions(colorOptions);
        setShowOptions(true);
        const reply = `Great choice! You're a ${style} player. Now, do you prefer playing with White or Black?`;
        setMessages((msgs) => [...msgs, { sender: "bot", text: reply }]);
        speak(reply);
      }
    } else if (openingState === "color") {
      let color = null;
      if (option.includes("White")) color = "white";
      else if (option.includes("Black")) color = "black";

      if (color && selectedStyle) {
        const openings = openingRecommendations[selectedStyle][color];
        setOpeningState(null);
        setSelectedStyle(null);
        setShowOptions(false);
        setCurrentOptions([]);
        const reply = `Perfect! Here are 4 great ${selectedStyle} openings for ${color}:\n\n${openings
          .map((opening, index) => `${index + 1}. ${opening}`)
          .join(
            "\n\n"
          )}\n\nFor more personalized coaching and to learn these openings from expert FIDE-certified coaches, contact us to book a demo class!`;
        setMessages((msgs) => [...msgs, { sender: "bot", text: reply }]);
        speak(reply);

        // Show contact buttons after opening recommendations
        const contactOptions = [
          {
            text: "📞 Call Now",
            value: "call",
            action: () => window.open("tel:+919038162791"),
          },
          {
            text: "💬 WhatsApp Us",
            value: "whatsapp",
            action: () => window.open("https://wa.me/919038162791"),
          },
        ];
        setCurrentOptions(contactOptions);
        setShowOptions(true);
      }
    }
  };

  // Handle contact button clicks
  const handleContactClick = (option) => {
    if (option.value === "call") {
      window.open("tel:+919038162791");
    } else if (option.value === "whatsapp") {
      window.open("https://wa.me/919038162791");
    }
    setShowOptions(false);
    setCurrentOptions([]);
  };

  // Handle opening selection
  const handleOpeningSelection = (text) => {
    const lower = text.toLowerCase();

    if (openingState === null && lower.includes("opening")) {
      setOpeningState("style");
      const styleOptions = [
        { text: "1. Attacking - Aggressive play", value: "attacking" },
        { text: "2. Positional - Strategic control", value: "positional" },
        { text: "3. Defensive - Solid positions", value: "defensive" },
        { text: "4. Strategic - Long-term planning", value: "strategic" },
      ];
      setCurrentOptions(styleOptions);
      setShowOptions(true);
      return "Great! Let me help you find the perfect chess opening. What type of player are you?";
    }

    if (openingState === "style") {
      let style = null;
      if (lower.includes("1") || lower.includes("attacking"))
        style = "attacking";
      else if (lower.includes("2") || lower.includes("positional"))
        style = "positional";
      else if (lower.includes("3") || lower.includes("defensive"))
        style = "defensive";
      else if (lower.includes("4") || lower.includes("strategic"))
        style = "strategic";

      if (style) {
        setSelectedStyle(style);
        setOpeningState("color");
        const colorOptions = [
          { text: "White", value: "white" },
          { text: "Black", value: "black" },
        ];
        setCurrentOptions(colorOptions);
        setShowOptions(true);
        return `Great choice! You're a ${style} player. Now, do you prefer playing with White or Black?`;
      }
    }

    if (openingState === "color") {
      let color = null;
      if (lower.includes("white")) color = "white";
      else if (lower.includes("black")) color = "black";

      if (color && selectedStyle) {
        const openings = openingRecommendations[selectedStyle][color];
        setOpeningState(null);
        setSelectedStyle(null);
        setShowOptions(false);
        setCurrentOptions([]);
        return `Perfect! Here are 4 great ${selectedStyle} openings for ${color}:\n\n${openings
          .map((opening, index) => `${index + 1}. ${opening}`)
          .join(
            "\n\n"
          )}\n\nFor more personalized coaching and to learn these openings from expert FIDE-certified coaches, contact us to book a demo class!`;
      }
    }

    return null;
  };

  // Voice input setup
  const startListening = () => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      alert("Sorry, your browser does not support speech recognition.");
      return;
    }
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
      handleVoiceCommand(transcript);
      sendMessage(transcript, true);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  // Voice output
  const speak = (text) => {
    if ("speechSynthesis" in window) {
      // Stop any current speech
      window.speechSynthesis.cancel();

      const utter = new window.SpeechSynthesisUtterance(text);
      utter.lang = "en-US";

      utter.onstart = () => setIsSpeaking(true);
      utter.onend = () => setIsSpeaking(false);
      utter.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utter);
    }
  };

  // Stop speaking
  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Detect and handle voice commands
  const handleVoiceCommand = async (text) => {
    // Ensure text is a string
    const textString = String(text || "");
    const lower = textString.toLowerCase();

    // Check for FAQ answers locally
    let reply = findFAQ(chessFAQs, lower) || findFAQ(codingFAQs, lower);
    if (reply) {
      setMessages((msgs) => [
        ...msgs,
        { sender: "user", text: textString },
        { sender: "bot", text: reply },
      ]);
      speak(reply);
      return;
    }

    for (const cmd of voiceCommands) {
      if (cmd.keywords.some((k) => lower.includes(k))) {
        cmd.action();
        break;
      }
    }
  };

  const sendMessage = async (msg = input, fromVoice = false) => {
    // Ensure msg is a string
    const messageText = String(msg || input).trim();
    if (!messageText) return;

    const userMessage = { sender: "user", text: messageText };
    setMessages((msgs) => [...msgs, userMessage]);
    setLoading(true);
    if (!fromVoice) setInput("");

    // Check for opening selection first
    const openingReply = handleOpeningSelection(messageText);
    if (openingReply) {
      setMessages((msgs) => [...msgs, { sender: "bot", text: openingReply }]);
      speak(openingReply);
      setLoading(false);
      return;
    }

    // Check for FAQ answers locally first
    const lower = messageText.toLowerCase();
    let reply = findFAQ(chessFAQs, lower) || findFAQ(codingFAQs, lower);
    if (reply) {
      setMessages((msgs) => [...msgs, { sender: "bot", text: reply }]);
      speak(reply);
      setLoading(false);
      return;
    }

    try {
      // Get recent messages (last 5 messages) for context instead of full history
      const recentMessages = messages.slice(-5);
      const recentContext = recentMessages
        .map((msg) => `${msg.sender}: ${msg.text}`)
        .join("\n");

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          recentContext: recentContext, // Send recent context instead of full history
        }),
      });
      const data = await res.json();
      setMessages((msgs) => [...msgs, { sender: "bot", text: data.reply }]);
      // Speak the reply, including for greetings
      if (data.reply === "I am King Master, welcome! How can I help you?") {
        speak(data.reply);
      } else {
        speak(data.reply);
      }

      // If it's a fallback response (not a specific answer), show contact options
      if (
        data.reply.includes("I am King Master, your assistant") ||
        data.reply.includes("Try asking about chess strategies") ||
        data.reply.includes("Try asking about chess openings") ||
        data.reply.includes("expert FIDE-certified coaches are here to help")
      ) {
        const contactOptions = [
          {
            text: "📞 Call Expert",
            value: "call",
            action: () => window.open("tel:+919038162791"),
          },
          {
            text: "💬 WhatsApp Expert",
            value: "whatsapp",
            action: () => window.open("https://wa.me/919038162791"),
          },
        ];
        setCurrentOptions(contactOptions);
        setShowOptions(true);
      }
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: "Sorry, something went wrong." },
      ]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  // Speak the initial greeting when chat is opened for the first time
  useEffect(() => {
    if (open && messages.length === 1 && messages[0].sender === "bot") {
      speak(messages[0].text);
    }
    // eslint-disable-next-line
  }, [open]);

  // Floating king icon button
  if (!open) {
    return (
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          zIndex: 1000,
        }}
      >
        {/* WhatsApp Button */}
        <button
          onClick={() => {
            const message = encodeURIComponent(
              "HI i want to know more about kingcompiler and what course provide"
            );
            window.open(`https://wa.me/?text=${message}`, "_blank");
          }}
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "#25D366",
            border: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "transform 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "scale(1.1)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "scale(1)";
          }}
          aria-label="Contact us on WhatsApp"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
          </svg>
        </button>

        {/* King Master Chatbot Button */}
        <button
          onClick={() => setOpen(true)}
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "transparent",
            border: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          aria-label="Open King Master chatbot"
        >
          <KingIcon />
        </button>
      </div>
    );
  }

  // Chat window
  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 350,
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid #eee",
          padding: 8,
          background: "#f8fafc",
        }}
      >
        <span
          style={{
            flex: 1,
            fontWeight: "bold",
            fontSize: 18,
            color: "#6366f1",
            textAlign: "center",
          }}
        >
          King Master
        </span>
        <button
          onClick={() => setOpen(false)}
          style={{
            background: "none",
            border: "none",
            fontSize: 20,
            color: "#888",
            cursor: "pointer",
            marginLeft: 8,
          }}
          aria-label="Close King Master chatbot"
        >
          ×
        </button>
      </div>
      <div
        style={{
          padding: 16,
          height: 300,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              margin: "4px 0",
            }}
          >
            <span
              style={{
                background: msg.sender === "user" ? "#e0e7ff" : "#f3f4f6",
                padding: "8px 12px",
                borderRadius: 16,
                display: "inline-block",
                maxWidth: 250,
                wordBreak: "break-word",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
        {loading && (
          <div style={{ fontStyle: "italic", color: "#888" }}>
            King Master is typing...
          </div>
        )}
        {/* Option buttons */}
        {showOptions && currentOptions.length > 0 && (
          <div style={{ marginTop: 8 }}>
            {currentOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  if (option.value === "call" || option.value === "whatsapp") {
                    handleContactClick(option);
                  } else {
                    handleOptionClick(option.text);
                  }
                }}
                style={{
                  display: "block",
                  width: "100%",
                  margin: "4px 0",
                  padding: "8px 12px",
                  background: "#6366f1",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 14,
                  textAlign: "left",
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "#4f46e5";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "#6366f1";
                }}
              >
                {option.text}
              </button>
            ))}
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          borderTop: "1px solid #eee",
          padding: 8,
          gap: "4px",
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            padding: "6px 8px",
            fontSize: "14px",
          }}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "none",
            background: "#6366f1",
            color: "#fff",
            cursor: "pointer",
            fontSize: "12px",
            minWidth: "50px",
          }}
        >
          Send
        </button>
        <button
          onClick={listening ? stopListening : startListening}
          style={{
            padding: "6px 8px",
            borderRadius: "50%",
            border: listening ? "2px solid #6366f1" : "1px solid #ccc",
            background: listening ? "#e0e7ff" : "#fff",
            color: listening ? "#6366f1" : "#888",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "12px",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label={listening ? "Stop listening" : "Start voice input"}
        >
          {listening ? "🎤" : "🎙️"}
        </button>
        {isSpeaking && (
          <button
            onClick={stopSpeaking}
            style={{
              padding: "6px 8px",
              borderRadius: "50%",
              border: "2px solid #ef4444",
              background: "#fef2f2",
              color: "#ef4444",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "12px",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Stop King Master from speaking"
          >
            🔇
          </button>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
