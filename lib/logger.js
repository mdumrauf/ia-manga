const fs = require('fs');

const LOG_ERRORS = false;
const LOG_INFO = false;

const logFileDate = new Date().toISOString().replace(/T/, ' ').replace(/:/g, '-').replace(/\..+/, '').replace(' ', '_');

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

function log(population, fitnessRate) {
    logInfo({population, fitnessRate});
}

module.exports = {
    logInfo,
    logSelect,
    logMutate,
    logCross,
    logError,
    log,
};
