function cross(population) {
    
		const child1 = [];
		const child2 = [];
	
	
	for (let i = 0; i < population.length; i +=2) {

		var breakPoint  = Math.floor(population[i].length/2);  //Breaks at the middle of the individual length
		
		var parent1 = population[i]
		if (population[i+1])
			var parent2 = population[i+1]
		
		
		for (let j = 0; j < population[i].length ; j++) {
			if ( breakPoint < j) {			
				child1.push(parent1[i][j])
				child2.push(population[i+1][j])
			}
			else {
				child1.push(parent1[i+1][j])
				child2.push(population[i][j])
			}
		}
		
		console.log("Iteracion Poblacion Mutada");
		console.log(child1);
		console.log(child2);
	}
	
    return child1,child2;
}

class Individual {
    m = [];
    c = [];

    constructor(m, c) {
        this.m = m;
        this.c = c;
    }
}

function main() {

		 const m1 = [1, 1, 0, 0, 2, 2, 2, 0, 0, 0, 0];
		 const c1 = [1, 0, 2, 1, 0, 0, 0, 1, 2, 1, 2];
		 const m2 = [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2];
		 const c2 = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1];
		 const m3 = [0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1];
		 const c3 = [2, 1, 0, 2, 1, 0, 2, 1, 0, 2, 1];
		 
		const population = [];
		
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

		
		population.push(m1,c1)
		population.push(m2,c2)
		population.push(m3,c3)
		

		
		console.log("Poblacion Original");
		console.log(populationExample);
		console.log(populationExample[0].length);
		console.log(populationExample[0][0]);
		
		var mutatedPopulation = []
		mutatedPopulation = cross(populationExample);
		
		console.log("Poblacion Mutada");
		console.log(mutatedPopulation);

}

main();