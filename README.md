# Tic Tac Toe with Minimax AI

A feature-rich Tic Tac Toe game with an unbeatable AI opponent powered by the minimax algorithm, customizable game settings, and a sound toggle feature.

## Features

- 🎮 **Game Modes**: Play vs AI or challenge a friend in two-player mode.
- 🧠 **Smart AI**: Uses the Minimax algorithm for optimal decision-making.
- 🎚️ **Difficulty Levels**: Easy, Medium, and Hard (Hard mode is unbeatable!).
- 🔊 **Sound Effects Toggle**: Enable/disable game sounds easily.
- 📊 **Score Tracking**: Keeps track of wins, losses, and draws.
- ⏳ **Game History**: View past games with a visual board representation.
- 🔄 **Reset & New Game Options**: Quickly start over or begin a fresh session.
- 🎨 **Clean, Responsive UI**: Optimized for desktop and mobile.

## How It Works

### Game Structure

- **Player:** Selects 'X' or 'O' and plays first.
- **AI Opponent:** Responds optimally to every move.
- **Win Conditions:** Standard Tic Tac Toe rules - 3 in a row horizontally, vertically, or diagonally.

### Minimax Algorithm

The AI opponent uses the minimax algorithm to:

1. Evaluate all possible future game states.
2. Assume the opponent plays optimally.
3. Choose moves that maximize its chances of winning.
4. Result in an AI that is nearly impossible to beat.

## Technologies Used

- **HTML5**
- **CSS3**
- **JavaScript (Vanilla)**
- **Font Awesome (for icons)**

## Getting Started

### Prerequisites

- Any modern web browser (Chrome, Firefox, Edge, Safari)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/true-de/tic-tac-toe-minimax.git
   ```
2. Open `index.html` in your browser.

### Playing the Game

1. Click any tile to place your mark.
2. The AI (if enabled) will make its move.
3. Get three in a row to win!
4. Use the **Reset** button to restart the game or **New Game** to reset scores.
5. Toggle game sounds on/off using the sound button.

## Development Notes

- The AI is built using the minimax algorithm with alpha-beta pruning for efficiency.
- In **Easy/Medium mode**, the AI occasionally makes random moves.
- **Hard mode** makes perfect moves and cannot lose.
- Score tracking and game history are stored in memory during gameplay.


## Acknowledgments

- Original minimax algorithm implementation inspiration from GeeksforGeeks
- UI design inspired by modern minimalist web applications