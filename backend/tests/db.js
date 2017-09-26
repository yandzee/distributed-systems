// Author: Renat Tuktarov (yandzeek@gmail.com)

const { Client } = require('pg');
const config = require('../config').storage.test;

class Database {
  constructor(storage) {
    this.storage = storage;
    this.client = new Client(this.connectionConfig);
  }

  get connectionConfig() {
    if (process.env.DATABASE_URL) {
      return {
        connectionString: process.env.DATABASE_URL
      };
    } else return {
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database
    }
  }

  async setupTables() {
    await this.client.query(`create table if not exists tasks (
      id serial primary key,
      label varchar,
      done boolean
    )`);
  }

  async fill() {
    const tasks = [
      ['Task 1', 'f'],
      ['Task 2', 't'],
      ['Task 3', 'f'],
      ['Task 4', 't']
    ];
    const sqlPart = tasks.map(pair => `('${pair[0]}', '${pair[1]}')`)
      .join(', ');
    const insertUsersSql = `insert into tasks (label, done) values ${sqlPart}`;
    await this.client.query(insertUsersSql);
  }

  async clear() {
    await this.client.query('delete from tasks');
    await this.client.query('alter sequence tasks_id_seq restart 1');
  }

  async up() {
    await this.client.connect();
    await this.setupTables();
  }

  async down() {
    await this.client.end();
  }
}

module.exports = Database;
