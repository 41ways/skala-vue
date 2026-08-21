<script setup>
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/stores/configStore.js'

const configStore = useConfigStore()
const { unit, unitSymbol } = storeToRefs(configStore)
const { toggleUnit } = configStore
</script>

<template>
  <button class="toggler" @click="toggleUnit">
    <span :class="{ on: unit === 'celsius' }">℃</span>
    <span :class="{ on: unit === 'fahrenheit' }">℉</span>
    <span class="now">{{ unitSymbol }}</span>
  </button>
</template>

<style scoped>
.toggler {
  display: flex;
  align-items: center;
  gap: 2px;
  border: 1px solid #48626a;
  background: none;
  border-radius: 3px;
  padding: 3px 4px;
  cursor: pointer;
}

.toggler span {
  padding: 2px 7px;
  border-radius: 2px;
  font-size: 12px;
  color: #8ba0a5;
}

.toggler span.on {
  background-color: #dde8e9;
  color: #1e2f33;
}

.toggler .now {
  display: none;
}
</style>
