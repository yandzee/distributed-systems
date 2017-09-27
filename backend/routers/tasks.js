// Author: Renat Tuktarov (yandzeek@gmail.com)

const logger = require('../logger')();
const responses = require('../shared/responses');
const pbResponses = require('./middlewares/pb-responses');
const pbDataParser = require('./middlewares/pb-data-parser');

module.exports = (server, router) => {
  const storage = server.storage;

  router.get('/', pbResponses, async (req, res) => {
    const tasks = await storage.getTasks();

    res.tasks({ tasks }).end();
  });

  const tasksMiddleware = [ pbResponses, pbDataParser('Task') ];
  router.put('/', tasksMiddleware, async (req, res) => {
    const taskId = req.task.id;
    const rowsAffected = await storage.invertTaskStatus(taskId);

    if (rowsAffected === 1) {
      return res.taskResult({
        result: responses.taskUpdated,
        task: req.task
      }).end();
    }
    return res.taskResult({
      result: responses.noTaskFound,
      task: req.task
    }).end();
  });

  router.post('/', tasksMiddleware, async (req, res) => {
    const taskId = await storage.createTask(req.task.label);

    res.taskResult({
      result: responses.taskCreated,
      task: {
        id: taskId,
        label: req.task.label,
        done: false
      }
    }).end();
  });

  router.delete('/:id', pbResponses, async (req, res) => {
    logger.debug('about to delete task: ' + req.params.id);
    await storage.deleteTask(req.params.id);
    res.taskResult({
      result: responses.taskDeleted,
      task: req.task
    }).end();
  });

  return router;
};
