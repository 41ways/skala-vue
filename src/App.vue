<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import Lenis from 'lenis'

// 레퍼런스와 동일한 관성 스무스 스크롤 — 화폭이 물 흐르듯 넘어간다
const route = useRoute()
let lenis = null
let rafId = 0
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
  window.__lenis = lenis
  const raf = (t) => {
    lenis.raf(t)
    rafId = requestAnimationFrame(raf)
  }
  rafId = requestAnimationFrame(raf)
})
onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  lenis?.destroy()
  window.__lenis = null
})
</script>

<template>
  <header class="top" :class="{ dark: route.path.startsWith('/world') }">
    <RouterLink to="/" class="logo">청우<em>록</em><small>晴雨錄</small></RouterLink>
    <nav class="util">
      <RouterLink to="/">국내 화폭</RouterLink>
      <RouterLink to="/world">세계화폭</RouterLink>
      <RouterLink to="/guide">빨래 지침</RouterLink>
      <RouterLink to="/classic">실습 대시보드</RouterLink>
      <RouterLink to="/about">소개</RouterLink>
    </nav>
  </header>
  <div class="saekdong"></div>
  <RouterView />
</template>

<style scoped>
.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 24px;
  flex-wrap: wrap;
}
/* 세계화폭 — 먹빛 내비 (레퍼런스의 nav theme 전환) */
.top.dark {
  background: #0b0f18;
  transition: background 0.4s;
}
.top.dark .logo,
.top.dark .logo small {
  color: var(--baek);
}
.top.dark nav a {
  color: rgba(251, 246, 234, 0.6);
}
.top.dark nav a.router-link-exact-active,
.top.dark nav a:hover {
  color: #e8a5b0;
}
.logo {
  font-family: var(--font-display);
  font-size: 22px;
  letter-spacing: 0.06em;
  color: var(--ink);
  text-decoration: none;
}
.logo em {
  color: var(--jeok);
  font-style: normal;
}
.logo small {
  font-size: 12px;
  color: var(--ink-soft);
  margin-left: 8px;
  letter-spacing: 0.18em;
}
.util {
  font-family: var(--font-util);
}
nav {
  display: flex;
  gap: 18px;
  font-size: 14px;
  font-weight: 500;
  overflow-x: auto;
}
nav a {
  color: var(--ink-soft);
  text-decoration: none;
  white-space: nowrap;
}
nav a.router-link-exact-active,
nav a:hover {
  color: var(--jeok);
}
</style>
