<script setup>
// 세계화폭 — 만국청우록(萬國晴雨錄)
// 레퍼런스: Shopify Editions Winter '26 — 그림 전환 연출 중심으로.
// 설명 블록은 걷어내고, 도시마다 한 폭의 살아있는 화폭이 크로스페이드로 이어진다.
//  · 히어로: 누끼 콜라주(무동의 소매끝 ↔ 까치의 부리) + 1px 표제함 + 차례
//  · 챕터: sticky 화폭 + 관절 인형 마스코트 + 초대형 헤드라인 + 드롭캡 한 줄
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import MinhwaScene from '@/components/minhwa/MinhwaScene.vue'
import MinhwaCut from '@/components/minhwa/MinhwaCut.vue'
import InkRipple from '@/components/minhwa/InkRipple.vue'
import ScrollHint from '@/components/minhwa/ScrollHint.vue'
import { useWorldWeather } from '@/composables/useWeather.js'

const { cities, loading, error, fetchLive } = useWorldWeather()

const cutFiles = import.meta.glob('@/assets/minhwa-art/cut/*.png', {
  eager: true,
  import: 'default',
})
const cut = (name) => cutFiles[Object.keys(cutFiles).find((k) => k.includes(name))]

const numerals = ['一', '二', '三', '四', '五', '六']
const statusHanja = { 맑음: '晴', 구름: '雲', 흐림: '陰', 비: '雨', 뇌우: '雷', 눈: '雪', 바람: '風' }

// 호랑이 관절 부위 (tiger_body 730×899 기준 %)
const tigerParts = () => [
  { src: cut('tiger_head'), left: '4.1%', top: '1.1%', w: '43.2%', anim: 'p-head', origin: '55% 92%' },
  { src: cut('tiger_tail'), left: '0%', top: '59.5%', w: '25.3%', anim: 'p-tail', origin: '88% 18%' },
  { src: cut('tiger_paw'), left: '17.8%', top: '80.6%', w: '18.5%', anim: 'p-paw', origin: '50% 20%' },
]

// 도시별 수호 인물 — 몸 잔모션 + 부위 모션
const mascots = {
  w_tokyo: { src: () => cut('mudong_dancer'), w: '30%', left: '52%', top: '30%', idle: 'sway', parts: () => [] },
  w_beijing: { src: () => cut('tiger_body'), w: '42%', left: '46%', top: '16%', idle: 'breathe', parts: tigerParts },
  w_paris: { src: () => cut('seodang_crier'), w: '20%', left: '56%', top: '38%', idle: 'sway', parts: () => [] },
  w_london: { src: () => cut('ssireum_wrestlers'), w: '26%', left: '52%', top: '26%', idle: 'tussle', parts: () => [] },
  w_newyork: { src: () => cut('ssireum_crowd_br'), w: '30%', left: '52%', top: '40%', idle: 'bob', parts: () => [] },
  w_sydney: { src: () => cut('tiger_magpie'), w: '22%', left: '55%', top: '30%', idle: 'bob', parts: () => [] },
}

// ── 스크롤 진행도 + 마우스 시차 ──
const chapterEls = ref([])
const heroEl = ref(null)
const progress = ref([])
const heroP = ref(0)
const activeIdx = ref(-1)
const mx = ref(0)
const my = ref(0)
let tx = 0, ty = 0, rafId = 0, lastY = -1

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
function onMove(e) {
  tx = (e.clientX / window.innerWidth) * 2 - 1
  ty = (e.clientY / window.innerHeight) * 2 - 1
}
function loop() {
  const y = window.scrollY
  if (y !== lastY) { lastY = y; measure() }
  mx.value += (tx - mx.value) * 0.06
  my.value += (ty - my.value) * 0.06
  rafId = requestAnimationFrame(loop)
}
onMounted(() => {
  fetchLive()
  measure()
  rafId = requestAnimationFrame(loop)
  window.addEventListener('scroll', measure, { passive: true })
  window.addEventListener('resize', measure, { passive: true })
  window.addEventListener('pointermove', onMove, { passive: true })
})
onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('scroll', measure)
  window.removeEventListener('resize', measure)
  window.removeEventListener('pointermove', onMove)
})

