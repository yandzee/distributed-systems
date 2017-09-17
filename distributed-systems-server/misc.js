// Author: Renat Tuktarov (yandzeek@gmail.com)

const path = require('path');

const env = (process.env.ENV || '').toLowerCase();
const dev = env.search('dev') > -1;
const prod = env.search('prod') > -1;
const test = env.search('test') > -1;

const functions = {
  path: function(...parts) {
    return path.join(__dirname, ...parts);
  }
};

module.exports = Object.assign({
  prod, dev, test
}, functions);
