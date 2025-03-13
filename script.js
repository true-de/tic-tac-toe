let boxes = document.querySelectorAll(".box");
let reset_btn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let turnO = true;
const winPatterns = [
    [0,1,2],
    [0,3,6],
    [0,4,8],
    [1,4,7],
    [2,5,8],
    [2,4,6],
    [3,4,5],
    [6,7,8]
];

//   Handles the click event on each box in the game.
//   Updates the box's text with 'O' or 'X' based on the current turn, disables the box, and checks for a winner.

//   @param {HTMLElement} box - The clicked box element.
//   @returns {void}
boxes.forEach((box) => {
    box.addEventListener("click", () => {
        console.log("box clicked");
        if(turnO){
            box.innerText = "O";
            turnO = false;

        } else {
            box.innerText = "X";
            turnO = true;
        }
        box.disabled = true;

        checkWinner();
    });
});

//   Handles the click event on the reset button.
const disableBoxes = () => {
    for(let box of boxes) {
        box.disabled = true;
    }
}


const enableBoxes = () => {
    for(let box of boxes) {
        box.disabled = false;
        box.innerText = "";
    }
}

const showWinner = (winner) => {
    msg.innerText = `Congratulations, winner is ${winner}`;
    msgContainer.classList.remove("hidden");
    disableBoxes();
}

const checkDraw = () => {
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
        disableBoxes();
    }
};

const checkWinner = () => {
    for (let pattern of winPatterns){

        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if(pos1Val != "" && pos2Val != "" && pos3Val != ""){
            if(pos1Val === pos2Val && pos2Val === pos3Val){
                showWinner(pos1Val);
            }
        }
    }
    checkDraw();
};

const resetGame = () => {
    turnO = true;
    enableBoxes();
    msgContainer.classList.add("hidden");
}

newGameBtn.addEventListener("click", resetGame);
reset_btn.addEventListener("click", resetGame);