// 헤드라인·내러티브 — 화폭이 자리잡으며 떠오르고, 말미에 물러난다
function headStyle(i) {
  const p = progress.value[i] ?? 0
  const t = easeOut(clamp01((p - 0.06) / 0.18))
  const leave = clamp01((p - 0.82) / 0.14)
  return {
    opacity: (t * (1 - leave)).toFixed(3),
    transform: `translateY(${((1 - t) * 60 - leave * 40).toFixed(1)}px) scale(${(0.94 + t * 0.06).toFixed(3)})`,
  }
}
function mascotStyle(i, m) {
  const p = progress.value[i] ?? 0
  const t = easeOut(clamp01((p - 0.03) / 0.22))
  const leave = clamp01((p - 0.84) / 0.13)
  return {
    left: m.left,
    top: m.top,
    width: m.w,
    opacity: (t * (1 - leave)).toFixed(3),
    transform: `translate3d(${(mx.value * 14).toFixed(1)}px, ${(my.value * 9 + (1 - t) * 46 - leave * 60).toFixed(1)}px, 0) scale(${(1 + leave * 0.12).toFixed(3)})`,
  }
}
// 화폭 전환 — 다음 폭이 밀고 들어오며 앞 폭은 어둠으로 잦아든다
function sceneStyle(i) {
  const p = progress.value[i] ?? 0
  const enter = easeOut(clamp01(p / 0.14))
  const leave = clamp01((p - 0.86) / 0.12)
  return {
    opacity: (enter * (1 - leave)).toFixed(3),
    transform: `scale(${(1.1 - easeOut(clamp01(p / 0.5)) * 0.1 + leave * 0.06).toFixed(4)})`,
    filter: leave > 0 ? `brightness(${(1 - leave * 0.55).toFixed(3)})` : 'none',
  }
}
const heroStyle = computed(() => ({
  transform: `translateY(${(heroP.value * -8).toFixed(2)}%)`,
  opacity: clamp01((1 - heroP.value) / 0.45).toFixed(3),
}))
const heroFigL = computed(() => ({
  transform: `translate3d(${(mx.value * 22).toFixed(1)}px, ${(my.value * 14).toFixed(1)}px, 0)`,
}))
const heroFigR = computed(() => ({
  transform: `translate3d(${(mx.value * -18).toFixed(1)}px, ${(my.value * -11).toFixed(1)}px, 0)`,
}))

function jump(i) {
  chapterEls.value[i]?.scrollIntoView({ behavior: 'smooth' })
}

const firstChar = (s) => s.slice(0, 1)
const restChars = (s) => s.slice(1)
</script>

