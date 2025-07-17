# Endgame PGN Files Structure

This directory contains organized PGN files for different endgame concepts used in the Endgame Mastery component.

## Folder Structure

```
public/endgames/
├── basic-endgames/          # Fundamental endgame concepts
├── pawn-endgames/           # King and pawn vs king scenarios
├── queen-endgames/          # King and queen vs king checkmate patterns
├── rook-endgames/           # King and rook vs king checkmate patterns
├── bishop-endgames/         # King and bishop vs king scenarios
├── knight-endgames/         # King and knight vs king scenarios
├── minor-piece-endgames/    # Combinations of bishops and knights
├── major-piece-endgames/    # Combinations of rooks and other pieces
├── complex-endgames/        # Multiple piece combinations
└── advanced-endgames/       # Maximum piece coordination scenarios
```

## How to Add PGN Files

### 1. Choose the Appropriate Category

Select the folder that best matches your endgame concept:

- **Basic Endgames**: King vs King, minimal piece scenarios
- **Pawn Endgames**: King and pawn vs king, pawn promotion scenarios
- **Queen Endgames**: King and queen vs king checkmate patterns
- **Rook Endgames**: King and rook vs king checkmate patterns
- **Bishop Endgames**: King and bishop vs king scenarios
- **Knight Endgames**: King and knight vs king scenarios
- **Minor Piece Endgames**: Bishop and knight combinations
- **Major Piece Endgames**: Rook combinations with other pieces
- **Complex Endgames**: Multiple piece combinations
- **Advanced Endgames**: Maximum piece coordination scenarios

### 2. Create PGN File

Create a `.pgn` file in the appropriate folder with the following format:

```pgn
[Event "Endgame Name"]
[Site "Chess Training"]
[Date "2024.01.01"]
[Round "1"]
[White "Training"]
[Black "Training"]
[Result "*"]
[FEN "8/8/8/8/8/8/5k2/6K1 w - - 0 1"]

* Description of the endgame position and what to learn
```

### 3. Update Index File

Each category folder should have an `index.json` file that lists all available endgames:

```json
{
  "category": "Basic Endgames",
  "description": "Fundamental endgame concepts with minimal pieces",
  "endgames": [
    {
      "name": "King vs King",
      "file": "king-vs-king.pgn",
      "difficulty": "Beginner",
      "description": "Basic king vs king endgame - always a draw"
    },
    {
      "name": "Another Endgame",
      "file": "another-endgame.pgn",
      "difficulty": "Intermediate",
      "description": "Description of this endgame"
    }
  ]
}
```

### 4. PGN File Requirements

- **FEN Position**: Include the starting position in FEN notation
- **Clear Description**: Add a comment explaining what the endgame teaches
- **Proper Formatting**: Follow standard PGN format
- **Meaningful Names**: Use descriptive filenames

### 5. Example PGN File

```pgn
[Event "King and Queen vs King Checkmate"]
[Site "Chess Training"]
[Date "2024.01.01"]
[Round "1"]
[White "Training"]
[Black "Training"]
[Result "*"]
[FEN "8/8/8/8/8/8/5k2/6KQ w - - 0 1"]

* Learn the basic king and queen vs king checkmate pattern
* This is the foundation for more complex queen endgames
```

## Features

- **Category Filtering**: Users can filter by endgame concept
- **Difficulty Levels**: Each category has an associated difficulty
- **PGN Loading**: The component can load specific PGN files
- **Fallback System**: If PGN files aren't available, it uses built-in positions
- **Syzygy Integration**: All positions are analyzed using Lichess Tablebase

## Adding New Categories

To add a new endgame category:

1. Create a new folder in `public/endgames/`
2. Add the category to the `endgameCategories` array in `EndgameMastery.js`
3. Create an `index.json` file for the new category
4. Add sample PGN files

The system will automatically detect and load the new category.
