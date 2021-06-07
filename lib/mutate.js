const _ = require('lodash');

function mutateElement(gen, probability) {
    if (Math.random() < probability) return Math.floor(Math.random() * 3);

    return gen;
}

module.exports = (population, probability) => {
    return _.map(population, (elem) => ({
        movementsMissionaries: _.map(elem.movementsMissionaries, (m) => mutateElement(m, probability)),
        movementsCannibals: _.map(elem.movementsCannibals, (c) => mutateElement(c, probability)),
    }));
};
