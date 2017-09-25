<template>
  <div class="layout">
    <div class="box" v-show="!loading">
      <div class="bigcaption centrified">
        Tasks
      </div>
      <div class="tasks">
        <task v-if="tasks.length !== 0" v-for="(task, idx) in tasks" :key="idx"
          :done="task.done"
          :label="task.label"
          @status-click="toggleStatus(task)"
          @delete-click="deleteTask(task)"
        />
        <div class="controls">
          <div class="loading" v-show="loading">
            Loading
          </div>
          <div v-show="tasks.length === 0" class="loading">
            No tasks
          </div>
          <div class="add-task">
            <input class="widget" type="text"
              placeholder = "Type a new task…"
              @keypress.enter="addTask">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Task from '@/components/Task'
import api from '@/api/index'

const data = function() {
  return {
    loading: true,
    tasks: []
  };
};

const mounted = async function() {
  const tasks = await api.loadTasks();
  this.tasks = tasks.sort((a, b) => a.label > b.label);
  this.loading = false;
};

const toggleStatus = async function(task) {
  const taskId = task.id;
  const newStatus = !task.done;
  const updResult = await api.updateTaskStatus(taskId, newStatus);
  if (updResult.updated) {
    task.done = newStatus;
  } else if (updResult.failed) {
    this.showErrorMessage('Failed to update task');
  }
};

const addTask = async function(e) {
  const taskLabel = e.target.value;
  const task = await api.createTask(taskLabel);
  if (task.created) {
    this.tasks.push(task.itself);
  } else {
    this.showErrorMessage('Failed to create task');
  }
};

const deleteTask = async function(task) {
  const result = await api.deleteTask(task.id);

  if (result.deleted) {
    const taskIdx = this.tasks.findIndex(t => t.id === task.id);
    this.tasks.splice(taskIdx, 1);
  } else {
    this.showErrorMessage('Failed to delete task');
  }
};

const showErrorMessage = function(msg) {
  console.error(msg);
};

export default {
  name: 'main',
  data,
  mounted,
  methods: {
    toggleStatus,
    addTask,
    deleteTask,
    showErrorMessage
  },
  components: { Task }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
  @import "../assets/styles/main.scss"
</style>
