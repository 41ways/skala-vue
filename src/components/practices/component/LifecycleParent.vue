<script setup>
import { ref } from 'vue'
import LifecycleChild from './LifecycleChild.vue'

const isAlive = ref(true)
</script>

<template>
  <div class="practice-section">
    <h2>Component Lifecycle Hook</h2>

    <button @click="isAlive = !isAlive">
      {{ isAlive ? '자식 컴포넌트 제거 (unmount)' : '자식 컴포넌트 생성 (mount)' }}
    </button>

    <LifecycleChild v-if="isAlive" />
    <p v-else>자식 컴포넌트가 소멸된 상태입니다.</p>

    <small>콘솔에서 setup, onMounted, onUpdated, onUnmounted 순서를 확인</small>
  </div>
</template>
