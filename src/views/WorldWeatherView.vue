<script setup>
// 세계화폭(萬國晴雨錄) — 해외 도시 스크롤텔링
// 레퍼런스: Shopify Editions Winter '26
//  - sticky 화폭 + 스크롤 진행도 기반 카메라 구도 변화(줌·팬)
//  - 챕터 크로스페이드 전환, 표제 획 드로잉, 손가락 스크롤 힌트, 먹 파문
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import MinhwaScene from '@/components/minhwa/MinhwaScene.vue'
import MudongScene from '@/components/minhwa/genre/MudongScene.vue'
import SsireumScene from '@/components/minhwa/genre/SsireumScene.vue'
import SeodangScene from '@/components/minhwa/genre/SeodangScene.vue'
import TigerScene from '@/components/minhwa/genre/TigerScene.vue'
import InkRipple from '@/components/minhwa/InkRipple.vue'
import ScrollHint from '@/components/minhwa/ScrollHint.vue'
import { useWorldWeather } from '@/composables/useWeather.js'

const { cities, loading, error, fetchLive } = useWorldWeather()

const genreMap = {
  mudong: { comp: MudongScene, title: '무동', caption: '춤과 풍악' },
  ssireum: { comp: SsireumScene, title: '씨름', caption: '힘겨루기 한판' },
  seodang: { comp: SeodangScene, title: '서당', caption: '글 읽는 소리' },
  tiger: { comp: TigerScene, title: '작호도', caption: '까치와 호랑이' },
}

const statusHanja = {
  맑음: '晴',
  구름: '雲',
  흐림: '陰',
  비: '雨',
  뇌우: '雷',
  눈: '雪',
  바람: '風',
}

// ── 스크롤 진행도 ─────────────────────────────────────
const root = ref(null)
const chapterEls = ref([])
const heroEl = ref(null)
const progress = ref([]) // 각 챕터 0..1
const heroP = ref(0)
const activeIdx = ref(-1)
let rafId = 0
let lastY = -1

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const easeOut = (t) => 1 - Math.pow(1 - t, 3)

function measure() {
  const vh = window.innerHeight
  if (heroEl.value) {
    const r = heroEl.value.getBoundingClientRect()
    heroP.value = clamp01(-r.top / (r.height - vh || 1))
  }
  let act = -1
  progress.value = chapterEls.value.map((el, i) => {
    if (!el) return 0
    const r = el.getBoundingClientRect()
    const p = clamp01(-r.top / (r.height - vh || 1))
    if (r.top < vh * 0.5 && r.bottom > vh * 0.5) act = i
    return p
  })
  activeIdx.value = act
}

// scroll 이벤트 대신 rAF 연속 루프 — 휠·터치·키보드·프로그램 스크롤 전부에 견고
function loop() {
  const y = window.scrollY
  if (y !== lastY) {
    lastY = y
    measure()
  }
  rafId = requestAnimationFrame(loop)
}

onMounted(() => {
  fetchLive()
  measure()
  rafId = requestAnimationFrame(loop)
  // rAF가 잠든 상황(탭 비활성 등) 대비 이중 안전벨트
  window.addEventListener('scroll', measure, { passive: true })
  window.addEventListener('resize', measure, { passive: true })
})
onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('scroll', measure)
  window.removeEventListener('resize', measure)
})

