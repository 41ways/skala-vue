<script setup>
defineProps({
  count: {
    type: Number,
    required: true,
  },
  average: {
    type: [String, Number],
    required: true,
  },
  dryableCount: {
    type: Number,
    required: true,
  },
  sortOrder: {
    type: String,
    default: '',
  },
  onlyDryable: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['change-sort', 'toggle-filter'])
</script>

<template>
  <div class="summary">
    <div class="stats">
      <span>{{ count }}곳</span>
      <span>평균 {{ average }}점</span>
      <span>널 수 있는 곳 {{ dryableCount }}</span>
    </div>

    <label class="filter">
      <input type="checkbox" :checked="onlyDryable" @change="emit('toggle-filter')" />
      가능한 곳만
    </label>

    <div class="sort">
      <span class="label">지수</span>
      <button
        :class="{ on: sortOrder === 'desc' }"
        title="높은 점수부터"
        aria-label="높은 점수부터 정렬"
        @click="emit('change-sort', 'desc')"
      >
        ↓
      </button>
      <button
        :class="{ on: sortOrder === 'asc' }"
        title="낮은 점수부터"
        aria-label="낮은 점수부터 정렬"
        @click="emit('change-sort', 'asc')"
      >
        ↑
      </button>
    </div>
  </div>
</template>

<style scoped>
.summary {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: var(--ink-soft);
}

.stats {
  display: flex;
  gap: 12px;
}

.filter {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.filter input {
  margin: 0;
  cursor: pointer;
}

.sort {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}

.sort .label {
  margin-right: 2px;
}

.sort button {
  width: 24px;
  height: 24px;
  border: 1px solid var(--line);
  background: var(--baek);
  border-radius: 3px;
  font-size: 13px;
  line-height: 1;
  color: var(--ink-soft);
  cursor: pointer;
}

.sort button:hover {
  border-color: var(--ink);
  color: var(--ink);
}

.sort button.on {
  background-color: var(--ink);
  border-color: var(--ink);
  color: white;
}
</style>
