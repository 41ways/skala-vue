<script setup>
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <main class="notfound">
    <p class="hanja">無題</p>
    <p class="code util">404</p>
    <h1>이 길에는 화폭이 걸려 있지 않습니다</h1>
    <p class="path util">{{ decodeURIComponent(route.fullPath) }}</p>
    <p class="back"><RouterLink to="/">국내 화폭으로 돌아가기</RouterLink></p>
  </main>
</template>

<style scoped>
.notfound {
  min-height: calc(100vh - 120px);
  display: grid;
  place-content: center;
  text-align: center;
  padding: 40px 24px;
  color: var(--ink);
}
.hanja {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(88px, 18vw, 160px);
  line-height: 1;
  letter-spacing: 0.1em;
  color: rgba(34, 28, 22, 0.08);
}
.code {
  margin: -18px 0 0;
  font-size: 13px;
  letter-spacing: 0.5em;
  color: var(--jeok);
}
h1 {
  margin: 14px 0 0;
  font-family: var(--font-display);
  font-size: clamp(20px, 3vw, 26px);
  font-weight: 400;
  letter-spacing: 0.1em;
}
.path {
  margin: 10px 0 0;
  font-size: 12px;
  color: var(--ink-soft);
  word-break: break-all;
}
.back {
  margin: 28px 0 0;
}
.back a {
  display: inline-block;
  padding: 8px 18px;
  border: 1.5px solid var(--jeok);
  border-radius: 3px;
  color: var(--jeok);
  font-family: var(--font-display);
  letter-spacing: 0.14em;
  text-decoration: none;
}
.back a:hover {
  background: var(--jeok);
  color: var(--baek);
}
</style>
