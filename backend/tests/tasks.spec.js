// Author: Renat Tuktarov (yandzeek@gmail.com)

const chai = require('chai');
const chaiHttp = require('chai-http');
const responses = require('../shared/responses');
const binaryParser = require('./binary-parser');
const pb = require('../../shared/pb');
const Database = require('./db');

chai.should();
chai.use(chaiHttp);

const App = require('../app');

describe('/tasks endpoint', function() {
  before(async function() {
    const app = new App();
    const db = new Database();

    this.app = app;
    this.db = db;

    await app.up()
    await db.up();
    await db.clear();
  });

  after(async function() {
    await this.app.down();
    await this.db.down();
  });

  beforeEach(async function() {
    await this.db.fill();
  });

  afterEach(async function() {
    await this.db.clear();
  });

  it('should get initial list of tasks', async function() {
    const faceServer = this.app.server.eapp;

    const res = await chai.request(faceServer)
      .get('/tasks')
      .set('content-type', 'application/octet-stream')
      .buffer()
      .parse(binaryParser)
      .send();
    const parsedResponse = pb.parse(res.body).to('Tasks');

    res.should.have.status(200);
    res.should.have.header('content-type', 'application/octet-stream');
    parsedResponse.tasks.should.have.length(4);
  });

  it('should create new task with undone status', async function() {
    const faceServer = this.app.server.eapp;

    const newTask = pb.make('Task').from({
      label: 'TEST TASK',
      done: 0
    });
    const res = await chai.request(faceServer)
      .post('/tasks')
      .set('content-type', 'application/octet-stream')
      .buffer()
      .parse(binaryParser)
      .send(newTask);

    const parsedResponse = pb.parse(res.body).to('TaskResult');
    res.should.have.status(200);
    res.should.have.header('content-type', 'application/octet-stream');
    parsedResponse.result.code.should.equal(responses.taskCreated.code);
    parsedResponse.result.message.should.equal(responses.taskCreated.message);
    parsedResponse.task.label.should.equal('TEST TASK');
    parsedResponse.task.done.should.equal(0);
  });

  it('should successfully update status of first test task', async function() {
    const faceServer = this.app.server.eapp;

    const taskToToggle = pb.make('Task').from({ id: 1 });
    const res = await chai.request(faceServer)
      .put('/tasks')
      .set('content-type', 'application/octet-stream')
      .buffer()
      .parse(binaryParser)
      .send(taskToToggle);

    const parsedResponse = pb.parse(res.body).to('TaskResult');
    res.should.have.status(200);
    res.should.have.header('content-type', 'application/octet-stream');

    parsedResponse.result.code.should.equal(responses.taskUpdated.code);
    parsedResponse.result.message.should.equal(responses.taskUpdated.message);
    parsedResponse.task.id.should.equal(1);
  });

  it('should fail updating status of non-existing task', async function() {
    const faceServer = this.app.server.eapp;

    const taskToToggle = pb.make('Task').from({ id: 10 });
    const res = await chai.request(faceServer)
      .put('/tasks')
      .set('content-type', 'application/octet-stream')
      .buffer()
      .parse(binaryParser)
      .send(taskToToggle);

    const parsedResponse = pb.parse(res.body).to('TaskResult');
    res.should.have.status(200);
    res.should.have.header('content-type', 'application/octet-stream');

    parsedResponse.result.code.should.equal(responses.noTaskFound.code);
    parsedResponse.result.message.should.equal(responses.noTaskFound.message);
    parsedResponse.task.id.should.equal(10);
  });

  it('should fail updating status of non-existing task (overflow case)',
    async function() {
      const faceServer = this.app.server.eapp;

      const taskToToggle = pb.make('Task').from({ id: -1 });
      const res = await chai.request(faceServer)
        .put('/tasks')
        .set('content-type', 'application/octet-stream')
        .buffer()
        .parse(binaryParser)
        .send(taskToToggle);

      const parsedResponse = pb.parse(res.body).to('TaskResult');
      res.should.have.status(200);
      res.should.have.header('content-type', 'application/octet-stream');

      parsedResponse.result.code.should.equal(responses.noTaskFound.code);
      parsedResponse.result.message.should.equal(responses.noTaskFound.message);
      parsedResponse.task.id.should.equal(2**32 - 1);
    });
});
