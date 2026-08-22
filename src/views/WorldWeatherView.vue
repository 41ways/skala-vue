<script setup>
// 세계화폭 — 만국청우록(萬國晴雨錄)
// 레퍼런스: Shopify Editions Winter '26 를 구조 그대로 번안
//  · 히어로: 명화 누끼 콜라주(아담의 창조 오마주 → 무동의 소매끝 ↔ 까치의 부리)
//    + 중앙 1px 테두리 표제함 + 챕터 차례(한자 숫자)
//  · 챕터: sticky 화폭(-100vh 음수마진 기법) 위로 카드가 흘러 올라온다
//  · 초대형 도시 헤드라인 + 드롭캡 내러티브 + 좌측 상주 차례 레일
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import MinhwaScene from '@/components/minhwa/MinhwaScene.vue'
import InkRipple from '@/components/minhwa/InkRipple.vue'
import ScrollHint from '@/components/minhwa/ScrollHint.vue'
import { useWorldWeather } from '@/composables/useWeather.js'
import { laundryScore, starCount, skyGrade } from '@/data/weatherData.js'

const { cities, loading, error, fetchLive } = useWorldWeather()

const cutFiles = import.meta.glob('@/assets/minhwa-art/cut/*.png', {
  eager: true,
  import: 'default',
})
const cut = (name) => cutFiles[Object.keys(cutFiles).find((k) => k.includes(name))]

const numerals = ['一', '二', '三', '四', '五', '六']
const statusHanja = { 맑음: '晴', 구름: '雲', 흐림: '陰', 비: '雨', 뇌우: '雷', 눈: '雪', 바람: '風' }

