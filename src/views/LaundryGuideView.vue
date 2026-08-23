<script setup>
import { RouterLink } from 'vue-router'

const rules = [
  { item: '기본', hanja: '基', detail: '100점에서 시작' },
  { item: '습도', hanja: '濕', detail: '40%를 넘는 만큼 1.8배로 감점' },
  { item: '바람', hanja: '風', detail: '1m/s당 6점 가점, 6m/s까지만' },
  { item: '하늘', hanja: '晴', detail: '맑음이면 8점 가점' },
  { item: '기온', hanja: '溫', detail: '20도 이상이면 4점 가점' },
  { item: '비·눈', hanja: '雨', detail: '다른 조건과 무관하게 0점' },
]

const grades = [
  { range: '90 이상', label: '아주 잘 마름', mark: '上上' },
  { range: '70 ~ 89', label: '잘 마름', mark: '上' },
  { range: '1 ~ 69', label: '더디게 마름', mark: '中' },
  { range: '0', label: '널 수 없음', mark: '下' },
]
</script>

<template>
  <main class="guide">
    <header class="head">
      <p class="eyebrow util">洗濯指針</p>
      <h1>빨래 지침</h1>
      <p class="lead">두루마리의 날씨를 빨래 지수 100점으로 바꾸는 규칙입니다. 실습 대시보드의 점수도 같은 규칙으로 계산합니다.</p>
    </header>

    <section class="sheet">
      <h2><i class="seal">則</i>점수 규칙</h2>
      <ol class="rules">
        <li v-for="r in rules" :key="r.item">
          <b class="h">{{ r.hanja }}</b>
          <span class="k">{{ r.item }}</span>
          <span class="d">{{ r.detail }}</span>
        </li>
      </ol>
    </section>

    <section class="sheet">
      <h2><i class="seal">等</i>등급</h2>
      <ul class="grades">
        <li v-for="g in grades" :key="g.range">
          <b class="mark">{{ g.mark }}</b>
          <span class="k">{{ g.range }}점</span>
          <span class="d">{{ g.label }}</span>
        </li>
      </ul>
    </section>

    <p class="note">
      바람은 다른 지표와 달리 강할수록 점수가 오릅니다. 빨래가 마르는 데는 습기를 걷어 가는 공기의 흐름이 필요하기 때문입니다.
    </p>

    <p class="back util">
      <RouterLink to="/">← 국내 화폭으로</RouterLink>
      <RouterLink to="/classic">실습 대시보드 →</RouterLink>
    </p>
  </main>
</template>

<style scoped>
.guide {
  max-width: 680px;
  margin: 0 auto;
  padding: 48px 24px 96px;
  color: var(--ink);
}
.eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  letter-spacing: 0.4em;
  color: var(--jeok);
}
h1 {
  margin: 0 0 14px;
  font-family: var(--font-display);
  font-size: clamp(28px, 4vw, 38px);
  letter-spacing: 0.14em;
}
.lead {
  margin: 0;
  font-size: 15.5px;
  line-height: 1.85;
  color: var(--ink-soft);
}
.sheet {
  margin-top: 38px;
  padding: 22px 26px 18px;
  border-top: 1.5px solid rgba(178, 58, 44, 0.45);
  border-bottom: 1.5px solid rgba(178, 58, 44, 0.45);
  background:
    repeating-linear-gradient(180deg, transparent 0 47px, rgba(178, 58, 44, 0.18) 47px 48px),
    rgba(251, 246, 234, 0.45);
}
h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 14px;
  font-family: var(--font-display);
  font-size: 18px;
  letter-spacing: 0.18em;
}
.seal {
  display: inline-grid;
  place-items: center;
  width: 26px;
  height: 26px;
  background: var(--jeok);
  color: var(--baek);
  font-style: normal;
  font-size: 14px;
  border-radius: 3px;
  box-shadow: inset 0 0 0 1.5px rgba(251, 246, 234, 0.4);
}
.rules,
.grades {
  list-style: none;
  margin: 0;
  padding: 0;
}
.rules li,
.grades li {
  display: grid;
  grid-template-columns: 34px 90px 1fr;
  align-items: center;
  gap: 12px;
  height: 48px;
  font-size: 15.5px;
}
.h,
.mark {
  font-family: var(--font-display);
  font-weight: 400;
  color: var(--jeok);
}
.h {
  font-size: 20px;
}
.mark {
  font-size: 15px;
  letter-spacing: 0.08em;
}
.k {
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: 0.1em;
}
.d {
  color: var(--ink-soft);
}
.note {
  margin: 30px 0 0;
  padding-left: 14px;
  border-left: 2px solid var(--hwang);
  font-size: 14.5px;
  line-height: 1.8;
  color: var(--ink-soft);
}
.back {
  display: flex;
  justify-content: space-between;
  margin-top: 46px;
  font-size: 14px;
}
.back a {
  text-decoration: none;
}
@media (max-width: 520px) {
  .rules li,
  .grades li {
    grid-template-columns: 30px 76px 1fr;
    font-size: 14px;
    height: auto;
    padding: 10px 0;
  }
  .sheet {
    padding: 18px 16px 14px;
    background-image: none;
  }
}
</style>
