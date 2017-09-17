// Author: Renat Tuktarov (yandzeek@gmail.com)

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const knex = require('knex');

const logger = require('./logger')();
const misc = require('./misc');

class Storage {
  constructor(app, cfg) {
    this.app = app;
    this.cfg = cfg;

    this.db = null;
  }

  async up() {
    this.setupDatabase();
    this.setupSchemes();
    // await this.sanitizeDatabases();
    return this;
  }

  async setupDatabase() {
    this.db = knex({
      client: 'pg',
      connection: this.cfg,
      debug: misc.dev,
      pool: { min: 0, max: 100 }
    });
  }

  async setupSchemes() {
    const schema = this.db.schema.withSchema('public');
    await schema.dropTableIfExists('tasks');
    await schema.createTableIfNotExists('tasks', table => {
      table.increments();
      table.string('label');
      table.boolean('done');
      table.timestamps();
    });
  }
}

module.exports = Storage;
