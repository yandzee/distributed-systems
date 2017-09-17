// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueAxios from 'vue-axios'
import axios from 'axios'
import pb from '../../../shared/pb'
import TaskUpdateResult from './task-update-result'

import config from '@/config'
Vue.use(VueAxios, axios.create(config.http));

const loadTasks = function() {
  return Vue.axios.get('/tasks')
    .then(res => pb.parse(res.data).to('Tasks'))
    .then(res => res.tasks);
};

const updateTaskStatus = function(id, done) {
  const updatedTask = pb.make('Task', true).from({ id, done });
  return Vue.axios.put('/tasks', updatedTask)
    .then(res => pb.parse(res.data).to('Result'))
    .then(TaskUpdateResult.from)
}

export default {
  loadTasks,
  updateTaskStatus
};
