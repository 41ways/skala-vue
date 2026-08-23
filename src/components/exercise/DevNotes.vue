<script setup>
import DevLog from '@/components/exercise/DevLog.vue'
import { learned, reflections } from '@/data/learned.js'

// 부모(대시보드 위 세부 탭)에서도 바꿀 수 있게 v-model
const tab = defineModel('tab', { default: 'log' })
</script>

<template>
  <section id="notes" class="notes">
    <header class="nt-head">
      <p class="eyebrow util">學習記錄</p>
      <h3>수업에서 배운 것, 만들며 겪은 것</h3>
    </header>

    <el-tabs v-model="tab" class="tabs">
      <el-tab-pane label="개발 일지" name="log">
        <DevLog />
      </el-tab-pane>

      <el-tab-pane label="배운 점 → 쓴 곳" name="learned">
        <p class="lead">수업 단원마다 이 프로젝트의 어디에 썼는지 적었습니다.</p>
        <section v-for="u in learned" :key="u.unit" class="unit">
          <h4><i class="seal">{{ u.hanja }}</i>{{ u.unit }}</h4>
          <table>
            <tbody>
              <tr v-for="[what, how, where] in u.items" :key="what">
                <th>{{ what }}</th>
                <td>{{ how }}</td>
                <td class="where">{{ where }}</td>
              </tr>
            </tbody>
          </table>
        </section>
      </el-tab-pane>

      <el-tab-pane label="회고" name="reflect">
        <p class="lead">짧게, 다음에도 지킬 것만.</p>
        <ol class="reflect">
          <li v-for="(r, i) in reflections" :key="i">{{ r }}</li>
        </ol>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<style scoped>
.notes {
  margin-top: 40px;
}
.nt-head {
  margin-bottom: 6px;
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
  font-size: 21px;
  letter-spacing: 0.1em;
}
.lead {
  margin: 10px 0 16px;
  font-size: 14px;
  color: var(--ink-soft);
}
/* Element Plus 탭을 한지 톤으로 */
.tabs :deep(.el-tabs__item) {
  font-family: var(--font-display);
  font-size: 15px;
  letter-spacing: 0.08em;
  color: var(--ink-soft);
}
.tabs :deep(.el-tabs__item.is-active),
.tabs :deep(.el-tabs__item:hover) {
  color: var(--jeok);
}
.tabs :deep(.el-tabs__active-bar) {
  background: var(--jeok);
}
.tabs :deep(.el-tabs__nav-wrap::after) {
  background: var(--line);
}
/* 개발 일지 컴포넌트가 제 머리글을 갖고 있으니 탭 안에서는 숨긴다 */
.tabs :deep(.devlog) {
  margin-top: 8px;
}
.tabs :deep(.dl-head) {
  display: none;
}
.unit {
  margin-top: 18px;
}
h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 8px;
  font-family: var(--font-display);
  font-size: 16px;
  letter-spacing: 0.08em;
}
.seal {
  display: inline-grid;
  place-items: center;
  min-width: 24px;
  height: 24px;
  padding: 0 4px;
  background: var(--jeok);
  color: var(--baek);
  font-style: normal;
  font-size: 12px;
  letter-spacing: 0.05em;
  border-radius: 3px;
  box-shadow: inset 0 0 0 1.5px rgba(251, 246, 234, 0.4);
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  line-height: 1.6;
}
th,
td {
  text-align: left;
  vertical-align: top;
  padding: 7px 10px 7px 0;
  border-bottom: 1px dotted var(--line);
}
th {
  width: 150px;
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--ink);
  white-space: nowrap;
}
td {
  color: var(--ink-soft);
}
.where {
  width: 190px;
  font-family: var(--font-util);
  font-size: 12px;
  color: var(--cheong);
  white-space: nowrap;
}
.reflect {
  margin: 0;
  padding-left: 22px;
  font-size: 14.5px;
  line-height: 1.8;
}
.reflect li {
  margin-bottom: 6px;
}
.reflect li::marker {
  color: var(--jeok);
  font-family: var(--font-display);
}
@media (max-width: 640px) {
  table,
  tbody,
  tr,
  th,
  td {
    display: block;
    width: auto;
  }
  tr {
    padding: 8px 0;
    border-bottom: 1px dotted var(--line);
  }
  th,
  td {
    border: 0;
    padding: 2px 0;
    white-space: normal;
  }
  .where {
    width: auto;
  }
}
</style>
