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
    return this;
  }

  async setupDatabase() {
    this.db = knex({
      client: 'pg',
      connection: process.env.DATABASE_URL || this.cfg,
      debug: misc.dev,
      pool: { min: 0, max: 100 }
    });
  }

  async setupSchemes() {
    await this.setupTaskTable();
  }

  async setupTaskTable() {
    const schema = this.db.schema.withSchema('public');
    misc.dev && await schema.dropTableIfExists('tasks');
    await schema.createTableIfNotExists('tasks', table => {
      table.increments();
      table.string('label');
      table.boolean('done');
    });
  }

  // Operations on base
  async invertTaskStatus(taskId) {
    const idLimit = 2**31 - 1;
    if (taskId > idLimit) return -1;
    const raw = this.db.raw;
    return await this.db('tasks')
      .where({ id: taskId })
      .update('done', raw('not "tasks".done'));
  }

  async getTasks() {
    return await this.db('tasks');
  }

  async createTask(label) {
    return await this.db('tasks').insert({
      done: false,
      label
    }, 'id');
  }

  async deleteTask(taskId) {
    return await this.db('tasks').where({
      id: taskId
    }).delete();
  }
}

module.exports = Storage;
