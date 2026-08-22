<script setup>
// 에디션 — 레퍼런스(Shopify Editions Winter '26 · The Renaissance Edition) 구조 복제 전용 화폭.
// 12챕터 · 다크 모노크롬 · 초대형 그로테스크 헤드라인 · 필기체 드롭캡 · sticky 스크롤텔링.
// 그림은 저작권상 원본 대신 같은 시대의 퍼블릭 도메인 명화로 대치했다.
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import InkRipple from '@/components/minhwa/InkRipple.vue'
import ScrollHint from '@/components/minhwa/ScrollHint.vue'

import heroImg from '@/assets/world-art/hero.jpg'
import vitruvianImg from '@/assets/world-art/ed_vitruvian.jpg'
import puttiImg from '@/assets/world-art/src_putti.jpg'
import athensImg from '@/assets/world-art/ed_athens.jpg'
import marketImg from '@/assets/world-art/ed_market.jpg'
import moneylenderImg from '@/assets/world-art/ed_moneylender.jpg'
import harvestersImg from '@/assets/world-art/ed_harvesters.jpg'
import venusImg from '@/assets/world-art/src_venus.jpg'
import ambassadorsImg from '@/assets/world-art/ed_ambassadors.jpg'
import taxImg from '@/assets/world-art/ed_taxcollectors.jpg'
import horseImg from '@/assets/world-art/src_horse.jpg'
import babelImg from '@/assets/world-art/src_babel.jpg'

const numerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']

