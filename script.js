let boxes = document.querySelectorAll(".box");
let reset_btn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let turnO = true; // Player is O, Computer is X
let gameActive = true;

const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8]
];

// Initialize boxes with click listeners
boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
        if (box.innerText === "" && gameActive) {
            // Player's turn (O)
            box.innerText = "O";
            box.disabled = true;
            
            // Check if player won
            if (checkWinner()) {
                return;
            }
            
            // Computer's turn (X)
            if (gameActive) {
                setTimeout(() => {
                    makeComputerMove();
                }, 300); // Small delay for better UX
            }
        }
    });
});

// Function to make computer move using minimax
function makeComputerMove() {
    // Convert the current board state to a format suitable for minimax
    const board = getBoardState();
    
    // Find the best move using minimax
    const bestMove = findBestMove(board);
    
    // Apply the move
    if (bestMove !== -1 && boxes[bestMove].innerText === "") {
        boxes[bestMove].innerText = "X";
        boxes[bestMove].disabled = true;
        checkWinner();
    }
}

// Get current board state as array of 'O', 'X', or empty strings
function getBoardState() {
    return Array.from(boxes).map(box => box.innerText);
}

// Minimax algorithm implementation
function minimax(board, depth, isMaximizing) {
    // Check terminal states
    const winner = checkWinnerForBoard(board);
    
    if (winner === "X") return 10 - depth; // Computer wins (X)
    if (winner === "O") return depth - 10; // Player wins (O)
    if (!board.includes("")) return 0;     // Draw
    
    if (isMaximizing) {
        // Computer's turn (X) - maximize score
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "X";
                const score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        // Player's turn (O) - minimize score
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "O";
                const score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Find the best move for the computer using minimax
function findBestMove(board) {
    let bestScore = -Infinity;
    let bestMove = -1;
    
    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = "X";
            const score = minimax(board, 0, false);
            board[i] = "";
            
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    
    return bestMove;
}

// Check if there's a winner in a given board state
function checkWinnerForBoard(board) {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // Return the winner ('X' or 'O')
        }
    }
    return null; // No winner
}

// Check for winner in the actual game
function checkWinner() {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        const pos1Val = boxes[a].innerText;
        const pos2Val = boxes[b].innerText;
        const pos3Val = boxes[c].innerText;
        
        if (pos1Val !== "" && pos1Val === pos2Val && pos2Val === pos3Val) {
            showWinner(pos1Val);
            gameActive = false;
            return true;
        }
    }
    
    // Check for draw
    if (checkDraw()) {
        gameActive = false;
        return true;
    }
    
    return false;
}

// Check if the game is a draw
function checkDraw() {
    let allBoxesFilled = true;
    for (let box of boxes) {
        if (box.innerText === "") {
            allBoxesFilled = false;
            break;
        }
    }
    
    if (allBoxesFilled) {
        msg.innerText = "It's a draw!";
        msgContainer.classList.remove("hidden");
        return true;
    }
    
    return false;
}

// Disable all boxes
function disableBoxes() {
    for (let box of boxes) {
        box.disabled = true;
    }
}

// Enable all boxes and clear their content
function enableBoxes() {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
    }
}

// Show winner message
function showWinner(winner) {
    msg.innerText = `Congratulations, winner is ${winner}`;
    msgContainer.classList.remove("hidden");
    disableBoxes();
}

// Reset the game
function resetGame() {
    turnO = true;
    gameActive = true;
    enableBoxes();
    msgContainer.classList.add("hidden");
}

// Add event listeners for buttons
newGameBtn.addEventListener("click", resetGame);
reset_btn.addEventListener("click", resetGame);