// Author: Renat Tuktarov (yandzeek@gmail.com)

const ApiServer = require('./server');
const config    = require('./config');
const logger    = require('./logger')();
const misc      = require('./misc');
const Storage   = require('./storage');
const mode = misc.dev ? 'dev' : (misc.test ? 'test' : 'prod');

class App {
  constructor() {
    this.config  = config;

    this.server = null; // commit server
    this.storage = null; // db operation storage

    this.models = {}; // { database: …, protobuf: … }
  }

  async up() {
    const dev = misc.dev || misc.test;
    const dbConfig = dev ? config.storage.test : config.storage.prod;
    try {
      this.storage = await this.setupStorage(dbConfig);
      this.server  = await this.setupApiServer(this.config.server);
    } catch(e) {
      this.exit(e);
    }

    logger.info('Running in %s mode', mode);
  }

  async down() {
    await this.server.down();
  }

  async setupStorage(cfg) {
    logger.info('setting up storage...');
    const storage = new Storage(this, cfg);
    return await storage.up();
  }

  async setupApiServer(cfg) {
    logger.info('setting up server...');
    const server = new ApiServer(this, cfg);
    return await server.up();
  }

  exit(msg) {
    logger.error(msg);
    process.exit(1);
  }

  static run() {
    const app = new App();
    app.up();
  }
}

module.exports = App;