const chapters = [
  { id: 'sidekick', tagline: 'Complexity, delegated.', name: 'Sidekick', desc: 'An AI-powered expert who is just as obsessed with your business as you are.', img: puttiImg, focal: '50% 30%', caption: '라파엘로 「시스티나의 두 푸티」 1512' },
  { id: 'agentic', tagline: 'Sell where the talking happens.', name: 'Agentic', desc: 'Sell directly in AI chats, with built-in tools that carry your products to every platform.', img: heroImg, focal: '38% 42%', caption: '미켈란젤로 「아담의 창조」 1512' },
  { id: 'online', tagline: 'Test before you trust.', name: 'Online', desc: 'Validate store changes with A/B testing and AI that simulates shopping behavior.', img: vitruvianImg, focal: '50% 38%', caption: '레오나르도 다빈치 「비트루비우스 인간」 1490' },
  { id: 'retail', tagline: 'Hardware, unwavering.', name: 'Retail', desc: 'New in-store hardware built for unwavering reliability.', img: marketImg, focal: '46% 40%', caption: '피터르 아르첸 「시장 풍경」 1550' },
  { id: 'marketing', tagline: 'A network of wants.', name: 'Marketing', desc: 'Grow your sales with a first-of-its-kind product network.', img: athensImg, focal: '50% 46%', caption: '라파엘로 「아테네 학당」 1511' },
  { id: 'checkout', tagline: 'The shortest path to yes.', name: 'Checkout', desc: 'Convert more customers with personalized checkout and more ways to pay.', img: moneylenderImg, focal: '48% 38%', caption: '크벤틴 마시스 「환전상과 그의 아내」 1514' },
  { id: 'operations', tagline: 'Order from chaos.', name: 'Operations', desc: 'Flexible inventory modeling and trend-spotting analytics for everyday workflows.', img: harvestersImg, focal: '55% 45%', caption: '피터르 브뤼헐 「수확하는 사람들」 1565' },
  { id: 'shopapp', tagline: 'Where shoppers arrive.', name: 'Shop app', desc: 'Reach millions of high-intent shoppers with personalized buying experiences.', img: venusImg, focal: '50% 35%', caption: '보티첼리 「비너스의 탄생」 1485' },
  { id: 'b2b', tagline: 'Wholesale, worldwide.', name: 'B2B', desc: 'Take your wholesale business global, discover new retailers, get paid in more ways.', img: ambassadorsImg, focal: '50% 35%', caption: '한스 홀바인 「대사들」 1533' },
  { id: 'finance', tagline: 'Modern money tools.', name: 'Finance', desc: 'Modern financial tools designed for growing your business.', img: taxImg, focal: '50% 30%', caption: '판 레이메르스발러 「세리들」 1540' },
  { id: 'shipping', tagline: 'Cheetah-fast, horse-strong.', name: 'Shipping', desc: 'Ship confidently — cheetah-fast — with more label, partner, and carrier options.', img: horseImg, focal: '50% 40%', caption: '조지 스텁스 「휘슬재킷」 1762', parcel: true },
  { id: 'developer', tagline: 'Build the new build.', name: 'Developer', desc: 'An entirely new way to build for commerce, with the power of AI.', img: babelImg, focal: '48% 55%', caption: '피터르 브뤼헐 「바벨탑」 1563' },
]

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
  if (y !== lastY) {
    lastY = y
    measure()
  }
  mx.value += (tx - mx.value) * 0.06
  my.value += (ty - my.value) * 0.06
  rafId = requestAnimationFrame(loop)
}
onMounted(() => {
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

// 간주 그림 — 선묘로 머물다 원색이 중심에서 원형으로 번져 나온다 (리빌 마스크)
function chColorStyle(i) {
  const p = progress.value[i] ?? 0
  const t = easeOut(clamp01((p - 0.12) / 0.26))
  const r = (t * 120).toFixed(1)
  const mask = `radial-gradient(circle at 50% 44%, #000 ${Math.max(0, r - 26)}%, transparent ${r}%)`
  return {
    opacity: t > 0.01 ? 1 : 0,
    maskImage: mask,
    WebkitMaskImage: mask,
  }
}
// 간주 카메라 — 스크롤을 따라 시점이 천천히 도는 3D 오빗
function chCamStyle(i) {
  const p = progress.value[i] ?? 0
  const drift = (p - 0.5) * 2
  return {
    transform: `perspective(1100px) rotateY(${(drift * 5 + mx.value * 2.4).toFixed(2)}deg) rotateX(${(-drift * 2.4 + my.value * -1.6).toFixed(2)}deg) scale(${(1.12 - clamp01(p / 0.6) * 0.07).toFixed(4)}) translate3d(${(mx.value * -10).toFixed(1)}px, ${(my.value * -7).toFixed(1)}px, 0)`,
  }
}
// 별 입자 — 선묘 어둠 위 잔반짝임 (레퍼런스의 스파클)
const stars = Array.from({ length: 22 }, (_, i) => ({
  left: 4 + ((i * 137) % 92) + '%',
  top: 6 + ((i * 71) % 82) + '%',
  animationDelay: -(((i * 23) % 40) / 10).toFixed(1) + 's',
  animationDuration: (2 + ((i * 13) % 25) / 10).toFixed(1) + 's',
}))
// 히어로 3막: 먹빛 선묘 -> 에칭 그림 -> 양피지 차례
const geomStyle = computed(() => ({
  opacity: (0.85 * (1 - clamp01((heroP.value - 0.3) / 0.25))).toFixed(3),
  transform: `translate3d(${(mx.value * 10).toFixed(1)}px, ${(my.value * 7).toFixed(1)}px, 0) rotate(${(heroP.value * 8).toFixed(2)}deg)`,
}))
const bigTitleStyle = computed(() => ({
  opacity: (1 - clamp01((heroP.value - 0.42) / 0.16)).toFixed(3),
  transform: `translateY(${(heroP.value * -6).toFixed(2)}vh)`,
}))
const sketchStyle = computed(() => ({
  opacity: (easeOut(clamp01((heroP.value - 0.12) / 0.22)) * (1 - clamp01((heroP.value - 0.66) / 0.14))).toFixed(3),
  transform: `scale(${(1.12 - clamp01(heroP.value / 0.7) * 0.1).toFixed(4)}) translate3d(${(mx.value * -12).toFixed(1)}px, ${(my.value * -8).toFixed(1)}px, 0)`,
}))
const colorStyle = computed(() => {
  const t = easeOut(clamp01((heroP.value - 0.4) / 0.2))
  const r = (t * 125).toFixed(1)
  const mask = `radial-gradient(circle at 46% 40%, #000 ${Math.max(0, t * 125 - 24).toFixed(1)}%, transparent ${r}%)`
  return {
    opacity: (t > 0.01 ? 1 - clamp01((heroP.value - 0.72) / 0.12) : 0).toFixed(3),
    maskImage: mask,
    WebkitMaskImage: mask,
    transform: `scale(${(1.1 - clamp01(heroP.value / 0.8) * 0.08).toFixed(4)}) translate3d(${(mx.value * -12).toFixed(1)}px, ${(my.value * -8).toFixed(1)}px, 0)`,
  }
})
// 히어로 3D 카메라 — 마우스·스크롤에 무대 전체가 은근히 돈다
const heroCamStyle = computed(() => ({
  transform: `perspective(1100px) rotateY(${(mx.value * 3 + (heroP.value - 0.3) * 4).toFixed(2)}deg) rotateX(${(my.value * -2).toFixed(2)}deg)`,
}))
const parchStyle = computed(() => ({
  transform: `translateY(${((1 - easeOut(clamp01((heroP.value - 0.62) / 0.3))) * 104).toFixed(2)}%)`,
}))

function jump(i) {
  chapterEls.value[i]?.scrollIntoView({ behavior: 'smooth' })
}
function toTop() {
  if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.6 })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <main class="edition">
    <InkRipple />
    <div class="grain" aria-hidden="true"></div>

    <!-- ══ 히어로 — 3막: 먹빛 선묘 → 에칭 → 양피지 차례 ══ -->
    <section ref="heroEl" class="hero-wrap">
      <div class="hero-stage">
        <!-- 에칭용 엣지 필터 -->
        <svg width="0" height="0" style="position: absolute" aria-hidden="true">
          <filter id="edgeSketch">
            <feColorMatrix type="saturate" values="0" />
            <feConvolveMatrix order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" preserveAlpha="true" />
            <feComponentTransfer>
              <feFuncR type="linear" slope="2.4" /><feFuncG type="linear" slope="2.4" /><feFuncB type="linear" slope="2.4" />
            </feComponentTransfer>
          </filter>
        </svg>

        <!-- 1막: 다빈치식 기하 선 -->
        <svg class="geom" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" :style="geomStyle" aria-hidden="true">
          <g fill="none" stroke="rgba(244,241,234,0.11)" stroke-width="1">
            <circle cx="600" cy="410" r="330" />
            <circle cx="600" cy="410" r="205" />
            <rect x="330" y="140" width="540" height="540" />
            <line x1="0" y1="800" x2="1200" y2="0" />
            <line x1="0" y1="0" x2="1200" y2="800" />
            <line x1="600" y1="0" x2="600" y2="800" />
            <line x1="0" y1="410" x2="1200" y2="410" />
            <path d="M330 680 A 380 380 0 0 1 870 680" />
          </g>
          <g fill="none" stroke="rgba(244,241,234,0.06)" stroke-width="1">
            <line x1="300" y1="0" x2="300" y2="800" />
            <line x1="900" y1="0" x2="900" y2="800" />
          </g>
        </svg>

        <!-- 2막: 백색 선묘 에칭 → 원색 (3D 무대) -->
        <div class="depth" :style="heroCamStyle">
          <div class="etch" :style="sketchStyle">
            <img :src="heroImg" alt="" draggable="false" />
          </div>
          <div class="etch-color" :style="colorStyle">
            <img :src="heroImg" alt="미켈란젤로, 아담의 창조" draggable="false" />
          </div>
          <span v-for="(st, k) in stars" :key="'hs' + k" class="star" :style="[st, { opacity: sketchStyle.opacity }]"></span>
        </div>

        <!-- 표제 — ai만 세리프 이탤릭 (레퍼런스의 말장난) -->
        <h1 class="big-title" :style="bigTitleStyle">
          The<br />Ren<em>ai</em>ssance<br />Edition
        </h1>

        <!-- 3막: 찢긴 양피지 — 차례 -->
        <div class="parchment" :style="parchStyle">
          <div class="parch-inner">
            <p class="parch-title">The Ren<em>ai</em>ssance<br />Edition</p>
            <ol class="menu">
              <li v-for="(ch, i) in chapters" :key="ch.id">
                <button class="menu-item" @click="jump(i)">
                  <span class="m-name">{{ ch.name }}</span>
                  <span class="m-dots"></span>
                  <span class="m-num">{{ numerals[i] }}</span>
                </button>
              </li>
            </ol>
            <p class="parch-narrative">
              <span class="pn-cap">A</span> new world of commerce — twelve chapters, painted anew.
            </p>
          </div>
        </div>

        <div class="hero-hint" :style="bigTitleStyle"><ScrollHint label="Scroll" /></div>
      </div>
    </section>

    <!-- ══ 12 챕터 — 크림 카탈로그 + 그림 간주 ══ -->
    <div class="catalog">
      <!-- 좌측 고정 차례 (레퍼런스의 사이드바) -->
      <aside v-show="activeIdx >= 0" class="sidebar">
        <p class="sb-title">The Ren<em>ai</em>ssance<br />Edition</p>
        <ol class="sb-menu">
          <li v-for="(ch, i) in chapters" :key="ch.id">
            <button class="sb-item" :class="{ on: activeIdx === i }" @click="jump(i)">
              <span>{{ ch.name }}</span>
              <span class="sb-dots"></span>
              <span class="sb-num">{{ numerals[i] }}</span>
            </button>
          </li>
        </ol>
      </aside>

      <section
        v-for="(ch, i) in chapters"
        :key="ch.id"
        :ref="(el) => (chapterEls[i] = el)"
        class="chapter"
        :id="'ed-' + ch.id"
      >
        <!-- 그림 간주 — 에칭으로 떠올라 원색이 되는 순간 -->
        <div class="ch-art">
          <div class="ch-art-sticky">
            <div class="depth" :style="chCamStyle(i)">
              <div class="etch"><img :src="ch.img" alt="" loading="lazy" decoding="async" draggable="false" /></div>
              <div class="etch-color" :style="chColorStyle(i)">
                <img :src="ch.img" :alt="ch.caption" loading="lazy" decoding="async" draggable="false" />
              </div>
              <span v-for="(st, k) in stars" :key="'cs' + k" class="star" :style="st"></span>
            </div>
            <span v-if="ch.parcel" class="parcel">Editions<br />特急</span>
            <p class="ch-mark">{{ numerals[i] }} — {{ ch.name }}</p>
          </div>
        </div>

        <!-- 크림 본문 — 필기체 드롭캡 헤드라인 + 피처 블록 -->
        <div class="ch-body">
          <h2 class="ch-head">
            <span class="ch-cap">{{ ch.tagline.slice(0, 1) }}</span>{{ ch.tagline.slice(1) }}
          </h2>
          <div class="feature">
            <h3 class="ft-kicker">{{ ch.name }}</h3>
            <p class="ft-copy">{{ ch.desc }}</p>
            <span class="doc-pill">{{ ch.caption }}</span>
            <div class="media-card">
              <span class="ring ring-a" aria-hidden="true"></span>
              <span class="ring ring-b" aria-hidden="true"></span>
              <img :src="ch.img" :alt="ch.caption" loading="lazy" decoding="async" draggable="false" />
            </div>
          </div>
          <button class="backnav" @click="toTop">Back to navigation ↑</button>
        </div>
      </section>

      <section class="outro">
        <p class="outro-copy">Fin.</p>
        <router-link to="/world" class="outro-link util">만국청우록 — 세계화폭으로 →</router-link>
      </section>
    </div>
  </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Imperial+Script&display=swap');

.edition {
  position: relative;
  background: #0a0a0a;
  color: #f4f1ea;
}
.util {
  font-family: var(--font-util);
}

/* ── 히어로 3막 ── */
.hero-wrap {
  height: 420vh;
}
.hero-stage {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  background: #0a0a0a;
}
.geom {
  position: absolute;
  inset: -4%;
  width: 108%;
  height: 108%;
  will-change: transform, opacity;
}
/* 3D 무대 — 원근 카메라가 마우스·스크롤을 따라 돈다 */
.depth {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  will-change: transform;
}
/* 별 입자 — 선묘 위 잔반짝임 */
.star {
  position: absolute;
  width: 2.5px;
  height: 2.5px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 6px 1.5px rgba(255, 255, 255, 0.7);
  animation: starTwinkle ease-in-out infinite;
  pointer-events: none;
}
@keyframes starTwinkle {
  0%, 100% { opacity: 0; transform: scale(0.5); }
  50% { opacity: 0.95; transform: scale(1.2); }
}
/* 에칭 — 엣지 추출로 백색 선묘가 어둠 속에 떠오른다 */
.etch,
.etch-color {
  position: absolute;
  inset: -3%;
  will-change: transform, opacity;
}
.etch img,
.etch-color img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 36%;
  user-select: none;
}
.etch img {
  filter: url(#edgeSketch) brightness(1.15);
  mix-blend-mode: screen;
}
.etch-color img {
  filter: saturate(0.92) brightness(0.9);
}
.big-title {
  position: absolute;
  left: 33%;
  top: 58%;
  transform: translateY(-50%);
  margin: 0;
  font-family: 'Helvetica Neue', Helvetica, Arial, var(--font-util);
  font-weight: 800;
  font-size: clamp(34px, 4.6vw, 64px);
  line-height: 1.02;
  letter-spacing: -0.015em;
  color: #fff;
  will-change: transform, opacity;
  animation: titleFill 1.8s ease-out both;
}
.big-title em,
.parch-title em {
  font-family: Georgia, 'Times New Roman', serif;
  font-style: italic;
  font-weight: 400;
  letter-spacing: 0;
}
@keyframes titleFill {
  0% { opacity: 0; filter: blur(5px); }
  100% { opacity: 1; filter: blur(0); }
}
/* 양피지 — 찢긴 윗단으로 밀고 올라온다 */
.parchment {
  position: absolute;
  inset: 0;
  background: #ece9dc;
  color: #14130f;
  will-change: transform;
  box-shadow: 0 -30px 60px rgba(0, 0, 0, 0.5);
}
.parchment::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: -22px;
  height: 23px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='24' preserveAspectRatio='none'%3E%3Cpath d='M0 24 L0 16 Q13 7 28 14 T60 10 T92 15 T124 8 T156 14 T188 9 T220 15 T252 10 T284 16 T316 9 T348 13 T380 10 L400 15 L400 24 Z' fill='%23ece9dc'/%3E%3C/svg%3E");
  background-size: 400px 24px;
  background-repeat: repeat-x;
}
.parch-inner {
  max-width: 560px;
  padding: clamp(28px, 7vh, 72px) 8vw 40px;
}
.parch-title {
  margin: 0 0 5vh;
  font-family: 'Helvetica Neue', Helvetica, Arial, var(--font-util);
  font-weight: 800;
  font-size: clamp(22px, 2.4vw, 32px);
  line-height: 1.05;
  letter-spacing: -0.015em;
  color: #14130f;
}
.menu {
  list-style: none;
  margin: 0 0 5vh;
  padding: 0;
}
.menu-item {
  display: flex;
  align-items: baseline;
  gap: 10px;
  width: 100%;
  background: none;
  border: 0;
  padding: 3.5px 0;
  cursor: pointer;
  color: #a09d92;
  font-family: 'Helvetica Neue', Helvetica, Arial, var(--font-util);
  font-size: clamp(17px, 1.9vw, 24px);
  font-weight: 800;
  letter-spacing: 0.01em;
  transition: color 0.2s;
}
.menu-item:hover {
  color: #14130f;
}
.menu li:first-child .menu-item {
  color: #14130f;
}
.m-dots {
  flex: 1;
  border-bottom: 1.5px dotted #b9b5a6;
  transform: translateY(-4px);
}
.m-num {
  font-family: Georgia, serif;
  font-weight: 400;
  font-size: 0.58em;
  color: #7c7970;
}
.parch-narrative {
  margin: 0;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(17px, 1.9vw, 23px);
  line-height: 1.6;
  color: #14130f;
}
.pn-cap {
  float: left;
  font-family: 'Imperial Script', cursive;
  font-size: 4.6em;
  line-height: 0.66;
  margin: 0.05em 0.1em 0 0;
}
.hero-hint {
  position: absolute;
  left: 50%;
  bottom: 4%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.8);
}

