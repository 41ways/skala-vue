<script setup>
// 국내 화폭 — 팔도청우록(八道晴雨錄)
// 레퍼런스: Shopify Editions Winter '26 의 구조를 그대로 가져오되,
// 르네상스 회화 자리에 실제 조선 민화·풍속화 스캔이 들어간다.
//  · 표제 획 드로잉(만국청우록 스타일) · sticky 챕터 스크롤텔링
//  · 그림 속으로 빠져드는 카메라 · 선염 번짐 전환 · 레이어 패럴랙스 + 마우스 시차
//  · 비 그림 챕터에는 비 오는 도시, 맑은 그림 챕터에는 맑은 도시
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import ArtStage from '@/components/minhwa/ArtStage.vue'
import InkRipple from '@/components/minhwa/InkRipple.vue'
import ScrollHint from '@/components/minhwa/ScrollHint.vue'
import { useWeather } from '@/composables/useWeather.js'

import obongdoImg from '@/assets/minhwa-art/obongdo.jpg'
import mudongImg from '@/assets/minhwa-art/mudong.jpg'
import ssireumImg from '@/assets/minhwa-art/ssireum.jpg'
import seodangImg from '@/assets/minhwa-art/seodang.jpg'
import inwangImg from '@/assets/minhwa-art/inwang.jpg'
import tigerImg from '@/assets/minhwa-art/tiger.jpg'

// 누끼 PNG 일괄 로드 — cut('tiger_body') 식으로 꺼내 쓴다
const cutFiles = import.meta.glob('@/assets/minhwa-art/cut/*.png', {
  eager: true,
  import: 'default',
})
const cut = (name) => cutFiles[Object.keys(cutFiles).find((k) => k.includes(name))]

// 누끼 자리를 메운 배경판
const bgFiles = import.meta.glob('@/assets/minhwa-art/bg/*.jpg', {
  eager: true,
  import: 'default',
})
const bgOf = (name) => bgFiles[Object.keys(bgFiles).find((k) => k.includes(name))]

const { cities, loading, error, fetchLive } = useWeather()

