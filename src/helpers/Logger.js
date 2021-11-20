const winston = require('winston');

const logger = winston.createLogger();

if (process.env.NODE_ENV === 'prod') {
  logger.add(
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({
          format: 'MMM-DD-YYYY HH:mm:ss',
        }),
        winston.format.printf(
          (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`
        )
      ),
    })
  );
}
if (process.env.NODE_ENV === 'dev') {
  logger.add(
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({
          format: 'MMM-DD-YYYY HH:mm:ss',
        }),
        winston.format.printf(
          (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`
        )
      ),
    })
  );
}

module.exports = logger;
