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
  { id: 'sidekick', name: 'Sidekick', desc: 'An AI-powered expert who is just as obsessed with your business as you are.', img: puttiImg, focal: '50% 30%', caption: '라파엘로 「시스티나의 두 푸티」 1512' },
  { id: 'agentic', name: 'Agentic', desc: 'Sell directly in AI chats, with built-in tools that carry your products to every platform.', img: heroImg, focal: '38% 42%', caption: '미켈란젤로 「아담의 창조」 1512' },
  { id: 'online', name: 'Online', desc: 'Validate store changes with A/B testing and AI that simulates shopping behavior.', img: vitruvianImg, focal: '50% 38%', caption: '레오나르도 다빈치 「비트루비우스 인간」 1490' },
  { id: 'retail', name: 'Retail', desc: 'New in-store hardware built for unwavering reliability.', img: marketImg, focal: '46% 40%', caption: '피터르 아르첸 「시장 풍경」 1550' },
  { id: 'marketing', name: 'Marketing', desc: 'Grow your sales with a first-of-its-kind product network.', img: athensImg, focal: '50% 46%', caption: '라파엘로 「아테네 학당」 1511' },
  { id: 'checkout', name: 'Checkout', desc: 'Convert more customers with personalized checkout and more ways to pay.', img: moneylenderImg, focal: '48% 38%', caption: '크벤틴 마시스 「환전상과 그의 아내」 1514' },
  { id: 'operations', name: 'Operations', desc: 'Flexible inventory modeling and trend-spotting analytics for everyday workflows.', img: harvestersImg, focal: '55% 45%', caption: '피터르 브뤼헐 「수확하는 사람들」 1565' },
  { id: 'shopapp', name: 'Shop app', desc: 'Reach millions of high-intent shoppers with personalized buying experiences.', img: venusImg, focal: '50% 35%', caption: '보티첼리 「비너스의 탄생」 1485' },
  { id: 'b2b', name: 'B2B', desc: 'Take your wholesale business global, discover new retailers, get paid in more ways.', img: ambassadorsImg, focal: '50% 35%', caption: '한스 홀바인 「대사들」 1533' },
  { id: 'finance', name: 'Finance', desc: 'Modern financial tools designed for growing your business.', img: taxImg, focal: '50% 30%', caption: '판 레이메르스발러 「세리들」 1540' },
  { id: 'shipping', name: 'Shipping', desc: 'Ship confidently — cheetah-fast — with more label, partner, and carrier options.', img: horseImg, focal: '50% 40%', caption: '조지 스텁스 「휘슬재킷」 1762', parcel: true },
  { id: 'developer', name: 'Developer', desc: 'An entirely new way to build for commerce, with the power of AI.', img: babelImg, focal: '48% 55%', caption: '피터르 브뤼헐 「바벨탑」 1563' },
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

function paintStyle(i, ch) {
  const p = progress.value[i] ?? 0
  const enter = easeOut(clamp01(p / 0.14))
  const dive = easeOut(clamp01(p / 0.6))
  const leave = clamp01((p - 0.86) / 0.12)
  return {
    opacity: (enter * (1 - leave * 0.4)).toFixed(3),
    transform: `scale(${(1.16 - dive * 0.12 + leave * 0.07).toFixed(4)}) translate3d(${(mx.value * -10).toFixed(1)}px, ${(my.value * -7).toFixed(1)}px, 0)`,
    transformOrigin: ch.focal,
    filter: `brightness(${(1 - leave * 0.6).toFixed(3)})`,
  }
}
function headStyle(i) {
  const p = progress.value[i] ?? 0
  const t = easeOut(clamp01((p - 0.06) / 0.18))
  const leave = clamp01((p - 0.82) / 0.14)
  return {
    opacity: (t * (1 - leave)).toFixed(3),
    transform: `translateY(${((1 - t) * 60 - leave * 40).toFixed(1)}px) translateX(${(mx.value * 7).toFixed(1)}px)`,
  }
}
function ghostStyle(i) {
  const p = progress.value[i] ?? 0
  return {
    opacity: (clamp01(p / 0.2) * (1 - clamp01((p - 0.8) / 0.16)) * 0.08).toFixed(3),
    transform: `translateY(${((0.5 - p) * 12).toFixed(1)}vh)`,
  }
}
const heroStyle = computed(() => ({
  transform: `translateY(${(heroP.value * -10).toFixed(2)}%)`,
  opacity: clamp01((1 - heroP.value) / 0.4).toFixed(3),
}))
const heroArtStyle = computed(() => ({
  transform: `translate3d(${(mx.value * 12).toFixed(1)}px, ${(my.value * 8).toFixed(1)}px, 0)`,
}))

function jump(i) {
  chapterEls.value[i]?.scrollIntoView({ behavior: 'smooth' })
}
function toTop() {
  if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.6 })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}
const firstChar = (s) => s.slice(0, 1)
const restChars = (s) => s.slice(1)
</script>

