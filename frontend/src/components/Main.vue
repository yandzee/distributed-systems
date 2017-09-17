<template>
  <div class="layout">
    <div class="loading" v-show="loading">
      Loading
    </div>
    <div class="box" v-show="!loading">
      <div class="bigcaption centrified">
        Tasks
      </div>
      <div class="tasks">
        <task v-for="(task, idx) in tasks" :key="idx"
          :done="task.done"
          :label="task.label"
          @status-click="toggleStatus(task.id)"
        />
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

const loadTasks = async function() {
  this.tasks = await api.loadTasks()
  this.loading = false;
};

const created = async function() {
  await this.loadTasks();
};

const toggleStatus = async function(taskId) {
  const task = this.tasks.find(task => task.id === taskId);
  const newStatus = !task.done;
  const result = await api.updateTaskStatus(taskId, +newStatus);
  if (result.updated) {
    task.done = newStatus;
  } else {
    console.error('Task wasnt updated');
  }
};

export default {
  name: 'main',
  data,
  created,
  methods: {
    loadTasks,
    toggleStatus
  },
  components: { Task }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
  @import "../assets/styles/main.scss"
</style>
