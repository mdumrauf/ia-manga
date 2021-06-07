# Inteligencia Artificial - TP2
Algoritmo Genético aplicado a la solución del problema de misioneros y caníbales.

## Integrantes Grupo 11

- Araujo, Franco: fraraujo@frba.utn.edu.ar
- De Beruti, Nicolás Alejandro: dberuti@frba.utn.edu.ar
- Dumrauf, Matías Alejandro: mdumrauf@frba.utn.edu.ar
- Nielsen, Kevin: nielsenkev@frba.utn.edu.ar
- Tesolin, Julián Augusto: jtesolin@frba.utn.edu.ar
- Vazquez, Rodrigo: rvazquez@frba.utn.edu.ar

## Descripción del problema
El problema consta de la situación en la cual tres misioneros y tres caníbales tienen que cruzar un río con una balsa que solo puede llevar como máximo dos personas por vez. 

Si quedan más caníbales que misioneros presentes en cualquiera de los costados del río, los caníbales se comerían a los misioneros. La balsa no puede cruzar por el río sin personas a bordo, ni tampoco puede cruzar con más caníbales que misioneros.

## Setup
Se requiere la utilización de node.js 10 o superior: https://nodejs.org/.

Para preparar la ejecución:
1. Instalar dependencias: `npm ci`
2. Ejecutar solución: `npm start`

## Parámetros de configuración
Se disponen de los siguientes parámetros que permiten alterar el output de la solución:

1. `INDIVIDUAL_SELECTION_RATE`: ratio utilizado en la generación de población inicial para definir si el primer individuo es Misionero o Canibal. Valores: (0..1). Extremos exclusive, admite flotantes.
2. `NUMBERS_TO_MOVE_RATE`: ratio utilizado para decidir la cantidad de individuos a trasladar en la balsa. Valores: (0..1). Extremos exclusive, admite flotantes.
3. `GENERATIONAL_JUMP`: porcentaje de corte utilizado en el algoritmo selección. A mayor porcentaje, menor será la población descartada. Valores: (0..1). Extremos exclusive, admite flotantes.
4. `MUTATION_PROBABILITY`: probabilidad de mutación del gen. Valores: (0..1). Extremos exclusive, admite flotantes.
5. `INITIAL_POPULATION_SIZE`: tamaño de la población inicial a generarse de manera aleatoria. Valores mayores a 1.

## Generación de csvs

Los log files tienen formato pseudo-json. Para poder procesarlos, agregarles un corchete al inicio y al final (salvando la coma del último elemento). TODO: agregar lógica para no requerir ese paso manual. Para facilitar el proceso, renombramos los "YYYY-MM-DD_HH-mm-ss-select.log" a "N.json", donde "N" es el número de corrida.

Luego ejecutar según sea necesario lo siguiente:
```bash
NODE_OPTIONS="--max-old-space-size=8192" node # Aumentar el heap size

> const fs = require('fs');
> const arr = require('./1')
> fs.appendFileSync('1.csv', 'apt,\n')
> for (let i = 0; i < foo.length; i++) fs.appendFileSync('1.csv', `${arr[i].apt}\n`)
>
(To exit, press ^C again or type .exit)
>
```