<script setup>
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
</script>

<template>
  <article
    class="card"
    :class="[grade.key, { on: isSelected }]"
    @click="emit('select-card', city)"
  >
    <div class="left">
      <p class="name">{{ city.name }}</p>
      <p class="cond">{{ city.status }} · {{ city.temp }}도</p>
      <p class="cond">습도 {{ city.humidity }}% · 바람 {{ city.wind }}m/s</p>
      <span class="tag">{{ grade.label }}</span>
    </div>

    <div class="right">
      <p class="score">
        {{ score }}<span class="unit">점</span>
      </p>
      <button @click.stop="emit('click-detail', city)">상세보기</button>
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
  background-color: white;
  border: 1px solid #e4eaec;
  border-left-width: 5px;
  border-radius: 4px;
  margin-bottom: 8px;
  cursor: pointer;
}

.card:hover {
  background-color: #fafcfc;
}

.card.on {
  background-color: #f2f8f8;
  border-color: #1e2f33;
  border-left-width: 5px;
}

.card.best {
  border-left-color: #1f8a8f;
}
.card.good {
  border-left-color: #4a8f6b;
}
.card.fair {
  border-left-color: #a8813c;
}
.card.none {
  border-left-color: #8b969d;
}

.card.best .score {
  color: #1f8a8f;
}
.card.good .score {
  color: #4a8f6b;
}
.card.fair .score {
  color: #a8813c;
}
.card.none .score {
  color: #8b969d;
}

.card.best .tag {
  background-color: #e0f1f2;
  color: #14666a;
}
.card.good .tag {
  background-color: #e5f1ea;
  color: #326b4f;
}
.card.fair .tag {
  background-color: #f6eeda;
  color: #7d5f24;
}
.card.none .tag {
  background-color: #edf0f2;
  color: #5f6c74;
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
  color: #7f8b92;
  margin-top: 3px;
}

.tag {
  display: inline-block;
  margin-top: 7px;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 11px;
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
  font-variant-numeric: tabular-nums;
}

.score .unit {
  font-size: 13px;
  margin-left: 2px;
}

.right button {
  border: 1px solid #ccd5d8;
  background: white;
  border-radius: 3px;
  padding: 4px 10px;
  font-size: 12px;
  color: #4a5860;
  cursor: pointer;
}

.right button:hover {
  border-color: #1e2f33;
  color: #1e2f33;
}
</style>
