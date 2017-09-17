// Copyright 2017 Sourcerer, Inc. All Rights Reserved.
// Author: Renat Tuktarov (renat@sourcerer.io)

const { Client } = require('pg');
const config = require('../config').db.dev;

class Database {
  constructor(storage) {
    this.storage = storage;
    this.client = new Client({
      host: config.host,
      user: config.username,
      password: config.password,
      database: config.name
    });
  }

  async fill() {
    const users = [
      ['user1', 'pwd1'],
      ['user2', 'pwd2'],
      ['user3', 'pwd3'],
      ['user4', 'pwd4']
    ];
    const sqlPart = users
      .map(([user, pwd]) => [user, this.storage.hash(pwd)])
      .map(([user, pwdHash]) => `('${user}', '${pwdHash}', now(), now())`)
      .join(', ');
    const insertUsersSql =
      `insert into users (username, password, created_at, updated_at) values
      ${sqlPart}`;
    await this.client.query(insertUsersSql);
  }

  async clear() {
    await this.client.query('delete from users');
  }

  async up() {
    await this.client.connect();
  }

  async getUserAndHisEmail({ username, email }) {
    const user = await this.client.query(`select * from users where
      username = '${username}'
    `);
    const _email = await this.client.query(`select * from user_emails where
      email = '${email}'
    `);

    return [user.rows[0], _email.rows[0]];
  }
}

module.exports = Database;
