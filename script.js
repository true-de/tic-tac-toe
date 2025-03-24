// Game Configuration
const GameConfig = {
    // Game modes
    MODE: {
        AI: 'ai',
        TWO_PLAYER: '2p'
    },
    // Difficulty levels
    DIFFICULTY: {
        EASY: 'easy',
        MEDIUM: 'medium',
        HARD: 'hard'
    },
    // Player marks
    MARK: {
        X: 'X',
        O: 'O',
        EMPTY: ''
    },
    // Sound settings
    SOUND: {
        enabled: true
    }
};

// Game state
const GameState = {
    currentMode: GameConfig.MODE.AI,
    difficulty: GameConfig.DIFFICULTY.HARD,
    playerMark: GameConfig.MARK.O,
    computerMark: GameConfig.MARK.X,
    currentPlayer: GameConfig.MARK.O, // Initial player
    playerGoesFirst: true,
    board: Array(9).fill(''),
    gameActive: true,
    scores: {
        player: 0,
        computer: 0,
        draws: 0
    },
    history: []
};

// DOM Elements
const DOM = {
    boxes: document.querySelectorAll('.box'),
    resetBtn: document.querySelector('#reset-btn'),
    newGameBtn: document.querySelector('#new-btn'),
    msgContainer: document.querySelector('.msg-container'),
    msg: document.querySelector('#msg'),
    soundToggle: document.querySelector('#sound-toggle'),
    playAsO: document.querySelector('#play-as-o'),
    playAsX: document.querySelector('#play-as-x'),
    playerFirst: document.querySelector('#player-first'),
    computerFirst: document.querySelector('#computer-first'),
    difficultyEasy: document.querySelector('#difficulty-easy'),
    difficultyMedium: document.querySelector('#difficulty-medium'),
    difficultyHard: document.querySelector('#difficulty-hard'),
    modeAI: document.querySelector('#mode-ai'),
    mode2P: document.querySelector('#mode-2p'),
    playerScore: document.querySelector('#player-score'),
    computerScore: document.querySelector('#computer-score'),
    drawsScore: document.querySelector('#draws-score'),
    historyContainer: document.querySelector('#history-container'),
    currentPlayerDisplay: document.querySelector('#current-player'),
    // Sounds
    moveSound: document.querySelector('#move-sound'),
    winSound: document.querySelector('#win-sound'),
    drawSound: document.querySelector('#draw-sound')
};

// Win patterns
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Event Listeners
function setupEventListeners() {
    // Box click event
    DOM.boxes.forEach(box => {
        box.addEventListener('click', handleBoxClick);
    });
    
    // Reset and New Game buttons
    DOM.resetBtn.addEventListener('click', resetGame);
    DOM.newGameBtn.addEventListener('click', newGame);
    
    // Game options
    DOM.playAsO.addEventListener('click', () => setPlayerMark(GameConfig.MARK.O));
    DOM.playAsX.addEventListener('click', () => setPlayerMark(GameConfig.MARK.X));
    DOM.playerFirst.addEventListener('click', () => setFirstPlayer(true));
    DOM.computerFirst.addEventListener('click', () => setFirstPlayer(false));
    DOM.difficultyEasy.addEventListener('click', () => setDifficulty(GameConfig.DIFFICULTY.EASY));
    DOM.difficultyMedium.addEventListener('click', () => setDifficulty(GameConfig.DIFFICULTY.MEDIUM));
    DOM.difficultyHard.addEventListener('click', () => setDifficulty(GameConfig.DIFFICULTY.HARD));
    DOM.modeAI.addEventListener('click', () => setGameMode(GameConfig.MODE.AI));
    DOM.mode2P.addEventListener('click', () => setGameMode(GameConfig.MODE.TWO_PLAYER));
    
    // Sound toggle
    DOM.soundToggle.addEventListener('click', toggleSound);
}