/* ── 크림 카탈로그 ── */
.catalog {
  position: relative;
  background: #e8e6db;
  color: #14130f;
}
.sidebar {
  position: fixed;
  left: 22px;
  top: 96px;
  z-index: 30;
  width: 200px;
}
.sb-title {
  margin: 0 0 18px;
  font-family: 'Helvetica Neue', Helvetica, Arial, var(--font-util);
  font-weight: 800;
  font-size: 17px;
  line-height: 1.1;
  letter-spacing: -0.01em;
  color: #14130f;
}
.sb-title em {
  font-family: Georgia, serif;
  font-style: italic;
  font-weight: 400;
}
.sb-menu {
  list-style: none;
  margin: 0;
  padding: 0;
}
.sb-item {
  display: flex;
  align-items: baseline;
  gap: 7px;
  width: 100%;
  background: none;
  border: 0;
  padding: 2px 0;
  cursor: pointer;
  color: #a09d92;
  font-family: 'Helvetica Neue', Helvetica, Arial, var(--font-util);
  font-size: 13.5px;
  font-weight: 700;
  transition: color 0.25s;
  text-align: left;
}
.sb-item:hover,
.sb-item.on {
  color: #14130f;
}
.sb-dots {
  flex: 1;
  border-bottom: 1.2px dotted #b9b5a6;
  transform: translateY(-3px);
}
.sb-num {
  font-family: Georgia, serif;
  font-weight: 400;
  font-size: 10px;
  color: #7c7970;
}

