// Author: Renat Tuktarov (yandzeek@gmail.com)

const logger = require('../logger')();
const responses = require('./responses');

module.exports = (server, router) => {
  const { emptyData } = responses;

  router.post('/', async (req, res) => {
    res.end();
  });

  return router;
};
