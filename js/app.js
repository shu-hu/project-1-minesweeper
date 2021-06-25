/*-------------------------------- Constants --------------------------------*/




/*-------------------------------- Variables --------------------------------*/
let boardWidth, numBomb;



/*------------------------ Cached Element References ------------------------*/
const boardEl = document.querySelector("section.board");

/*----------------------------- Event Listeners -----------------------------*/
// boardEl.addEventListener('click', () => console.log('work'))
// squareEl.addEventListener('click', () => console.log('work'))



/*-------------------------------- Functions --------------------------------*/

// create a board
function createBoard(boardWidth, numBomb) {
    const board = [];
    for (let i = 0; i < boardWidth; i++) {
        const row = [];
        for (let j = 0; j < boardWidth; j++) {
            const squareEl = document.createElement('div');
            squareEl.setAttribute('id', `${i}-${j}`);
            // console.log(boardEl);
            boardEl.append(squareEl);
            row.push(squareEl);
        }
        board.push(row);
    }
    boardEl.style.setProperty("--size", 5);
}

// main
createBoard(5, 20);

