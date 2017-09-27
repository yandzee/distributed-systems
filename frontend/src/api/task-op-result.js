import responses from '../shared/responses'

class TaskOpResult {
  constructor(result) {
    this.result = result.result;
    this.task = result.task;
  }

  get created() {
    return this.result && this.result.code === responses.taskCreated.code;
  }

  get failed() {
    return this.result &&
      this.result.code === responses.taskCreateFail.code ||
      this.result.code === responses.taskDeleteFail.code;
  }

  get deleted() {
    return this.result && this.result.code === responses.taskDeleted.code;
  }

  get updated() {
    return this.result && this.result.code === responses.taskUpdated.code;
  }

  get itself() {
    return this.task;
  }

  static from(result) {
    return new TaskOpResult(result);
  }
}

export default TaskOpResult;
