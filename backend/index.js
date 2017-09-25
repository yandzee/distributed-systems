// Author: Renat Tuktarov (yandzeek@gmail.com)

const App = require('./app');
const logger = require('./logger')();

process.on('unhandledRejection', (reason, promise) => {
  promise.catch(err => {
    logger.debug(`Promise: ${promise}, reason: ${reason}`);
    logger.debug(err);
  })
});

App.run();
