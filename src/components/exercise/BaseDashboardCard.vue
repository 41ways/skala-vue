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
  border: 1px solid #e6ebee;
  border-radius: 6px;
  padding: 16px 18px;
  margin-bottom: 14px;
  background-color: #fbfcfd;
}

.panel h3 {
  margin: 0 0 12px;
  font-size: 12px;
  color: #6b7a84;
  font-weight: 600;
}
</style>
