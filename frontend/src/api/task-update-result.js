const responses = require('../../../shared/responses');

class TaskUpdateResult {
  constructor(result) {
    this.code = result.code;
  }

  get updated() {
    return this.code === responses.taskUpdated.code;
  }

  static from(result) {
    return new TaskUpdateResult(result);
  }
}

export default TaskUpdateResult;