// Box click handler
function handleBoxClick() {
    const boxIndex = parseInt(this.dataset.index);
    
    // Check if box is empty and game is active
    if (GameState.board[boxIndex] !== GameConfig.MARK.EMPTY || !GameState.gameActive) {
        return;
    }
    
    // Two player mode logic
    if (GameState.currentMode === GameConfig.MODE.TWO_PLAYER) {
        makeMove(boxIndex, GameState.currentPlayer);
        togglePlayer();
        return;
    }
    
    // Player's move in AI mode
    if (GameState.currentPlayer === GameState.playerMark) {
        makeMove(boxIndex, GameState.playerMark);
        
        // Check winner after player's move
        if (!checkGameEnd()) {
            // AI's turn
            togglePlayer();
            setTimeout(makeAIMove, 500);
        }
    }
}

// Make a move
function makeMove(index, mark) {
    // Update board state
    GameState.board[index] = mark;
    
    // Update UI
    const box = DOM.boxes[index];
    box.innerText = mark;
    box.disabled = true;
    box.classList.add(mark === GameConfig.MARK.O ? 'o-mark' : 'x-mark');
    box.classList.add('animate-placement');
    
    // Remove animation class after animation completes
    setTimeout(() => {
        box.classList.remove('animate-placement');
    }, 300);
    
    // Play sound
    playSound('move');
    
    // Update turn indicator
    updateTurnIndicator();
}

// Toggle current player
function togglePlayer() {
    GameState.currentPlayer = GameState.currentPlayer === GameConfig.MARK.O 
        ? GameConfig.MARK.X 
        : GameConfig.MARK.O;
    
    updateTurnIndicator();
}

// Update turn indicator
function updateTurnIndicator() {
    DOM.currentPlayerDisplay.textContent = GameState.currentPlayer;
    DOM.currentPlayerDisplay.style.color = 
        GameState.currentPlayer === GameConfig.MARK.O ? 'var(--o-color)' : 'var(--x-color)';
}

// AI move using minimax with alpha-beta pruning
function makeAIMove() {
    if (!GameState.gameActive) return;
    
    // Get current board state
    const bestMove = findBestMove();
    
    // Make the move
    if (bestMove !== -1) {
        makeMove(bestMove, GameState.computerMark);
        checkGameEnd();
        
        // Back to player's turn
        if (GameState.gameActive) {
            togglePlayer();
        }
    }
}

// Find best move using minimax with alpha-beta pruning
function findBestMove() {
    let bestScore = -Infinity;
    let bestMove = -1;
    let maxDepth;
    
    // Set depth limit based on difficulty
    switch (GameState.difficulty) {
        case GameConfig.DIFFICULTY.EASY:
            maxDepth = 1; // Very limited lookahead
            break;
        case GameConfig.DIFFICULTY.MEDIUM:
            maxDepth = 3; // Moderate lookahead
            break;
        case GameConfig.DIFFICULTY.HARD:
        default:
            maxDepth = Infinity; // Full lookahead (unbeatable)
            break;
    }
    
    // Get empty spots
    const availableMoves = getEmptySpots(GameState.board);
    
    // Sometimes make random moves on easy/medium difficulty
    if (GameState.difficulty !== GameConfig.DIFFICULTY.HARD && Math.random() < 0.3) {
        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        return availableMoves[randomIndex];
    }
    
    // Try each available move
    for (let i = 0; i < availableMoves.length; i++) {
        const move = availableMoves[i];
        GameState.board[move] = GameState.computerMark;
        
        // Use minimax to evaluate this move
        const score = minimax(
            GameState.board, 
            0, 
            maxDepth,
            false, 
            -Infinity, 
            Infinity
        );
        
        // Undo the move
        GameState.board[move] = GameConfig.MARK.EMPTY;
        
        // Update best move if better score found
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }
    
    return bestMove;
}

