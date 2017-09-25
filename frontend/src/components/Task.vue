<template>
  <div class="task">
    <div class="label">
      {{ label }}
    </div>
    <div class="status" @click="statusClicked">
      <span v-if="done" class="done">✓</span>
    </div>
    <div class="status" @click="deleteClicked">
      <span class="delete">✕</span>
    </div>
  </div>
</template>

<script>
const statusClicked = function() {
  this.$emit('status-click');
};

const deleteClicked = function() {
  this.$emit('delete-click');
};

export default {
  props: ['done', 'label'],
  methods: {
    statusClicked,
    deleteClicked
  }
};
</script>

<style lang="scss">
@import "../assets/styles/task.scss";
</style>