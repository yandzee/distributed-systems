// Copyright 2017 Sourcerer, Inc. All Rights Reserved.
// Author: Renat Tuktarov (renat@sourcerer.io)

const chai = require('chai');
const chaiHttp = require('chai-http');
const responses = require('../routers/responses');
const Database = require('./db');
const protobufed = require('./protobufed');

chai.should();
chai.use(chaiHttp);

const App = require('../app');

describe('POST /auth', function() {
  before(async function() {
    const app = new App();
    await app.up()
    this.app = app;

    const db = new Database(app.storage);
    await db.up();
    this.db = db;

    await protobufed.prepare();
  });

  after(async function() {
    return await this.app.down();
  });

  beforeEach(async function() {
    return await this.db.fill();
  });

  afterEach(async function() {
    return await this.db.clear();
  });

  it('should register a new beta user', async function() {
    const faceServer = this.app.server.eapp;
    const { UserEmail } = this.app.storage.schemes;
    const { RegistrationData } = this.app.server.protobuf;
    const successRegResp = responses.auth.successfullyRegistered;

    const newUserData = {
      username: 'ydz',
      password: 'awesomepassword',
      email: 'renat@sourcerer.io',
      betaCode: this.app.server.cfg.betaCode
    };
    const newUser = protobufed.registrationData(newUserData);
    const pwdHash = 'ad62252f71a484702b74f379ea3c3388ac8c147ef65a7d4f50bfa06d6d9aaf8b';

    const res = await chai.request(faceServer)
      .post('/auth/register')
      .set('content-type', 'application/octet-stream')
      .buffer()
      .parse(protobufed.utils.binaryParser)
      .send(newUser);
    const parsedResponse = protobufed.parseResult(res.body);

    res.should.have.status(200);
    res.should.have.header('content-type', 'application/octet-stream')

    parsedResponse.code.should.equal(successRegResp.code);
    parsedResponse.message.should.equal(successRegResp.message);

    const [user, email] = await this.db.getUserAndHisEmail(newUserData);
    user.username.should.equal(newUserData.username);
    user.password.should.equal(pwdHash);

    email.email.should.equal(newUserData.email);
    email.verified.should.equal(UserEmail.notVerified);
  });

  it('should fail register due to existence of user', async function() {
    const faceServer = this.app.server.eapp;
    const { UserEmail } = this.app.storage.schemes;
    const { RegistrationData } = this.app.server.protobuf;
    const userExists = responses.auth.userAlreadyExists;

    const newUserData = {
      username: 'user1',
      password: 'pwd1',
      email: 'renat@sourcerer.io',
      betaCode: this.app.server.cfg.betaCode
    };
    const newUser = protobufed.registrationData(newUserData);

    const res = await chai.request(faceServer)
      .post('/auth/register')
      .set('content-type', 'application/octet-stream')
      .buffer()
      .parse(protobufed.utils.binaryParser)
      .send(newUser);
    const parsedResponse = protobufed.parseResult(res.body);

    res.should.have.status(200);
    parsedResponse.code.should.equal(userExists.code);
    parsedResponse.message.should.equal(userExists.message);
  });

  it('should fail register due to invalid beta code', async function() {
    const faceServer = this.app.server.eapp;
    const { UserEmail } = this.app.storage.schemes;
    const { RegistrationData } = this.app.server.protobuf;
    const invalidBetaCode = responses.auth.invalidBetaCode;

    const newUserData = {
      username: 'user1',
      password: 'pwd1',
      email: 'renat@sourcerer.io',
      betaCode: this.app.server.cfg.betaCode + 'FORGERY'
    };
    const newUser = protobufed.registrationData(newUserData);

    const res = await chai.request(faceServer)
      .post('/auth/register')
      .set('content-type', 'application/octet-stream')
      .buffer()
      .parse(protobufed.utils.binaryParser)
      .send(newUser);
    const parsedResponse = protobufed.parseResult(res.body);

    res.should.have.status(200);
    parsedResponse.code.should.equal(invalidBetaCode.code);
    parsedResponse.message.should.equal(invalidBetaCode.message);
  });

  it('should succesfully log in', async function() {
    const faceServer = this.app.server.eapp;

    const authHeader = 'Basic ' + Buffer.from('user1:pwd1').toString('base64');
    const res = await chai.request(faceServer).post('/auth')
      .set('Authorization', authHeader);
    res.should.have.status(200);
    res.should.have.cookie('Token');
  });

  it('should fail log in due to unexistence of user', async function() {
    const faceServer = this.app.server.eapp;
    const storage = this.app.storage;
    const { UserEmail } = storage.schemes;

    const authHeader = 'Basic ' + Buffer.from('WRONG').toString('base64');
    const res = await chai.request(faceServer)
      .post('/auth')
      .set('Authorization', authHeader);

    res.should.have.status(200);
    res.should.not.have.cookie('Token');
  });
});
