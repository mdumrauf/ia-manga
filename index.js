
const population = {
    missionaries: 3,
    cannibals: 3,
};

const bankLeft = population;

const bankRight = {
    missionaries: 0,
    cannibals: 0,
};

function createPopulation() {
    const population = [];

    for (let i = 0; i < 10; i++) {    
        const elem = {
            individualsRightBank: 0,
            numberOfMovements: 0,
            eatenByCannibals: 0,
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
            const numberToMove = Math.random() >= 0.4 ? 2 : 1;

            const bankToDecrement = boatPosition === 1 ? bankLeft : bankRight;
            const bankToIncrement = boatPosition === 0 ? bankLeft : bankRight;

            if (Math.random() >= 0.5) {

                // Validate there are missionaries to move.
                if (bankToDecrement.missionaries >= 1) {
                    // Move missionaries
                    bankToDecrement.missionaries--;
                    bankToIncrement.missionaries++;

                    if (numberToMove === 2) {
                        if (Math.random() >= 0.5) {
                            // Validate there are missionaries to move.
                            if (bankToDecrement.missionaries >= 1) {
                                // Move missionaries
                                bankToDecrement.missionaries--;
                                bankToIncrement.missionaries++;
                            } else {
                                console.log('Try to move 2, but there are no more missionaries to move. Continue to next round.');
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
                            } else {
                                console.log('Tried to move 1 cannibal with 1 missionary, but there are no cannibals to move. Continue to next round.');
                                // Cancel the movement
                                bankToDecrement.missionaries++;
                                bankToIncrement.missionaries--;
                                // xor boatPosition to invalidate movement
                                boatPosition ^= 1;
                            }
                            
                        }
                    }
                } else {
                    console.log('Tried to move 1, but there are no missionaries to move. Continue to next round.');
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
                        if (Math.random() >= 0.5) {
                            // Validate there are missionaries to move.
                            if (bankToDecrement.missionaries >= 1) {
                                // Move missionaries
                                bankToDecrement.missionaries--;
                                bankToIncrement.missionaries++;
                            } else {
                                console.log('Tried to move 1 cannibal with 1 missionary, but there are no cannibals to move. Continue to next round.');
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
                            } else {
                                console.log('Try to move 2, but there are no more cannibals to move. Continue to next round.');
                                // Cancel the movement
                                bankToDecrement.cannibals++;
                                bankToIncrement.cannibals--;

                                // xor boatPosition to invalidate movement
                                boatPosition ^= 1;
                            }
                        }
                    }
                } else {
                    console.log('Tried to move 1, but there are no cannibals to move. Continue to next round.');
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

function select(population) {
    return population;
}

function cross(population) {
    return population;
}

function mutate(population) {
    return population;
}

/**
 * 
 * @param {Elem} elem individualsRightBank, numberOfMovements, eatenByCannibals (0, 1)
 * @returns 
 */
function applyFitness(elem) {
    return 50 * elem.individualsRightBank - 10 * elem.numberOfMovements - 100 * elem.eatenByCannibals;
}

function log(population, fitnessRate) {
    console.log({population, fitnessRate});
}

function main() {

    while (true/* criterio de paro */) {

        const population = createPopulation();

        const selectedPopulation = select(population);
        const mutatedPopulation = mutate(selectedPopulation);
        // cross

        for (let i = 0; i < population.length; i++) {
            const elem = population[i];
            const bestFitness = applyFitness(elem);
            log(elem, bestFitness);
        }
    }
}

main();
