const Group = require('./group');
const hash = require('object-hash');

const results = {
    ILLEGAL_MOVE: 'ILLEGAL_MOVE',
    CAPACITY_OVER: 'CAPACITY_OVER',
    EATEN_BY_CANNIBALS: 'EATEN_BY_CANNIBALS',
    REPETITION: 'REPETITION',
    GAME_CLEAR: 'GAME_CLEAR',
    LEGAL_MOVE: 'LEGAL_MOVE'
}

class Board {
    constructor() {
        this._LEFT_BANK = 0;
        this._RIGHT_BANK = 1;
        this._crossTheRiver = {
            [this._LEFT_BANK] : forward.bind(this),
            [this._RIGHT_BANK] : backward.bind(this)
        },
        this.reset();
    }

    reset() {
        this._leftBank = new Group(3, 3);
        this._rightBank = new Group(0, 0);
        this._boatPosition = this._LEFT_BANK;
        this._records = [this._record()];
    }

    _record() {
        // TODO por ahi se puede comparar directamente un objeto con props
        return hash([
            JSON.stringify(this._leftBank),
            JSON.stringify(this._rightBank),
            JSON.stringify(this._boatPosition)
        ]);
    }

    _move(passengers) {
        let FIRST_TRY_FLAG = true;
        this._crossTheRiver[this._boatPosition](passengers);

        if (!(this._leftBank.isValid() && this._rightBank.isValid())) {
            return results.ILLEGAL_MOVE;
        }

        if (passengers.isCapacityOver()) {
            return results.CAPACITY_OVER;
        }

        if(!(this._leftBank.isSafe() && this._rightBank.isSafe())) {
            return results.EATEN_BY_CANNIBALS;
        }
        
        if(!FIRST_TRY_FLAG && this._records.includes(this._record())) {
            FIRST_TRY_FLAG = false;
            return results.REPETITION;
        }

        if (this._leftBank.isEmpty()) {
            return results.GAME_CLEAR;
        }
       
        this._records.push(this._record())

        return results.LEGAL_MOVE;
    }

    moves(missionaries, cannibals) {
        if(missionaries.length !== cannibals.length) throw new Error('Missionares and cannibals length mismatch in move method');

        this.reset();
        let legalMoves = 0;
        let result;
        
        for (const el in missionaries) {
            result = this._move(new Group(missionaries[el], cannibals[el]));

            if (result !== results.LEGAL_MOVE) {
                if(result === results.GAME_CLEAR) legalMoves++;
                break;
            } 

            legalMoves ++;
        }

        return [result, legalMoves];
    }

    calculateFitness(missionaries, cannibals) {
        if(missionaries.length !== cannibals.length) throw new Error('Missionares and cannibals length mismatch in move method');

        this.reset();
        let legalMoves = 0;
        let result;
        
        for (const el in missionaries) {
            result = this._move(new Group(missionaries[el], cannibals[el]));

            if (result !== results.LEGAL_MOVE) {
                if(result === results.GAME_CLEAR) legalMoves++;
                break;
            } 

            legalMoves ++;
        }

        return { individualsRightBank: this._rightBank._getSize(), numberOfMovements: legalMoves, eatenByCannibals: result !== results.GAME_CLEAR };
    }
}

function forward(passengers) {
    this._leftBank = this._leftBank.rest(passengers);
    this._rightBank = this._rightBank.add(passengers);
    this._boatPosition = this._RIGHT_BANK;
}

function backward(passengers) {
    this._leftBank = this._leftBank.add(passengers);
    this._rightBank = this._rightBank.rest(passengers);
    this._boatPosition = this._LEFT_BANK;
}

module.exports = Board;

