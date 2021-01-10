import Algorithm from "./algorithm.js";

export default class MCTS extends Algorithm {
    /*
        1. Selection
        2. Expansion
        3. Simulation
        4. Backpropagation

    */
    constructor(board) {
        super(board);
        this.iterations = 2000;
        this.exploration = 1.41;
        this.nextmove;
    }

    play() {
        let nextmove = this.startMCTS();
        this.nextmove = nextmove;
    }

    getNextMove() {
        return this.nextmove;
    }

    startMCTS() {
        const originalState = JSON.parse(JSON.stringify(this.getPlayField()));
        let root = new MCTSNode(this.getPlayField(), this.getPossibleMoves(this.getPlayField()), null);
        let possibleMoves = this.getPossibleMoves(root.state);

        for (let i = 0; i < this.iterations; i++) {
            root.state = originalState;
            let selectedNode = this.select(root);

            if (this.gameOver(selectedNode.state)) {
                if (this.getWinner(selectedNode.state) != "o") {
                    selectedNode.parent.wins = Number.MIN_SAFE_INTEGER;
                }
            }

            let expandedNode = this.expand(selectedNode);
            let winner = this.simulate(expandedNode);
            let reward;
            if (winner === "o") {
                reward = 1;
            } // ai wins
            else if (winner === "x") {
                reward = -1;
            } // player wins
            else if (winner === "") {
                reward = 0;
            } // draw

            this.backpropagate(expandedNode, reward);
        }

        // choose move with most wins
        let maxWins = -Infinity;
        let maxIndex = -1;

        for (let i in root.children) {
            const child = root.children[i];
            if (child == null) {
                continue;
            }

            let childwinrate = child.wins / child.visits;
            if (childwinrate > maxWins) {
                maxWins = childwinrate;
                maxIndex = i;
            }
        }
        root.state = originalState;
        return possibleMoves[maxIndex];
    }

    select(node) {
        const c = this.exploration;

        while (node.numUnexpandedMoves == 0) { // https://www.geeksforgeeks.org/ml-monte-carlo-tree-search-mcts/
            let maxUBC = -Infinity;
            let maxIndex = -1;
            let Ni = node.visits;

            for (let i in node.children) {
                const child = node.children[i];
                const ni = child.visits;
                const wi = child.wins;
                const ubc = this.computeUCB(wi, ni, c, Ni);
                if (ubc > maxUBC) {
                    maxUBC = ubc;
                    maxIndex = i;
                }
            }
            //const moves = this.getPossibleMoves(node.state);
            //let newBoard = this.getNewBoard(node.state, this.getTurn(node.state), moves[maxIndex]); // ??? https://github.com/SethPipho/monte-carlo-tree-search-js/blob/master/src/MCTS.js

            node = node.children[maxIndex];

            if (this.gameOver(node.state)) {
                return node;
            }
        }

        return node;
    }

    computeUCB(wi, ni, c, Ni) { // ucb = upper confidence bound
        return wi / ni + c * Math.sqrt(Math.log(Ni) / ni);
    }

    expand(node) {
        /*         if (this.gameOver(node.state)) {
            return node;
        } */
        if (node.numUnexpandedMoves > 0) {
            const childIndex = this.selectRandomUnexpandedChild(node);

            let moves = this.getPossibleMoves(node.state);
            let newBoard = this.getNewBoard(node.state, this.getTurn(node.state), moves[childIndex]);

            const newNode = new MCTSNode(newBoard, moves, node);

            node.children[childIndex] = newNode;
            node.numUnexpandedMoves -= 1;

            return newNode;
        }
        return node;
    }
    // returns index of a random unexpanded child of node
    selectRandomUnexpandedChild(node) {
        const choice = Math.floor(Math.random() * node.numUnexpandedMoves); //expand random nth unexpanded node
        let count = -1;
        for (let i in node.children) {
            const child = node.children[i];
            if (child == null) {
                count += 1;
            }
            if (count == choice) {
                return i;
            }
        }
    }

    simulate(node) {
        let simulationState = [...node.state];

        while (!this.gameOver(simulationState)) {
            const moves = this.getPossibleMoves(simulationState);
            const randomChoice = Math.floor(Math.random() * moves.length);
            simulationState = this.getNewBoard(simulationState, this.getTurn(simulationState), moves[randomChoice]);
        }
        let winner = this.getWinner(simulationState);

        return winner;
    }

    backpropagate(node, reward) {
        while (node != null) {
            node.visits += 1;
            node.wins += reward;
            node = node.parent;
        }
    }

    getTurn(board) {
        let x = 0;
        let o = 0;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] == "o") {
                    o++;
                }
                if (board[i][j] == "x") {
                    x++;
                }
            }
        }

        if (o >= x) {
            return "x";
        }
        if (o < x) {
            return "o";
        }
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
        let newBoard = node.map(function (arr) {
            return arr.slice();
        });
        let row = 0;
        while (row < 5 && newBoard[row + 1][column] == 0) {
            row += 1;
        }

        newBoard[row][column] = playersign;
        return newBoard;
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

    gameOver(node) {
        if (this.check4Diagonal(node)[0] || this.check4Horizontal(node)[0] || this.check4Vertical(node)[0] || this.noMoreMoves(node)) {
            return true;
        }
        return false;
    }

    getWinner(node) {
        if (this.check4Horizontal(node)[1] == 100000 || this.check4Vertical(node)[1] == 100000 || this.check4Diagonal(node)[1] == 100000) {
            return "o";
        }

        if (this.check4Horizontal(node)[1] == -100000 || this.check4Vertical(node)[1] == -100000 || this.check4Diagonal(node)[1] == -100000) {
            return "x";
        }
        return "";
    }
}

class MCTSNode {
    constructor(state, moves, parent) {
        this.state = state;
        this.parent = parent;
        this.visits = 0;
        this.wins = 0;
        this.numUnexpandedMoves = moves.length;
        this.children = new Array(this.numUnexpandedMoves).fill(null); //temporary store move for debugging purposes
    }
}