// Minimax algorithm with alpha-beta pruning
function minimax(board, depth, maxDepth, isMaximizing, alpha, beta) {
    // Get the result for the current board state
    const result = checkWinnerForBoard(board);
    
    // Terminal states
    if (result === GameState.computerMark) return 10 - depth; // AI wins
    if (result === GameState.playerMark) return depth - 10;   // Player wins
    if (isBoardFull(board)) return 0;                        // Draw
    if (depth >= maxDepth) return evaluateBoard(board);      // Depth limit reached

    if (isMaximizing) {
        // Computer's turn (maximize score)
        let bestScore = -Infinity;
        const emptySpots = getEmptySpots(board);
        
        for (let i = 0; i < emptySpots.length; i++) {
            const spot = emptySpots[i];
            board[spot] = GameState.computerMark;
            
            const score = minimax(board, depth + 1, maxDepth, false, alpha, beta);
            board[spot] = GameConfig.MARK.EMPTY;
            
            bestScore = Math.max(score, bestScore);
            alpha = Math.max(alpha, bestScore);
            
            // Alpha-beta pruning
            if (beta <= alpha) break;
        }
        
        return bestScore;
    } else {
        // Player's turn (minimize score)
        let bestScore = Infinity;
        const emptySpots = getEmptySpots(board);
        
        for (let i = 0; i < emptySpots.length; i++) {
            const spot = emptySpots[i];
            board[spot] = GameState.playerMark;
            
            const score = minimax(board, depth + 1, maxDepth, true, alpha, beta);
            board[spot] = GameConfig.MARK.EMPTY;
            
            bestScore = Math.min(score, bestScore);
            beta = Math.min(beta, bestScore);
            
            // Alpha-beta pruning
            if (beta <= alpha) break;
        }
        
        return bestScore;
    }
}

// Simple board evaluation for moderate difficulty
function evaluateBoard(board) {
    // Count potential winning lines
    let computerScore = 0;
    let playerScore = 0;
    
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        const line = [board[a], board[b], board[c]];
        
        const computerCount = line.filter(cell => cell === GameState.computerMark).length;
        const playerCount = line.filter(cell => cell === GameState.playerMark).length;
        const emptyCount = line.filter(cell => cell === GameConfig.MARK.EMPTY).length;
        
        // Score open lines (with no opponent pieces)
        if (playerCount === 0 && computerCount > 0) {
            computerScore += computerCount * computerCount;
        }
        
        if (computerCount === 0 && playerCount > 0) {
            playerScore += playerCount * playerCount;
        }
    }
    
    return computerScore - playerScore;
}

// Get all empty spots on the board
function getEmptySpots(board) {
    return board.reduce((spots, cell, index) => {
        if (cell === GameConfig.MARK.EMPTY) spots.push(index);
        return spots;
    }, []);
}

// Check if board is full
function isBoardFull(board) {
    return !board.includes(GameConfig.MARK.EMPTY);
}

// Check for winner in a given board state
function checkWinnerForBoard(board) {
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

// Check for game end (win or draw)
function checkGameEnd() {
    // Check for winner
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        const cellA = DOM.boxes[a];
        const cellB = DOM.boxes[b];
        const cellC = DOM.boxes[c];
        
        if (GameState.board[a] && 
            GameState.board[a] === GameState.board[b] && 
            GameState.board[a] === GameState.board[c]) {
            
            // Highlight winning combination
            highlightWinPattern(cellA, cellB, cellC);
            
            // Show winner message
            showGameResult(GameState.board[a]);
            
            return true;
        }
    }
    
    // Check for draw
    if (!GameState.board.includes(GameConfig.MARK.EMPTY)) {
        showGameResult('draw');
        return true;
    }
    
    return false;
}

// Highlight winning pattern
function highlightWinPattern(cellA, cellB, cellC) {
    [cellA, cellB, cellC].forEach(cell => {
        cell.classList.add('winner');
    });
}

// Show game result (win or draw)
function showGameResult(result) {
    GameState.gameActive = false;
    
    // Update scores and history
    if (result === 'draw') {
        DOM.msg.innerText = "It's a draw!";
        GameState.scores.draws++;
        DOM.drawsScore.innerText = GameState.scores.draws;
        playSound('draw');
        addToHistory('Draw');
    } else {
        const isPlayerWin = result === GameState.playerMark;
        
        if (isPlayerWin) {
            GameState.scores.player++;
            DOM.playerScore.innerText = GameState.scores.player;
            DOM.msg.innerText = `${GameState.currentMode === GameConfig.MODE.TWO_PLAYER ? 'Player ' + result : 'You'} won!`;
            addToHistory(`Player ${result} won`);
        } else {
            GameState.scores.computer++;
            DOM.computerScore.innerText = GameState.scores.computer;
            DOM.msg.innerText = `${GameState.currentMode === GameConfig.MODE.TWO_PLAYER ? 'Player ' + result : 'Computer'} won!`;
            addToHistory(`${GameState.currentMode === GameConfig.MODE.TWO_PLAYER ? 'Player ' + result : 'Computer'} won`);
        }
        
        playSound('win');
    }
    
    // Show message container
    setTimeout(() => {
        DOM.msgContainer.classList.remove('hidden');
    }, 1000);
}

