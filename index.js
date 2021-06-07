const {
    createPopulation,
    select,
    mutate,
    cross,
} = require('./lib');

const { logMutate, logCross } = require('./lib/logger');

const INDIVIDUAL_SELECTION_RATE = 0.5;
const NUMBERS_TO_MOVE_RATE = 0.4;

const GENERATIONAL_JUMP = 0.75;

const MUTATION_PROBABILITY = 0.1;

const INITIAL_POPULATION_SIZE = 1000000;


function main() {
    let population = createPopulation(INITIAL_POPULATION_SIZE, INDIVIDUAL_SELECTION_RATE, NUMBERS_TO_MOVE_RATE);
    let iteration = 1;

    while (population.length > 0) {
        population = select(population, GENERATIONAL_JUMP);

        population = mutate(population, MUTATION_PROBABILITY);

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

    console.log('Finished!');
}

main();
