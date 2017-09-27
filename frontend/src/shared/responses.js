// Author: Renat Tuktarov (yandzeek@gmail.com)

const EMPTY_DATA = 1;
const NO_TASK_FOUND = 2;
const TASK_UPDATED = 3;
const TASK_CREATED = 4;
const TASK_CREATE_FAIL = 5;
const TASK_DELETED = 6;
const TASK_DELETE_FAIL = 7;

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

const taskCreated = {
  code: TASK_CREATED,
  message: 'Task was successfully created'
};

const taskCreateFail = {
  code: TASK_CREATE_FAIL,
  message: 'Failed to create new task'
};

const taskDeleted = {
  code: TASK_DELETED,
  message: 'Task was succcessfully deleted'
};

const taskDeleteFail = {
  code: TASK_DELETE_FAIL,
  message: 'Failed to delete task'
};


const responses = {
  emptyData,
  noTaskFound,
  taskUpdated,
  taskCreated,
  taskCreateFail,
  taskDeleted
};

export default responses;