// 화폭 차례 — 그림과 날씨의 궁합
const chapters = [
  {
    id: 'inwang',
    img: inwangImg,
    title: '인왕제색도',
    hanja: '仁王霽色圖',
    era: '정선 · 1751 · 국보',
    weather: ['비', '뇌우'],
    wHanja: '雨',
    effect: 'water',
    focal: '50% 48%',
    rain: true,
    line: '비에 젖은 인왕산 — 지금 비가 듣는 고을들입니다. 화폭을 내리면 그림이 물이 됩니다.',
    empty: '오늘은 비에 든 고을이 없습니다.',
  },
  {
    id: 'obongdo',
    img: obongdoImg,
    title: '일월오봉도',
    hanja: '日月五峯圖',
    era: '조선 후기 · 궁중 장식화',
    weather: ['맑음'],
    wHanja: '晴',
    effect: 'inkfill',
    waterIntro: true, // 앞 폭(인왕제색도)이 풀어진 물 위로 해와 달이 떠오른다
    waterImg: inwangImg,
    focal: '50% 44%',
    tone: 'light',
    cuts: [
      // ix/iy = 원화(2560x1106) 속 해·달의 좌표 비율, dvh = 지름(vh)
      // riseX = 떠오를 때의 화면 x(%), 이후 원화 좌표로 미끄러져 정렬
      { src: cut('obongdo_moon'), ix: 0.277, iy: 0.1293, dvh: 10.3, depth: 10, riseX: 24 },
      { src: cut('obongdo_sun'), ix: 0.7172, iy: 0.1212, dvh: 12.7, depth: 14, riseX: 76, warm: true },
    ],
    line: '비 갠 물 위로 해와 달이 떠오릅니다 — 볕이 좋은 고을들입니다.',
    empty: '오늘은 맑게 갠 고을이 없습니다.',
  },
  {
    id: 'mudong',
    img: mudongImg,
    bg: bgOf('mudong'),
    title: '무동',
    hanja: '舞童',
    era: '김홍도 · 풍속화첩 · 보물',
    weather: ['바람'],
    wHanja: '風',
    effect: 'collage',
    focal: '38% 62%',
    cuts: [
      // 악단 반원 — 뒤에서 가락을 탄다
      { src: cut('mudong_band'), left: '16%', top: '3%', w: '64%', depth: 8, ox: -8, oy: -12, ds: 0.02, idle: 'bob', z: 1 },
      // 대금·해금 — 오른쪽 아래
      { src: cut('mudong_bottomright'), left: '58%', top: '38%', w: '27%', depth: 14, ox: 12, oy: 6, ds: 0.04, idle: 'bob', z: 2 },
      // 무동 — 앞으로 크게 나서며 춤춘다
      { src: cut('mudong_dancer'), left: '20%', top: '30%', w: '31%', depth: 28, ox: -14, oy: 18, ds: 0.12, idle: 'sway', z: 3 },
    ],
    line: '소매가 바람을 탑니다 — 바람 부는 고을들입니다.',
    empty: '오늘은 바람 든 고을이 없습니다.',
  },
  {
    id: 'ssireum',
    img: ssireumImg,
    bg: bgOf('ssireum'),
    title: '씨름',
    hanja: '角觝',
    era: '김홍도 · 풍속화첩 · 보물',
    weather: ['구름'],
    wHanja: '雲',
    effect: 'collage',
    focal: '50% 48%',
    cuts: [
      // 구경꾼 네 무리 — 판 가장자리에서 들썩인다
      { src: cut('ssireum_crowd_tl'), left: '2%', top: '1%', w: '36%', depth: 7, ox: -12, oy: -10, ds: 0.015, idle: 'bob', z: 1 },
      { src: cut('ssireum_crowd_tr'), left: '62%', top: '2%', w: '34%', depth: 8, ox: 12, oy: -10, ds: 0.015, idle: 'bob', z: 1 },
      { src: cut('ssireum_crowd_bl'), left: '2%', top: '62%', w: '33%', depth: 10, ox: -12, oy: 10, ds: 0.02, idle: 'bob', z: 2 },
      { src: cut('ssireum_crowd_br'), left: '66%', top: '60%', w: '30%', depth: 10, ox: 12, oy: 10, ds: 0.02, idle: 'bob', z: 2 },
      // 씨름꾼 — 판 한가운데서 힘겨루기
      { src: cut('ssireum_wrestlers'), left: '36%', top: '22%', w: '28%', depth: 24, oy: 12, ds: 0.11, idle: 'tussle', z: 3 },
    ],
    line: '구름처럼 모여든 판 — 구름 낀 고을들입니다.',
    empty: '오늘은 구름 든 고을이 없습니다.',
  },
  {
    id: 'seodang',
    img: seodangImg,
    bg: bgOf('seodang'),
    title: '서당',
    hanja: '書堂',
    era: '김홍도 · 풍속화첩 · 보물',
    weather: ['흐림'],
    wHanja: '陰',
    effect: 'collage',
    focal: '44% 50%',
    cuts: [
      // 훈장님 — 서안 뒤에서 지긋이
      { src: cut('seodang_hunjang'), left: '32%', top: '4%', w: '40%', depth: 8, oy: -12, ds: 0.02, idle: 'bob', z: 2 },
      // 학동들 — 양쪽 줄
      { src: cut('seodang_students_l'), left: '4%', top: '16%', w: '25%', depth: 12, ox: -12, ds: 0.03, idle: 'bob', z: 1 },
      { src: cut('seodang_students_r'), left: '66%', top: '32%', w: '25%', depth: 12, ox: 12, ds: 0.03, idle: 'bob', z: 1 },
      { src: cut('seodang_back'), left: '40%', top: '66%', w: '21%', depth: 16, oy: 12, ds: 0.05, idle: 'bob', z: 2 },
      // 우는 아이 — 한가운데 앞으로
      { src: cut('seodang_crier'), left: '33%', top: '40%', w: '18%', depth: 26, oy: 16, ds: 0.12, idle: 'sway', z: 3 },
    ],
    line: '하늘이 낮은 날은 글 읽기 좋은 날 — 흐린 고을들입니다.',
    empty: '오늘은 흐린 고을이 없습니다.',
  },
  {
    id: 'tiger',
    img: tigerImg,
    bg: bgOf('tiger'),
    title: '작호도',
    hanja: '鵲虎圖',
    era: '조선 민화 · 세화(歲畫)',
    weather: ['눈'],
    wHanja: '雪',
    effect: 'collage',
    focal: '40% 48%',
    snow: true,
    cuts: [
      // 까치 — 솔가지에 앉아 까딱인다
      {
        src: cut('tiger_magpie'),
        left: '64%',
        top: '8%',
        w: '24%',
        depth: 10,
        ox: 14,
        oy: -14,
        ds: 0.03,
        idle: 'fly',
        z: 1,
        parts: [
          { src: cut('magpie_head'), left: '0%', top: '6.9%', w: '40%', anim: 'p-head', origin: '85% 80%' },
          { src: cut('magpie_tail'), left: '47.3%', top: '46.6%', w: '52.7%', anim: 'p-tail', origin: '10% 15%' },
        ],
      },
      // 호랑이 — 개별로 숨쉬며 앞으로 나온다
      // 호랑이 — 몸은 숨쉬고, 머리·꼬리·앞발은 저마다 따로 움직인다
      {
        src: cut('tiger_body'),
        left: '16%',
        top: '12%',
        w: '45%',
        depth: 22,
        ox: -10,
        oy: 10,
        ds: 0.08,
        idle: 'breathe',
        z: 3,
        parts: [
          { src: cut('tiger_head'), left: '4.1%', top: '1.1%', w: '43.2%', anim: 'p-head', origin: '55% 92%' },
          { src: cut('tiger_tail'), left: '0%', top: '59.5%', w: '25.3%', anim: 'p-tail', origin: '88% 18%' },
          { src: cut('tiger_paw'), left: '17.8%', top: '80.6%', w: '18.5%', anim: 'p-paw', origin: '50% 20%' },
        ],
      },
    ],
    line: '궂은 하늘을 막아서는 세화 — 눈 오는 고을을 지킵니다.',
    empty: '오늘 눈 내리는 고을은 없습니다. 호랑이가 잘 막고 있습니다.',
  },
]

