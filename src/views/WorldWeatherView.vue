<script setup>
// 세계화폭 — 만국청우록(萬國晴雨錄)
// 레퍼런스: Shopify Editions Winter '26 를 그대로 —
//  · 히어로: 미켈란젤로 「아담의 창조」 — 손끝이 닿는 그 장면 위에 1px 표제함 + 차례
//  · 챕터: 도시마다 "그 나라의 명화"가 한 폭씩 (도쿄=호쿠사이, 베이징=왕희맹,
//    파리=모네, 런던=터너, 뉴욕=비어슈타트, 시드니=폰 게라르)
//  · 설명 블록 없음 — 그림 전환 연출 중심. 민화는 국내 화폭 전용.
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import InkRipple from '@/components/minhwa/InkRipple.vue'
import ScrollHint from '@/components/minhwa/ScrollHint.vue'
import { useWorldWeather } from '@/composables/useWeather.js'

import heroImg from '@/assets/world-art/hero.jpg'
import tokyoImg from '@/assets/world-art/tokyo.jpg'
import beijingImg from '@/assets/world-art/beijing.jpg'
import parisImg from '@/assets/world-art/paris.jpg'
import londonImg from '@/assets/world-art/london.jpg'
import newyorkImg from '@/assets/world-art/newyork.jpg'
import sydneyImg from '@/assets/world-art/sydney.jpg'

const { cities, loading, error, fetchLive } = useWorldWeather()

const numerals = ['一', '二', '三', '四', '五', '六']
const statusHanja = { 맑음: '晴', 구름: '雲', 흐림: '陰', 비: '雨', 뇌우: '雷', 눈: '雪', 바람: '風' }

