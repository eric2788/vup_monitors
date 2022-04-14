const winston = require('winston');
const { combine, timestamp, simple, colorize, json } = winston.format;

const logger = winston.createLogger({
    level: 'info',
    format: timestamp(),
    transports: [
        new winston.transports.Console({
            format: combine(
                colorize(),
                simple(),
            )
        }),
        new winston.transports.File({ format: json(), filename: 'logs/error.log', level: 'error', encoding: 'utf-8' }),
        new winston.transports.File({ format: json(), filename: 'logs/server.log', encoding: 'utf-8' }),
    ],
});


module.exports = function () {
    console.log = (...args) => logger.info.call(logger, ...args);
    console.info = (...args) => logger.info.call(logger, ...args);
    console.warn = (...args) => logger.warn.call(logger, ...args);
    console.error = (...args) => logger.error.call(logger, ...args);
    console.debug = (...args) => logger.debug.call(logger, ...args);
}