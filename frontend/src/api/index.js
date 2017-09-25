// Author: Renat Tuktarov (yandzeek@gmail.com)

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueAxios from 'vue-axios'
import axios from 'axios'
import pb from '../../../shared/pb'
import TaskOpResult from './task-op-result'

import config from '@/config'
Vue.use(VueAxios, axios.create(config.http));

const loadTasks = function() {
  return Vue.axios.get('/tasks')
    .then(res => pb.parse(res.data).to('Tasks'))
    .then(res => res.tasks);
};

const updateTaskStatus = function(id, done) {
  done = +done;
  const updatedTask = pb.make('Task', true).from({ id, done });
  return Vue.axios.put('/tasks', updatedTask)
    .then(res => pb.parse(res.data).to('TaskResult'))
    .then(TaskOpResult.from)
};

const createTask = function(label) {
  const newTask = pb.make('Task', true).from({ done: false, label });
  return Vue.axios.post('/tasks', newTask)
    .then(res => pb.parse(res.data).to('TaskResult'))
    .then(TaskOpResult.from);
};

const deleteTask = function(taskId) {
  console.log('prepare request to delete: ' + taskId);
  // const taskToDelete = pb.make('Task', true).from({ id: taskId });
  return Vue.axios.delete('/tasks/' + taskId)
    .then(res => pb.parse(res.data).to('TaskResult'))
    .then(TaskOpResult.from);
};

export default {
  loadTasks,
  updateTaskStatus,
  createTask,
  deleteTask
};
