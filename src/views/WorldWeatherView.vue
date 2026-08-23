<script setup>
// 세계화폭 (만국청우록)
// 해외 도시마다 그 나라 명화 한 폭, 실황에 따라 비/안개/바람 효과
import { ref, computed, onMounted, onBeforeUnmount, defineAsyncComponent } from 'vue'
import InkRipple from '@/components/minhwa/InkRipple.vue'
import ScrollHint from '@/components/minhwa/ScrollHint.vue'
import { useWorldWeather } from '@/composables/useWeather.js'
import { toHanja, tempHanja, STATUS_HANJA } from '@/utils/hanja.js'
// 두루마리는 누를 때 처음 불러온다 (초기 번들에서 제외)
const ScrollSheet = defineAsyncComponent(() => import('@/components/minhwa/ScrollSheet.vue'))

import heroImg from '@/assets/world-art/hero.jpg'
import tokyoImg from '@/assets/world-art/tokyo.jpg'
import beijingImg from '@/assets/world-art/beijing.jpg'
import parisImg from '@/assets/world-art/paris.jpg'
import londonImg from '@/assets/world-art/london.jpg'
import newyorkImg from '@/assets/world-art/newyork.jpg'
import sydneyImg from '@/assets/world-art/sydney.jpg'
import romeImg from '@/assets/world-art/rome.jpg'
import istanbulImg from '@/assets/world-art/istanbul.jpg'
import cairoImg from '@/assets/world-art/cairo.jpg'
// 스칼라 시연 사진 - src/assets/world-art/skala.jpg 를 넣으면 자동 연결, 없으면 먹빛 폭풍 배경
const skalaFiles = import.meta.glob('@/assets/world-art/skala.{jpg,jpeg,png,webp}', { eager: true, import: 'default' })
const skalaImg = Object.values(skalaFiles)[0] ?? ''

const { cities, loading, error, fetchLive } = useWorldWeather()

const numerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']
// 두루마리 날씨첩 - 도시 이름을 누르면 펼쳐진다
const sheetCity = ref(null)

// 도시 = 그 나라의 그림
const artMap = {
  w_tokyo: { img: tokyoImg, caption: '가쓰시카 호쿠사이 「가나가와 해변의 높은 파도」 1831', focal: '38% 45%' },
  w_beijing: { img: beijingImg, caption: '왕희맹 「천리강산도」 1113 · 북송', focal: '50% 55%' },
  w_paris: { img: parisImg, caption: '클로드 모네 「인상, 해돋이」 1872', focal: '55% 42%' },
  w_london: { img: londonImg, caption: '윌리엄 터너 「비, 증기, 속도」 1844', focal: '58% 45%' },
  w_newyork: { img: newyorkImg, caption: '앨버트 비어슈타트 「로키산맥의 폭풍」 1866', focal: '45% 40%' },
  w_sydney: { img: sydneyImg, caption: '유진 폰 게라르 「시드니 헤즈」 1865', focal: '50% 45%' },
  w_rome: { img: romeImg, caption: '조반니 파올로 파니니 「로마 포룸」 1735', focal: '50% 48%' },
  w_istanbul: { img: istanbulImg, caption: '이반 아이바좁스키 「콘스탄티노플과 보스포루스」 1856', focal: '50% 50%' },
  w_cairo: { img: cairoImg, caption: '장레옹 제롬 「카이로의 저녁 기도」 1865', focal: '50% 42%' },
  w_skala: { img: skalaImg, caption: 'SKALA 캠퍼스 · 시연 기상 — 뇌우 21° · 풍속 11.4m/s', focal: '50% 40%' },
}


// 스크롤 진행도 + 마우스 시차 
const chapterEls = ref([])
const heroEl = ref(null)
const progress = ref([])
const heroP = ref(0)
const activeIdx = ref(-1)
const mx = ref(0)
const my = ref(0)
let tx = 0, ty = 0, rafId = 0, lastY = -1, scrollDir = 1 // 1 내려감, -1 올라감

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

