const fs = require('fs');
const logFileDate = new Date().toISOString().replace(/T/, ' ').replace(/:/g, '-').replace(/\..+/, '').replace(' ', '_');

const LOG_ERRORS = false;
const LOG_INFO = false;

const INDIVIDUAL_SELECTION_RATE = 0.5;
const NUMBERS_TO_MOVE_RATE = 0.4;

CONST GENERATIONAL_JUMP = 0.5;


function logInfo(text) {
    text.date = new Date().toISOString();
    LOG_INFO && fs.appendFileSync(`${logFileDate}-info.log`, JSON.stringify(text) + ',\n');
}

function logIndividual(text) {
    fs.appendFileSync(`${logFileDate}-individual.log`, JSON.stringify(text) + ',\n');
}

function logError(text) {
    text.date = new Date().toISOString();
    LOG_ERRORS && fs.appendFileSync(`${logFileDate}-error.log`, JSON.stringify(text) + ',\n');
}

/**
 * ERRORS
 * 42: Tried to move 2, but there are no more missionaries to move. Continue to next round.
 * 43: Tried to move 1 cannibal with 1 missionary, but there are no cannibals to move. Continue to next round.
 * 44: Tried to move 1, but there are no missionaries to move. Continue to next round.
 * 45: Tried to move 2, but there are no more cannibals to move. Continue to next round.
 * 46: Tried to move 1, but there are no cannibals to move. Continue to next round.
 */

function createPopulation() {
    const population = [];

    for (let i = 0; i < 1000; i++) {
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
            const numberToMove = Math.random() >= NUMBERS_TO_MOVE_RATE ? 2 : 1;

            const bankToDecrement = boatPosition === 1 ? bankLeft : bankRight;
            const bankToIncrement = boatPosition === 0 ? bankLeft : bankRight;

            if (Math.random() >= INDIVIDUAL_SELECTION_RATE) {

                // Validate there are missionaries to move.
                if (bankToDecrement.missionaries >= 1) {
                    // Move missionaries
                    bankToDecrement.missionaries--;
                    bankToIncrement.missionaries++;

                    if (numberToMove === 2) {
                        if (Math.random() >= INDIVIDUAL_SELECTION_RATE) {
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
                        if (Math.random() >= INDIVIDUAL_SELECTION_RATE) {
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

function select(population, generationalJump = 0.5) {
    const populationWithApt = _.map(population, (elem) => {
        const apt = calculateFitness(elem)
        log(elem, bestFitness);
        logIndividual({
            m: elem.movementsMissionaries,
            c: elem.movementsCannibals, 
            eatenByCannibals: elem.eatenByCannibals,
            apt,
        })
        return { ...elem, apt };
    });
    const orderedPopulation = _.orderBy(populationWithApt, 'apt', 'desc');
    
    const elementsToTake = orderedPopulation.length * generationalJump;
    
    return _.take(orderedPopulation, elementsToTake)
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
function calculateFitness(elem) {
    return 50 * elem.individualsRightBank - 10 * elem.numberOfMovements - 100 * elem.eatenByCannibals;
}

function log(population, fitnessRate) {
    logInfo({population, fitnessRate});
}

function main() {

    let population = createPopulation();

    while (true/* criterio de paro */) {

        //     if (elem.eatenByCannibals === 0) {
        //         console.log('I WON, BITCHES!', elem);
        //     }
        // }

        population = select(population, GENERATIONAL_JUMP);

        population = mutate(population);

        population = cross(population);
    }
}

main();