// Add game result to history
function addToHistory(result) {
    // Create a timestamp
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // Add to game state history
    GameState.history.unshift({
        result,
        timestamp,
        boardState: [...GameState.board] // Clone the board state
    });
    
    // Limit history to last 10 games
    if (GameState.history.length > 10) {
        GameState.history.pop();
    }
    
    // Update history UI
    updateHistoryUI();
}

// Update history UI
function updateHistoryUI() {
    // Clear history container
    DOM.historyContainer.innerHTML = '';
    
    // No history yet
    if (GameState.history.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.innerText = 'No games played yet.';
        DOM.historyContainer.appendChild(emptyMessage);
        return;
    }
    
    // Create history entries
    GameState.history.forEach((game, index) => {
        const historyItem = document.createElement('div');
        historyItem.classList.add('history-item');
        
        // Add result and timestamp
        historyItem.innerHTML = `
            <span class="history-result">${game.result}</span>
            <span class="history-timestamp">${game.timestamp}</span>
        `;
        
        // Add mini board representation
        const miniBoard = document.createElement('div');
        miniBoard.classList.add('mini-board');
        
        for (let i = 0; i < 9; i++) {
            const miniCell = document.createElement('div');
            miniCell.classList.add('mini-cell');
            
            if (game.boardState[i]) {
                miniCell.innerText = game.boardState[i];
                miniCell.classList.add(game.boardState[i] === GameConfig.MARK.O ? 'o-mark' : 'x-mark');
            }
            
            miniBoard.appendChild(miniCell);
        }
        
        historyItem.appendChild(miniBoard);
        DOM.historyContainer.appendChild(historyItem);
    });
}

// Play sound
function playSound(type) {
    if (!GameConfig.SOUND.enabled) return;
    
    let sound;
    switch (type) {
        case 'move':
            sound = DOM.moveSound;
            break;
        case 'win':
            sound = DOM.winSound;
            break;
        case 'draw':
            sound = DOM.drawSound;
            break;
        default:
            return;
    }
    
    // Reset and play
    sound.currentTime = 0;
    sound.play().catch(error => console.log('Sound play error:', error));
}

// Toggle sound
function toggleSound() {
    GameConfig.SOUND.enabled = !GameConfig.SOUND.enabled;
    DOM.soundToggle.innerHTML = GameConfig.SOUND.enabled 
        ? `<i class="fas fa-volume-up"></i>` 
        : `<i class="fa-solid fa-volume-xmark"></i>`;
    DOM.soundToggle.classList.toggle('sound-off', !GameConfig.SOUND.enabled);
}


// Set player mark (X or O)
function setPlayerMark(mark) {
    // Update mark-selection UI
    DOM.playAsO.classList.toggle('selected', mark === GameConfig.MARK.O);
    DOM.playAsX.classList.toggle('selected', mark === GameConfig.MARK.X);
    
    // Update game state
    GameState.playerMark = mark;
    GameState.computerMark = mark === GameConfig.MARK.O ? GameConfig.MARK.X : GameConfig.MARK.O;
    
    // Reset game with new settings
    resetGame();
}

// Set who goes first
function setFirstPlayer(playerFirst) {
    // Update first-player UI
    DOM.playerFirst.classList.toggle('selected', playerFirst);
    DOM.computerFirst.classList.toggle('selected', !playerFirst);
    
    // Update game state
    GameState.playerGoesFirst = playerFirst;
    
    // Reset game with new settings
    resetGame();
}

// Set game difficulty
function setDifficulty(level) {
    // Update difficulty UI
    DOM.difficultyEasy.classList.toggle('selected', level === GameConfig.DIFFICULTY.EASY);
    DOM.difficultyMedium.classList.toggle('selected', level === GameConfig.DIFFICULTY.MEDIUM);
    DOM.difficultyHard.classList.toggle('selected', level === GameConfig.DIFFICULTY.HARD);
    
    // Update game state
    GameState.difficulty = level;
}

