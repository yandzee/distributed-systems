// Author: Renat Tuktarov (yandzeek@gmail.com)

const logger = require('../logger')();
const responses = require('../../shared/responses');
const pbResponses = require('./middlewares/pb-responses');
const pbDataParser = require('./middlewares/pb-data-parser');

const tasks = [
  { id: 1, label: 'Task 1', done: +false },
  { id: 2, label: 'Task 2', done: +true },
  { id: 3, label: 'Task 3', done: +true },
  { id: 4, label: 'Task 4', done: +false },
  { id: 5, label: 'Task 5', done: +true },
];

module.exports = (server, router) => {
  router.get('/', pbResponses, async (req, res) => {
    res.tasks({ tasks }).end();
  });

  const updateMids = [ pbResponses, pbDataParser('Task') ];
  router.put('/', updateMids, async (req, res) => {
    const task = tasks.find(t => t.id === req.task.id);
    if (!task) {
      return res.result(responses.noTaskFound).end();
    }

    task.done = req.task.done;
    res.result(responses.taskUpdated);
  });

  return router;
};
