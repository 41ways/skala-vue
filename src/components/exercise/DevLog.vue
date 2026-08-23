<script setup>
import { ref } from 'vue'
import { devLog } from '@/data/devLog.js'

// 펼친 카드 하나만 기억한다 (같은 카드를 다시 누르면 접힘)
const open = ref(null)
const toggle = (i) => {
  open.value = open.value === i ? null : i
}
</script>

<template>
  <section class="devlog">
    <header class="dl-head">
      <p class="eyebrow util">開發日誌</p>
      <h3>개발 일지</h3>
      <p class="lead">카드를 누르면 그때 있었던 일과 결정을 볼 수 있습니다. <i class="key red"></i>트러블슈팅 <i class="key yellow"></i>손질</p>
    </header>

    <ol class="cards">
      <li v-for="(e, i) in devLog" :key="e.title" class="card" :class="[e.kind === 'tweak' ? 'tweak' : 'trouble', { on: open === i }]">
        <button class="head" type="button" :aria-expanded="open === i" @click="toggle(i)">
          <span class="date util">{{ e.date }}</span>
          <span class="title">{{ e.title }}</span>
          <span class="summary">{{ e.summary }}</span>
          <span class="tags">
            <el-tag v-for="t in e.tags" :key="t" size="small" effect="plain" round>{{ t }}</el-tag>
          </span>
          <span class="arrow" aria-hidden="true">{{ open === i ? '▾' : '▸' }}</span>
        </button>
        <Transition name="fold">
          <ul v-show="open === i" class="detail">
            <li v-for="(line, j) in e.detail" :key="j">{{ line }}</li>
          </ul>
        </Transition>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.devlog {
  margin-top: 34px;
}
.dl-head {
  margin-bottom: 14px;
}
.eyebrow {
  margin: 0 0 4px;
  font-size: 11.5px;
  letter-spacing: 0.4em;
  color: var(--jeok);
}
h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 20px;
  letter-spacing: 0.12em;
}
.lead {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--ink-soft);
}
.cards {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}
.card {
  background: var(--baek);
  border: 1px solid var(--line);
  border-left: 4px solid var(--jeok); /* 트러블슈팅 = 빨강 */
  border-radius: 4px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.card.tweak {
  border-left-color: var(--hwang); /* 손질 = 노랑 */
}
.card.on {
  box-shadow: 0 10px 24px -18px rgba(34, 28, 22, 0.6);
}
.key {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin: 0 4px 0 10px;
  vertical-align: -1px;
  border-radius: 2px;
}
.key.red { background: var(--jeok); }
.key.yellow { background: var(--hwang); }
.head {
  all: unset;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas:
    'date arrow'
    'title arrow'
    'summary arrow'
    'tags arrow';
  gap: 3px 12px;
  width: 100%;
  box-sizing: border-box;
  padding: 12px 16px;
  cursor: pointer;
}
.head:focus-visible {
  outline: 2px solid var(--cheong);
  outline-offset: 2px;
}
.date {
  grid-area: date;
  font-size: 11px;
  letter-spacing: 0.18em;
  color: var(--jeok);
}
.title {
  grid-area: title;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 17px;
  letter-spacing: 0.01em;
  color: var(--ink);
}
.summary {
  grid-area: summary;
  font-size: 14px;
  line-height: 1.6;
  color: var(--ink-soft);
}
.tags {
  grid-area: tags;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}
.tags :deep(.el-tag) {
  font-family: var(--font-util);
  border-color: var(--line);
  color: var(--ink-soft);
  background: transparent;
}
.arrow {
  grid-area: arrow;
  align-self: center;
  color: var(--ink-soft);
  font-size: 14px;
}
.detail {
  margin: 0;
  padding: 0 16px 14px 30px;
  border-top: 1px dotted var(--line);
  font-size: 13.5px;
  line-height: 1.75;
  color: var(--ink);
}
.detail li {
  margin-top: 8px;
}
.detail li::marker {
  color: var(--jeok);
}
.fold-enter-active,
.fold-leave-active {
  transition: opacity 0.2s ease;
}
.fold-enter-from,
.fold-leave-to {
  opacity: 0;
}
@media (max-width: 600px) {
  .head {
    padding: 12px 12px;
  }
  .detail {
    padding-left: 24px;
  }
}
</style>