// 자석 스냅 - 스크롤이 멈췄을 때 어중간한 지점이면 정착점으로 스르륵
function magnetSnap() {
  const i = activeIdx.value
  if (i < 0) return
  const el = chapterEls.value[i]
  if (!el) return
  const vh = window.innerHeight
  const p = progress.value[i] ?? 0
  const settle = (node) => node.getBoundingClientRect().top + window.scrollY + (node.offsetHeight - vh) * 0.42
  let target = null
  // 스크롤 방향을 따라간다 - 위로 올라가는데 아래로 되돌려 보내면 앞 폭으로 못 간다
  if (p > 0.9) {
    const next = chapterEls.value[i + 1]
    if (scrollDir > 0 && next) target = settle(next)
    else if (scrollDir < 0) target = settle(el)
  } else if (p > 0.008 && p < 0.1) {
    const prev = chapterEls.value[i - 1]
    if (scrollDir < 0 && prev) target = settle(prev)
    else if (scrollDir > 0) target = settle(el)
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
    if (lastY >= 0) scrollDir = y > lastY ? 1 : -1
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

// 선묘 에칭 - 챕터 초입에 백색 선으로 떠올랐다가 원색이 번지면 물러난다
function etchStyle(i) {
  const p = progress.value[i] ?? 0
  return {
    opacity: (easeOut(clamp01(p / 0.08)) * (1 - clamp01((p - 0.44) / 0.12))).toFixed(3), // 선묘를 오래 두고
    transform: `scale(${(1.2 - easeOut(clamp01(p / 0.6)) * 0.14).toFixed(4)})`,
  }
}
// 그림 - 선묘 위로 원색이 중심에서 번져 나오고, 초점으로 빠져들다 다음 폭에 어둠으로 내준다
function paintStyle(i, art) {
  const p = progress.value[i] ?? 0
  const enter = easeOut(clamp01(p / 0.14))
  const reveal = easeOut(clamp01((p - 0.22) / 0.26)) // 원색은 선묘를 충분히 본 뒤에
  const r = reveal * 125
  const mask = `radial-gradient(circle at ${art.focal}, #000 ${Math.max(0, r - 28).toFixed(1)}%, transparent ${r.toFixed(1)}%)`
  const dive = easeOut(clamp01(p / 0.6))
  const leave = clamp01((p - 0.86) / 0.12)
  return {
    maskImage: mask,
    WebkitMaskImage: mask,
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
    transform: `translateY(${((1 - t) * 60 - leave * 40).toFixed(1)}px) translateX(${(mx.value * 7).toFixed(1)}px) scale(${(0.94 + t * 0.06).toFixed(3)})`,
  }
}
// 유령 숫자 - 화폭보다 느리게 흐른다
function ghostStyle(i) {
  const p = progress.value[i] ?? 0
  return {
    opacity: (clamp01(p / 0.2) * (1 - clamp01((p - 0.8) / 0.16)) * 0.36).toFixed(3),
    transform: `translateY(${((0.5 - p) * 12).toFixed(1)}vh) translateX(${(mx.value * -12).toFixed(1)}px)`,
  }
}
// 빛 입자 - 어두운 화폭 위 느린 티끌
const motes = Array.from({ length: 9 }, (_, i) => ({
  left: 6 + ((i * 131) % 88) + '%',
  top: 10 + ((i * 67) % 70) + '%',
  animationDuration: (5 + ((i * 13) % 40) / 6).toFixed(1) + 's',
  animationDelay: -(((i * 17) % 50) / 10).toFixed(1) + 's',
}))
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
const rainDrops = Array.from({ length: 42 }, (_, i) => ({
  left: ((i * 37) % 100) + '%',
  duration: 0.9 + ((i * 13) % 10) / 11 + 's',
  delay: -((i * 7) % 20) / 10 + 's',
  opacity: 0.55 + ((i * 11) % 10) / 22,
}))
// 도시별 효과 - 어느 부위를 오려 어떻게 흔들지
// 효과 영역은 칼로 자르지 않고 - 가장자리를 흐려 그림에 스미게 한다 (mask)
const SKY = (to) => `linear-gradient(180deg, #000 0%, #000 ${to - 18}%, transparent ${to}%)`
const WATER = (from) => `linear-gradient(0deg, #000 0%, #000 ${100 - from - 18}%, transparent ${100 - from}%)`
const fxMap = {
  w_beijing: { kind: 'sky', mask: SKY(64), mist: true, mistTop: 28 },
  w_paris: { kind: 'water', mask: WATER(46), sun: { left: '49%', top: '34%' } },
  w_london: { kind: 'sky', mask: SKY(72), mist: true, mistTop: 22 },
  w_newyork: { kind: 'sky', mask: SKY(60), lightning: true },
  w_skala: { kind: null, lightning: true, storm: true }, // 그림은 통째로 국기처럼 펄럭인다
}
// 효과는 그림과 함께 떠오르고 함께 물러난다 - 미리 보이지 않게
function fxVis(i) {
  const p = progress.value[i] ?? 0
  // 원색 리빌(0.22~0.48)이 거의 끝난 뒤에야 효과가 스며든다
  return { opacity: (easeOut(clamp01((p - 0.3) / 0.12)) * (1 - clamp01((p - 0.86) / 0.12))).toFixed(3) }
}
// 효과 레이어용 그림 스타일 - 리빌 마스크는 빼고(자체 부드러운 마스크 사용) 움직임만 따라간다
function fxPaintStyle(i, art) {
  const st = paintStyle(i, art)
  delete st.maskImage
  delete st.WebkitMaskImage
  return st
}
// 스크린리더용 한글 독법 (한자 기문의 대체 텍스트)
function readingAria(c) {
  return `${c.status}, 기온 ${c.temp}도, 습도 ${c.humidity}퍼센트, 바람 초속 ${c.wind}미터, ${c.isDay ? '낮' : '밤'}`
}
// 한자 독법 아래 한글 풀이 - 한자만으론 알아보기 어려워서
function readingKo(c) {
  const parts = [c.status, `${c.temp}°`, `습도 ${c.humidity}%`, `바람 ${c.wind}m/s`]
  if (c.demo) parts.push('시연용 고정값')
  else if (c.live && c.localTime) parts.push(`현지 ${c.localTime}`)
  else parts.push('표본')
  parts.push(c.isDay ? '낮' : '밤')
  return parts.join(' · ')
}
// 고풍 독법 - 氣溫 二十二度, 濕度 四十一分, 風 四米
function readingOf(c) {
  const parts = [`氣溫 ${tempHanja(c.temp)}`, `濕度 ${toHanja(c.humidity)}分`, `風 ${toHanja(Math.round(c.wind))}米`]
  if (c.demo) parts.push('示演 固定')
  else if (c.live && c.localTime) parts.push(`現地 ${c.localTime}`)
  else parts.push('標本')
  parts.push(c.isDay ? '晝' : '夜')
  return parts.join(' · ')
}
// 안개 띠 - 산허리/강물 위로 천천히 흐른다
const mists = Array.from({ length: 4 }, (_, i) => ({
  height: 7 + (i % 2) * 4 + '%',
  animationDuration: (22 + i * 6) + 's',
  animationDelay: -(i * 7) + 's',
  opacity: 0.55 - i * 0.08,
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

    <!-- 필름 그레인 -->
    <div class="grain" aria-hidden="true"></div>
    <!-- 상주 브랜드 마크 (챕터 진입 후) -->
    <p v-show="activeIdx >= 0" class="brand">만국청우록<span>萬國晴雨錄</span></p>

    <!-- 좌측 상주 차례 레일 -->
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

    <svg width="0" height="0" style="position: absolute" aria-hidden="true">
      <!-- 강풍 - 천이 펄럭이듯 그림 전체가 물결친다 (국기) -->
      <filter id="flagWave" x="-6%" y="-6%" width="112%" height="112%">
        <!-- 깃발처럼: 큰 파동 한두 줄만. 주파수를 낮춰 잔떨림을 없앰 -->
        <feTurbulence type="fractalNoise" baseFrequency="0.003 0.009" numOctaves="1" seed="3" result="w">
          <animate attributeName="baseFrequency" values="0.003 0.009;0.004 0.007;0.003 0.009" dur="3.2s" repeatCount="indefinite" />
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" in2="w" scale="44" xChannelSelector="R" yChannelSelector="G">
          <animate attributeName="scale" values="30;56;30" dur="3.2s" repeatCount="indefinite" />
        </feDisplacementMap>
      </filter>
      <!-- 물결 - 가로로 긴 잔물결이 흐른다 -->
      <filter id="fxWater" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.008 0.04" numOctaves="2" seed="8" result="n">
          <animate attributeName="baseFrequency" values="0.008 0.04;0.011 0.05;0.008 0.04" dur="7s" repeatCount="indefinite" />
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G">
          <animate attributeName="scale" values="6;12;6" dur="4.6s" repeatCount="indefinite" />
        </feDisplacementMap>
      </filter>
      <!-- 구름 - 아주 느린 저주파 일렁임 -->
      <filter id="fxSky" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.003 0.006" numOctaves="2" seed="2" result="n">
          <animate attributeName="baseFrequency" values="0.003 0.006;0.004 0.008;0.003 0.006" dur="14s" repeatCount="indefinite" />
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="16" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="wEdge">
        <feColorMatrix type="saturate" values="0" />
        <feConvolveMatrix order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" preserveAlpha="true" />
        <feComponentTransfer>
          <feFuncR type="linear" slope="2.2" /><feFuncG type="linear" slope="2.2" /><feFuncB type="linear" slope="2.2" />
        </feComponentTransfer>
      </filter>
    </svg>

    <!-- 히어로 : 손끝이 닿는 순간 -->
    <section ref="heroEl" class="hero-wrap">
      <div class="hero-stage">
        <div class="hero-art" :style="heroArtStyle">
          <img :src="heroImg" alt="미켈란젤로, 아담의 창조" draggable="false" />
        </div>
        <div class="hero-shade"></div>
        <span class="spark"></span>

        <div class="hero-inner" :style="heroStyle">
          <div class="title-box">
            <h1 class="ed-title">만국청우록</h1>
            <p class="ed-hanja">萬 國 晴 雨 錄</p>
            <p class="hero-sub util">
              새로운 하늘의 기록 — 바다 건너 열 곳의 지금.
              <span v-if="loading"> 살피는 중…</span>
            </p>
            <ol class="menu util">
              <li v-for="(c, i) in cities" :key="c.id" :style="{ animationDelay: (0.35 + i * 0.07).toFixed(2) + 's' }">
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

    <!-- 도시 챕터 - 그 나라의 그림으로 -->
    <section
      v-for="(c, i) in cities"
      :key="c.id"
      :ref="(el) => (chapterEls[i] = el)"
      class="chapter"
      :id="c.id"
    >
      <div class="scene-sticky">
        <div class="etch" :style="etchStyle(i)">
          <img :src="artMap[c.id].img" alt="" loading="lazy" decoding="async" draggable="false" />
        </div>
        <div class="paint" :class="{ windy: c.wind >= 6, gale: c.wind >= 10, blank: !artMap[c.id].img }" :style="paintStyle(i, artMap[c.id])">
          <img v-if="artMap[c.id].img" :src="artMap[c.id].img" :alt="artMap[c.id].caption" loading="lazy" decoding="async" draggable="false" />
        </div>
        <!-- 날씨 기운 + 도시별 효과 - 그림과 함께 나타난다 -->
        <div class="fx-group" :class="{ storm: fxMap[c.id]?.storm }" :style="fxVis(i)">
          <template v-if="c.status === '비' || c.status === '뇌우'">
            <span
              v-for="(d, j) in rainDrops"
              :key="'r' + j"
              class="w-drop"
              :style="{ left: d.left, animationDuration: d.duration, animationDelay: d.delay, opacity: d.opacity }"
            ></span>
          </template>
          <template v-if="c.status === '눈' || c.snowAlways">
            <span
              v-for="(f, j) in snowFlakes"
              :key="'s' + j"
              class="w-flake"
              :style="{ left: f.left, width: f.size, height: f.size, animationDuration: f.duration, animationDelay: f.delay }"
            ></span>
          </template>
          <template v-if="!fxMap[c.id]?.mist && (c.status === '흐림' || c.status === '구름' || c.status === '안개')">
            <span v-for="(m, j) in mists" :key="'wm' + j" class="mistband" :style="[m, { top: 26 + j * 9 + '%' }]"></span>
          </template>
          <template v-if="fxMap[c.id]">
            <div v-if="fxMap[c.id].kind" class="fx" :class="fxMap[c.id].kind" :style="[fxPaintStyle(i, artMap[c.id]), { maskImage: fxMap[c.id].mask, WebkitMaskImage: fxMap[c.id].mask }]">
              <img :src="artMap[c.id].img" alt="" loading="lazy" decoding="async" draggable="false" />
            </div>
            <template v-if="fxMap[c.id].mist">
              <span v-for="(m, j) in mists" :key="'m' + j" class="mistband" :style="[m, { top: fxMap[c.id].mistTop + j * 9 + '%' }]"></span>
            </template>
            <span v-if="fxMap[c.id].sun" class="sunglow" :style="fxMap[c.id].sun"></span>
            <span v-if="fxMap[c.id].storm" class="storm"></span>
            <span v-if="fxMap[c.id].lightning" class="lightning"></span>
          </template>
        </div>
        <div class="paint-shade"></div>

        <!-- 유령 숫자 - 화폭 뒤 거대한 차례 -->
        <span class="ghost-num" aria-hidden="true" :style="ghostStyle(i)">{{ numerals[i] }}</span>
        <!-- 빛 입자 -->
        <span v-for="(m, k) in motes" :key="'mo' + k" class="mote" :style="m"></span>
        <!-- 초대형 헤드라인 -->
        <h2 class="mega" :style="headStyle(i)">
          <button class="mega-btn" @click="sheetCity = c">{{ c.name }}</button>
          <small>{{ c.hanja }} · {{ c.country }} · <button class="open-sheet" @click="sheetCity = c">날씨첩 펼치기</button></small>
        </h2>

        <!-- 드롭캡 + 간이 독법 + 그림 캡션 -->
        <div class="foot" :style="headStyle(i)">
          <p class="narrative">
            <span class="dcap">{{ firstChar(c.line) }}</span>{{ restChars(c.line) }}
          </p>
          <p class="reading" :aria-label="readingAria(c)">
            <i class="r-seal" aria-hidden="true">{{ STATUS_HANJA[c.status] ?? '天' }}</i>
            <span class="r-lines" aria-hidden="true">
              <span class="r-text">{{ readingOf(c) }}</span>
              <span class="r-ko">{{ readingKo(c) }}</span>
            </span>
          </p>
          <p class="credit util">{{ artMap[c.id].caption }}</p>
        </div>
      </div>
    </section>

    <ScrollSheet :city="sheetCity" @close="sheetCity = null" />

    <!-- 발문 -->
    <section class="outro">
      <p class="outro-copy">열 곳의 하늘을 모두 거두었습니다.</p>
      <router-link to="/" class="outro-link util">국내 화폭 — 팔도청우록으로 →</router-link>
      <p v-if="error" class="err util">실시간 조회 실패 — 표본 자료로 표시 중입니다.</p>
    </section>
  </main>
</template>

<style scoped>
.mangug {
  position: relative;
  background: #050505;
  color: var(--baek);
}
.util {
  font-family: var(--font-util);
}

/* 좌측 차례 레일 */
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
  color: rgba(255, 255, 255, 0.5);
  font-family: 'Helvetica Neue', Helvetica, Arial, var(--font-util);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.02em;
  transition: color 0.25s, transform 0.25s;
}
.rail-item:hover,
.rail-item.on {
  color: var(--baek);
  transform: translateX(3px);
}
.rail-item.on .rail-num {
  color: #ffffff;
}
.rail-num {
  font-family: 'Cinzel', 'Times New Roman', serif;
  font-weight: 500;
  font-size: 11px;
  letter-spacing: 0.14em;
  color: rgba(251, 246, 234, 0.5);
}

/* 히어로 */
.hero-wrap {
  height: 178vh;
}
.hero-stage {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  background: #050505;
}
.hero-art {
  position: absolute;
  inset: -4%;
  will-change: transform;
  animation: ambientZoom 36s ease-in-out infinite alternate;
}
@keyframes ambientZoom {
  from { scale: 1; }
  to { scale: 1.045; }
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
/* 손끝이 닿는 지점 - 프레스코 중앙의 그 틈 */
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
@keyframes boxIn {
  from { opacity: 0; box-shadow: 0 0 0 0 rgba(251, 246, 234, 0); }
  to { opacity: 1; box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45); }
}
.title-box {
  animation: boxIn 1.4s ease-out 0.3s both;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: min(500px, 86vw);
  padding: clamp(22px, 4vh, 40px) clamp(20px, 3.5vw, 44px);
  border: 1.5px solid rgba(251, 246, 234, 0.88);
  background: rgba(11, 15, 24, 0.32);
  backdrop-filter: blur(2.5px);
}
.ed-title {
  font-family: var(--font-display);
  font-size: clamp(46px, 7vw, 76px);
  font-weight: 700;
  letter-spacing: 0.16em;
  line-height: 1.05;
  text-align: center;
  color: #fff;
  margin: 0;
  text-shadow: 0 2px 24px rgba(0, 0, 0, 0.6);
}
.ed-hanja {
  text-align: center;
  font-family: var(--font-display);
  font-size: clamp(12px, 1.4vw, 15px);
  letter-spacing: 0.5em;
  color: rgba(255, 255, 255, 0.6);
  margin: 10px 0 0;
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
.menu li {
  opacity: 0;
  animation: menuIn 0.7s cubic-bezier(0.2, 0.7, 0.3, 1) forwards;
}
@keyframes menuIn {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
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
  color: #fff;
  font-family: 'Helvetica Neue', Helvetica, Arial, var(--font-util);
  font-size: clamp(17px, 2.3vw, 22px);
  font-weight: 800;
  letter-spacing: 0.04em;
  transition: color 0.2s, transform 0.2s;
}
.menu-item:hover {
  color: #ffffff;
  transform: translateX(4px);
}
.m-dots {
  flex: 1;
  border-bottom: 1px dotted rgba(251, 246, 234, 0.28);
}
.m-num {
  font-family: 'Cinzel', 'Times New Roman', serif;
  font-weight: 500;
  font-size: 0.62em;
  letter-spacing: 0.16em;
  color: rgba(251, 246, 234, 0.7);
  /* 비문(碑文)처럼 위아래 가는 줄 */
  border-top: 1px solid rgba(251, 246, 234, 0.35);
  border-bottom: 1px solid rgba(251, 246, 234, 0.35);
  padding: 1px 4px;
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

/* 챕터 */
.chapter {
  position: relative;
  height: 230vh;
}
.scene-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  background: #050505;
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
/* 사진 미첨부 시 - 먹구름 폭풍 하늘 */
.paint.blank {
  background:
    radial-gradient(ellipse at 60% 20%, rgba(120, 130, 150, 0.5), transparent 55%),
    linear-gradient(180deg, #20242c, #0b0d12 70%);
}
/* 폭풍 어둠 - 빗줄기 뒤로 하늘이 무겁게 가라앉는다 */
.storm {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(10, 12, 20, 0.55), rgba(10, 12, 20, 0.25) 50%, rgba(10, 12, 20, 0.5));
  mix-blend-mode: multiply;
  animation: stormBreath 6s ease-in-out infinite;
}
@keyframes stormBreath {
  0%, 100% { opacity: 0.85; }
  50% { opacity: 1; }
}
/* 바람 ≥ 6m/s - 걸어 둔 화폭이 바람에 살짝 휘날린다 (translate/rotate 대신 별도 속성으로 흔들어 인라인 transform과 충돌 없음) */
.paint.windy {
  animation: windFlutter 4.4s ease-in-out infinite;
  transform-origin: 50% 0%;
}
.paint.gale {
  animation: galeFlutter 3.6s ease-in-out infinite;
}
.paint.gale img {
  filter: url(#flagWave); /* 천 결이 바람에 일렁인다 */
}
@keyframes galeFlutter {
  0%, 100% { rotate: 0deg; translate: 0 0; }
  18% { rotate: 0.9deg; translate: 12px 5px; }
  38% { rotate: -0.7deg; translate: -10px 2px; }
  58% { rotate: 0.8deg; translate: 9px 5px; }
  78% { rotate: -0.5deg; translate: -6px 2px; }
}
@keyframes windFlutter {
  0%, 100% { rotate: 0deg; translate: 0 0; }
  25% { rotate: 0.2deg; translate: 2px 1px; }
  50% { rotate: -0.15deg; translate: -2px 0; }
  75% { rotate: 0.12deg; translate: 1px 1px; }
}

/* 도시별 효과 레이어 */
.fx {
  position: absolute;
  inset: -3%;
  z-index: 1;
  pointer-events: none;
  will-change: transform, opacity, filter;
}
.fx img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
}
.fx.water img { filter: url(#fxWater); }
.fx.sky img { filter: url(#fxSky); }
.fx.sky { animation: skyDrift 40s ease-in-out infinite alternate; }
@keyframes skyDrift {
  from { translate: 0 0; }
  to { translate: -18px 4px; }
}
.mistband {
  position: absolute;
  z-index: 2;
  left: -30%;
  width: 60%;
  pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.55) 40%, rgba(255, 255, 255, 0.5) 60%, transparent);
  filter: blur(14px);
  animation: mistDrift linear infinite;
}
@keyframes mistDrift {
  from { transform: translateX(0); }
  to { transform: translateX(230%); }
}
.sunglow {
  position: absolute;
  z-index: 2;
  width: 26vmin;
  height: 26vmin;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  pointer-events: none;
  background: radial-gradient(circle, rgba(255, 190, 120, 0.55), rgba(255, 150, 90, 0.22) 40%, transparent 70%);
  filter: blur(6px);
  mix-blend-mode: screen;
  animation: sunPulse 4.8s ease-in-out infinite;
}
@keyframes sunPulse {
  0%, 100% { opacity: 0.6; scale: 1; }
  50% { opacity: 1; scale: 1.18; }
}
.lightning {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background: radial-gradient(ellipse at 62% 18%, rgba(255, 255, 255, 0.95), rgba(220, 230, 255, 0.4) 30%, transparent 65%);
  mix-blend-mode: screen;
  opacity: 0;
  animation: flash 6s linear infinite;
}
@keyframes flash {
  0%, 14%, 100% { opacity: 0; }
  15% { opacity: 1; }
  16.5% { opacity: 0.2; }
  18% { opacity: 1; }
  20.5% { opacity: 0; }
  47% { opacity: 0; }
  48% { opacity: 0.85; }
  49.5% { opacity: 0; }
  78% { opacity: 0; }
  78.7% { opacity: 1; }
  80% { opacity: 0.25; }
  81.5% { opacity: 0; }
}

/* 선묘 에칭 - 엣지 추출 백선 */
.etch {
  position: absolute;
  inset: -3%;
  will-change: transform, opacity;
}
.etch img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: url(#wEdge) brightness(1.1);
  mix-blend-mode: screen;
  user-select: none;
}
.mega-btn {
  all: unset;
  cursor: pointer;
  pointer-events: auto;
  transition: color 0.2s;
}
.mega-btn:hover,
.mega-btn:focus-visible {
  color: #ffd9a3;
}
.open-sheet {
  all: unset;
  display: inline-block;
  padding: 6px 2px; /* 손가락이 닿을 높이 */
  margin: -6px -2px;
  text-decoration: underline;
  text-underline-offset: 4px;
  pointer-events: auto;
  cursor: pointer;
}
.open-sheet:focus-visible,
.mega-btn:focus-visible {
  outline: 2px solid #ffd9a3;
  outline-offset: 4px;
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
  z-index: 3; /* 폭풍 어둠(z2) 위에 */
  width: 2px;
  height: 40px;
  background: linear-gradient(180deg, transparent, rgba(251, 246, 234, 0.95));
  box-shadow: 0 0 2px rgba(251, 246, 234, 0.5);
  transform: rotate(8deg);
  animation: wFall linear infinite;
  pointer-events: none;
}
@keyframes wFall {
  to { transform: translateY(112vh) rotate(8deg); }
}
/* 폭풍 도시(스칼라) - 비가 굵게 몰아친다 */
.fx-group.storm .w-drop {
  width: 3px;
  height: 70px;
  opacity: 1 !important;
  background: linear-gradient(180deg, transparent, #fff);
  box-shadow: 0 0 3px rgba(255, 255, 255, 0.6);
  transform: rotate(16deg);
  animation-name: wFallStorm;
  animation-duration: 0.55s !important;
}
@keyframes wFallStorm {
  to { transform: translateY(115vh) translateX(-14vw) rotate(16deg); }
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

.fx-group {
  position: absolute;
  inset: 0;
  pointer-events: none;
  will-change: opacity;
}
.mega {
  position: absolute;
  left: 5%;
  right: 5%;
  top: 32%;
  z-index: 2;
  margin: 0;
  font-family: 'Helvetica Neue', Helvetica, Arial, var(--font-util);
  font-weight: 800;
  font-size: clamp(76px, 16vw, 220px);
  line-height: 0.92;
  letter-spacing: -0.02em;
  color: var(--baek);
  text-shadow: 0 4px 44px rgba(0, 0, 0, 0.55);
  will-change: transform, opacity;
  pointer-events: none;
}
.mega small {
  display: block;
  font-family: var(--font-util);
  font-weight: 500;
  text-transform: uppercase;
  font-size: clamp(11px, 1.3vw, 15px);
  letter-spacing: 0.4em;
  margin-top: 14px;
  color: rgba(251, 246, 234, 0.8);
}
.foot {
  position: absolute;
  left: max(5%, 116px); /* 좌측 차례 레일과 겹치지 않게 */
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
  font-style: italic;
  font-size: 3.1em;
  line-height: 0.9;
  margin: 0.04em 0.14em 0 0;
  color: #ffffff;
}
/* 독법 - 낙관 한 방 + 한자 기문, 위아래 괘선 */
.reading {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin: 14px 0 0;
  padding: 8px 0;
  border-top: 1px solid rgba(251, 246, 234, 0.35);
  border-bottom: 1px solid rgba(251, 246, 234, 0.35);
  font-family: var(--font-display);
  font-size: 14.5px;
  letter-spacing: 0.2em;
  color: rgba(251, 246, 234, 0.92);
  clear: left;
}
.r-lines {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.r-ko {
  font-family: var(--font-body);
  font-size: 13px;
  letter-spacing: 0.04em;
  color: rgba(251, 246, 234, 0.78);
}
.r-seal {
  display: inline-grid;
  place-items: center;
  width: 28px;
  height: 28px;
  background: var(--jeok);
  color: var(--baek);
  font-style: normal;
  font-size: 16px;
  border-radius: 3px;
  box-shadow: inset 0 0 0 1.5px rgba(251, 246, 234, 0.4);
}
.credit {
  display: inline-block;
  margin: 12px 0 0;
  padding: 5px 10px;
  font-size: 11px;
  color: rgba(251, 246, 234, 0.75);
  letter-spacing: 0.06em;
  border: 1px solid rgba(251, 246, 234, 0.25);
  border-radius: 3px;
  background: rgba(11, 15, 24, 0.45);
  backdrop-filter: blur(3px);
}

/* 필름 그레인 */
.grain {
  position: fixed;
  inset: 0;
  z-index: 40;
  pointer-events: none;
  opacity: 0.28;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' seed='3'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.05 0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23g)'/%3E%3C/svg%3E");
}

/* 상주 브랜드 마크 */
.brand {
  position: fixed;
  left: 22px;
  top: 90px;
  z-index: 30;
  margin: 0;
  writing-mode: vertical-rl;
  font-family: var(--font-display);
  font-size: clamp(24px, 2.4vw, 34px);
  font-weight: 700;
  letter-spacing: 0.3em;
  color: var(--baek);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8), 0 0 14px rgba(0, 0, 0, 0.6);
  animation: brandIn 0.8s ease-out backwards;
}
.brand span {
  display: inline-block;
  margin-top: 14px;
  font-size: 0.38em;
  font-weight: 400;
  letter-spacing: 0.5em;
  color: rgba(251, 246, 234, 0.6);
}
@keyframes brandIn {
  from { opacity: 0; transform: translateY(-18px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 유령 숫자 */
.ghost-num {
  position: absolute;
  right: 4%;
  top: 8%;
  z-index: 1;
  font-family: 'Cinzel', 'Times New Roman', serif;
  font-weight: 700;
  font-size: clamp(280px, min(72vh, 46vw), 840px); /* 좁은 화면에서 왼쪽으로 넘치지 않게 */
  line-height: 1;
  letter-spacing: 0.04em;
  /* 새김 윤곽 + 옅은 채움 */
  color: rgba(251, 246, 234, 0.38);
  -webkit-text-stroke: 2px rgba(251, 246, 234, 0.9);
  pointer-events: none;
  will-change: transform, opacity;
}

/* 빛 입자 */
.mote {
  position: absolute;
  z-index: 2;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(255, 240, 200, 0.9);
  box-shadow: 0 0 8px 2px rgba(206, 155, 59, 0.4);
  animation: moteFloat ease-in-out infinite;
  pointer-events: none;
}
@keyframes moteFloat {
  0%, 100% { opacity: 0; transform: translateY(0); }
  50% { opacity: 0.9; transform: translateY(-14px); }
}

/* 발문 */
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
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
}
.err {
  color: #ffffff;
  font-size: 13px;
  margin-top: 20px;
}

@media (max-width: 860px) {
  /* 터치 화면: 날씨첩 버튼을 손가락 크기의 알약으로 */
  .open-sheet {
    display: inline-block;
    margin: 8px 0 0;
    padding: 9px 14px;
    border: 1.5px solid rgba(251, 246, 234, 0.7);
    border-radius: 999px;
    font-size: 13px;
    letter-spacing: 0.12em;
    text-decoration: none;
    color: var(--baek);
  }
  .rail, .brand { display: none; }
  .mega { top: 22%; font-size: clamp(52px, 17vw, 96px); }
  .ghost-num { font-size: clamp(180px, 58vw, 360px); top: 6%; }
  .mega small { font-size: 11px; letter-spacing: 0.24em; }
  .foot { left: 5%; right: 5%; bottom: 5%; }
  .narrative { font-size: 16px; line-height: 1.55; }
  .dcap { font-size: 2.4em; }
  .credit { font-size: 10px; }
  .ed-title { font-size: clamp(34px, 11vw, 56px); letter-spacing: 0.1em; }
  .title-box { padding: 20px 18px; }
  .hero-credit { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .stroke-title {
    animation: none;
    fill-opacity: 1;
    stroke-dashoffset: 0;
  }
  .spark, .w-drop, .w-flake, .fx, .mistband, .sunglow, .lightning, .paint.windy, .paint.gale { animation: none !important; }
}
</style>
