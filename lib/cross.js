const _ = require('lodash');

module.exports = (population) => {
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
