<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <section class="panel">
    <h3 v-if="title">{{ title }}</h3>
    <slot></slot>
  </section>
</template>

<style scoped>
.panel {
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 16px 18px;
  margin-bottom: 14px;
  background-color: rgba(251, 246, 234, 0.7);
}

.panel h3 {
  margin: 0 0 12px;
  font-size: 12px;
  color: var(--ink-soft);
  font-weight: 600;
}
</style>
