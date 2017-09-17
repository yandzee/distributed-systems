<template>
  <div class="task">
    <div class="label">
      {{ label }}
    </div>
    <div class="status" @click="statusClicked">
      <span v-if="done" class="done">✓</span>
    </div>
  </div>
</template>

<script>
const statusClicked = function() {
  this.$emit('status-click');
};

export default {
  props: ['done', 'label'],
  methods: {
    statusClicked
  }
};
</script>

<style lang="scss">
@import "../assets/styles/task.scss";
</style>