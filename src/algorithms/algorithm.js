export default class Algorithm {
    constructor(board) {
        this.b = board;
        this.state = {};
    }

    play() {}
    
    giveMeColumn() {
        return Math.floor(Math.random() * 7);
    }

    getNextMove() {
        return "";
    }

    getBoard() {
        return this.b;
    }
    
    getPlayField() {
        return this.b.playBoard
    }
}
