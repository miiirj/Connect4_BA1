import MiniMax from "./algorithms/minimax.js";
import MiniMaxAlphaBeta from "./algorithms/minimaxab.js";
import MCTS from "./algorithms/mcts.js";

const boardHTML = document.getElementById("board");

class Board {
    constructor() {
        this.player = 0;
        this.playerFinalGoal = "";

        this.playBoard = [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
        ];

        for (let i = 0; i < this.playBoard.length; i++) {
            for (let j = 0; j < this.playBoard[i].length; j++) {
                this.addDiv(i, j);
            }
        }

        let number = Math.floor(Math.random() * 3) + 1;
        this.algorithmNr = number;

        switch (number) {
            case 1:
                this.algorithm = new MiniMax(this);
                break;
            case 2:
                this.algorithm = new MiniMaxAlphaBeta(this);
                break;
            case 3:
                this.algorithm = new MCTS(this);
                break;
        }
    }

    addDiv(i, j) {
        let emptyField = document.createElement("div");
        emptyField.className = "field " + i + "" + j;
        emptyField.addEventListener("click", addItem);
        boardHTML.appendChild(emptyField);
    }

    setField(column, playersign) {
        let row = 0;
        while (row < 5 && this.playBoard[row + 1][column] == 0) {
            row += 1;
        }

        this.playBoard[row][column] = playersign;

        let currentElement = document.getElementsByClassName(row + "" + column);
        if (!(currentElement[0].classList.contains("fieldYellow") || currentElement[0].classList.contains("fieldRed"))) {
            if (playersign == "x") {
                currentElement[0].classList.add("fieldYellow");
                this.playerFinalGoal = "xxxx";
            } else if (playersign == "o") {
                currentElement[0].classList.add("fieldRed");
                this.playerFinalGoal = "oooo";
            }

            // check if game won
            this.checkIfGameDone(row, column);

            this.player++;
        } else {
            if (playersign == "o") {
                this.setField(this.algorithm.giveMeColumn(), "o");
                //console.log("Error");
            }
        }
    }

    checkIfGameDone(row, column) {
        if (
            this.checkHorizontal(row).includes(this.playerFinalGoal) ||
            this.checkVertical(column).includes(this.playerFinalGoal) ||
            this.checkDiagonalsltrb(row, column).includes(this.playerFinalGoal) ||
            this.checkDiagonalslbrt(row, column).includes(this.playerFinalGoal)
        ) {
            //console.log("Gewonnen");
            this.showGameFinishedMessage("WIN");
            gameOver = true;
        }

        if (this.noMoreMoves(this.playBoard)) {
            //console.log("Unentschieden");
            this.showGameFinishedMessage("DRAW");
            gameOver = true;
        }
        return false;
    }

    noMoreMoves(currentNode) {
        for (let i = 0; i < currentNode.length; i++) {
            for (let j = 0; j < currentNode[i].length; j++) {
                if (currentNode[i][j] === 0) {
                    return false;
                }
            }
        }
        return true;
    }

    showGameFinishedMessage(finalMessage) {
        let winnerField = document.getElementById("boardAligner");
        let winnerText = document.getElementById("winnerText");
        winnerField.style.display = "block";
        let winner = "";
        if (finalMessage == "WIN") {
            if (this.player % 2 == 0) {
                winnerText.innerHTML = "You win";
                winner = "player";
            } else {
                winnerText.innerHTML = "The Computer wins";
                winner = "ai";
            }
        } else if (finalMessage == "DRAW") {
            winnerText.innerHTML = "It is a Draw";
            winner = "draw";
        }

        for (let i = 0; i < document.getElementsByClassName("field").length; i++) {
            document.getElementsByClassName("field")[i].removeEventListener("click", addItem);
        }
        document.getElementById("gameEndedButton").addEventListener("click", restartGame);

        // send to database here
        let sqldata = {
            algorithm: this.algorithmNr,
            winner: winner,
            board: this.playBoard.toString(),
            numberOfMoves: numberOfMoves,
            aiMovesTime: timesAIMoves.toString(),
            sessioncookie: getCookie("sessionkey").toString(),
        };

        var xhr = new XMLHttpRequest();
        let url = "https://linode8401.unnamed.group/ajaxfile.php";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(sqldata));
    }

    // checking functionsö
    checkHorizontal(row) {
        let horizontalString = "";
        for (let i = 0; i < this.playBoard[row].length; i++) {
            horizontalString += this.playBoard[row][i];
        }
        return horizontalString;
    }

    checkVertical(column) {
        let verticalString = "";
        for (let i = 0; i < this.playBoard.length; i++) {
            verticalString += this.playBoard[i][column];
        }
        return verticalString;
    }

    checkDiagonalsltrb(row, column) {
        // left top to rigth bottom
        let leftTop = 0;
        let bottomRight = 0;

        let myString = "";

        try {
            for (let i = 0; i < 7; i++) {
                let here = this.playBoard[row - i][column - i];
                leftTop = i;
            }
        } catch (err) {}

        try {
            for (let i = 0; i < 7; i++) {
                let here = this.playBoard[row + i][column + i];
                bottomRight = i;
            }
        } catch (err) {}

        leftTop = leftTop * -1;

        for (let i = leftTop; i <= bottomRight; i++) {
            myString += this.playBoard[row + i][column + i];
        }

        return myString;
    }

    checkDiagonalslbrt(row, column) {
        // left bottom to right top
        let bottomLeft = 0;
        let topRight = 0;

        let myString = "";

        try {
            for (let i = 0; i < 7; i++) {
                let here = this.playBoard[row + i][column - i];
                bottomLeft = i;
            }
        } catch (err) {}

        try {
            for (let i = 0; i < 7; i++) {
                let here = this.playBoard[row - i][column + i];
                topRight = i;
            }
        } catch (err) {}

        bottomLeft = bottomLeft * -1;

        for (let i = bottomLeft; i <= topRight; i++) {
            myString += this.playBoard[row - i][column + i];
        }

        return myString;
    }
}

// .............................................................

let b = new Board();

checkCookie();

let gameOver = false;
let timesAIMoves = [];
let numberOfMoves = 0;

// on press off any fields
function addItem() {
    let numbers = this.classList[1];
    let column = parseInt(numbers[1]);
    let moves = getPossibleMoves(b.playBoard);

    // if human's turn
    if (b.player % 2 == 0 && moves.includes(column)) {
        numberOfMoves++;
        b.setField(column, "x");

        if (!gameOver) {
            //setTimeout(function() { }, 0);// https://stackoverflow.com/questions/15694470/javascript-wait-function
            let t1 = performance.now();
            b.algorithm.play();
            numberOfMoves++;
            b.setField(b.algorithm.getNextMove(), "o");
            let t2 = performance.now();
            //console.log("Call to doSomething took " + (t2 - t1) + " milliseconds.")
            timesAIMoves.push(t2 - t1);
        }
    }
}

function restartGame() {
    window.location.reload();
}

function getPossibleMoves(node) {
    let moveArray = [];
    let counter = 0;

    for (let i = 0; i < 7; i++) {
        if (node[0][i] == 0) {
            moveArray[counter] = i;
            counter++;
        }
    }

    return moveArray;
}

function checkCookie() {
    var session = getCookie("sessionkey");
    if ((session == "")) {
        let rndnumber = Math.floor(Math.random() * 1000);
        let time = performance.now();
        setCookie("sessionkey", (rndnumber + "" + time), 100);
    };
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
