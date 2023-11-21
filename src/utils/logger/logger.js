const winston = require('winston');
const { combine, timestamp, printf, colorize } = winston.format;
const myFormat = printf(({ level, message, timestamp }) => {
  const formattedMessage = message instanceof Object ? JSON.stringify(message, null, 2) : message;
  return `${timestamp} ${level}: ${formattedMessage}`;
});
const customLevelsOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    test: 5,
    debug: 6,
  },
  colors: {
    fatal: 'red',
    error: 'red',
    warn: 'yellow',
    info: 'blue',
    http: 'green',
    test: 'green',
    debug: 'purple',
  },
};
winston.addColors(customLevelsOptions.colors);

const createCustomLogger = (level) => {
  return winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
      new winston.transports.Console({
        level,
        format: combine(colorize(), timestamp({ format: 'HH:mm:ss' }), myFormat),
      }),
    ],
  });
};
const createProdLogger = (level) => {
  return winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
      new winston.transports.Console({
        level,
        format: combine(colorize(), timestamp({ format: 'HH:mm:ss' }), myFormat),
      }),
      new winston.transports.File({
        filename: './errors.log',
        level: 'error',
        format: combine(timestamp({ format: 'HH:mm:ss' }), myFormat),
      }),
    ],
  });
};
const devLogger = createCustomLogger('debug');
const stageLogger = createCustomLogger('http');
const prodLogger = createProdLogger('info');

module.exports = { devLogger, stageLogger, prodLogger };