<template>
  <main class="mangug">
    <InkRipple />

    <!-- ══ 좌측 상주 차례 레일 ══ -->
    <nav v-show="activeIdx >= 0" class="rail util" aria-label="도시 차례">
      <button
        v-for="(c, i) in cities"
        :key="c.id"
        class="rail-item"
        :class="{ on: activeIdx === i }"
        @click="jump(i)"
      >
        <span class="rail-city">{{ c.name }}</span>
        <span class="rail-num">{{ numerals[i] }}</span>
      </button>
    </nav>

    <!-- ══ 히어로 ══ -->
    <section ref="heroEl" class="hero-wrap">
      <div class="hero-stage">
        <div class="hero-sky"></div>
        <svg class="hcloud c1" viewBox="0 0 220 90"><path d="M40 40 a30 30 0 0 1 58 0 a24 24 0 0 1 44 10 a20 20 0 0 1 -16 32 l-104 0 a26 26 0 0 1 18 -42" fill="rgba(251,246,234,.12)" /></svg>
        <svg class="hcloud c2" viewBox="0 0 220 90"><path d="M40 40 a30 30 0 0 1 58 0 a24 24 0 0 1 44 10 a20 20 0 0 1 -16 32 l-104 0 a26 26 0 0 1 18 -42" fill="rgba(251,246,234,.09)" /></svg>

        <div class="hero-inner" :style="heroStyle">
          <div class="fig fig-l" :style="heroFigL">
            <span class="float-a">
              <MinhwaCut :src="cut('mudong_dancer')" silhouette />
            </span>
          </div>
          <div class="fig fig-r" :style="heroFigR">
            <span class="float-b">
              <MinhwaCut :src="cut('tiger_magpie')" silhouette />
            </span>
          </div>
          <span class="spark"></span>

          <div class="title-box">
            <svg class="title-svg" viewBox="0 0 640 190">
              <text x="320" y="86" class="stroke-title t-main">만국청우록</text>
              <text x="320" y="150" class="stroke-title t-sub">萬 國 晴 雨 錄</text>
            </svg>
            <p class="hero-sub util">
              새로운 하늘의 기록 — 바다 건너 여섯 도시의 지금.
              <span v-if="loading"> 살피는 중…</span>
            </p>
            <ol class="menu util">
              <li v-for="(c, i) in cities" :key="c.id">
                <button class="menu-item" @click="jump(i)">
                  <span class="m-name">{{ c.name }}</span>
                  <span class="m-dots"></span>
                  <span class="m-num">{{ numerals[i] }}</span>
                </button>
              </li>
            </ol>
          </div>
        </div>

        <div class="hero-hint"><ScrollHint label="화폭을 내리세요" /></div>
      </div>
    </section>

    <!-- ══ 도시 챕터 — 화폭에서 화폭으로 ══ -->
    <section
      v-for="(c, i) in cities"
      :key="c.id"
      :ref="(el) => (chapterEls[i] = el)"
      class="chapter"
      :id="c.id"
    >
      <div class="scene-sticky">
        <div class="scene-cam" :style="sceneStyle(i)">
          <MinhwaScene :status="c.status" :is-day="c.isDay" />
        </div>

        <!-- 관절 인형 마스코트 -->
        <span class="mascot" :style="mascotStyle(i, mascots[c.id])">
          <MinhwaCut
            :src="mascots[c.id].src()"
            :parts="mascots[c.id].parts()"
            :idle="mascots[c.id].idle"
            silhouette
          />
        </span>

        <!-- 초대형 헤드라인 -->
        <h2 class="mega" :style="headStyle(i)">
          {{ c.name }}
          <small>{{ c.hanja }} · {{ c.country }}</small>
        </h2>

        <!-- 드롭캡 한 줄 + 간이 독법 -->
        <div class="foot" :style="headStyle(i)">
          <p class="narrative">
            <span class="dcap">{{ firstChar(c.line) }}</span>{{ restChars(c.line) }}
          </p>
          <p class="reading util">
            <span class="r-hanja">{{ statusHanja[c.status] ?? '晴' }}</span>
            {{ c.temp }}° · {{ c.status }} · 습도 {{ c.humidity }}% ·
            {{ c.live && c.localTime ? `현지 ${c.localTime}` : '표본' }} · {{ c.isDay ? '낮' : '밤' }}
          </p>
        </div>
      </div>
    </section>

    <!-- ══ 발문 ══ -->
    <section class="outro">
      <p class="outro-copy">여섯 도시의 하늘을 모두 거두었습니다.</p>
      <router-link to="/" class="outro-link util">국내 화폭 — 팔도청우록으로 →</router-link>
      <p v-if="error" class="err util">실시간 조회 실패 — 표본 자료로 표시 중입니다.</p>
    </section>
  </main>
</template>

<style scoped>
.mangug {
  position: relative;
  background: #0f1726;
  color: var(--baek);
}
.util {
  font-family: var(--font-util);
}

