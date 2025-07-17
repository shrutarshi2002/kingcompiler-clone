# Chess Sound Effects

This folder contains sound effects for the chess learning game. Replace these placeholder files with actual audio files:

## Required Sound Files:

1. **move.mp3** - Sound played when a piece moves (without capture)
2. **capture.mp3** - Sound played when a piece captures another piece
3. **puzzle-complete.mp3** - Sound played when a puzzle is solved correctly
4. **wrong-move.mp3** - Sound played when an illegal move is attempted
5. **level-complete.mp3** - Sound played when a level is completed
6. **star-collect.mp3** - Sound played when a star is collected

## Audio Requirements:

- Format: MP3
- Duration: 0.5-2 seconds each
- Volume: Normalized to avoid clipping
- Quality: 128kbps or higher recommended

## Free Sound Resources:

- Freesound.org
- Zapsplat.com
- Soundbible.com
- Chess.com (for reference)

## Implementation:

The sounds are automatically loaded and managed by the SoundManager component.
Sound effects are triggered by calling `window.playChessSound('soundType')` from anywhere in the app.