// Set game mode (AI or 2-player)
function setGameMode(mode) {
    // Update mode UI
    DOM.modeAI.classList.toggle('selected', mode === GameConfig.MODE.AI);
    DOM.mode2P.classList.toggle('selected', mode === GameConfig.MODE.TWO_PLAYER);
    
    // Update game state
    GameState.currentMode = mode;
    
    // Show/hide relevant controls
    const aiControlsVisible = mode === GameConfig.MODE.AI;
    document.querySelector('.player-controls').classList.toggle('hidden', !aiControlsVisible);
    document.querySelector('.difficulty-controls').classList.toggle('hidden', !aiControlsVisible);
    
    // Update score labels
    const playerLabel = document.querySelector('#player-label');
    const computerLabel = document.querySelector('#computer-label');
    
    if (mode === GameConfig.MODE.AI) {
        playerLabel.innerText = 'You';
        computerLabel.innerText = 'Computer';
    } else {
        playerLabel.innerText = 'Player X';
        computerLabel.innerText = 'Player O';
    }
    
    // Reset game with new settings
    resetGame();
}

// Reset current game
function resetGame() {
    // Hide message container
    DOM.msgContainer.classList.add('hidden');
    
    // Reset board state
    GameState.board = Array(9).fill(GameConfig.MARK.EMPTY);
    GameState.gameActive = true;
    
    // Reset UI
    DOM.boxes.forEach(box => {
        box.innerText = '';
        box.disabled = false;
        box.classList.remove('x-mark', 'o-mark', 'winner');
    });
    
    // Set initial player based on settings
    if (GameState.currentMode === GameConfig.MODE.AI) {
        GameState.currentPlayer = GameState.playerGoesFirst ? GameState.playerMark : GameState.computerMark;
    } else {
        // In 2-player mode, X always goes first
        GameState.currentPlayer = GameConfig.MARK.X;
    }
    
    // Update turn indicator
    updateTurnIndicator();
    
    // If AI goes first, make AI move
    if (GameState.currentMode === GameConfig.MODE.AI && 
        GameState.currentPlayer === GameState.computerMark) {
        setTimeout(makeAIMove, 500);
    }
}

// Start a new game (reset scores and history)
function newGame() {
    // Reset scores
    GameState.scores = {
        player: 0,
        computer: 0,
        draws: 0
    };
    
    // Update score display
    DOM.playerScore.innerText = '0';
    DOM.computerScore.innerText = '0';
    DOM.drawsScore.innerText = '0';
    
    // Clear history
    GameState.history = [];
    updateHistoryUI();
    
    // Reset current game
    resetGame();
}

// Initialize game
function initGame() {
    // Set initial UI states
    DOM.playAsO.classList.add('selected');
    DOM.playerFirst.classList.add('selected');
    DOM.difficultyHard.classList.add('selected');
    DOM.modeAI.classList.add('selected');
    
    // Set up event listeners
    setupEventListeners();
    
    // Update initial history UI
    updateHistoryUI();
    
    // Update initial turn indicator
    updateTurnIndicator();
}

// Start the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initGame);


//REcently added
// This is likely the current implementation causing the issue
function setupToggleButtons() {
    const optionGroups = document.querySelectorAll('.option-group');
    
    optionGroups.forEach(group => {
        const buttons = group.querySelectorAll('.toggle-buttons button');
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                // POTENTIAL ISSUE: This code only adds 'active' to the clicked button
                // But it does NOT remove 'active' from the other button
                button.classList.add('active');
            });
        });
    });
}

// Correct implementation
function setupToggleButtons() {
    const optionGroups = document.querySelectorAll('.option-group');
    
    optionGroups.forEach(group => {
        const buttons = group.querySelectorAll('.toggle-buttons button');
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove 'active' class from all buttons in this group
                buttons.forEach(otherButton => {
                    otherButton.classList.remove('active');
                });
                
                // Add 'active' class to the clicked button
                button.classList.add('active');
            });
        });
    });
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', setupToggleButtons);