// Copyright 2017 Sourcerer, Inc. All Rights Reserved.
// Author: Renat Tuktarov (renat@sourcerer.io)

const App = require('./app');
const logger = require('./logger')();

process.on('unhandledRejection', (reason, promise) => {
  promise.catch(err => {
    logger.debug(`Promise: ${promise}, reason: ${reason}`);
    logger.debug(err);
  })
});

App.run();
