const winston = require("winston");
const { combine, printf, timestamp, colorize } = winston.format;
const logFormat = printf(({ level, message, domain, timestamp }) => {
    return `${timestamp} [${domain}] ${level}: ${message}`
});

const WinstonLoggingLevels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3
};

const logger = winston.createLogger({
    transports: [new winston.transports.Console()],
    levels: WinstonLoggingLevels,
    format: combine(
        timestamp(),
        colorize({
            colors: {
                error: 'red',
                warn: 'yellow',
                info: 'blue',
                debug: 'grey',
            }
        }),
        logFormat
    )
});

exports.LogCategory = class {
    constructor(domain) {
        this._domain = domain;
    }

    error(message) {
        logger.log("error", message, {
            domain: this._domain
        });
    }

    warn(message) {
        logger.log("warn", message, {
            domain: this._domain
        });
    }

    info(message) {
        logger.log("info", message, {
            domain: this._domain
        });
    }

    debug(message) {
        logger.log("debug", message, {
            domain: this._domain
        });
    }
};
