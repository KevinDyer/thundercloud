(() => {
  'use strict';

  const winston = require('winston');

  const logger = winston.createLogger({
    transports: [
      new winston.transports.Console({colorize: true, timestamp: true}),
    ],
  });

  module.exports = logger;
})();