/* 챕터 */
.chapter {
  position: relative;
}
.ch-art {
  height: 170vh;
  background: #0a0a0a;
}
.ch-art-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  background: #0a0a0a;
}
.ch-art .etch,
.ch-art .etch-color {
  position: absolute;
  inset: -3%;
  will-change: transform, opacity;
}
.ch-art .etch img,
.ch-art .etch-color img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
}
.ch-art .etch img {
  filter: url(#edgeSketch) brightness(1.1);
  mix-blend-mode: screen;
}
.ch-art .etch-color img {
  filter: saturate(0.94) brightness(0.92);
}
.ch-mark {
  position: absolute;
  left: 5%;
  bottom: 5%;
  margin: 0;
  font-family: Georgia, serif;
  font-style: italic;
  font-size: clamp(15px, 1.6vw, 20px);
  letter-spacing: 0.14em;
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.7);
}
.parcel {
  position: absolute;
  z-index: 3;
  left: 55%;
  top: 45%;
  width: clamp(70px, 9vw, 150px);
  aspect-ratio: 1 / 0.82;
  background: linear-gradient(160deg, #e8722e, #c9571d);
  border-radius: 6% / 8%;
  rotate: -9deg;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.45), inset 0 0 0 2px rgba(255, 255, 255, 0.18);
  color: #fff7ec;
  font-size: clamp(10px, 1vw, 14px);
  font-weight: 700;
  line-height: 1.25;
  display: grid;
  place-items: center;
  text-align: center;
  letter-spacing: 0.08em;
  font-family: var(--font-util);
}