// 도시별 수호 인물(마스코트) — 치타 콜라주의 자리
const mascots = {
  w_tokyo: { src: () => cut('mudong_dancer'), w: '30%', left: '52%', top: '30%', idle: 'sway' },
  w_beijing: { src: () => cut('tiger_body'), w: '42%', left: '46%', top: '18%', idle: 'breathe' },
  w_paris: { src: () => cut('seodang_crier'), w: '20%', left: '56%', top: '38%', idle: 'sway' },
  w_london: { src: () => cut('ssireum_wrestlers'), w: '26%', left: '52%', top: '26%', idle: 'tussle' },
  w_newyork: { src: () => cut('ssireum_crowd_br'), w: '30%', left: '52%', top: '40%', idle: 'bob' },
  w_sydney: { src: () => cut('tiger_magpie'), w: '22%', left: '55%', top: '30%', idle: 'bob' },
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

// 헤드라인 — 화폭이 자리잡으며 떠오른다
function headStyle(i) {
  const p = progress.value[i] ?? 0
  const t = easeOut(clamp01((p - 0.04) / 0.16))
  return {
    opacity: t.toFixed(3),
    transform: `translateY(${((1 - t) * 60).toFixed(1)}px) scale(${(0.94 + t * 0.06).toFixed(3)})`,
  }
}
function mascotStyle(i, m) {
  const p = progress.value[i] ?? 0
  const t = easeOut(clamp01((p - 0.02) / 0.2))
  return {
    left: m.left,
    top: m.top,
    width: m.w,
    opacity: t.toFixed(3),
    transform: `translate3d(${(mx.value * 14).toFixed(1)}px, ${(my.value * 9 + (1 - t) * 40).toFixed(1)}px, 0)`,
  }
}
function sceneStyle(i) {
  const p = progress.value[i] ?? 0
  return {
    opacity: (clamp01(p / 0.06) * clamp01((1 - p) / 0.05)).toFixed(3),
    transform: `scale(${(1.06 - easeOut(clamp01(p / 0.5)) * 0.06).toFixed(4)})`,
  }
}
const heroStyle = computed(() => ({
  transform: `translateY(${(heroP.value * -8).toFixed(2)}%)`,
  opacity: clamp01((1 - heroP.value) / 0.45).toFixed(3),
}))
// 히어로 인물 — 마우스 시차 + 부유
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

    <!-- ══ 좌측 상주 차례 레일 (챕터 진입 후 표시) ══ -->
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

    <!-- ══ 히어로 : 손끝이 닿는 콜라주 + 표제함 ══ -->
    <section ref="heroEl" class="hero-wrap">
      <div class="hero-stage">
        <div class="hero-sky"></div>
        <!-- 구름문 -->
        <svg class="hcloud c1" viewBox="0 0 220 90"><path d="M40 40 a30 30 0 0 1 58 0 a24 24 0 0 1 44 10 a20 20 0 0 1 -16 32 l-104 0 a26 26 0 0 1 18 -42" fill="rgba(251,246,234,.12)" /></svg>
        <svg class="hcloud c2" viewBox="0 0 220 90"><path d="M40 40 a30 30 0 0 1 58 0 a24 24 0 0 1 44 10 a20 20 0 0 1 -16 32 l-104 0 a26 26 0 0 1 18 -42" fill="rgba(251,246,234,.09)" /></svg>

        <div class="hero-inner" :style="heroStyle">
          <!-- 왼쪽: 무동 — 소매끝을 뻗는다 (한지 실루엣 받침 위에) -->
          <div class="fig fig-l" :style="heroFigL">
            <span class="paper-doll float-a">
              <img :src="cut('mudong_dancer')" alt="" class="silhouette" draggable="false" />
              <img :src="cut('mudong_dancer')" alt="" draggable="false" />
            </span>
          </div>
          <!-- 오른쪽: 까치 — 부리를 내민다 -->
          <div class="fig fig-r" :style="heroFigR">
            <span class="paper-doll float-b">
              <img :src="cut('tiger_magpie')" alt="" class="silhouette" draggable="false" />
              <img :src="cut('tiger_magpie')" alt="" draggable="false" />
            </span>
          </div>
          <!-- 맞닿는 지점의 서기(瑞氣) -->
          <span class="spark"></span>

          <!-- 표제함 -->
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

    <!-- ══ 도시 챕터 ══ -->
    <section
      v-for="(c, i) in cities"
      :key="c.id"
      :ref="(el) => (chapterEls[i] = el)"
      class="chapter"
      :id="c.id"
    >
      <!-- sticky 화폭 : 뒤에 고정된 채 카드가 그 위로 흐른다 -->
      <div class="scene-sticky">
        <div class="scene-cam" :style="sceneStyle(i)">
          <MinhwaScene :status="c.status" :is-day="c.isDay" />
        </div>

        <!-- 마스코트 누끼 (한지 실루엣 받침) -->
        <span class="mascot" :style="mascotStyle(i, mascots[c.id])">
          <span class="paper-doll" :class="mascots[c.id].idle">
            <img :src="mascots[c.id].src()" alt="" class="silhouette" draggable="false" />
            <img :src="mascots[c.id].src()" alt="" draggable="false" />
          </span>
        </span>

        <!-- 초대형 헤드라인 — 그림과 겹친다 -->
        <h2 class="mega" :style="headStyle(i)">
          {{ c.name }}
          <small>{{ c.hanja }} · {{ c.country }}</small>
        </h2>

        <!-- 드롭캡 내러티브 -->
        <p class="narrative" :style="headStyle(i)">
          <span class="dcap">{{ firstChar(c.line) }}</span>{{ restChars(c.line) }}
        </p>
      </div>

      <!-- 화폭 위로 흘러 올라오는 카드들 -->
      <div class="flow">
        <div class="cards">
          <div class="card">
            <p class="c-label util">기온 氣溫</p>
            <p class="c-big">{{ c.temp }}<small>°C</small></p>
            <p class="c-sub util">
              <span class="c-hanja">{{ statusHanja[c.status] ?? '晴' }}</span> {{ c.status }} ·
              {{ c.live && c.localTime ? `현지 ${c.localTime}` : '표본' }} · {{ c.isDay ? '낮' : '밤' }}
            </p>
          </div>
          <div class="card">
            <p class="c-label util">습도 濕度</p>
            <p class="c-big">{{ c.humidity }}<small>%</small></p>
            <p class="c-sub util">바람 {{ c.wind }}m/s</p>
          </div>
          <div class="card">
            <p class="c-label util">빨래 지수</p>
            <p class="c-big">{{ laundryScore(c) }}<small>점</small></p>
            <p class="c-sub util">마당에 널어도 좋은가</p>
          </div>
          <div class="card">
            <p class="c-label util">오늘 밤 별</p>
            <p class="c-big">{{ starCount(c) }}<small>개</small></p>
            <p class="c-sub util">{{ skyGrade(starCount(c)) }}</p>
          </div>
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
.fig img {
  width: 100%;
  height: auto;
  user-select: none;
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
  animation: floatA 7s ease-in-out infinite alternate;
}
.float-b {
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
/* 손끝(소매끝↔부리)이 닿는 지점 */
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

/* ── 챕터 ── */
.chapter {
  position: relative;
}
/* 레퍼런스의 canvas-wrapper 기법: sticky + -100vh 음수마진 */
.scene-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  margin-bottom: -100vh;
  overflow: hidden;
  z-index: 0;
}
.scene-cam {
  position: absolute;
  inset: 0;
  will-change: transform, opacity;
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
.mascot img {
  width: 100%;
  height: auto;
  user-select: none;
}
/* 한지 실루엣 받침 — 종이 인형을 오려 붙인 질감 */
.paper-doll {
  position: relative;
  display: block;
}
.paper-doll img {
  display: block;
  width: 100%;
  height: auto;
}
.paper-doll .silhouette {
  position: absolute;
  inset: 0;
  filter: brightness(0) invert(0.93) sepia(0.55) saturate(0.9) brightness(1.04);
  transform: scale(1.025);
}
.paper-doll img:last-child {
  position: relative;
  z-index: 1; /* 본화가 실루엣 위에 */
}
.mascot .paper-doll.sway { animation: mSway 4.8s ease-in-out infinite alternate; transform-origin: 45% 88%; }
@keyframes mSway { from { transform: rotate(-1.8deg); } to { transform: rotate(2.2deg) translateY(-5px); } }
.mascot .paper-doll.bob { animation: mBob 3.8s ease-in-out infinite alternate; }
@keyframes mBob { from { transform: translateY(0); } to { transform: translateY(-8px); } }
.mascot .paper-doll.breathe { animation: mBreathe 5s ease-in-out infinite; transform-origin: 45% 65%; }
@keyframes mBreathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.022); } }
.mascot .paper-doll.tussle { animation: mTussle 4s ease-in-out infinite; transform-origin: 50% 80%; }
@keyframes mTussle {
  0%, 100% { transform: translateX(-7px) rotate(-1.4deg); }
  45% { transform: translateX(8px) rotate(1.6deg); }
  70% { transform: translateX(3px) translateY(-7px); }
}

