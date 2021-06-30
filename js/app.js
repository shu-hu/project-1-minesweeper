/*-------------------------------- Variables --------------------------------*/
let boardWidth, numBomb, flags, isWin, board, isLose;
let isDefultTheme = true;
let timerIntervalId;
let min, sec, seconds = 0;
let isTimerStart = false;

/*------------------------ Cached Element References ------------------------*/
const boardEl = document.querySelector("div.board");
const normalBtnEl = document.querySelector(".normal");
const hardBtnEl = document.querySelector(".hard");
const extremeBtnEl = document.querySelector(".extreme");
const mainPageEl = document.querySelector(".main-page");
const backMainEl = document.querySelector("#back-main");
const btnsBarEl = document.querySelector(".btns-bar")
const gamePageEl = document.querySelector(".game-page");
const totalFlagsEl = document.querySelector("#total-flags");
const massageEl = document.querySelector("#display-msg");
const restartBtnEl = document.querySelector("#restart");
const switchThemeEl = document.querySelector("#switch");
const bodyEl = document.querySelector("body");
const timerEl = document.getElementById('time');

/*----------------------------- Event Listeners -----------------------------*/
normalBtnEl.addEventListener('click', () => setMode(1));
hardBtnEl.addEventListener('click', () => setMode(2));
extremeBtnEl.addEventListener('click', () => setMode(3));
backMainEl.addEventListener('click', backToHome);
restartBtnEl.addEventListener('click' , restartGame);
switchThemeEl.addEventListener('click', changeTheme);

/*-------------------------------- Functions --------------------------------*/
function setMode(x) {
    if (x === 1) {
        boardWidth = 5;
        numBomb = 4;
    } else if (x === 2) {
        boardWidth = 6;
        numBomb = 8;
    } else if (x === 3) {
        boardWidth = 8;
        numBomb = 15;
    }
    mainPageEl.setAttribute("hidden", "");
    gamePageEl.removeAttribute("hidden");
    board = createBoard();
}

// create a board
function createBoard() {
    flags = 0;
    isWin = false;
    isLose = false;
    const board = [];
    const bombIdxs = generateBombIdxs(numBomb, boardWidth);
    for (let i = 0; i < boardWidth; i++) {
        const row = [];
        for (let j = 0; j < boardWidth; j++) {
            let isBomb = false;
            let isChecked = false;
            let hasFlag = false;
            const squareEl = document.createElement('div');
            // add class name
            squareEl.classList.add("sq");
            if (hasIndex(bombIdxs, i, j)) {
                // bomb
                isBomb = true;
            }
            boardEl.append(squareEl);
            row.push(
                {
                    isBomb: isBomb,
                    element: squareEl,
                    num: null,
                    i: i,
                    j: j,
                    isChecked: isChecked,
                    hasFlag: hasFlag,
                }
            );
        }
        board.push(row);
    }
    board.forEach(row => {
        row.forEach(squareObj => {
            addNumber(squareObj, board, boardWidth);
            // handle left click
            squareObj.element.addEventListener('click', () => {
                if (!isTimerStart) {
                    startTimer();
                }
                if(squareObj.isChecked || squareObj.hasFlag) return;
                if(isWin || isLose) return;
                squareObj.element.style.backgroundColor = "#118DF0";
                if (!squareObj.isBomb) {
                    if(squareObj.num !== 0 ) {
                        squareObj.element.innerHTML = squareObj.num;
                        squareObj.element.style.fontFamily = "'Fredoka One', cursive";
                    } else {
                        const revealSafeSpots = getSafeSpots(squareObj, board, []);
                        revealSafeSpots.forEach(obj => {
                            obj.element.style.backgroundColor = "#118DF0";
                            if (obj.num !== 0) {
                                obj.element.innerHTML = obj.num;
                                obj.element.style.fontFamily = "'Fredoka One', cursive";
                            }
                            obj.isChecked = true;
                        });
                    }
                } else {
                    isLose = true;
                    showAllBombs();
                    render();
                }
                squareObj.isChecked = true;
                checkWin();
            });
            // handle right click
            squareObj.element.oncontextmenu = function(e) {
                e.preventDefault();
                addFlag(squareObj);
                if (!isTimerStart) {
                    startTimer();
                }
            }
        })
    })
    boardEl.style.setProperty("--size", boardWidth);
    render();
    return board;
}

function generateBombIdxs(numBomb, boardWidth) {
    let count = 0;
    const randBombIdxs = [];
    while (count < numBomb) {
        let x = Math.floor(Math.random() * boardWidth);
        let y = Math.floor(Math.random() * boardWidth);
        let randBombIdx = [x, y];
        if (!hasIndex(randBombIdxs, x, y)) {
            randBombIdxs.push(randBombIdx);
            count++;
        }
    }
    return randBombIdxs;
}

function hasIndex(indexArr, i, j) {
    return indexArr.some(index => index[0] === i && index[1] === j);
}

function getSafeSpots(squareObj, board, visited) {
    if (visited.includes(squareObj)) return [];
    visited.push(squareObj);
    let safeSpots = [];
    const neighborIdxs = getNeighborIdxs(squareObj, boardWidth);
    neighborIdxs.forEach(e => {
        const neighbor = board[e[0]][e[1]];
        if (!neighbor.isBomb && !neighbor.hasFlag) {
            if (!visited.includes(neighbor)) {
                safeSpots.push(neighbor);
            }
            if (neighbor.num === 0) {
                safeSpots = safeSpots.concat(getSafeSpots(neighbor, board, visited));
            }
        }
    })
    return safeSpots;
}