// 도시 = 그 나라의 그림
const artMap = {
  w_tokyo: { img: tokyoImg, caption: '가쓰시카 호쿠사이 「가나가와 해변의 높은 파도」 1831', focal: '38% 45%' },
  w_beijing: { img: beijingImg, caption: '왕희맹 「천리강산도」 1113 · 북송', focal: '50% 55%' },
  w_paris: { img: parisImg, caption: '클로드 모네 「인상, 해돋이」 1872', focal: '55% 42%' },
  w_london: { img: londonImg, caption: '윌리엄 터너 「비, 증기, 그리고 속도」 1844', focal: '58% 45%' },
  w_newyork: { img: newyorkImg, caption: '앨버트 비어슈타트 「로키산맥의 폭풍」 1866', focal: '45% 40%' },
  w_sydney: { img: sydneyImg, caption: '외젠 폰 게라르 「시드니 헤즈」 1865', focal: '50% 45%' },
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

// 자석 스냅 — 스크롤이 멈췄을 때 어중간한 지점이면 정착점으로 스르륵
function magnetSnap() {
  const i = activeIdx.value
  if (i < 0) return
  const el = chapterEls.value[i]
  if (!el) return
  const vh = window.innerHeight
  const p = progress.value[i] ?? 0
  let target = null
  if (p > 0.9) {
    const next = chapterEls.value[i + 1]
    if (next) target = next.getBoundingClientRect().top + window.scrollY + (next.offsetHeight - vh) * 0.42
  } else if (p > 0.008 && p < 0.1) {
    target = el.getBoundingClientRect().top + window.scrollY + (el.offsetHeight - vh) * 0.42
  }
  if (target !== null) {
    if (window.__lenis) window.__lenis.scrollTo(target, { duration: 1.7 })
    else window.scrollTo({ top: target, behavior: 'smooth' })
  }
}
let still = 0
let magnetArmed = true
function loop() {
  const y = window.scrollY
  if (y !== lastY) {
    lastY = y
    measure()
    still = 0
    magnetArmed = true
  } else if (magnetArmed && ++still > 20) {
    magnetArmed = false
    magnetSnap()
  }
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

// 그림 — 켄 번즈 다이브: 넓게 들어와 초점으로 빠져들고, 다음 폭에 어둠으로 내준다
function paintStyle(i, art) {
  const p = progress.value[i] ?? 0
  const enter = easeOut(clamp01(p / 0.14))
  const dive = easeOut(clamp01(p / 0.6))
  const leave = clamp01((p - 0.86) / 0.12)
  return {
    opacity: (enter * (1 - leave * 0.4)).toFixed(3),
    transform: `scale(${(1.18 - dive * 0.14 + leave * 0.08).toFixed(4)}) translate3d(${(mx.value * -10).toFixed(1)}px, ${(my.value * -7).toFixed(1)}px, 0)`,
    transformOrigin: art.focal,
    filter: `brightness(${(1 - leave * 0.6).toFixed(3)}) saturate(${(0.94 + dive * 0.1).toFixed(3)})`,
  }
}
function headStyle(i) {
  const p = progress.value[i] ?? 0
  const t = easeOut(clamp01((p - 0.06) / 0.18))
  const leave = clamp01((p - 0.82) / 0.14)
  return {
    opacity: (t * (1 - leave)).toFixed(3),
    transform: `translateY(${((1 - t) * 60 - leave * 40).toFixed(1)}px) scale(${(0.94 + t * 0.06).toFixed(3)})`,
  }
}
const heroStyle = computed(() => ({
  transform: `translateY(${(heroP.value * -8).toFixed(2)}%)`,
  opacity: clamp01((1 - heroP.value) / 0.45).toFixed(3),
}))
const heroArtStyle = computed(() => ({
  transform: `scale(${(1.08 + heroP.value * 0.1).toFixed(4)}) translate3d(${(mx.value * 14).toFixed(1)}px, ${(my.value * 9).toFixed(1)}px, 0)`,
}))

function jump(i) {
  chapterEls.value[i]?.scrollIntoView({ behavior: 'smooth' })
}
const firstChar = (s) => s.slice(0, 1)
const restChars = (s) => s.slice(1)

// 날씨 기운 (그림 위 가벼운 오버레이)
const rainDrops = Array.from({ length: 26 }, (_, i) => ({
  left: ((i * 37) % 100) + '%',
  duration: 0.9 + ((i * 13) % 10) / 11 + 's',
  delay: -((i * 7) % 20) / 10 + 's',
  opacity: 0.2 + ((i * 11) % 10) / 26,
}))
const snowFlakes = Array.from({ length: 22 }, (_, i) => ({
  left: ((i * 41) % 100) + '%',
  duration: 7 + ((i * 17) % 50) / 10 + 's',
  delay: -((i * 29) % 90) / 10 + 's',
  size: 3 + ((i * 7) % 30) / 10 + 'px',
}))
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

    <!-- ══ 히어로 : 손끝이 닿는 순간 ══ -->
    <section ref="heroEl" class="hero-wrap">
      <div class="hero-stage">
        <div class="hero-art" :style="heroArtStyle">
          <img :src="heroImg" alt="미켈란젤로, 아담의 창조" draggable="false" />
        </div>
        <div class="hero-shade"></div>
        <span class="spark"></span>

        <div class="hero-inner" :style="heroStyle">
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

        <p class="hero-credit util">미켈란젤로 「아담의 창조」 1512 · 시스티나 예배당</p>
        <div class="hero-hint"><ScrollHint label="화폭을 내리세요" /></div>
      </div>
    </section>

    <!-- ══ 도시 챕터 — 그 나라의 그림으로 ══ -->
    <section
      v-for="(c, i) in cities"
      :key="c.id"
      :ref="(el) => (chapterEls[i] = el)"
      class="chapter"
      :id="c.id"
    >
      <div class="scene-sticky">
        <div class="paint" :style="paintStyle(i, artMap[c.id])">
          <img :src="artMap[c.id].img" :alt="artMap[c.id].caption" loading="lazy" decoding="async" draggable="false" />
        </div>
        <div class="paint-shade"></div>

        <!-- 날씨 기운 -->
        <template v-if="c.status === '비' || c.status === '뇌우'">
          <span
            v-for="(d, j) in rainDrops"
            :key="'r' + j"
            class="w-drop"
            :style="{ left: d.left, animationDuration: d.duration, animationDelay: d.delay, opacity: d.opacity }"
          ></span>
        </template>
        <template v-if="c.status === '눈'">
          <span
            v-for="(f, j) in snowFlakes"
            :key="'s' + j"
            class="w-flake"
            :style="{ left: f.left, width: f.size, height: f.size, animationDuration: f.duration, animationDelay: f.delay }"
          ></span>
        </template>

        <!-- 초대형 헤드라인 -->
        <h2 class="mega" :style="headStyle(i)">
          {{ c.name }}
          <small>{{ c.hanja }} · {{ c.country }}</small>
        </h2>

        <!-- 드롭캡 + 간이 독법 + 그림 캡션 -->
        <div class="foot" :style="headStyle(i)">
          <p class="narrative">
            <span class="dcap">{{ firstChar(c.line) }}</span>{{ restChars(c.line) }}
          </p>
          <p class="reading util">
            <span class="r-hanja">{{ statusHanja[c.status] ?? '晴' }}</span>
            {{ c.temp }}° · {{ c.status }} · 습도 {{ c.humidity }}% ·
            {{ c.live && c.localTime ? `현지 ${c.localTime}` : '표본' }} · {{ c.isDay ? '낮' : '밤' }}
          </p>
          <p class="credit util">{{ artMap[c.id].caption }}</p>
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
  background: #0b0f18;
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
  background: #0b0f18;
}
.hero-art {
  position: absolute;
  inset: -4%;
  will-change: transform;
}
.hero-art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 38%;
  user-select: none;
}
.hero-shade {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 70% 60% at 50% 42%, transparent 40%, rgba(11, 15, 24, 0.68) 92%),
    linear-gradient(180deg, rgba(11, 15, 24, 0.55), transparent 26%, transparent 68%, rgba(11, 15, 24, 0.8));
}
/* 손끝이 닿는 지점 — 프레스코 중앙의 그 틈 */
.spark {
  position: absolute;
  z-index: 4;
  left: 26.5%;
  top: 55.5%;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: rgba(255, 240, 200, 0.95);
  box-shadow: 0 0 24px 7px rgba(255, 214, 140, 0.6);
  animation: sparkle 3.2s ease-in-out infinite;
}
@keyframes sparkle {
  0%, 100% { opacity: 0.2; transform: scale(0.6); }
  50% { opacity: 1; transform: scale(1.35); }
}
.hero-inner {
  position: absolute;
  inset: 0;
  will-change: transform, opacity;
}
.title-box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: min(500px, 86vw);
  padding: clamp(22px, 4vh, 40px) clamp(20px, 3.5vw, 44px);
  border: 1px solid rgba(251, 246, 234, 0.55);
  background: rgba(11, 15, 24, 0.32);
  backdrop-filter: blur(2.5px);
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
.hero-credit {
  position: absolute;
  right: 18px;
  bottom: 16px;
  margin: 0;
  font-size: 11.5px;
  color: rgba(251, 246, 234, 0.55);
  letter-spacing: 0.06em;
}
.hero-hint {
  position: absolute;
  left: 50%;
  bottom: 4%;
  transform: translateX(-50%);
  color: rgba(251, 246, 234, 0.85);
}