/* 초대형 헤드라인 — Shipping 프레임의 자리 */
.mega {
  position: absolute;
  left: 5%;
  right: 5%;
  top: 34%;
  z-index: 1; /* 마스코트가 글자를 살짝 가리도록 (레퍼런스의 치타↔Shipping 겹침) */
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
.narrative {
  position: absolute;
  left: 5%;
  bottom: 7%;
  z-index: 3;
  max-width: min(640px, 84vw);
  margin: 0;
  font-size: clamp(17px, 2.4vw, 26px);
  line-height: 1.7;
  color: var(--baek);
  text-shadow: 0 2px 18px rgba(0, 0, 0, 0.5);
  will-change: transform, opacity;
}
/* 드롭캡 — 필사본 첫 글자 */
.dcap {
  float: left;
  font-family: var(--font-display);
  font-size: 3.1em;
  line-height: 0.9;
  margin: 0.04em 0.14em 0 0;
  color: #e8a5b0;
}

/* 화폭 위로 흐르는 카드 */
.flow {
  position: relative;
  z-index: 5;
  padding: 168vh 5% 22vh; /* 화폭을 충분히 감상한 뒤에야 카드가 올라온다 */
  pointer-events: none;
}
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  max-width: 1080px;
  margin: 0 auto;
  pointer-events: auto;
}
.card {
  background: var(--baek);
  color: var(--ink);
  border-radius: 4px;
  padding: 22px 24px;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.45);
}
.c-label {
  font-size: 12px;
  letter-spacing: 0.22em;
  color: var(--ink-soft);
  margin: 0 0 8px;
}
.c-big {
  font-family: var(--font-display);
  font-size: 52px;
  line-height: 1;
  margin: 0;
}
.c-big small {
  font-size: 18px;
  color: var(--ink-soft);
  margin-left: 4px;
}
.c-sub {
  font-size: 13px;
  color: var(--ink-soft);
  margin: 10px 0 0;
  display: flex;
  align-items: center;
  gap: 7px;
}
.c-hanja {
  display: inline-grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border: 1.2px solid var(--jeok);
  color: var(--jeok);
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
  background: linear-gradient(180deg, transparent, rgba(9, 14, 25, 0.9) 30%);
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
  .flow { padding-top: 100vh; }
}

@media (prefers-reduced-motion: reduce) {
  .stroke-title {
    animation: none;
    fill-opacity: 1;
    stroke-dashoffset: 0;
  }
  .float-a, .float-b, .hcloud, .spark,
  .paper-doll { animation: none !important; }
}
</style>