const citiesFor = (ch) => cities.value.filter((c) => ch.weather.includes(c.status))

// ── 스크롤 진행도 + 마우스 시차 ──────────────────────────
const heroEl = ref(null)
const chapterEls = ref([])
const progress = ref([])
const heroP = ref(0)
const activeIdx = ref(-1)
const mx = ref(0)
const my = ref(0)
let tx = 0
let ty = 0
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

// 정보 오버레이 : 그림이 자리잡은 뒤 순차 등장
function infoStyle(i, order = 0) {
  const p = progress.value[i] ?? 0
  const t = easeOut(clamp01((p - 0.3 - order * 0.05) / 0.16))
  const leave = clamp01((p - 0.88) / 0.1)
  return {
    opacity: (t * (1 - leave)).toFixed(3),
    transform: `translateY(${((1 - t) * 26).toFixed(1)}px)`,
  }
}
const heroStyle = computed(() => ({
  transform: `scale(${(1 - heroP.value * 0.12).toFixed(4)}) translateY(${(heroP.value * -6).toFixed(2)}%)`,
  opacity: clamp01((1 - heroP.value) / 0.5).toFixed(3),
}))

function jump(i) {
  chapterEls.value[i]?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <main class="gukfok">
    <InkRipple />

    <!-- ══ 표제 — 만국청우록의 획 드로잉 스타일, 국내판 ══ -->
    <section ref="heroEl" class="hero-wrap">
      <div class="hero-stage">
        <!-- 은은한 오봉도 배경 — 한지에 배접된 옛 그림처럼 -->
        <div class="hero-bg">
          <img :src="obongdoImg" alt="" draggable="false" />
        </div>
        <div class="hero-inner" :style="heroStyle">
          <svg class="title-svg" viewBox="0 0 900 260">
            <text x="450" y="118" class="stroke-title t-main">팔도청우록</text>
            <text x="450" y="196" class="stroke-title t-sub">八 道 晴 雨 錄</text>
          </svg>
          <p class="hero-copy">
            옛 그림은 늘 오늘의 하늘이었습니다.<br />
            화폭을 내리면, 여섯 폭 민화가 지금 팔도의 날씨를 대신 전합니다.
          </p>
          <p class="hero-note util">
            {{ loading ? '팔도의 하늘을 살피는 중…' : '실측 · Open-Meteo · 그림은 조선의 원본 스캔' }}
          </p>
          <div class="hero-hint"><ScrollHint /></div>
        </div>
        <svg class="hero-mts" viewBox="0 0 1200 200" preserveAspectRatio="xMidYMax slice">
          <path d="M0 200 L190 90 L390 200 Z" fill="rgba(34,28,22,.07)" />
          <path d="M290 200 L520 40 L760 200 Z" fill="rgba(34,28,22,.1)" />
          <path d="M640 200 L860 80 L1080 200 Z" fill="rgba(34,28,22,.07)" />
          <path d="M920 200 L1090 110 L1240 200 Z" fill="rgba(34,28,22,.05)" />
        </svg>
      </div>
    </section>

    <!-- ══ 화폭 챕터 ══ -->
    <section
      v-for="(ch, i) in chapters"
      :key="ch.id"
      :ref="(el) => (chapterEls[i] = el)"
      class="chapter"
      :id="ch.id"
    >
      <div class="stage">
        <ArtStage
          :img="ch.img"
          :bg="ch.bg ?? ''"
          :effect="ch.effect"
          :focal="ch.focal"
          :cuts="ch.cuts ?? []"
          :p="progress[i] ?? 0"
          :mx="mx"
          :my="my"
          :rain="!!ch.rain"
          :snow="!!ch.snow"
          :water-intro="!!ch.waterIntro"
          :intro-water-img="ch.waterImg ?? ''"
        />

        <!-- 초대형 화제(畫題) — 그림과 겹친다 -->
        <h2 class="mega" :class="{ light: ch.tone === 'light' }" :style="infoStyle(i, 0)">
          {{ ch.title }}
          <small>{{ ch.hanja }} · 제{{ i + 1 }}폭 · {{ ch.era }}</small>
        </h2>

        <!-- 드롭캡 내러티브 + 날씨 도시 -->
        <div class="foot" :class="{ light: ch.tone === 'light' }" :style="infoStyle(i, 1)">
          <p class="narrative">
            <span class="dcap">{{ ch.line.slice(0, 1) }}</span>{{ ch.line.slice(1) }}
          </p>
          <div class="city-chips">
            <template v-if="citiesFor(ch).length">
              <router-link
                v-for="c in citiesFor(ch)"
                :key="c.id"
                class="chip util"
                :to="`/weather/${c.id}`"
              >
                <span class="chip-hanja">{{ ch.wHanja }}</span>
                <b>{{ c.name }}</b> {{ c.temp }}° · {{ c.status }}
              </router-link>
            </template>
            <p v-else class="chip-empty util">{{ ch.empty }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ 발문 ══ -->
    <section class="outro">
      <div class="saekdong"></div>
      <p class="outro-copy">여섯 폭을 모두 거두었습니다.</p>
      <div class="outro-cities util">
        <router-link v-for="c in cities" :key="c.id" class="chip" :to="`/weather/${c.id}`">
          <b>{{ c.name }}</b> {{ c.temp }}° · {{ c.status }}
        </router-link>
      </div>
      <nav class="outro-links util">
        <router-link to="/world">세계화폭 →</router-link>
        <router-link to="/guide">빨래 지침</router-link>
        <router-link to="/sky">별하늘</router-link>
      </nav>
      <p v-if="error" class="err util">실시간 조회 실패 — 표본 자료로 표시 중입니다.</p>
    </section>

    <!-- ══ 좌측 차례 레일 (챕터 진입 후) ══ -->
    <nav v-show="activeIdx >= 0" class="rail util" aria-label="화폭 차례">
      <button
        v-for="(ch, i) in chapters"
        :key="ch.id"
        class="rail-item"
        :class="{ on: activeIdx === i }"
        @click="jump(i)"
      >
        <span class="rail-name">{{ ch.title }}</span>
        <span class="rail-num">{{ ['一', '二', '三', '四', '五', '六'][i] }}</span>
      </button>
    </nav>
  </main>
</template>

<style scoped>
.gukfok {
  position: relative;
  background: var(--paper);
}
.util {
  font-family: var(--font-util);
}

/* ── 표제 (만국청우록 스타일 이식) ── */
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
/* 한지에 배접된 오봉도 — 표제 뒤 은은하게 */
.hero-bg {
  position: absolute;
  inset: 0;
}
.hero-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 30%;
  mix-blend-mode: multiply;
  opacity: 0.1;
  filter: blur(1.5px) saturate(0.9);
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
  to { stroke-dashoffset: 0; }
}
@keyframes fillIn {
  to { fill-opacity: 1; }
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
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}
.hero-mts {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 160px;
  pointer-events: none;
}

/* ── 챕터 ── */
.chapter {
  height: 300vh;
  position: relative;
}
.stage {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  background: var(--paper);
}
/* 화폭 위 은은한 비네트 — 그림이 무대 중앙으로 모인다 */
.stage::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(ellipse 120% 100% at 50% 45%, transparent 62%, rgba(34, 28, 22, 0.12));
}