// ── 카메라 구도 : 진행도 → 줌/팬/페이드 ────────────────
function cameraStyle(i) {
  const p = progress.value[i] ?? 0
  // 도입부: 넓게 잡았다가(1.22) 천천히 들어간다 → 정면(1.0) → 말미에 살짝 빠진다
  const zoomIn = easeOut(clamp01(p / 0.55))
  const scale = 1.22 - 0.22 * zoomIn + (p > 0.85 ? (p - 0.85) * 0.4 : 0)
  const panY = (1 - zoomIn) * 4 - (p > 0.85 ? (p - 0.85) * 10 : 0)
  const opacity = clamp01(p / 0.08) * clamp01((1 - p) / 0.06)
  return {
    transform: `scale(${scale.toFixed(4)}) translateY(${panY.toFixed(2)}%)`,
    opacity: opacity.toFixed(3),
  }
}
// 풍속화 두루마리: 화폭이 자리잡은 뒤 아래에서 펼쳐진다
function genreStyle(i) {
  const p = progress.value[i] ?? 0
  const t = easeOut(clamp01((p - 0.3) / 0.22))
  const leave = clamp01((p - 0.88) / 0.1)
  return {
    opacity: (t * (1 - leave)).toFixed(3),
    transform: `translateY(${((1 - t) * 12).toFixed(2)}%) scale(${(0.94 + t * 0.06).toFixed(3)})`,
  }
}
function infoStyle(i, order = 0) {
  const p = progress.value[i] ?? 0
  const t = easeOut(clamp01((p - 0.1 - order * 0.045) / 0.16))
  return {
    opacity: t.toFixed(3),
    transform: `translateY(${((1 - t) * 26).toFixed(1)}px)`,
  }
}
const heroStyle = computed(() => {
  const p = heroP.value
  return {
    transform: `scale(${(1 - p * 0.12).toFixed(4)}) translateY(${(p * -6).toFixed(2)}%)`,
    opacity: clamp01((1 - p) / 0.5).toFixed(3),
  }
})