<template>
  <main class="edition">
    <InkRipple />
    <div class="grain" aria-hidden="true"></div>
    <p v-show="activeIdx >= 0" class="brand util">The Renaissance Edition</p>

    <!-- 좌측 차례 레일 -->
    <nav v-show="activeIdx >= 0" class="rail util" aria-label="차례">
      <button
        v-for="(ch, i) in chapters"
        :key="ch.id"
        class="rail-item"
        :class="{ on: activeIdx === i }"
        @click="jump(i)"
      >
        {{ ch.name }}
      </button>
    </nav>

    <!-- ══ 히어로 — 다빈치 소묘 위 표제 ══ -->
    <section ref="heroEl" class="hero-wrap">
      <div class="hero-stage">
        <div class="hero-art" :style="heroArtStyle">
          <img :src="vitruvianImg" alt="" draggable="false" />
        </div>
        <div class="hero-shade"></div>

        <div class="hero-inner" :style="heroStyle">
          <h1 class="ed-title"><span class="sketch">The</span> Renaissance <span class="sketch">Edition</span></h1>
          <p class="ed-sub util">A new world of commerce · 150+ product updates</p>

          <ol class="menu util">
            <li v-for="(ch, i) in chapters" :key="ch.id" :style="{ animationDelay: (1.1 + i * 0.09).toFixed(2) + 's' }">
              <button class="menu-item" @click="jump(i)">
                <span class="m-name">{{ ch.name }}</span>
                <span class="m-num">{{ numerals[i] }}</span>
              </button>
            </li>
          </ol>
        </div>
        <div class="hero-hint"><ScrollHint label="Scroll" /></div>
      </div>
    </section>

    <!-- ══ 12 챕터 ══ -->
    <section
      v-for="(ch, i) in chapters"
      :key="ch.id"
      :ref="(el) => (chapterEls[i] = el)"
      class="chapter"
      :id="'ed-' + ch.id"
    >
      <div class="scene-sticky">
        <div class="paint" :style="paintStyle(i, ch)">
          <img :src="ch.img" :alt="ch.caption" loading="lazy" decoding="async" draggable="false" />
        </div>
        <div class="paint-shade"></div>

        <!-- 말 등의 주황 소포 — 레퍼런스의 위트 -->
        <span v-if="ch.parcel" class="parcel util" :style="headStyle(i)">Editions<br />特急</span>

        <span class="ghost-num" :style="ghostStyle(i)">{{ numerals[i] }}</span>

        <h2 class="mega" :style="headStyle(i)">{{ ch.name }}</h2>

        <div class="foot" :style="headStyle(i)">
          <p class="narrative">
            <span class="dcap">{{ firstChar(ch.desc) }}</span>{{ restChars(ch.desc) }}
          </p>
          <p class="credit util">{{ ch.caption }}</p>
          <button class="backnav util" @click="toTop">Back to navigation ↑</button>
        </div>
      </div>
    </section>

    <!-- 발문 -->
    <section class="outro">
      <p class="outro-copy">Fin.</p>
      <router-link to="/world" class="outro-link util">만국청우록 — 세계화폭으로 →</router-link>
    </section>
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

/* ── 레일 ── */
.rail {
  position: fixed;
  left: 18px;
  bottom: 30px;
  z-index: 30;
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.rail-item {
  background: none;
  border: 0;
  padding: 1.5px 0;
  cursor: pointer;
  text-align: left;
  color: rgba(255, 255, 255, 0.4);
  font-family: 'Helvetica Neue', Helvetica, Arial, var(--font-util);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.01em;
  transition: color 0.25s, transform 0.25s;
}
.rail-item:hover,
.rail-item.on {
  color: #fff;
  transform: translateX(3px);
}

/* ── 히어로 ── */
.hero-wrap {
  height: 190vh;
}
.hero-stage {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  background: #0a0a0a;
}
.hero-art {
  position: absolute;
  inset: -3%;
  opacity: 0.22;
  filter: grayscale(0.4) contrast(1.05);
  animation: edZoom 40s ease-in-out infinite alternate;
}
@keyframes edZoom {
  from { scale: 1; }
  to { scale: 1.05; }
}
.hero-art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 30%;
  user-select: none;
}
.hero-shade {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 75% 62% at 50% 44%, transparent 30%, rgba(10, 10, 10, 0.8) 90%),
    linear-gradient(180deg, rgba(10, 10, 10, 0.5), transparent 30%, transparent 62%, rgba(10, 10, 10, 0.86));
}
.hero-inner {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 5vw;
  will-change: transform, opacity;
}
/* 표제 — 소묘 선이 채워지듯 */
.ed-title {
  margin: 0;
  font-family: 'Helvetica Neue', Helvetica, Arial, var(--font-util);
  font-weight: 800;
  font-size: clamp(40px, 7.4vw, 104px);
  line-height: 0.95;
  letter-spacing: -0.03em;
  text-align: center;
  color: #fff;
  animation: titleFill 2.2s ease-out both;
}
.ed-title .sketch {
  font-family: 'Imperial Script', var(--font-display), cursive;
  font-weight: 400;
  font-size: 0.92em;
  letter-spacing: 0;
  color: #d9d3c6;
  vertical-align: -0.06em;
  padding: 0 0.06em;
}
@keyframes titleFill {
  0% { opacity: 0; filter: blur(5px); letter-spacing: 0.02em; }
  100% { opacity: 1; filter: blur(0); letter-spacing: -0.03em; }
}
.ed-sub {
  margin: 18px 0 4vh;
  font-size: 12px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  animation: menuIn 0.9s ease-out 0.7s both;
}

