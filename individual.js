class Individual {
    m = [];
    c = [];

    constructor(m, c) {
        this.m = m;
        this.c = c;
    }
}

var populationExample = [
    new Individual(
        [1, 1, 0, 0, 2, 1, 2, 0, 0, 0, 0],
        [1, 0, 2, 1, 0, 1, 0, 1, 2, 1, 2]),
    new Individual(
        [1, 1, 0, 0, 2, 1, 2, 0, 0, 0, 0],
        [1, 0, 2, 1, 0, 1, 0, 1, 2, 1, 2]),
    new Individual(
        [1, 1, 1, 0, 2, 1, 2, 0, 0, 0, 0],
        [1, 0, 1, 1, 0, 1, 0, 1, 2, 1, 2]),
    new Individual(
        [1, 1, 2, 0, 1, 1, 2, 1, 1, 0, 0],
        [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 2])
];


function runMutation(population) {
    let mutatedPopulation = [];

    population.forEach(individual => {

        mutatedPopulation.push(new Individual(
            individual.m.map(gen => mutate(gen)),
            individual.c.map(gen => mutate(gen))
        ));
    });
    return mutatedPopulation;
}


function mutate(gen) {
    mutationProbability = 0.05;
    if (Math.random() < mutationProbability)
        return Math.floor(Math.random() * 3);

    return gen;
}
console.log(runMutation(populationExample));