/* ── 초대형 화제 — 그림과 겹치는 헤드라인 (세계화폭과 같은 문법) ── */
.mega {
  position: absolute;
  left: 5%;
  right: 5%;
  top: 30%;
  z-index: 2;
  margin: 0;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(64px, 13vw, 180px);
  line-height: 0.98;
  letter-spacing: 0.08em;
  color: var(--ink);
  text-shadow:
    0 0 26px rgba(241, 231, 208, 0.95),
    0 0 60px rgba(241, 231, 208, 0.7);
  will-change: transform, opacity;
  pointer-events: none;
}
.mega small {
  display: block;
  font-size: clamp(12px, 1.5vw, 18px);
  letter-spacing: 0.42em;
  margin-top: 14px;
  color: var(--ink-soft);
  text-shadow: 0 0 18px rgba(241, 231, 208, 0.95);
}
.mega.light {
  color: var(--baek);
  text-shadow: 0 4px 44px rgba(0, 0, 0, 0.6);
}
.mega.light small {
  color: rgba(251, 246, 234, 0.8);
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.6);
}

.foot {
  position: absolute;
  left: 5%;
  right: 5%;
  bottom: 6%;
  z-index: 5;
  max-width: 760px;
  will-change: transform, opacity;
}
.narrative {
  margin: 0;
  font-size: clamp(16px, 2.2vw, 24px);
  line-height: 1.7;
  color: var(--ink);
  text-shadow: 0 0 16px rgba(241, 231, 208, 0.95), 0 0 34px rgba(241, 231, 208, 0.8);
}
.foot.light .narrative {
  color: var(--baek);
  text-shadow: 0 2px 18px rgba(0, 0, 0, 0.6);
}
.dcap {
  float: left;
  font-family: var(--font-display);
  font-size: 3em;
  line-height: 0.9;
  margin: 0.05em 0.14em 0 0;
  color: var(--jeok);
}
.foot.light .dcap {
  color: #e8a5b0;
}
.city-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
  clear: left;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  border: 1px solid var(--line);
  border-radius: 4px;
  background: rgba(251, 246, 234, 0.92);
  font-size: 13px;
  color: var(--ink);
  text-decoration: none;
  box-shadow: 0 10px 26px rgba(34, 28, 22, 0.16);
  transition: border-color 0.2s, transform 0.2s;
}
.chip:hover {
  border-color: var(--jeok);
  transform: translateY(-2px);
  color: var(--ink);
}
.chip-hanja {
  display: inline-grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border: 1.2px solid var(--jeok);
  color: var(--jeok);
  border-radius: 3px;
  font-family: var(--font-display);
  font-size: 13px;
}
.chip b {
  font-weight: 700;
}
.chip-empty {
  font-size: 13.5px;
  color: var(--ink-soft);
  margin: 0;
  text-shadow: 0 0 14px rgba(241, 231, 208, 0.95);
}
.foot.light .chip-empty {
  color: rgba(251, 246, 234, 0.85);
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.6);
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
  margin: 0 0 22px;
}
.outro-cities {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-bottom: 30px;
}
.outro-links {
  display: flex;
  gap: 22px;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
}
.err {
  color: var(--jeok);
  font-size: 13px;
  margin-top: 22px;
}

/* ── 좌측 차례 레일 (세계화폭과 동일 문법, 한지 팔레트) ── */
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
  color: var(--ink-soft);
  font-size: 13.5px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-shadow: 0 0 12px rgba(241, 231, 208, 0.95);
  transition: color 0.25s, transform 0.25s;
}
.rail-item:hover,
.rail-item.on {
  color: var(--ink);
  transform: translateX(3px);
}
.rail-item.on .rail-num {
  color: var(--jeok);
}
.rail-num {
  font-family: var(--font-display);
  font-size: 11px;
  color: rgba(34, 28, 22, 0.4);
}

@media (max-width: 760px) {
  .rail {
    display: none;
  }
  .mega {
    top: 22%;
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
