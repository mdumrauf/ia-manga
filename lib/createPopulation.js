const { logError } = require('./logger')

/**
 * ERRORS
 * 42: Tried to move 2, but there are no more missionaries to move. Continue to next round.
 * 43: Tried to move 1 cannibal with 1 missionary, but there are no cannibals to move. Continue to next round.
 * 44: Tried to move 1, but there are no missionaries to move. Continue to next round.
 * 45: Tried to move 2, but there are no more cannibals to move. Continue to next round.
 * 46: Tried to move 1, but there are no cannibals to move. Continue to next round.
 */

module.exports = (populationSize, individualsMoveRate, individualsSelectionRate) => {
    const population = [];

    for (let i = 0; i < populationSize; i++) {
        const elem = {
            individualsRightBank: 0,
            numberOfMovements: 0,
            eatenByCannibals: 0,
            movementsMissionaries: [],
            movementsCannibals: [],
        };

        let boatPosition = 1; // 1: left-to-right, 0: right-to-left

        const bankLeft = {
            missionaries: 3,
            cannibals: 3,
        };

        const bankRight = {
            missionaries: 0,
            cannibals: 0,
        };

        while (elem.eatenByCannibals === 0 && elem.individualsRightBank <= 6) {
            // Calculate number of individuals to move based on probability
            const numberToMove = Math.random() >= individualsMoveRate ? 2 : 1;

            const bankToDecrement = boatPosition === 1 ? bankLeft : bankRight;
            const bankToIncrement = boatPosition === 0 ? bankLeft : bankRight;

            if (Math.random() >= individualsSelectionRate) {

                // Validate there are missionaries to move.
                if (bankToDecrement.missionaries >= 1) {
                    // Move missionaries
                    bankToDecrement.missionaries--;
                    bankToIncrement.missionaries++;

                    if (numberToMove === 2) {
                        if (Math.random() >= individualsSelectionRate) {
                            // Validate there are missionaries to move.
                            if (bankToDecrement.missionaries >= 1) {
                                // Move missionaries
                                bankToDecrement.missionaries--;
                                bankToIncrement.missionaries++;

                                elem.movementsMissionaries.push(2);
                                elem.movementsCannibals.push(0);
                            } else {
                                logError({ error: 42,
                                    population, elem, boatPosition, bankLeft, bankRight});
                                // Cancel the movement
                                bankToDecrement.missionaries++;
                                bankToIncrement.missionaries--;
                                // xor boatPosition to invalidate movement
                                boatPosition ^= 1;
                            }

                        } else {
                            // Validate there are cannibals to move.
                            if (bankToDecrement.cannibals >= 1) {
                                // Move cannibals
                                bankToDecrement.cannibals--;
                                bankToIncrement.cannibals++;

                                elem.movementsMissionaries.push(1);
                                elem.movementsCannibals.push(1);
                            } else {
                                logError({ error: 43,
                                    population, elem, boatPosition, bankLeft, bankRight});
                                // Cancel the movement
                                bankToDecrement.missionaries++;
                                bankToIncrement.missionaries--;
                                // xor boatPosition to invalidate movement
                                boatPosition ^= 1;
                            }
                            
                        }
                    } else {
                        elem.movementsMissionaries.push(1);
                        elem.movementsCannibals.push(0);
                    }
                } else {
                    logError({ error: 44,
                        population, elem, boatPosition, bankLeft, bankRight});
                    // xor boatPosition to invalidate movement
                    boatPosition ^= 1;
                }
                
            } else {
                // Validate there are cannibals to move.
                if (bankToDecrement.cannibals >= 1) {
                    // Move cannibals
                    bankToDecrement.cannibals--;
                    bankToIncrement.cannibals++;                
        
                    if (numberToMove === 2) {
                        if (Math.random() >= individualsSelectionRate) {
                            // Validate there are missionaries to move.
                            if (bankToDecrement.missionaries >= 1) {
                                // Move missionaries
                                bankToDecrement.missionaries--;
                                bankToIncrement.missionaries++;

                                elem.movementsMissionaries.push(1);
                                elem.movementsCannibals.push(1);
                            } else {
                                logError({ error: 43,
                                    population, elem, boatPosition, bankLeft, bankRight});
                                // Cancel the movement
                                bankToDecrement.cannibals++;
                                bankToIncrement.cannibals--;

                                // xor boatPosition to invalidate movement
                                boatPosition ^= 1;
                            }
                        } else {
                            // Validate there are cannibals to move.
                            if (bankToDecrement.cannibals >= 1) {
                                // Move cannibals
                                bankToDecrement.cannibals--;
                                bankToIncrement.cannibals++;

                                elem.movementsMissionaries.push(1);
                                elem.movementsCannibals.push(1);
                            } else {
                                logError({ error: 45,
                                    population, elem, boatPosition, bankLeft, bankRight});
                                // Cancel the movement
                                bankToDecrement.cannibals++;
                                bankToIncrement.cannibals--;

                                // xor boatPosition to invalidate movement
                                boatPosition ^= 1;
                            }
                        }
                    } else {
                        elem.movementsMissionaries.push(0);
                        elem.movementsCannibals.push(1);
                    }
                } else {
                    logError({ error: 46,
                        population, elem, boatPosition, bankLeft, bankRight });
                    // xor boatPosition to invalidate movement
                    boatPosition ^= 1;
                }

            }
            // I WANT TO MOVE IT MOVE IT! YOU LIKE IT? MOVE IT! (THE BOAT)
            boatPosition ^= 1;
    
            // Compute population
            elem.numberOfMovements++;
            elem.individualsRightBank = (bankRight.missionaries + bankRight.cannibals);
    
            if (bankRight.cannibals > bankRight.missionaries || bankLeft.cannibals > bankLeft.bankLeft) {
                elem.eatenByCannibals = 1;
            }
        
        }
    
        population.push(elem);
    }
    return population;
}
