const winston = require('winston');
const { combine, timestamp, simple, colorize } = winston.format;

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        colorize({
            colors: {
                info: 'blue',
                debug: 'green',
                warn: 'yellow',
            }
        }),
        timestamp(),
        simple(),
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/server.log' }),
    ],
});


if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}


module.exports = function () {
    console.log = (...args) => logger.info.call(logger, ...args);
    console.info = (...args) => logger.info.call(logger, ...args);
    console.warn = (...args) => logger.warn.call(logger, ...args);
    console.error = (...args) => logger.error.call(logger, ...args);
    console.debug = (...args) => logger.debug.call(logger, ...args);
}