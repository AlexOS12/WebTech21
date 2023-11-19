"use strict";

let userMove = true;
let gameOver = false;

function checkFull() {
    let cells = document.querySelectorAll(".cell");
    for (let cell of cells) {
        if (cell.textContent == "") {
            return false;
        }
    }
    return true;
}

// 0 1 2
// 3 4 5
// 6 7 8

function showMessage(messageText, category = "good") {
    let messageBox = document.getElementById("messages");
    let message = document.createElement("div");
    message.textContent = messageText;
    messageBox.append(message);
    message.classList.add("message");
    message.classList.add(category);
    setTimeout(() => message.remove(), 3000);
}

function checkWin() {
    let cells = document.querySelectorAll(".cell");
    let haveWinner = true;

    for (let i = 0; i < 3; ++i) {
        if (cells[i * 3].textContent == "") {
            continue;
        }

        haveWinner = true;

        for (let j = 0; j < 2; ++j) {
            let currentCell = cells[i * 3 + j].textContent;
            let nextCell = cells[i * 3 + j + 1].textContent;

            if (currentCell != nextCell) {
                haveWinner = false;
                break;
            }
        }

        if (haveWinner) {
            return cells[i * 3].textContent;
        } 
    }
}

function checkWinColumn() {
    let cells = document.querySelectorAll(".cell");
    let haveWinner = true;

    for (let i = 0; i < 3; ++i) {
        if (cells[i].textContent == "") {
            continue;
        }

        haveWinner = true;

        for (let j = 0; j < 2; ++j) {
            let currentCell = cells[j * 3 + i].textContent;
            let nextCell = cells[(j + 1) * 3 + i].textContent;
            if (currentCell != nextCell) {
                haveWinner = false;
                break;
            }
        }

        if (haveWinner) {
            return cells[i].textContent;
        } 
    }
}

function checkWinDiagonalLR() {
    let cells = document.querySelectorAll(".cell");
    let haveWinner = true;

    for (let i = 0; i < 2; ++i) {
        if (cells[i * 3 + i].textContent == "") {
            return;
        }

        let currentCell = cells[i * 3 + i].textContent;
        let nextCell = cells[(i + 1) * 3 + i + 1].textContent;
        if (currentCell != nextCell) {
            haveWinner = false;
            return;
        }
    }
    if (haveWinner) {
        return cells[0].textContent;
    } 
}

function checkWinDiagonalRL() {
    let cells = document.querySelectorAll(".cell");
    let haveWinner = true;

    for (let i = 0; i < 2; ++i) {
        if (cells[(i * 3) + 2 - i].textContent == "") {
            return;
        }

        let currentCell = cells[(i * 3) + 2 - i].textContent;
        let nextCell = cells[(i + 1) * 3 + 2 - (i + 1)].textContent;
        if (currentCell != nextCell) {
            haveWinner = false;
            return;
        }
    }
    if (haveWinner) {
        return cells[2].textContent;
    } 
}


function processClick(eventObj) {
    let cell = eventObj.target;
    if (gameOver) {
        showMessage("Игра завершена", "bad");
        return;
    }
    if (cell.textContent != "") {
        showMessage("Занятая ячейка", "bad");
        return;
    }
    cell.textContent = userMove ? "X" : "O";
    userMove = !userMove;
    
    let winner = checkWin() || checkWinColumn() || 
        checkWinDiagonalLR() || checkWinDiagonalRL();
    if (winner) {
        showMessage(winner + "-ки одержали победу!!");
        gameOver = true;
        return;
    }

    if (checkFull()) {
        showMessage("Доступных ходов не осталось", "bad");
        gameOver = true;
    }
}

function newGame() {
    let cells = document.querySelectorAll(".cell");
    for (let cell of cells) {
        cell.textContent = "";
    }
    gameOver = false;
    userMove = true;
}

document.querySelector(".button").onclick = newGame;

function initBoard() {
    let boardElement = document.getElementById("board");
    for (let i = 0; i < 9; i++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.onclick = processClick;
        boardElement.append(cell);
    }
    return boardElement;
}

window.onload = initBoard;