/* ── 챕터 ── */
.chapter {
  position: relative;
  height: 230vh;
}
.scene-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  background: #0b0f18;
}
.paint {
  position: absolute;
  inset: -3%;
  will-change: transform, opacity, filter;
}
.paint img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
}
.paint-shade {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(180deg, rgba(11, 15, 24, 0.42), transparent 24%, transparent 62%, rgba(11, 15, 24, 0.78));
}
.w-drop {
  position: absolute;
  top: -6%;
  width: 1.5px;
  height: 34px;
  background: linear-gradient(180deg, transparent, rgba(251, 246, 234, 0.7));
  transform: rotate(8deg);
  animation: wFall linear infinite;
  pointer-events: none;
}
@keyframes wFall {
  to { transform: translateY(112vh) rotate(8deg); }
}
.w-flake {
  position: absolute;
  top: -4%;
  border-radius: 50%;
  background: rgba(251, 246, 234, 0.9);
  animation: wSnow linear infinite;
  pointer-events: none;
}
@keyframes wSnow {
  to { transform: translateY(110vh) translateX(24px); }
}

.mega {
  position: absolute;
  left: 5%;
  right: 5%;
  top: 32%;
  z-index: 2;
  margin: 0;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(72px, 15vw, 200px);
  line-height: 0.95;
  letter-spacing: 0.06em;
  color: var(--baek);
  text-shadow: 0 4px 44px rgba(0, 0, 0, 0.55);
  will-change: transform, opacity;
  pointer-events: none;
}
.mega small {
  display: block;
  font-size: clamp(13px, 1.6vw, 19px);
  letter-spacing: 0.5em;
  margin-top: 14px;
  color: rgba(251, 246, 234, 0.8);
}
.foot {
  position: absolute;
  left: 5%;
  right: 5%;
  bottom: 6%;
  z-index: 3;
  max-width: 760px;
  will-change: transform, opacity;
}
.narrative {
  margin: 0;
  font-size: clamp(17px, 2.4vw, 26px);
  line-height: 1.7;
  color: var(--baek);
  text-shadow: 0 2px 18px rgba(0, 0, 0, 0.6);
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
  color: rgba(251, 246, 234, 0.88);
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
.credit {
  margin: 10px 0 0;
  font-size: 11.5px;
  color: rgba(251, 246, 234, 0.55);
  letter-spacing: 0.05em;
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
  .mega { top: 24%; }
}

@media (prefers-reduced-motion: reduce) {
  .stroke-title {
    animation: none;
    fill-opacity: 1;
    stroke-dashoffset: 0;
  }
  .spark, .w-drop, .w-flake { animation: none !important; }
}
</style>