function jump(i) {
  chapterEls.value[i]?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <main ref="root" class="world">
    <InkRipple />

    <!-- ══ 표제 : 획이 그어지며 나타난다 ══ -->
    <section ref="heroEl" class="hero-wrap">
      <div class="hero-stage">
        <div class="hero-inner" :style="heroStyle">
          <svg class="title-svg" viewBox="0 0 900 260">
            <text x="450" y="118" class="stroke-title t-main">만국청우록</text>
            <text x="450" y="196" class="stroke-title t-sub">萬 國 晴 雨 錄</text>
          </svg>
          <p class="hero-copy">
            여덟 폭 병풍을 넘기듯 화폭을 내리면,<br />
            바다 건너 여섯 도시의 하늘이 차례로 펼쳐집니다.
          </p>
          <p class="hero-note util">
            {{ loading ? '먼 곳의 하늘을 살피는 중…' : '실측 · Open-Meteo · 현지 시각 기준' }}
          </p>
          <div class="hero-hint">
            <ScrollHint />
          </div>
        </div>
        <!-- 표제지 여백의 먹 산수 -->
        <svg class="hero-mts" viewBox="0 0 1200 200" preserveAspectRatio="xMidYMax slice">
          <path d="M0 200 L190 90 L390 200 Z" fill="rgba(34,28,22,.07)" />
          <path d="M290 200 L520 40 L760 200 Z" fill="rgba(34,28,22,.1)" />
          <path d="M640 200 L860 80 L1080 200 Z" fill="rgba(34,28,22,.07)" />
          <path d="M920 200 L1090 110 L1240 200 Z" fill="rgba(34,28,22,.05)" />
        </svg>
      </div>
    </section>

    <!-- ══ 도시 챕터 ══ -->
    <section
      v-for="(c, i) in cities"
      :key="c.id"
      :ref="(el) => (chapterEls[i] = el)"
      class="chapter"
      :id="c.id"
    >
      <div class="stage">
        <!-- 화폭 (카메라) -->
        <div class="camera" :style="cameraStyle(i)">
          <MinhwaScene :status="c.status" :is-day="c.isDay" />
        </div>

        <!-- 도시 정보 -->
        <div class="chapter-info">
          <p class="idx util" :style="infoStyle(i, 0)">
            제{{ i + 1 }}폭 / {{ cities.length }}폭 · {{ c.country }}
          </p>
          <h2 class="city" :style="infoStyle(i, 1)">
            {{ c.name }} <small>{{ c.hanja }}</small>
          </h2>
          <p class="reading" :style="infoStyle(i, 2)">
            <span class="hanja-badge">{{ statusHanja[c.status] ?? '晴' }}</span>
            {{ c.temp }}° · {{ c.status }} · 습도 {{ c.humidity }}% · 바람 {{ c.wind }}m/s
          </p>
          <p class="line" :style="infoStyle(i, 3)">{{ c.line }}</p>
          <p class="local util" :style="infoStyle(i, 4)">
            {{ c.live && c.localTime ? `현지 ${c.localTime} · ${c.isDay ? '낮' : '밤'}` : '표본 자료' }}
          </p>
        </div>

        <!-- 풍속화 두루마리 -->
        <div class="genre-scroll" :style="genreStyle(i)">
          <div class="genre-frame hanji-card">
            <component :is="genreMap[c.genre].comp" />
          </div>
          <p class="genre-caption util">
            「{{ genreMap[c.genre].title }}」 — {{ genreMap[c.genre].caption }}
          </p>
        </div>
      </div>
    </section>

    <!-- ══ 발문 ══ -->
    <section class="outro">
      <div class="saekdong"></div>
      <p class="outro-copy">여섯 도시의 하늘을 모두 거두었습니다.</p>
      <router-link to="/" class="outro-link util">국내 화폭으로 돌아가기 →</router-link>
      <p v-if="error" class="err util">
        실시간 조회에 실패해 표본 자료로 표시 중입니다.
      </p>
    </section>

    <!-- ══ 병풍 차례 (우측 내비) ══ -->
    <nav class="folds util" aria-label="도시 차례">
      <button
        v-for="(c, i) in cities"
        :key="c.id"
        class="fold"
        :class="{ on: activeIdx === i }"
        @click="jump(i)"
        :aria-label="c.name"
      >
        <span class="fold-name">{{ c.name }}</span>
        <span class="fold-bar"></span>
      </button>
    </nav>
  </main>
</template>

<style scoped>
.world {
  position: relative;
  background: var(--paper);
}

/* ── 표제 ── */
.hero-wrap {
  height: 160vh;
}
.hero-stage {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  display: grid;
  place-items: center;
}
.hero-inner {
  text-align: center;
  padding: 0 24px;
  will-change: transform, opacity;
}
.title-svg {
  width: min(720px, 92vw);
  display: block;
  margin: 0 auto;
}
.stroke-title {
  font-family: var(--font-display);
  text-anchor: middle;
  fill: var(--ink);
  stroke: var(--ink);
  fill-opacity: 0;
  stroke-dasharray: 2600;
  stroke-dashoffset: 2600;
  animation:
    draw 2.6s ease-out forwards,
    fillIn 1.2s ease-out 1.9s forwards;
}
.t-main {
  font-size: 104px;
  letter-spacing: 0.14em;
  stroke-width: 1.6;
}
.t-sub {
  font-size: 40px;
  letter-spacing: 0.5em;
  stroke-width: 1;
  fill: var(--jeok);
  stroke: var(--jeok);
  animation-delay: 0.7s, 2.4s;
}
@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes fillIn {
  to {
    fill-opacity: 1;
  }
}
.hero-copy {
  font-size: clamp(15px, 2vw, 18px);
  line-height: 2;
  margin: 18px 0 6px;
  opacity: 0;
  animation: rise 1s ease-out 2.6s forwards;
}
.hero-note {
  font-size: 12.5px;
  color: var(--ink-soft);
  margin: 0 0 26px;
  opacity: 0;
  animation: rise 1s ease-out 3s forwards;
}
.hero-hint {
  color: var(--ink);
  opacity: 0;
  animation: rise 1s ease-out 3.3s forwards;
}
@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.hero-mts {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 160px;
  pointer-events: none;
}
.util {
  font-family: var(--font-util);
}

/* ── 챕터 ── */
.chapter {
  height: 280vh;
  position: relative;
}
.stage {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  background: var(--paper);
}
.camera {
  position: absolute;
  inset: 0;
  will-change: transform, opacity;
  transform-origin: 50% 42%;
}
.camera :deep(.scene) {
  min-height: 100vh;
}

.chapter-info {
  position: absolute;
  left: 6%;
  top: 14%;
  z-index: 3;
  color: var(--baek);
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.4);
  max-width: min(520px, 70vw);
}
.chapter-info > * {
  will-change: transform, opacity;
}
.idx {
  font-size: 12.5px;
  letter-spacing: 0.3em;
  margin: 0 0 10px;
  opacity: 0.85;
}
.city {
  font-family: var(--font-display);
  font-size: clamp(44px, 8vw, 92px);
  line-height: 1;
  letter-spacing: 0.1em;
  margin: 0;
}
.city small {
  font-size: 0.38em;
  letter-spacing: 0.34em;
  color: rgba(251, 246, 234, 0.75);
  margin-left: 12px;
}
.reading {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: clamp(14px, 1.8vw, 17px);
  margin: 16px 0 0;
}
.hanja-badge {
  display: inline-grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 1.5px solid rgba(251, 246, 234, 0.8);
  border-radius: 4px;
  font-family: var(--font-display);
  font-size: 22px;
}
.line {
  font-size: clamp(14px, 1.7vw, 16px);
  margin: 12px 0 0;
  opacity: 0.92;
}
.local {
  font-size: 12.5px;
  margin: 10px 0 0;
  opacity: 0.75;
}

