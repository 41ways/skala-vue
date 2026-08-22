<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import Lenis from 'lenis'
import UnitToggler from '@/components/exercise/UnitToggler.vue'

// 관성 스무스 스크롤 - 화폭이 물 흐르듯 넘어간다
const route = useRoute()
let lenis = null
let rafId = 0

// 맨 위로 - 한 화면 넘게 내려가면 우하단에 뜬다
const showTop = ref(false)
function onScrollTop() {
  showTop.value = window.scrollY > window.innerHeight * 1.2
}
function toTop() {
  if (lenis) lenis.scrollTo(0, { duration: 1.8 })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}
// 화폭 전환 - Lenis가 이전 스크롤 위치를 물고 있지 않게 즉시 맨 위로
watch(
  () => route.path,
  () => {
    if (lenis) lenis.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
    showTop.value = false
  },
)
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
onMounted(() => {
  window.addEventListener('scroll', onScrollTop, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScrollTop)
  cancelAnimationFrame(rafId)
  lenis?.destroy()
  window.__lenis = null
})
</script>

<template>
  <header class="top" :class="{ dark: route.path.startsWith('/world') || route.path.startsWith('/edition') }">
    <RouterLink to="/" class="logo">청우<em>록</em><small>晴雨錄</small></RouterLink>
    <nav class="util">
      <RouterLink to="/">국내 화폭</RouterLink>
      <RouterLink to="/world">세계화폭</RouterLink>
      <RouterLink to="/edition">에디션</RouterLink>
      <RouterLink to="/guide">빨래 지침</RouterLink>
      <RouterLink to="/classic">실습 대시보드</RouterLink>
      <RouterLink to="/sky">하늘 드라이브</RouterLink>
      <RouterLink to="/about">소개</RouterLink>
    </nav>
    <!-- 단위 토글은 실습 화면(대시보드/상세)에서만 -->
    <UnitToggler v-if="route.path === '/classic' || route.path.startsWith('/weather/')" class="unit" />
  </header>
  <div class="saekdong"></div>
  <RouterView v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
  <Transition name="totop">
    <button v-show="showTop" class="totop" aria-label="맨 위로" @click="toTop">↑</button>
  </Transition>
</template>

<style scoped>
/* 화폭 전환: 먹이 마르듯 잠깐 옅어졌다 다음 폭이 든다 */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.32s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
.unit {
  margin-left: 12px;
}
.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 24px;
  flex-wrap: wrap;
}
/* 세계화폭 - 먹빛 내비 */
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

@media (max-width: 600px) {
  .top { padding: 10px 14px; gap: 8px; }
  .logo { font-size: 19px; }
  .logo small { display: none; }
  nav { gap: 14px; font-size: 13px; width: 100%; padding-bottom: 2px; }
  .totop { right: 14px; bottom: 16px; width: 40px; height: 40px; }
}

/* 맨 위로 */
.totop {
  position: fixed;
  right: 22px;
  bottom: 26px;
  z-index: 60;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 1.5px solid rgba(251, 246, 234, 0.5);
  background: rgba(20, 18, 14, 0.62);
  backdrop-filter: blur(4px);
  color: var(--baek, #fbf6ea);
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
  transition: transform 0.25s, background 0.25s;
}
.totop:hover {
  transform: translateY(-3px);
  background: rgba(20, 18, 14, 0.85);
}
.totop-enter-from,
.totop-leave-to {
  opacity: 0;
  transform: translateY(14px);
}
.totop-enter-active,
.totop-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
</style>
