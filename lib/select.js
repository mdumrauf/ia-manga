const _ = require('lodash');

const Board = require('./entities/board');
const { log, logError, logSelect } = require('./logger')

/**
 * Calculates the fitness of a given element.
 *
 * @param {Elem} elem individualsRightBank, numberOfMovements, eatenByCannibals (0, 1)
 * @returns { apt, eatenByCannibals, individualsRightBank }
 */
function calculateFitness(elem) {
    const board = new Board();

    const { individualsRightBank, numberOfMovements, eatenByCannibals } = board.calculateFitness(elem.movementsMissionaries, elem.movementsCannibals);

    return { apt: 50 * individualsRightBank - 10 * numberOfMovements - 100 * eatenByCannibals, eatenByCannibals, individualsRightBank };
}

module.exports = (population, generationalJump = 0.95) => {
    const populationWithApt = _.map(population, (elem) => {
        const fitness = calculateFitness(elem)

        log(elem, fitness.apt);
        logSelect({
            m: elem.movementsMissionaries,
            c: elem.movementsCannibals, 
            eatenByCannibals: fitness.eatenByCannibals,
            apt: fitness.apt,
            individualsRightBank: fitness.individualsRightBank,
        })
        return { ...elem, apt: fitness.apt, eatenByCannibals: fitness.eatenByCannibals };
    });
    const orderedPopulation = _.orderBy(populationWithApt, 'apt', 'desc');
    
    const elementsToTake = Math.floor(orderedPopulation.length * generationalJump);
    
    return _.take(orderedPopulation, elementsToTake)
}