/* ── 풍속화 두루마리 ── */
.genre-scroll {
  position: absolute;
  right: 4%;
  bottom: 6%;
  z-index: 3;
  width: clamp(260px, 34vw, 460px);
  will-change: transform, opacity;
}
.genre-frame {
  aspect-ratio: 4 / 3.1;
  padding: 10px;
  background: var(--baek);
  box-shadow:
    0 24px 60px rgba(34, 28, 22, 0.35),
    inset 0 0 0 1px rgba(34, 28, 22, 0.14);
  border-radius: 3px;
  overflow: hidden;
}
.genre-caption {
  text-align: right;
  font-size: 12.5px;
  color: var(--baek);
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.45);
  margin: 8px 2px 0;
}

/* ── 발문 ── */
.outro {
  text-align: center;
  padding: 0 24px 90px;
}
.outro .saekdong {
  margin-bottom: 56px;
}
.outro-copy {
  font-family: var(--font-display);
  font-size: clamp(20px, 3vw, 28px);
  letter-spacing: 0.12em;
  margin: 0 0 14px;
}
.outro-link {
  font-size: 14px;
  font-weight: 500;
}
.err {
  color: var(--jeok);
  font-size: 13px;
  margin-top: 22px;
}

/* ── 병풍 차례 ── */
.folds {
  position: fixed;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.fold {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  background: none;
  border: 0;
  padding: 2px;
  cursor: pointer;
  color: var(--ink-soft);
}
.fold-name {
  font-size: 11.5px;
  letter-spacing: 0.1em;
  opacity: 0;
  transform: translateX(6px);
  transition: opacity 0.25s, transform 0.25s;
}
.fold:hover .fold-name,
.fold.on .fold-name {
  opacity: 1;
  transform: translateX(0);
}
.fold-bar {
  width: 18px;
  height: 3px;
  border-radius: 2px;
  background: currentColor;
  opacity: 0.4;
  transition: opacity 0.25s, width 0.25s, background 0.25s;
}
.fold.on .fold-bar {
  width: 30px;
  opacity: 1;
  background: var(--jeok);
}

@media (max-width: 760px) {
  .genre-scroll {
    right: 50%;
    transform: translateX(50%) !important;
    bottom: 4%;
    width: min(78vw, 380px);
  }
  .chapter-info {
    top: 10%;
  }
  .folds {
    right: 6px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .stroke-title {
    animation: none;
    fill-opacity: 1;
    stroke-dashoffset: 0;
  }
  .hero-copy,
  .hero-note,
  .hero-hint {
    animation: none;
    opacity: 1;
  }
}
</style>