/* 12항 차례 — 레퍼런스처럼 굵은 항목 낙하 등장 */
.menu {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 220px));
  gap: 0 6vw;
}
.menu li {
  opacity: 0;
  animation: menuIn 0.65s cubic-bezier(0.2, 0.7, 0.3, 1) forwards;
}
@keyframes menuIn {
  from { opacity: 0; transform: translateY(-14px); }
  to { opacity: 1; transform: translateY(0); }
}
.menu-item {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  background: none;
  border: 0;
  padding: 4px 2px;
  cursor: pointer;
  color: #fff;
  font-family: 'Helvetica Neue', Helvetica, Arial, var(--font-util);
  font-size: clamp(15px, 1.8vw, 19px);
  font-weight: 800;
  letter-spacing: 0.02em;
  transition: transform 0.2s, color 0.2s;
}
.menu-item:hover {
  transform: translateX(4px);
  color: #d9d3c6;
}
.m-num {
  font-family: var(--font-util);
  font-weight: 400;
  font-size: 0.6em;
  color: rgba(255, 255, 255, 0.45);
}
.hero-hint {
  position: absolute;
  left: 50%;
  bottom: 4%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.8);
}

/* ── 챕터 ── */
.chapter {
  position: relative;
  height: 210vh;
}
.scene-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  background: #0a0a0a;
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
  background: linear-gradient(180deg, rgba(10, 10, 10, 0.45), transparent 26%, transparent 60%, rgba(10, 10, 10, 0.8));
}
/* 소포 — 휘슬재킷 등 위 */
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
  will-change: transform, opacity;
}
.ghost-num {
  position: absolute;
  right: 4%;
  top: 7%;
  z-index: 1;
  font-family: 'Helvetica Neue', Helvetica, Arial, var(--font-util);
  font-weight: 800;
  font-size: clamp(260px, 52vh, 600px);
  line-height: 1;
  color: #fff;
  pointer-events: none;
  will-change: transform, opacity;
}
.mega {
  position: absolute;
  left: 5%;
  right: 5%;
  top: 30%;
  z-index: 2;
  margin: 0;
  font-family: 'Helvetica Neue', Helvetica, Arial, var(--font-util);
  font-weight: 800;
  font-size: clamp(72px, 15.5vw, 215px);
  line-height: 0.9;
  letter-spacing: -0.03em;
  color: #fff;
  text-shadow: 0 4px 44px rgba(0, 0, 0, 0.55);
  will-change: transform, opacity;
  pointer-events: none;
}
.foot {
  position: absolute;
  left: 5%;
  right: 5%;
  bottom: 6%;
  z-index: 3;
  max-width: 720px;
  will-change: transform, opacity;
}
.narrative {
  margin: 0;
  font-family: 'Helvetica Neue', Helvetica, Arial, var(--font-util);
  font-size: clamp(17px, 2.3vw, 25px);
  line-height: 1.55;
  color: #fff;
  text-shadow: 0 2px 18px rgba(0, 0, 0, 0.6);
}
/* 필기체 드롭캡 — 레퍼런스의 ImperialScript */
.dcap {
  float: left;
  font-family: 'Imperial Script', var(--font-display), cursive;
  font-weight: 400;
  font-size: clamp(4rem, 6.5vw, 6.8rem);
  line-height: 0.72;
  margin: 0.06em 0.12em 0 0;
  color: #fff;
}
.credit {
  display: inline-block;
  margin: 14px 8px 0 0;
  padding: 5px 10px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.72);
  letter-spacing: 0.06em;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 3px;
  background: rgba(10, 10, 10, 0.45);
  backdrop-filter: blur(3px);
  clear: left;
}
.backnav {
  display: inline-block;
  margin: 14px 0 0;
  padding: 0;
  background: none;
  border: 0;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.backnav:hover {
  color: #fff;
}

/* 그레인 · 브랜드 */
.grain {
  position: fixed;
  inset: 0;
  z-index: 40;
  pointer-events: none;
  opacity: 0.26;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' seed='3'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.05 0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23g)'/%3E%3C/svg%3E");
}
.brand {
  position: fixed;
  left: 20px;
  top: 74px;
  z-index: 30;
  margin: 0;
  font-family: 'Imperial Script', var(--font-display), cursive;
  font-size: 21px;
  color: rgba(255, 255, 255, 0.85);
}

/* 발문 */
.outro {
  position: relative;
  z-index: 5;
  text-align: center;
  padding: 12vh 24px 14vh;
}
.outro-copy {
  font-family: 'Imperial Script', var(--font-display), cursive;
  font-size: clamp(38px, 6vw, 64px);
  margin: 0 0 14px;
}
.outro-link {
  color: #fff;
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
  .hero-art, .menu li, .ed-title, .ed-sub { animation: none !important; opacity: 1; }
}
</style>