function getNeighborIdxs(squareObj, width){
    const i = squareObj.i;
    const j = squareObj.j;
    const neighborIdxs = [
        [i-1, j-1], [i-1, j], [i-1, j+1],
        [i, j-1], [i, j+1], 
        [i+1, j-1], [i+1, j], [i+1, j+1],
    ];
    return neighborIdxs.filter(arr => arr[0] < width && arr[0] > -1 && arr[1] < width && arr[1] > -1);
}

function addNumber(squareObj, board, boardWidth) {
    let count = 0;
    if (!squareObj.isBomb) {
        const neighborIdxs = getNeighborIdxs(squareObj, boardWidth);
        neighborIdxs.forEach(e => {
            const neighbor = board[e[0]][e[1]];
            if (neighbor.isBomb) {
                count++;
            }
        })
    }
    squareObj.num = count;
}

function addFlag(obj) {
    if (isWin || isLose) return;
    if(!obj.isChecked && (flags < numBomb || obj.hasFlag)) {
        if(!obj.hasFlag) {
            obj.hasFlag = true;
            if (isSpaceMode()) {
                obj.element.innerHTML = '<i class="fas fa-space-shuttle flag-img"></i>';
                obj.element.style.backgroundColor = "yellow";
            } else {
                obj.element.innerHTML = '<i class="fab fa-gitkraken flag-img"></i>';
                obj.element.style.backgroundColor = "yellow";
            }
            flags++;
            totalFlagsEl.innerHTML = `: ${numBomb - flags}`;
            checkWin();
        } else {
            obj.hasFlag = false;
            obj.element.innerHTML = ''
            obj.element.style.backgroundColor = "#4DD6F8";
            flags--;
            totalFlagsEl.innerHTML = `: ${numBomb - flags}`;
        }
    }
}

function checkWin() {
    let allSafeSpotsChecked = boardWidth * boardWidth - numBomb;
    board.forEach(row => {
        row.forEach(square => {
            if (!square.isBomb && square.isChecked) {
                allSafeSpotsChecked--;
            }
            if (allSafeSpotsChecked === 0) {
                console.log('You win!!!');
                isWin = true;
                render();
            }
        })
    })

}

function backToHome() {
    mainPageEl.removeAttribute("hidden");
    boardEl.innerHTML = "";
    massageEl.innerHTML = "";
    massageEl.className = "";
    isTimerStart = false;
    clearInterval(timerIntervalId);
    seconds = 0;
    timerIntervalId = null;
    timerEl.innerHTML = "0:00";
    gamePageEl.setAttribute("hidden", "");
}

function render() {
    totalFlagsEl.innerHTML = `: ${numBomb}`;
    if(isWin) {
        clearInterval(timerIntervalId);
        timerIntervalId = null;
        massageEl.innerHTML = `Congratulations! You Won in ${seconds} seconds!`;
        massageEl.className = "animate__animated animate__bounce";
    }
    if(isLose) {
        clearInterval(timerIntervalId);
        timerIntervalId = null;
        massageEl.innerHTML = `Sorry! You Lost!!!`;
        massageEl.className = "animate__animated animate__backInLeft";
    }
}

function restartGame() {
    boardEl.innerHTML = "";
    massageEl.innerHTML = "";
    massageEl.className = "";
    board = createBoard();
    isTimerStart = false;
    clearInterval(timerIntervalId);
    seconds = 0;
    timerIntervalId = null;
    timerEl.innerHTML = "0:00";
}

function isSpaceMode() {
    return bodyEl.classList.contains("space");
}

function changeTheme() {
    isDefultTheme = !isDefultTheme;
    bodyEl.classList.toggle("space");
    const flagImgs = bodyEl.querySelectorAll(".flag-img");
    const mineImgs = bodyEl.querySelectorAll(".mine-img");
    if (isSpaceMode()) {
        flagImgs.forEach(flagImg => {
            flagImg.classList.add("fas", "fa-space-shuttle");
            flagImg.classList.remove("fab", "fa-gitkraken");
        });
        mineImgs.forEach(mineImg => {
            mineImg.classList.add("fa-skull");
            mineImg.classList.remove("fa-bomb");
        });
        
    } else {
        flagImgs.forEach(flagImg => {
            flagImg.classList.remove("fas", "fa-space-shuttle");
            flagImg.classList.add("fab", "fa-gitkraken");
        });
        mineImgs.forEach(mineImg => {
            mineImg.classList.remove("fa-skull");
            mineImg.classList.add("fa-bomb");
        });
    }

    if (board) {
        board.forEach(row => {
            row.forEach(squareObj => {
                if(squareObj.isBomb && squareObj.isChecked) {
                    if (isSpaceMode()) {
                        
                        squareObj.element.style.backgroundColor = "red";
                    } else {
                        
                        squareObj.element.style.backgroundColor = "red";
                    }
                }
            });
        });
    }
}

function showAllBombs() {
    board.forEach(row => {
        row.forEach(squareObj => {
            if(squareObj.isBomb) {
                squareObj.isChecked = true;
                if (isSpaceMode()) {
                    squareObj.element.innerHTML = '<i class="fas fa-skull mine-img"></i>';
                    squareObj.element.style.backgroundColor = "red";
                } else {
                    squareObj.element.innerHTML = '<i class="fas fa-bomb mine-img"></i>';
                    squareObj.element.style.backgroundColor = "red";
                }
            }
        })
    })
}

function startTimer() {
	if (timerIntervalId) {
		seconds = 0;
		clearInterval(timerIntervalId);
	}
	timerIntervalId = setInterval(tick, 1000);
    isTimerStart = true;
}

function tick() {
	seconds++;
	display();
}

function display() {
	min = Math.floor(seconds / 60);
	sec = seconds % 60;
	if (sec < 10) {
		timerEl.innerHTML = `${min}:0${sec}`;
	} else {
		timerEl.innerHTML = `${min}:${sec}`;
	}
}