/* ── 좌측 차례 레일 ── */
.rail {
  position: fixed;
  left: 18px;
  bottom: 34px;
  z-index: 30;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.rail-item {
  display: flex;
  align-items: baseline;
  gap: 10px;
  background: none;
  border: 0;
  padding: 2px 0;
  cursor: pointer;
  color: rgba(251, 246, 234, 0.55);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.06em;
  transition: color 0.25s, transform 0.25s;
}
.rail-item:hover,
.rail-item.on {
  color: var(--baek);
  transform: translateX(3px);
}
.rail-item.on .rail-num {
  color: #e8a5b0;
}
.rail-num {
  font-family: var(--font-display);
  font-size: 11px;
  color: rgba(251, 246, 234, 0.4);
}

/* ── 히어로 ── */
.hero-wrap {
  height: 178vh;
}
.hero-stage {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
}
.hero-sky {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 70% 50% at 50% 108%, rgba(47, 86, 122, 0.55), transparent 60%),
    linear-gradient(180deg, #0c1322, #17223a 55%, #1d2c49);
}
.hcloud {
  position: absolute;
  width: clamp(180px, 26vw, 340px);
  animation: heroDrift linear infinite;
}
.c1 { top: 16%; animation-duration: 90s; }
.c2 { top: 58%; animation-duration: 130s; animation-delay: -60s; }
@keyframes heroDrift {
  from { transform: translateX(-30vw); }
  to { transform: translateX(120vw); }
}
.hero-inner {
  position: absolute;
  inset: 0;
  will-change: transform, opacity;
}
.fig {
  position: absolute;
  will-change: transform;
  filter: drop-shadow(0 24px 44px rgba(0, 0, 0, 0.5));
}
.fig-l {
  left: 4%;
  bottom: 6%;
  width: clamp(200px, 26vw, 380px);
}
.fig-r {
  right: 6%;
  top: 10%;
  width: clamp(150px, 19vw, 280px);
}
.float-a {
  display: block;
  animation: floatA 7s ease-in-out infinite alternate;
}
.float-b {
  display: block;
  animation: floatB 5.5s ease-in-out infinite alternate;
}
@keyframes floatA {
  from { transform: translateY(0) rotate(-1.5deg); }
  to { transform: translateY(-18px) rotate(1.5deg); }
}
@keyframes floatB {
  from { transform: translateY(0) rotate(1deg); }
  to { transform: translateY(-14px) rotate(-1.5deg); }
}
.spark {
  position: absolute;
  z-index: 4;
  left: 38%;
  top: 55%;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 240, 200, 0.9);
  box-shadow: 0 0 22px 6px rgba(206, 155, 59, 0.55);
  animation: sparkle 3.2s ease-in-out infinite;
}
@keyframes sparkle {
  0%, 100% { opacity: 0.25; transform: scale(0.7); }
  50% { opacity: 1; transform: scale(1.3); }
}

.title-box {
  position: absolute;
  left: 50%;
  top: 46%;
  transform: translate(-50%, -50%);
  width: min(520px, 86vw);
  padding: clamp(22px, 4vh, 40px) clamp(20px, 3.5vw, 44px);
  border: 1px solid rgba(251, 246, 234, 0.45);
  background: rgba(12, 19, 34, 0.35);
  backdrop-filter: blur(3px);
}
.title-svg {
  width: 100%;
  display: block;
}
.stroke-title {
  font-family: var(--font-display);
  text-anchor: middle;
  fill: var(--baek);
  stroke: var(--baek);
  fill-opacity: 0;
  stroke-dasharray: 2600;
  stroke-dashoffset: 2600;
  animation:
    draw 2.6s ease-out forwards,
    fillIn 1.2s ease-out 1.9s forwards;
}
.t-main {
  font-size: 76px;
  letter-spacing: 0.12em;
  stroke-width: 1.4;
}
.t-sub {
  font-size: 30px;
  letter-spacing: 0.46em;
  stroke-width: 0.8;
  fill: #e8a5b0;
  stroke: #e8a5b0;
  animation-delay: 0.7s, 2.4s;
}
@keyframes draw {
  to { stroke-dashoffset: 0; }
}
@keyframes fillIn {
  to { fill-opacity: 1; }
}
.hero-sub {
  text-align: center;
  font-size: 13.5px;
  color: rgba(251, 246, 234, 0.8);
  margin: 6px 0 18px;
}
.menu {
  list-style: none;
  margin: 0;
  padding: 0;
}
.menu-item {
  display: flex;
  align-items: baseline;
  gap: 12px;
  width: 100%;
  background: none;
  border: 0;
  padding: 7px 2px;
  cursor: pointer;
  color: var(--baek);
  font-size: clamp(16px, 2.2vw, 21px);
  font-weight: 700;
  letter-spacing: 0.04em;
  transition: color 0.2s, transform 0.2s;
}
.menu-item:hover {
  color: #e8a5b0;
  transform: translateX(4px);
}
.m-dots {
  flex: 1;
  border-bottom: 1px dotted rgba(251, 246, 234, 0.28);
}
.m-num {
  font-family: var(--font-display);
  font-size: 0.8em;
  color: rgba(251, 246, 234, 0.55);
}
.hero-hint {
  position: absolute;
  left: 50%;
  bottom: 4%;
  transform: translateX(-50%);
  color: rgba(251, 246, 234, 0.8);
}

