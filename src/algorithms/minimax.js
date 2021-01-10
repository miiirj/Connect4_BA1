import Algorithm from "./algorithm.js";

export default class MiniMax extends Algorithm {
    
    constructor(board) {
        super(board);

        this.evaluationTable = [
            [3, 4, 5, 7, 5, 4, 3], 
            [4, 6, 8, 10, 8, 6, 4],
            [5, 8, 11, 13, 11, 8, 5], 
            [5, 8, 11, 13, 11, 8, 5],
            [4, 6, 8, 10, 8, 6, 4],
            [3, 4, 5, 7, 5, 4, 3]
        ];

        this.nextMove;

    }

    play() {
        let i = this.minimax(this.getPlayField(), 5, false); // even and true or odd and false

    }

    getNextMove() {
        return this.nextMove;
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

    // https://softwareengineering.stackexchange.com/questions/263514/why-does-this-evaluation-function-work-in-a-connect-four-game-in-java
    

    evaluate(node, playersign) {
        if (this.checkDiagnoal(node)[0]) {
            return this.checkDiagnoal(node)[1];
        }

        if (this.checkHorizontal(node)[0]) {
            return this.checkHorizontal(node)[1];
        }
        if (this.checkVertical(node)[0]) {
            return this.checkVertical(node)[1];
        }


        let value = 0;
        let utility = 128;

        for (let i = 0; i < node.length; i++) {
            for (let j = 0; j < node[i].length; j++) {
                if (node[i][j] == 'o')
                    value += this.evaluationTable[i][j];
                else if (node[i][j] == 'x')
                    value -= this.evaluationTable[i][j];
            }
        }

        return value + utility;
    }

    getPossibleMoves(node) {
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

    getNewBoard(node, playersign, column) {
        let newBoard = node.map(function(arr){return arr.slice()});
        let row = 0;
        while(row < 5 && newBoard[row+1][column] == 0) {
            row += 1;
        }

        newBoard[row][column] = playersign;
        return newBoard;
    }

    checkHorizontalIfWon(node) {
        for (let i = 0; i < node.length; i++) {
            let string = "";
            for (let j = 0; j < node[i].length; j++) {
                string += node[i][j];
            }
            if (string.includes("xxxx")) {
                return [true, 'x'];
            } else if (string.includes("oooo")) {
                return [true, 'o'];
            }
        }
        return [false, 0];
    }

    checkVerticalIfWon(node) {
        for (let j = 0; j < node[0].length; j++) {
            let string = "";
            for (let i = 0; i < node.length; i++) {
                string += node[i][j];
            }
            if (string.includes("xxxx")) {
                return [true, 'x'];
            } else if (string.includes("oooo")) {
                return [true, 'o'];
            }
        }
        return [false, 0];
    }

    checkDiagnoalForWin(node) {
        let diagnoals = [];
        diagnoals[0] = node[2][0] + node[3][1] + node[4][2] + node[5][3];
        diagnoals[1] = node[1][0] + node[2][1] + node[3][2] + node[4][3] + node[5][4];
        diagnoals[2] = node[0][0] + node[1][1] + node[2][2] + node[3][3] + node[4][4] + node[5][5];
        diagnoals[3] = node[0][1] + node[1][2] + node[2][3] + node[3][4] + node[4][5] + node[5][6];
        diagnoals[4] = node[0][2] + node[1][3] + node[2][4] + node[3][5] + node[4][6];
        diagnoals[5] = node[0][3] + node[1][4] + node[2][5] + node[3][6];

        diagnoals[6] = node[3][0] + node[2][1] + node[1][2] + node[0][3];
        diagnoals[7] = node[4][0] + node[3][1] + node[2][2] + node[1][3] + node[0][4];
        diagnoals[8] = node[5][0] + node[4][1] + node[3][2] + node[2][3] + node[1][4] + node[0][5];
        diagnoals[9] = node[5][1] + node[4][2] + node[3][3] + node[2][4] + node[1][5] + node[0][6];
        diagnoals[10] = node[5][2] + node[4][3] + node[3][4] + node[2][5] + node[1][6];
        diagnoals[11] = node[5][3] + node[4][4] + node[3][5] + node[2][6];

        for (let i = 0; i < diagnoals.length; i++) {
            let string = diagnoals[i];
            if (string.toString().includes("xxxx")) {
                return [true, 'x'];
            } else if (string.toString().includes("oooo")) {
                return [true, 'o'];
            }
        }

        return [false, 0];
    }

    isWinner(node, player) {
        if (this.checkHorizontalIfWon(node)[1] == player || this.checkVerticalIfWon(node)[1] == player || this.checkDiagnoalForWin(node)[1] == player) {
            return true;
        }
        return false;
    }

    

    minimax(node, depth, isMaximizingPlayer) {
        let evalVal;
        let value;
        let playersign;

        (isMaximizingPlayer) ? playersign = "o" : playersign = "x";
        let playermoves = this.getPossibleMoves(node);
        

        if (depth == 0 || this.noMoreMoves(node) || this.isWinner(node, 'o') || this.isWinner(node, 'x') ) {
            if (this.noMoreMoves(node)) {
                return 0;
            }

            if (this.isWinner(node, 'x')) {
                return -1000000;
            }

            if (this.isWinner(node, 'o')) {
                return 1000000;
            }

            return this.evaluate(node, playersign);
        }


        if (isMaximizingPlayer) {
            value = -Infinity;

            for (let i = 0; i < playermoves.length; i++) {
                let child = this.getNewBoard(node, playersign, playermoves[i]);
                evalVal = this.minimax(child, depth-1, false);

                if (value < evalVal) {
                    value = evalVal;
                    this.nextMove = playermoves[i]; 

                    if (this.isWinner(child, 'o')) {
                        break;
                    }
                }

                

            }
            return value;
        } else {
            value = Infinity;

            for (let i = 0; i < playermoves.length; i++) {
                let child = this.getNewBoard(node, playersign, playermoves[i]);
                evalVal = this.minimax(child, depth-1, true);

                if (value > evalVal) {
                    value = evalVal;
                    this.nextMove = playermoves[i];

                    if (this.isWinner(child, 'x')) {
                        break;
                    }

                }
            }

            return value;
        }
    }

    checkHorizontal(node) {
        for (let i = 0; i < node.length; i++) {
            let string = "";
            for (let j = 0; j < node[i].length; j++) {
                string += node[i][j];
            }

            if (string.includes("xxx")) {
                return [true, -100];
            } else if (string.includes("oooo")) {
                return [true, 100];
            }
        }
        return [false, 0];
    }

    // checks if there's either 4 or 3 in a column and returns a value
    checkVertical(node) {
        for (let j = 0; j < node[0].length; j++) {
            let string = "";
            for (let i = 0; i < node.length; i++) {
                string += node[i][j];
            }

            if (string.includes("xxx")) {
                return [true, -100];
            } else if (string.includes("ooo")) {
                return [true, 100];
            }
        }
        return [false, 0];
    }

    checkDiagnoal(node) {
        let diagnoals = [];
        
        diagnoals[0] = "" + node[2][0] + node[3][1] + node[4][2] + node[5][3];
        diagnoals[1] = "" + node[1][0] + node[2][1] + node[3][2] + node[4][3] + node[5][4];
        diagnoals[2] = "" + node[0][0] + node[1][1] + node[2][2] + node[3][3] + node[4][4] + node[5][5];
        diagnoals[3] = "" + node[0][1] + node[1][2] + node[2][3] + node[3][4] + node[4][5] + node[5][6];
        diagnoals[4] = "" + node[0][2] + node[1][3] + node[2][4] + node[3][5] + node[4][6];
        diagnoals[5] = "" + node[0][3] + node[1][4] + node[2][5] + node[3][6];

        diagnoals[6] = "" + node[3][0] + node[2][1] + node[1][2] + node[0][3];
        diagnoals[7] = "" + node[4][0] + node[3][1] + node[2][2] + node[1][3] + node[0][4];
        diagnoals[8] = "" + node[5][0] + node[4][1] + node[3][2] + node[2][3] + node[1][4] + node[0][5];
        diagnoals[9] = "" + node[5][1] + node[4][2] + node[3][3] + node[2][4] + node[1][5] + node[0][6];
        diagnoals[10] = "" + node[5][2] + node[4][3] + node[3][4] + node[2][5] + node[1][6];
        diagnoals[11] = "" + node[5][3] + node[4][4] + node[3][5] + node[2][6];

        for (let i = 0; i < diagnoals.length; i++) {
            let string = diagnoals[i];
            if (string.includes("xxx")) {
                return [true, -100];
            } else if (string.includes("ooo")) {
                return [true, 100];
            }
        }

        return [false, 0];
    }
}