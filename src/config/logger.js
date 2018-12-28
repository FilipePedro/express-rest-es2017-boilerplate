const path = require('path');
const { format, createLogger, transports } = require('winston');

/*
 * - Console logger transport
 */
const console = new transports.Console({
  format: format.simple(),
  humanReadableUnhandledException: true,
});

/*
 * - Write to all logs with level `info` and below to `combined.log`
 * - Write all logs error (and below) to `error.log`.
 */
const files = [
  new transports.File({
    level: 'error',
    filename: path.join(__dirname, '../../logs/error.log'),
    handleExceptions: true,
    tailable: true,
    json: true,
    maxsize: 5242880, // 5MB
    zippedArchive: true,
    maxFiles: 5,
    colorize: false,
  }),
  new transports.File({
    // level: info (default)
    filename: path.join(__dirname, '../../logs/combined.log'),
    handleExceptions: true,
    tailable: true,
    json: true,
    maxsize: 5242880, // 5MB
    zippedArchive: true,
    maxFiles: 5,
    colorize: false,
  }),
];


const logger = createLogger({
  level: 'info',
  format: format.json(),
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') logger.add(console);

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV === 'production') logger.add(files);

logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

module.exports = logger;
