class Group {
    constructor(missionaries, cannibals) {
        this.reset(missionaries, cannibals);
    }

    reset(missionaries, cannibals) {
        this.missionaries = missionaries;
        this.cannibals = cannibals;
    }

    _getSize() {
        return this.missionaries + this.cannibals;
    }

    add(other) {
        if (other.constructor.name === 'Group') {
            return new Group(this.missionaries + other.missionaries, this.cannibals + other.cannibals);
        }
    }

    rest(other) {
        if (other.constructor.name === 'Group') {
            return new Group(this.missionaries - other.missionaries, this.cannibals - other.cannibals);
        }
    }

    isValid() {
        return (0 <= this.missionaries) && (this.missionaries <= 3)  && (0 <= this.cannibals) && (this.cannibals <= 3);
    }

    isCapacityOver() {
        return  !((1 <= (this.missionaries + this.cannibals)) &&  ((this.missionaries + this.cannibals)<= 2));
    }

    isSafe() {
        return this.missionaries == 0 || this.missionaries >= this.cannibals;
    }

    isEmpty() {
        return this.missionaries === this.cannibals && this.cannibals === 0;
    }
}

module.exports = Group;