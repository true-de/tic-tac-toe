# tic-tac-toe
# Tic Tac Toe with Minimax AI

A simple yet challenging Tic Tac Toe game featuring an unbeatable AI opponent powered by the minimax algorithm.

## Features

- Clean, responsive user interface
- Player vs. AI gameplay
- Optimized AI using the minimax algorithm
- Impossible to beat (at best, you can draw)
- Game state tracking and messaging
- New game and reset options

## How It Works

### Game Structure
- **Player:** Uses 'O' and makes the first move
- **AI Opponent:** Uses 'X' and responds with optimal moves
- **Win Conditions:** Standard Tic Tac Toe rules - 3 in a row horizontally, vertically, or diagonally

### Minimax Algorithm
The AI opponent uses the minimax algorithm - a recursive decision-making algorithm that:
1. Evaluates all possible future game states
2. Assumes the opponent will play optimally
3. Chooses moves that maximize AI's chances while minimizing player's chances
4. Results in perfect play that cannot lose

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript (no frameworks or libraries)

## Getting Started

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge)

### Installation
1. Clone the repository:
   ```
   git clone https://github.com/true-de/tic-tac-toe-minimax.git
   ```
2. Open `index.html` in your browser

### Playing the Game
1. Click any square to place your 'O'
2. The AI will automatically respond with its move
3. Try to get three in a row to win (though the AI will never let you win!)
4. Use the "Reset Game" button to start a new game at any time

## Development Notes

The game uses the minimax algorithm, an optimal decision-making algorithm for zero-sum games. The implementation:

- Recursively explores all possible game states
- Assigns scores to game states (+10 for AI win, -10 for player win, 0 for draw)
- Adjusts scores based on move depth to prefer quicker wins
- Selects the move with the highest score for the AI

## Future Improvements

- Difficulty levels (by limiting minimax search depth)
- Score tracking across multiple games
- Sound effects and animations
- Game history and replay feature
- Two-player mode option

## Acknowledgments

- Original minimax algorithm implementation inspiration from GeeksforGeeks
- UI design inspired by modern minimalist web applications