const fs = require('fs');
const _ = require('lodash');

const Board = require('./entities/board');

const logFileDate = new Date().toISOString().replace(/T/, ' ').replace(/:/g, '-').replace(/\..+/, '').replace(' ', '_');

const LOG_ERRORS = false;
const LOG_INFO = false;

const INDIVIDUAL_SELECTION_RATE = 0.5;
const NUMBERS_TO_MOVE_RATE = 0.4;

const GENERATIONAL_JUMP = 0.95;

const MUTATION_PROBABILITY = 0.05;



function logInfo(text) {
    text.date = new Date().toISOString();
    LOG_INFO && fs.appendFileSync(`${logFileDate}-info.log`, JSON.stringify(text) + ',\n');
}

function logSelect(text) {
    fs.appendFileSync(`${logFileDate}-select.log`, JSON.stringify(text) + ',\n');
}

function logMutate(text) {
    fs.appendFileSync(`${logFileDate}-mutate.log`, JSON.stringify(text) + ',\n');
}

function logCross(text) {
    fs.appendFileSync(`${logFileDate}-cross.log`, JSON.stringify(text) + ',\n');
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

    for (let i = 0; i < 100000; i++) {
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

function select(population, generationalJump = 0.95) {
    const populationWithApt = _.map(population, (elem) => {
        const fitness = calculateFitness(elem)

        log(elem, fitness.apt);
        logSelect({
            m: elem.movementsMissionaries,
            c: elem.movementsCannibals, 
            eatenByCannibals: fitness.eatenByCannibals,
            apt: fitness.apt,
        })
        return { ...elem, apt: fitness.apt, eatenByCannibals: fitness.eatenByCannibals };
    });
    const orderedPopulation = _.orderBy(populationWithApt, 'apt', 'desc');
    
    const elementsToTake = Math.floor(orderedPopulation.length * generationalJump);
    
    return _.take(orderedPopulation, elementsToTake)
}

function cross(population) {
    const chunks = _.chunk(population, 2);
    const mappedChunkes = _.map(chunks, (chk) => {

        // Return same element for last chunk on odd arrays.
        if (chk.length !== 2) return chk;

        const elementsToTakeParentM1 = Math.floor(chk[0].movementsMissionaries.length * 0.5);
        const leftParentM1 = _.take(chk[0].movementsMissionaries, elementsToTakeParentM1);
        const rightParentM1 = _.takeRight(chk[0].movementsMissionaries, chk[0].movementsMissionaries.length - elementsToTakeParentM1);

        const elementsToTakeParentM2 = Math.floor(chk[1].movementsMissionaries.length * 0.5);
        const leftParentM2 = _.take(chk[1].movementsMissionaries, elementsToTakeParentM2);
        const rightParentM2 = _.takeRight(chk[1].movementsMissionaries, chk[1].movementsMissionaries.length - elementsToTakeParentM2);

        
        const childM1 = [ ...leftParentM1, ...rightParentM2 ];
        const childM2 = [ ...leftParentM2, ...rightParentM1 ];


        const elementsToTakeParentC1 = Math.floor(chk[0].movementsCannibals.length * 0.5);
        const leftParentC1 = _.take(chk[0].movementsCannibals, elementsToTakeParentC1);
        const rightParentC1 = _.takeRight(chk[0].movementsCannibals, chk[0].movementsCannibals.length - elementsToTakeParentC1);

        const elementsToTakeParentC2 = Math.floor(chk[1].movementsCannibals.length * 0.5);
        const leftParentC2 = _.take(chk[1].movementsCannibals, elementsToTakeParentC2);
        const rightParentC2 = _.takeRight(chk[1].movementsCannibals, chk[1].movementsCannibals.length - elementsToTakeParentC2);

        
        const childC1 = [ ...leftParentC1, ...rightParentC2 ];
        const childC2 = [ ...leftParentC2, ...rightParentC1 ];

        
        return [{ movementsMissionaries: childM1, movementsCannibals: childC1 }, { movementsMissionaries: childM2, movementsCannibals: childC2 }];
    });
    return _.flatten(mappedChunkes);
}

function mutateElement(gen) {
    if (Math.random() < MUTATION_PROBABILITY) return Math.floor(Math.random() * 3);

    return gen;
}

function mutate(population) {
    return _.map(population, (elem) => ({
        movementsMissionaries: _.map(elem.movementsMissionaries, (m) => mutateElement(m)),
        movementsCannibals: _.map(elem.movementsCannibals, (c) => mutateElement(c)),
    }));
}

/**
 * 
 * @param {Elem} elem individualsRightBank, numberOfMovements, eatenByCannibals (0, 1)
 * @returns 
 */
function calculateFitness(elem) {
    const board = new Board();

    const { individualsRightBank, numberOfMovements, eatenByCannibals } = board.calculateFitness(elem.movementsMissionaries, elem.movementsCannibals);

    return { apt: 50 * individualsRightBank - 10 * numberOfMovements - 100 * eatenByCannibals, eatenByCannibals };
}

function log(population, fitnessRate) {
    logInfo({population, fitnessRate});
}

function main() {

    let population = createPopulation();
    let iteration = 1;

    while (population.length > 0) {

        //     if (elem.eatenByCannibals === 0) {
        //         console.log('I WON, BITCHES!', elem);
        //     }
        // }

        population = select(population, GENERATIONAL_JUMP);

        population = mutate(population);

        population.forEach(elem1 => logMutate({
            m: elem1.movementsMissionaries,
            c: elem1.movementsCannibals,
        }));

        population = cross(population);

        population.forEach(elem2 => logCross({
            m: elem2.movementsMissionaries,
            c: elem2.movementsCannibals,
        }));

        ++iteration;

        console.log(`Iteration: ${iteration} with length: ${population.length}`);
    }

    console.log('Chau guachin');
}

main();