/* ── 챕터 : 그림 전환 중심 ── */
.chapter {
  position: relative;
  height: 230vh;
}
.scene-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
}
.scene-cam {
  position: absolute;
  inset: 0;
  will-change: transform, opacity, filter;
}
.scene-cam :deep(.scene) {
  min-height: 100vh;
}
.mascot {
  position: absolute;
  z-index: 2;
  will-change: transform, opacity;
  filter: drop-shadow(0 26px 44px rgba(0, 0, 0, 0.45));
}

.mega {
  position: absolute;
  left: 5%;
  right: 5%;
  top: 34%;
  z-index: 1; /* 마스코트가 글자를 살짝 가린다 */
  margin: 0;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(72px, 15vw, 200px);
  line-height: 0.95;
  letter-spacing: 0.06em;
  color: var(--baek);
  text-shadow: 0 4px 44px rgba(0, 0, 0, 0.45);
  will-change: transform, opacity;
  pointer-events: none;
}
.mega small {
  display: block;
  font-size: clamp(13px, 1.6vw, 19px);
  letter-spacing: 0.5em;
  margin-top: 14px;
  color: rgba(251, 246, 234, 0.75);
}
.foot {
  position: absolute;
  left: 5%;
  bottom: 6%;
  z-index: 3;
  max-width: min(680px, 86vw);
  will-change: transform, opacity;
}
.narrative {
  margin: 0;
  font-size: clamp(17px, 2.4vw, 26px);
  line-height: 1.7;
  color: var(--baek);
  text-shadow: 0 2px 18px rgba(0, 0, 0, 0.5);
}
.dcap {
  float: left;
  font-family: var(--font-display);
  font-size: 3.1em;
  line-height: 0.9;
  margin: 0.04em 0.14em 0 0;
  color: #e8a5b0;
}
.reading {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 12px 0 0;
  font-size: 13px;
  color: rgba(251, 246, 234, 0.85);
  clear: left;
}
.r-hanja {
  display: inline-grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border: 1.2px solid rgba(232, 165, 176, 0.9);
  color: #e8a5b0;
  border-radius: 3px;
  font-family: var(--font-display);
  font-size: 15px;
}

/* ── 발문 ── */
.outro {
  position: relative;
  z-index: 5;
  text-align: center;
  padding: 12vh 24px 14vh;
}
.outro-copy {
  font-family: var(--font-display);
  font-size: clamp(20px, 3vw, 30px);
  letter-spacing: 0.12em;
  margin: 0 0 16px;
}
.outro-link {
  color: #e8a5b0;
  font-size: 14px;
  font-weight: 500;
}
.err {
  color: #e8a5b0;
  font-size: 13px;
  margin-top: 20px;
}

@media (max-width: 860px) {
  .rail { display: none; }
  .fig-l { width: 34vw; bottom: 2%; }
  .fig-r { width: 26vw; top: 6%; }
  .mega { top: 26%; }
}

@media (prefers-reduced-motion: reduce) {
  .stroke-title {
    animation: none;
    fill-opacity: 1;
    stroke-dashoffset: 0;
  }
  .float-a, .float-b, .hcloud, .spark { animation: none !important; }
}
</style>
