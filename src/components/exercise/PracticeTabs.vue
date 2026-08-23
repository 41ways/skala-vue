<script setup>
import { ref, defineAsyncComponent } from 'vue'
import { practices } from '@/data/practices.js'

// 실습 파일 전부를 지연 로드로 묶어 둔다. 탭을 눌러야 그 파일만 불러옴
const practiceFiles = import.meta.glob('@/components/practices/**/*.vue')
const exerciseFiles = import.meta.glob('@/components/exercise/Weather{Mockup,Composition,Parent}.vue')
const loaders = { ...practiceFiles, ...exerciseFiles }

const resolve = (key) => {
  const path = Object.keys(loaders).find((k) => k.endsWith(`/${key}.vue`))
  return path ? defineAsyncComponent(loaders[path]) : null
}
const groups = practices.map((g) => ({ ...g, views: g.comps.map(resolve).filter(Boolean) }))

const tab = ref(groups[0].id)
</script>

<template>
  <section class="practice">
    <header class="pr-head">
      <p class="eyebrow util">實習</p>
      <h3>실습한 것들</h3>
      <p class="lead">수업 시간에 따라 친 파일을 그대로 두었습니다. 탭을 누르면 그때 만든 화면이 그대로 뜹니다.</p>
    </header>

    <el-tabs v-model="tab" class="tabs">
      <el-tab-pane v-for="g in groups" :key="g.id" :label="g.label" :name="g.id" lazy>
        <p class="title">
          <b>{{ g.title }}</b>
          <span class="note">{{ g.note }}</span>
        </p>
        <div class="stage">
          <component :is="c" v-for="(c, i) in g.views" :key="i" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<style scoped>
.practice {
  margin-top: 44px;
}
.pr-head {
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
  margin: 6px 0 0;
  font-size: 14px;
  color: var(--ink-soft);
}
.tabs :deep(.el-tabs__item) {
  font-family: var(--font-display);
  font-size: 14px;
  letter-spacing: 0.06em;
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
.title {
  margin: 8px 0 14px;
  font-size: 14.5px;
  line-height: 1.7;
}
.title b {
  font-family: var(--font-display);
  font-size: 17px;
  margin-right: 10px;
}
.note {
  color: var(--ink-soft);
}
/* 실습 파일 원래 모습을 해치지 않게 틀만 두른다 */
.stage {
  display: grid;
  gap: 14px;
}
.stage > * {
  padding: 16px 18px;
  border: 1px dashed var(--line);
  border-radius: 4px;
  background: rgba(251, 246, 234, 0.6);
  overflow-x: auto;
}
</style>
