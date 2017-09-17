// Author: Renat Tuktarov (yandzeek@gmail.com)

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const http = require('http');
const morgan = require('morgan');
const Router = express.Router;

const logger = require('./logger')();
const misc = require('./misc');

class ApiServer {
  constructor(app, cfg) {
    this.storage = app.storage;
    this.cfg = cfg;
    this.eapp = null;  // Express app.
  }

  async up() {
    this.eapp = express();
    this.middlewares();
    this.server = http.createServer(this.eapp);
    this.routes();
    this.errorCatcher();

    this.server.listen(this.cfg.port);
    logger.info(`server: listening at port ${this.cfg.port}`);

    return this;
  }

  async down() {
    await this.server.close();
  }

  routes() {
    this.routers().map(({ path, routerFn }) => {
      logger.debug(`server: setting up router for ${path}`);
      const router = new Router();
      routerFn(this, router);
      this.eapp.use(path, router);
    });
  }

  routers() {
    const tasksRouter = require('./routers/tasks');

    return [{
      path: '/tasks',
      routerFn: tasksRouter
    }];
  }

  middlewares() {
    const _cors = cors({
      origin: new RegExp('.*'),
      credentials: true
    });

    this.eapp.use(bodyParser.raw({
      type: 'application/octet-stream',
      inflate: false
    }));
    this.eapp.use(_cors);
    this.eapp.options('*', _cors);
    this.eapp.use(cookieParser());
  }

  errorCatcher() {
    this.eapp.use((err, req, res, next) => {
      logger.error('server: unhandled error: ', err);
      if (res.headersSent) {
        next(err);
      }
      const error = misc.prod ? 'Server Error' : 'Server Error' + err;
      return res.status(500).end(error);
    });
  }
}

module.exports = ApiServer;
