<script setup>
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/stores/configStore.js'

defineProps({
  city: {
    type: Object,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  grade: {
    type: Object,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])

const configStore = useConfigStore()
const { unitSymbol } = storeToRefs(configStore)

// 등급 → Element Plus 태그/막대 색
const TYPES = { best: 'primary', good: 'success', fair: 'warning', none: 'info' }
</script>

<template>
  <article
    class="card"
    :class="[grade.key, { on: isSelected }]"
    @click="emit('select-card', city)"
  >
    <div class="left">
      <p class="name">{{ city.name }}</p>
      <p class="cond">
        {{ city.status }} · {{ configStore.toTemp(city.temp) }}{{ unitSymbol }}
      </p>
      <p class="cond">습도 {{ city.humidity }}% · 바람 {{ city.wind }}m/s</p>
      <el-tag :type="TYPES[grade.key]" size="small" effect="light" round>{{ grade.label }}</el-tag>
      <el-progress
        class="bar"
        :percentage="score"
        :stroke-width="6"
        :show-text="false"
        :status="grade.key === 'none' ? 'exception' : grade.key === 'best' ? 'success' : undefined"
      />
    </div>

    <div class="right">
      <p class="score">
        {{ score }}<span class="unit">점</span>
      </p>
      <el-button size="small" plain @click.stop="emit('click-detail', city)">상세보기</el-button>
    </div>
  </article>
</template>

<style scoped>
.card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 14px 18px;
  background-color: var(--baek);
  border: 1px solid var(--line);
  border-left-width: 5px;
  border-radius: 4px;
  margin-bottom: 8px;
  cursor: pointer;
}

.card:hover {
  background-color: rgba(251, 246, 234, 0.75);
}

.card.on {
  background-color: rgba(206, 155, 59, 0.12);
  border-color: var(--ink);
  border-left-width: 5px;
}

.card.best {
  border-left-color: var(--cheong);
}
.card.good {
  border-left-color: var(--rok);
}
.card.fair {
  border-left-color: var(--hwang);
}
.card.none {
  border-left-color: var(--ink-soft);
}

.card.best .score {
  color: var(--cheong);
}
.card.good .score {
  color: var(--rok);
}
.card.fair .score {
  color: var(--hwang);
}
.card.none .score {
  color: var(--ink-soft);
}

.card.best .tag {
  background-color: rgba(47, 86, 122, 0.1);
  color: var(--cheong);
}
.card.good .tag {
  background-color: rgba(63, 125, 82, 0.12);
  color: var(--rok);
}
.card.fair .tag {
  background-color: rgba(206, 155, 59, 0.16);
  color: var(--hwang);
}
.card.none .tag {
  background-color: rgba(251, 246, 234, 0.7);
  color: var(--ink-soft);
}

.left p {
  margin: 0;
}

.name {
  font-size: 17px;
  font-weight: 600;
}

.cond {
  font-size: 12px;
  color: var(--ink-soft);
  margin-top: 3px;
}

.left :deep(.el-tag) {
  margin-top: 7px;
}
.bar {
  margin-top: 8px;
  max-width: 180px;
}

.right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.score {
  margin: 0;
  font-size: 30px;
  font-weight: 300;
  line-height: 1;
}

.score .unit {
  font-size: 13px;
  margin-left: 2px;
}

.right :deep(.el-button) {
  font-family: var(--font-body);
  color: var(--ink-soft);
}
.right :deep(.el-button:hover) {
  color: var(--ink);
  border-color: var(--ink);
}
</style>
