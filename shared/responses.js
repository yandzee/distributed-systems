// Author: Renat Tuktarov (yandzeek@gmail.com)

const EMPTY_DATA = 1;
const NO_TASK_FOUND = 2;
const TASK_UPDATED = 3;

const emptyData = {
  code: EMPTY_DATA,
  message: 'You have sent empty data'
};

const noTaskFound = {
  code: NO_TASK_FOUND,
  message: 'No such task'
};

const taskUpdated = {
  code: TASK_UPDATED,
  message: 'Task was successfully updated'
};

const responses = {
  emptyData,
  noTaskFound,
  taskUpdated
};

module.exports = responses;
