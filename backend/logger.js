// Author: Renat Tuktarov (yandzeek@gmail.com)

const winston = require('winston');

const loggerConfig = require('./config').logger;
const misc = require('./misc');

// TODO: multiple loggers required.
module.exports = function(localConfig = {}) {
  const Logger = winston.Logger;
  const { levels, colors } = Object.assign(loggerConfig, localConfig);
  const mode = misc.dev ? 'dev' : (misc.test ? 'test' : 'prod');

  const loggerCfg = loggerConfig[mode];
  const transports = [new (winston.transports.Console)(loggerCfg)];

  const logger = new Logger({ levels, colors, transports });
  logger.stream = {
    write: function(message, encoding){
      logger.info(message);
    }
  };

  return logger;
};
