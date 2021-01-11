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
        let i = this.minimax(this.getPlayField(), 5, false);	

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


    evaluate(node) {	
        if (this.check4Vertical(node)[0]) {	
            return this.check4Vertical(node)[1];	
        }	

        if (this.check4Horizontal(node)[0]) {	
            return this.check4Horizontal(node)[1];	
        }	

        if (this.check4Diagonal(node)[0]) {	
            return this.check4Diagonal(node)[1];	
        }	

        if (this.check3Diagonal(node)[0]) {	
            return this.check3Diagonal(node)[1];	
        }	

        if (this.check3Horizontal(node)[0]) {	
            return this.check3Horizontal(node)[1];	
        }	

        if (this.check3Vertical(node)[0]) {	
            return this.check3Vertical(node)[1];	
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


    isWinner(node, player) {	
        if ((this.check4Horizontal(node)[1] == 100000 || this.check4Vertical(node)[1] == 100000 || this.check4Diagonal(node)[1] == 100000) && player == "o") {	
            return true;	
        }	

        if ((this.check4Horizontal(node)[1] == -100000 || this.check4Vertical(node)[1] == -100000 || this.check4Diagonal(node)[1] == -100000) && player == "x") {	
            return true;	
        } 	
        return false;	
    }	

    isWinning(node) {	
        if (this.check4Horizontal(node)[0] == 100000 ||	
            this.check4Vertical(node)[0] == 100000 ||	
            this.check4Diagonal(node)[0] == 100000) {	
                return true;	
        }	

        return false;	
    }	

    minimax(node, depth, isMaximizingPlayer) {	
        let evalVal;	
        let value;	
        let playersign;	
        (isMaximizingPlayer) ? playersign = "o" : playersign = "x";	
        let playermoves = this.getPossibleMoves(node).sort( () => .5 - Math.random());

        if (this.noMoreMoves(node)) {	
            return 0;	
        }	

        if (this.isWinning(node) || depth == 0) {	
            return this.evaluate(node);	
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
                    if (this.isWinner(child, 'x')) {	
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
                    if (this.isWinner(child, 'o')) {	
                        break;	
                    }

                }	
            }	

            return value;	
        }	
    }	

    check4Horizontal(node) {	
        for (let i = 0; i < node.length; i++) {	
            let string = "";	
            for (let j = 0; j < node[i].length; j++) {	
                string += node[i][j];	
            }	

            if (string.includes("xxxx")) {	
                return [true, -100000];	
            } else if (string.includes("oooo")) {	
                return [true, 100000];	
            }	
        }	

        return [false, 0];	
    }	

    check3Horizontal(node) {	
        for (let i = 0; i < node.length; i++) {	
            let string = "";	
            for (let j = 0; j < node[i].length; j++) {	
                string += node[i][j];	
            }	

            if (string.includes("xxx")) {	
                return [true, -300];	
            } else if (string.includes("ooo")) {	
                return [true, 300];	
            }	
        }	
        return [false, 0];	
    }	


    check4Vertical(node) {	
        for (let j = 0; j < node[0].length; j++) {	
            let string = "";	
            for (let i = 0; i < node.length; i++) {	
                string += node[i][j];	
            }	

            if (string.includes("xxxx")) {	
                return [true, -100000];	
            } else if (string.includes("oooo")) {	
                return [true, 100000];	
            }	
        }	

        return [false, 0];	
    }	

    check3Vertical(node) {	
        for (let j = 0; j < node[0].length; j++) {	
            let string = "";	
            for (let i = 0; i < node.length; i++) {	
                string += node[i][j];	
            }	

            if (string.includes("xxx")) {	
                return [true, -300];	
            } else if (string.includes("ooo")) {	
                return [true, 300];	
            }	
        }	
        return [false, 0];	
    }	

    check4Diagonal(node) {	
        let diagonals = [];	

        diagonals[0] = "" + node[2][0] + node[3][1] + node[4][2] + node[5][3];	
        diagonals[1] = "" + node[1][0] + node[2][1] + node[3][2] + node[4][3] + node[5][4];	
        diagonals[2] = "" + node[0][0] + node[1][1] + node[2][2] + node[3][3] + node[4][4] + node[5][5];	
        diagonals[3] = "" + node[0][1] + node[1][2] + node[2][3] + node[3][4] + node[4][5] + node[5][6];	
        diagonals[4] = "" + node[0][2] + node[1][3] + node[2][4] + node[3][5] + node[4][6];	
        diagonals[5] = "" + node[0][3] + node[1][4] + node[2][5] + node[3][6];	

        diagonals[6] = "" + node[3][0] + node[2][1] + node[1][2] + node[0][3];	
        diagonals[7] = "" + node[4][0] + node[3][1] + node[2][2] + node[1][3] + node[0][4];	
        diagonals[8] = "" + node[5][0] + node[4][1] + node[3][2] + node[2][3] + node[1][4] + node[0][5];	
        diagonals[9] = "" + node[5][1] + node[4][2] + node[3][3] + node[2][4] + node[1][5] + node[0][6];	
        diagonals[10] = "" + node[5][2] + node[4][3] + node[3][4] + node[2][5] + node[1][6];	
        diagonals[11] = "" + node[5][3] + node[4][4] + node[3][5] + node[2][6];	

        for (let i = 0; i < diagonals.length; i++) {	
            let string = diagonals[i];	
            if (string.includes("xxxx")) {	
                return [true, -100000];	
            } else if (string.includes("oooo")) {	
                return [true, 100000];	
            }	
        }	

        return [false, 0];	
    }	

    check3Diagonal(node) {	
        let diagonals = [];	

        diagonals[0] = "" + node[2][0] + node[3][1] + node[4][2] + node[5][3];	
        diagonals[1] = "" + node[1][0] + node[2][1] + node[3][2] + node[4][3] + node[5][4];	
        diagonals[2] = "" + node[0][0] + node[1][1] + node[2][2] + node[3][3] + node[4][4] + node[5][5];	
        diagonals[3] = "" + node[0][1] + node[1][2] + node[2][3] + node[3][4] + node[4][5] + node[5][6];	
        diagonals[4] = "" + node[0][2] + node[1][3] + node[2][4] + node[3][5] + node[4][6];	
        diagonals[5] = "" + node[0][3] + node[1][4] + node[2][5] + node[3][6];	

        diagonals[6] = "" + node[3][0] + node[2][1] + node[1][2] + node[0][3];	
        diagonals[7] = "" + node[4][0] + node[3][1] + node[2][2] + node[1][3] + node[0][4];	
        diagonals[8] = "" + node[5][0] + node[4][1] + node[3][2] + node[2][3] + node[1][4] + node[0][5];	
        diagonals[9] = "" + node[5][1] + node[4][2] + node[3][3] + node[2][4] + node[1][5] + node[0][6];	
        diagonals[10] = "" + node[5][2] + node[4][3] + node[3][4] + node[2][5] + node[1][6];	
        diagonals[11] = "" + node[5][3] + node[4][4] + node[3][5] + node[2][6];	

        for (let i = 0; i < diagonals.length; i++) {	
            let string = diagonals[i];	
            if (string.includes("xxx")) {	
                return [true, -300];	
            } else if (string.includes("ooo")) {	
                return [true, 300];	
            }	
        }	

        return [false, 0];	
    }
}