/* 크림 본문 */
.ch-body {
  padding: clamp(48px, 10vh, 110px) 8vw clamp(40px, 8vh, 90px) clamp(260px, 24vw, 320px);
  max-width: 1100px;
}
.ch-head {
  margin: 0 0 6vh;
  font-family: Georgia, 'Times New Roman', serif;
  font-weight: 400;
  font-size: clamp(30px, 4.2vw, 58px);
  letter-spacing: 0.005em;
  color: #14130f;
  text-wrap: balance;
}
.ch-cap {
  float: left;
  font-family: 'Imperial Script', cursive;
  font-size: 2.1em;
  line-height: 0.62;
  margin: 0.07em 0.06em 0 0;
}
.ft-kicker {
  margin: 0 0 12px;
  font-family: 'Helvetica Neue', Helvetica, Arial, var(--font-util);
  font-size: 15px;
  font-weight: 700;
  color: #14130f;
  clear: left;
}
.ft-copy {
  margin: 0 0 16px;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(19px, 2.2vw, 27px);
  line-height: 1.45;
  color: #2b2a24;
  max-width: 30ch;
}
.doc-pill {
  display: inline-block;
  padding: 6px 12px;
  border: 1px solid #b9b5a6;
  border-radius: 999px;
  background: #f4f2e9;
  font-family: var(--font-util);
  font-size: 12px;
  color: #14130f;
}
.media-card {
  position: relative;
  margin-top: 5vh;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(20, 19, 15, 0.22);
}
.media-card img {
  display: block;
  width: 100%;
  height: clamp(260px, 48vh, 460px);
  object-fit: cover;
  user-select: none;
}
.ring {
  position: absolute;
  border: 1.5px solid rgba(108, 92, 231, 0.65);
  border-radius: 50%;
  pointer-events: none;
  z-index: 2;
}
.ring-a {
  width: 120px;
  height: 120px;
  right: 8%;
  top: 12%;
  box-shadow: 0 0 0 22px rgba(108, 92, 231, 0.12) inset;
  border-style: dashed;
  animation: ringSpin 26s linear infinite;
}
@keyframes ringSpin {
  to { transform: rotate(360deg); }
}
.ring-b {
  width: 54px;
  height: 54px;
  left: 10%;
  bottom: 14%;
}
.backnav {
  display: inline-block;
  margin: 6vh 0 0;
  padding: 0;
  background: none;
  border: 0;
  cursor: pointer;
  color: #55534a;
  font-family: var(--font-util);
  font-size: 12.5px;
  letter-spacing: 0.08em;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.backnav:hover {
  color: #14130f;
}

/* 그레인 · 브랜드 */
.grain {
  position: fixed;
  inset: 0;
  z-index: 40;
  pointer-events: none;
  opacity: 0.14;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' seed='3'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.05 0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23g)'/%3E%3C/svg%3E");
}

/* 발문 */
.outro {
  position: relative;
  z-index: 5;
  text-align: center;
  padding: 12vh 24px 14vh;
  color: #14130f;
}
.outro-copy {
  font-family: 'Imperial Script', var(--font-display), cursive;
  font-size: clamp(38px, 6vw, 64px);
  margin: 0 0 14px;
}
.outro-link {
  color: #14130f;
  font-size: 14px;
  font-weight: 500;
}

@media (max-width: 860px) {
  .rail { display: none; }
  .mega { top: 22%; }
  .menu { grid-template-columns: 1fr; gap: 0; }
  .parcel { left: 52%; top: 42%; }
}
@media (prefers-reduced-motion: reduce) {
  .star,
  .ring-a {
    animation: none !important;
  }
  .hero-art, .menu li, .ed-title, .ed-sub { animation: none !important; opacity: 1; }
}
</style>
