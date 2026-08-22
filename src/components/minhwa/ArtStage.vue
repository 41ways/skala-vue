<script setup>
// ArtStage — 실제 민화 스캔을 움직이는 화폭으로 올리는 무대
//  · 누끼: 알파 키잉으로 잘라낸 개별 인물 PNG가 저마다 따로 움직인다 (레퍼런스: Editions의 치타 콜라주)
//  · 배경: 원화를 크게 흐려 화폭의 색면(色面)으로 깐다
//  · 카메라: 스크롤 진행도(p)에 따라 그림 속으로 빠져드는 줌인
//  · 선염(渲染): 가장자리가 물기로 풀린 라디얼 마스크가 번지며 나타나고, 먹이 적시며 사라진다
//  · effect: 'collage'(누끼 콜라주) | 'inkfill'(물감 낙하 수묵 채색) | 'water'(수면 반영)
import { computed } from 'vue'
import MinhwaCut from '@/components/minhwa/MinhwaCut.vue'

const props = defineProps({
  img: { type: String, required: true },
  img2: { type: String, default: '' }, // 병합(sunrise) 챕터의 2막 그림 (오봉도)
  bg: { type: String, default: '' }, // 누끼 자리를 메운 배경판 (콜라주용)
  effect: { type: String, default: 'collage' },
  focal: { type: String, default: '50% 50%' },
  cuts: { type: Array, default: () => [] }, // {src,left,top,w,depth,ox,oy,ds,idle,z}
  p: { type: Number, default: 0 },
  mx: { type: Number, default: 0 },
  my: { type: Number, default: 0 },
  rain: { type: Boolean, default: false },
  snow: { type: Boolean, default: false },
  waterIntro: { type: Boolean, default: false }, // inkfill: 수면에서 해·달이 떠오르는 도입부
  introWaterImg: { type: String, default: '' }, // 앞 폭(인왕제색도)이 풀어진 물 — 그 반영이 남아 일렁인다
  zoom: { type: Number, default: 0 }, // 챕터별 다이브 확대 폭 재정의 (0=기본)
})

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const easeOut = (t) => 1 - Math.pow(1 - t, 3)

// 병합 챕터(sunrise): 전반(wprog)=인왕 물, 후반(oprog)=해달·오봉도 — 같은 무대에서 이어진다
const isCombo = computed(() => props.effect === 'sunrise')
const wprog = computed(() => (isCombo.value ? clamp01(props.p / 0.72) : props.p))
const oprog = computed(() => (isCombo.value ? clamp01((props.p - 0.7) / 0.3) : props.p))

// 빠져드는 정도
const dive = computed(() => easeOut(clamp01((props.p - 0.22) / 0.5)))

// 효과별 줌 깊이 — 파노라마(inkfill)는 살짝만, 콜라주는 깊게 빠져든다
const diveAmp = computed(() => props.zoom || (({ inkfill: 0.1, water: 0.24, sunrise: 0.08 })[props.effect] ?? 0.18))
const camStyle = computed(() => ({
  transform: `scale(${(0.97 + dive.value * diveAmp.value).toFixed(4)})`,
  transformOrigin: props.focal,
}))

// 선염 등장 마스크 (수면 도입 챕터는 물·하늘이 이미 무대라 생략)
const veilStyle = computed(() => {
  if (props.waterIntro || isCombo.value) return {}
  const r = 24 + easeOut(clamp01(props.p / 0.24)) * 150
  const g = `radial-gradient(ellipse 90% 75% at 50% 45%, #000 ${Math.max(0, r - 38)}%, transparent ${r}%)`
  return { maskImage: g, WebkitMaskImage: g }
})
const washStyle = computed(() => ({
  opacity: clamp01((props.p - 0.87) / 0.12).toFixed(3),
}))

// 원화 배경 — 너무 날아가지 않게 또렷함을 유지한 채 뒤로 물러난다
const backdropStyle = computed(() => ({
  transform: `scale(${(1.32 + dive.value * 0.18).toFixed(3)}) translate3d(${(-props.mx * 8).toFixed(1)}px, ${(-props.my * 6).toFixed(1)}px, 0)`,
  opacity: (0.92 - dive.value * 0.08).toFixed(3),
}))

// 누끼 인물 — 깊이별 시차 + 빠져들 때 분리
function cutStyle(c) {
  const d = c.depth ?? 14
  const x = props.mx * d * 0.6 + dive.value * (c.ox ?? 0)
  const y = props.my * d * 0.45 + dive.value * (c.oy ?? 0)
  // 컷별 등장 순서(t): 무동 먼저, 악단이 시계방향으로 하나씩
  const et = c.t === undefined ? 1 : easeOut(clamp01((props.p - c.t) / 0.09))
  const s = (1 + dive.value * (c.ds ?? 0.06)) * (0.93 + et * 0.07)
  return {
    left: c.left,
    top: c.top,
    width: c.w,
    zIndex: c.z ?? 2,
    opacity: et.toFixed(3),
    transform: `translate3d(${x.toFixed(1)}px, ${(y + (1 - et) * 26).toFixed(1)}px, 0) scale(${s.toFixed(4)})`,
  }
}

// ── inkfill ──
// waterIntro면 해·달이 물에서 떠오른 뒤(p~0.24)에야 물감이 번지기 시작한다
const fillStart = computed(() => (props.waterIntro ? 0.42 : 0.05))
const fillR = computed(() => easeOut(clamp01((oprog.value - fillStart.value) / 0.36)) * 165)
const fillStyle = computed(() => {
  const g = `radial-gradient(ellipse 85% 90% at 46% 38%, #000 ${Math.max(0, fillR.value - 34)}%, transparent ${fillR.value}%)`
  return { maskImage: g, WebkitMaskImage: g }
})
const dropsDone = computed(() => fillR.value > 150)
// 수면 도입: 선염 없이 — 물이 걷히면 화폭이 온전한 색으로 떠오른다
const plainFillStyle = computed(() => ({
  opacity: clamp01((oprog.value - 0.52) / 0.18).toFixed(3),
}))

// 수면 도입 — 해·달이 물에서 떠오르고, 물은 서서히 걷힌다
// 일출의 완급 — 수면에서 천천히 몸을 빼고, 중천으로 갈수록 미끄러진다
const riseT = computed(() => {
  const t = clamp01((oprog.value - 0.05) / 0.4)
  return t * t * (3 - 2 * t) // smoothstep
})
const introWaterStyle = computed(() => {
  // 병합 무대에선 같은 물이 그대로 띠가 된다 — 별도 이어받기 불필요
  const settle = isCombo.value ? 1 : clamp01(props.p / 0.14)
  const h = Math.max(44 - riseT.value * 20, 100 - settle * 56)
  return {
    height: h.toFixed(1) + '%',
    opacity: (0.96 * (1 - clamp01((oprog.value - 0.36) / 0.24)) * (isCombo.value ? clamp01((props.p - 0.64) / 0.08) : 1)).toFixed(3),
  }
})
// 물에 남은 앞 폭의 잔영 — 해가 떠오를수록 스러진다
const introReflStyle = computed(() => ({
  opacity: ((1 - riseT.value) * 0.75).toFixed(3),
}))
// 상승 중 물방울이 듣는 구간
const dripping = computed(() => riseT.value > 0.1 && riseT.value < 0.82)
// 윤슬 기둥 — 디스크 아래에서 수면까지 잇는 빛 반사
function glintStyle(c) {
  // 기둥이 아니라 수면 위 잔광 — 디스크 아래 물결에만 짧게 얹힌다
  const waterTopVh = 56 + riseT.value * 20
  const discCenterVh = c.iy * 100 + (1 - riseT.value) * 72
  const gap = waterTopVh - discCenterVh
  const waterAlive = 1 - clamp01((oprog.value - 0.45) / 0.2)
  return {
    top: `calc(50% + ${(gap - 2).toFixed(1)}vh)`,
    height: '7vh',
    opacity: (gap > 1 ? 0.32 * riseT.value * waterAlive : 0).toFixed(3),
  }
}
// 수면에 물드는 노을
const dawnStyle = computed(() => ({
  opacity: (riseT.value * 0.8 * (1 - clamp01((oprog.value - 0.45) / 0.2))).toFixed(3),
}))
function celestialStyle(c) {
  const land = clamp01((oprog.value - 0.62) / 0.16) // 화폭이 다 차면 원화의 해·달 위에서 스러진다
  // 2단 모션: 보기 좋은 자리(riseX)에서 수직으로 떠오른 뒤,
  // 옆으로 미끄러져 원화 속 해·달의 실제 좌표(cover 크롭 보정)에 정렬한다
  const imgAR = c.imgAR ?? 2.315
  const vis = Math.min(1, window.innerWidth / window.innerHeight / imgAR)
  const x0 = 0.5 - vis / 2
  const targetX = Math.min(95, Math.max(5, ((c.ix - x0) / vis) * 100))
  const slideT = easeOut(clamp01((oprog.value - 0.38) / 0.14))
  const leftPct = (c.riseX ?? targetX) + (targetX - (c.riseX ?? targetX)) * slideT
  return {
    left: leftPct.toFixed(2) + '%',
    top: (c.iy * 100).toFixed(2) + '%',
    width: c.dvh + 'vh',
    opacity: (riseT.value * (1 - land)).toFixed(3),
    transform: `translate(-50%, -50%) translateY(${((1 - riseT.value) * 52).toFixed(2)}vh) translate3d(${(props.mx * (c.depth ?? 10) * 0.4).toFixed(1)}px, ${(props.my * 5).toFixed(1)}px, 0) scaleY(${(0.82 + Math.min(1, riseT.value * 1.6) * 0.18).toFixed(3)})`,
  }
}

// ── water ──
// 물 위에 떠 있는 그림을 내려다본다 — 항상 잔물결, 말미엔 배경만 남기고 일렁이며 사라진다
const melt = computed(() => clamp01((wprog.value - 0.6) / 0.32))
// 물 파동만 남은 뒤에야 시점이 눕는다
const tiltT = computed(() => {
  const t = clamp01((wprog.value - 0.84) / 0.16)
  return t * t * (3 - 2 * t) // smoothstep — 서서히 눕기 시작해 서서히 멎는다
})
const mainWobble = computed(() => (7 + melt.value * 85).toFixed(1))
// 시선 이동 — 호수를 내려다보다가, 스크롤하면 수면을 수평선 보듯 기울어진다
const tiltStyle = computed(() => ({
  transform: `perspective(90vh) rotateX(${(tiltT.value * 62).toFixed(1)}deg) translateY(${(tiltT.value * -5).toFixed(1)}%) scale(${(1 + tiltT.value * 0.65).toFixed(3)})`,
  transformOrigin: '50% 96%',
}))
// 빗방울 파문 고리 위치 (마운트 시 고정)
const rainRings = Array.from({ length: 7 }, (_, i) => ({
  left: 8 + ((i * 137) % 84) + '%',
  top: 8 + ((i * 61) % 80) + '%',
  dur: (2.2 + ((i * 7) % 10) / 6).toFixed(2) + 's',
  delay: -(((i * 13) % 22) / 10).toFixed(1) + 's',
}))
// 먹물 한두 방울 — 닿은 자리에서 튄 자국(위성 방울)과 함께 색이 스며든다
// 밑선은 처음부터 보이고, 얼룩 마스크는 '색'만 채운다. 좌표계 0~1000
const mkSat = (seed, n) =>
  Array.from({ length: n }, (_, k) => {
    const a = ((seed * 37 + k * 97) % 360) * (Math.PI / 180)
    const d = 180 + ((seed * 53 + k * 131) % 260)
    return { dx: Math.cos(a) * d, dy: Math.sin(a) * d * 0.85, r: 10 + ((seed * 11 + k * 41) % 34) }
  })
const inkBlots = [
  { x: 300, y: 330, t: 0.05, max: 820, sat: mkSat(3, 10) },
  { x: 705, y: 560, t: 0.2, max: 760, sat: mkSat(8, 8) },
]
const blotT = (b) => easeOut(clamp01((wprog.value - b.t) / 0.4))
const blotR = (b) => (blotT(b) * b.max).toFixed(1)
const satR = (b, s) => (blotT(b) * s.r * 2.4).toFixed(1)
const inkDropsDone = computed(() => wprog.value > 0.42)
const mainRise = computed(() => {
  const t = easeOut(clamp01((wprog.value - 0.02) / 0.1))
  // 병합 무대: 일출이 무르익으면 물결 잔상도 오봉도에 자리를 내준다
  const yield2 = isCombo.value ? 1 - clamp01((oprog.value - 0.45) / 0.2) : 1
  return {
    opacity: (t * (1 - melt.value * 0.85) * yield2).toFixed(3),
    transform: `scale(${(1 + melt.value * 0.03).toFixed(3)})`,
    filter: 'url(#wobmain)', // 그림 전체(밑선 포함)가 물 위에서 일렁인다
  }
})

const rainDrops = Array.from({ length: 44 }, (_, i) => ({
  left: ((i * 37) % 100) + '%',
  duration: 0.9 + ((i * 13) % 10) / 11 + 's',
  delay: -((i * 7) % 20) / 10 + 's',
  opacity: 0.45 + ((i * 11) % 10) / 20,
}))
// 눈 — 가까운 송이는 크고 빠르며 조금 흐리고, 먼 송이는 작고 느리다
const snowFlakes = Array.from({ length: 70 }, (_, i) => {
  const near = i % 5 === 0
  const size = near ? 5 + ((i * 7) % 30) / 10 : 2 + ((i * 7) % 25) / 10
  return {
    left: ((i * 41) % 100) + '%',
    duration: (near ? 5.5 : 8) + ((i * 17) % 50) / 10 + 's',
    delay: -((i * 29) % 110) / 10 + 's',
    size: size + 'px',
    blur: near ? '0.8px' : '0px',
    opacity: near ? 0.95 : 0.6 + ((i * 13) % 10) / 30,
    sway: (i % 2 ? 1 : -1) * (14 + ((i * 11) % 30)) + 'px',
  }
})
</script>

<template>
  <div class="art-stage" :style="veilStyle">
    <div class="cam" :style="camStyle">
      <!-- ══ 수면 반영 ══ -->
      <template v-if="effect === 'water' || effect === 'sunrise'">
        <!-- 본화용 물결 필터 — 말미에 그림이 수면처럼 일렁이며 풀어진다 -->
        <svg width="0" height="0" style="position: absolute" aria-hidden="true">
          <filter id="wobmain" x="-15%" y="-15%" width="130%" height="130%">
            <!-- 등방에 가까운 잔물결 — 가로줄 무늬가 생기지 않게 -->
            <feTurbulence type="fractalNoise" baseFrequency="0.011 0.017" numOctaves="2" seed="9" result="n2">
              <animate attributeName="baseFrequency" values="0.011 0.017;0.013 0.02;0.011 0.017" dur="7s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="n2" :scale="mainWobble" xChannelSelector="R" yChannelSelector="G" />
            <feGaussianBlur :stdDeviation="(melt * 2).toFixed(2)" />
          </filter>
        </svg>
        <!-- 물 위에 떠 있는 그림 (부감) — 스크롤하면 시선이 수평선으로 기울어진다 -->
        <div class="w-tilt" :style="tiltStyle">
        <div class="w-main" :style="mainRise">
          <!-- 해가 뜨며 인왕의 물결에 노을이 진다 — 물과 같은 필터로 함께 일렁인다 -->
          <div class="w-dawn" :style="dawnStyle"></div>
          <!-- 밑선: 색이 채워지기 전의 옅은 골격 -->
          <img :src="img" alt="" class="art-img lines" draggable="false" />
          <svg class="wm-svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
            <defs>
              <filter id="bleed" x="-30%" y="-30%" width="160%" height="160%">
                <feTurbulence type="fractalNoise" baseFrequency="0.013" numOctaves="3" seed="11" result="bn">
                  <animate attributeName="baseFrequency" values="0.013;0.016;0.013" dur="9s" repeatCount="indefinite" />
                </feTurbulence>
                <feDisplacementMap in="SourceGraphic" in2="bn" scale="70" xChannelSelector="R" yChannelSelector="G" />
                <feGaussianBlur stdDeviation="7" />
              </filter>
              <mask id="inkmask" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000">
                <g filter="url(#bleed)">
                  <g v-for="(b, i) in inkBlots" :key="'ib' + i">
                    <circle :cx="b.x" :cy="b.y" :r="blotR(b)" fill="#fff" />
                    <!-- 튄 자국 — 본얼룩 둘레의 위성 방울들 -->
                    <circle
                      v-for="(s, k) in b.sat"
                      :key="'sb' + k"
                      :cx="b.x + s.dx"
                      :cy="b.y + s.dy"
                      :r="satR(b, s)"
                      fill="#fff"
                    />
                  </g>
                </g>
              </mask>
            </defs>
            <image
              :href="img"
              x="0"
              y="0"
              width="1000"
              height="1000"
              preserveAspectRatio="xMidYMid slice"
              mask="url(#inkmask)"
            />
          </svg>
        </div>
        <!-- 빗방울 파문 — 표면에 고리가 퍼진다 -->
        <template v-if="rain && melt < 0.7">
          <span
            v-for="(rg, i) in rainRings"
            :key="'rg' + i"
            class="rain-ring"
            :style="{ left: rg.left, top: rg.top, animationDuration: rg.dur, animationDelay: rg.delay }"
          ></span>
        </template>
        </div>
        <!-- 먹물 방울 — 비에 섞여 떨어지며 화폭을 적신다 -->
        <div v-if="!inkDropsDone" class="ink-drops">
          <span class="wd wd1"></span>
          <span class="wd wd2"></span>
        </div>
      </template>

      <!-- ══ 물감 낙하 수묵 채색 (+ 해·달 누끼 부유) ══ -->
      <template v-if="effect === 'inkfill' || effect === 'sunrise'">
        <img v-if="!waterIntro" :src="img" alt="" class="art-img gray" draggable="false" />
        <img
          :src="effect === 'sunrise' ? img2 : img"
          alt=""
          class="art-img colorized"
          draggable="false"
          :style="waterIntro ? plainFillStyle : fillStyle"
        />
        <!-- 수면 도입: 해·달이 물에서 떠오르고, 화폭이 차면 제 자리에 스며든다 -->
        <template v-if="waterIntro">
          <span v-for="(c, i) in cuts" :key="'cel' + i" class="celestial" :style="celestialStyle(c)">
            <!-- 윤슬 기둥 — 수면까지 빛이 잇닿는다 -->
            <span class="cel-glint" :class="c.warm ? 'warm' : 'cool'" :style="glintStyle(c)"></span>
            <img :src="c.src" alt="" draggable="false" />
            <span class="cel-glow"></span>
            <!-- 물을 벗어나며 듣는 물방울 -->
            <template v-if="dripping">
              <span class="cel-drip d1"></span>
              <span class="cel-drip d2"></span>
              <span class="cel-drip d3"></span>
              <span class="cel-ring r1"></span>
              <span class="cel-ring r2"></span>
              <span class="cel-ring r3"></span>
            </template>
          </span>
          <div v-if="effect !== 'sunrise'" class="intro-water" :style="introWaterStyle">
            <!-- 해가 뜨며 수면에 물드는 노을 -->
            <div class="iw-dawn" :style="dawnStyle"></div>
            <!-- 앞 폭이 풀어진 물의 잔영 — 같은 물결로 일렁인다 -->
            <svg v-if="introWaterImg" class="iw-svg" preserveAspectRatio="xMidYMin slice" :style="introReflStyle">
              <defs>
                <filter id="wobintro" x="-15%" y="-15%" width="130%" height="130%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.011 0.09" numOctaves="2" seed="4" result="ni">
                    <animate attributeName="baseFrequency" values="0.011 0.09;0.014 0.11;0.011 0.09" dur="7s" repeatCount="indefinite" />
                  </feTurbulence>
                  <feDisplacementMap in="SourceGraphic" in2="ni" scale="60" xChannelSelector="R" yChannelSelector="G" />
                </filter>
              </defs>
              <image :href="introWaterImg" x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMin slice" filter="url(#wobintro)" transform="scale(1,-1)" transform-origin="center" />
            </svg>
          </div>
        </template>
        <template v-else>
          <span v-for="(c, i) in cuts" :key="'c' + i" class="cut-wrap" :style="cutStyle(c)">
            <MinhwaCut :src="c.src" :parts="c.parts ?? []" :idle="c.idle" />
          </span>
        </template>
        <div v-if="!waterIntro && !dropsDone && p > fillStart" class="paint-drops">
          <span class="pd pd1"></span>
          <span class="pd pd2"></span>
          <span class="pd pd3"></span>
        </div>
      </template>

      <!-- ══ 누끼 콜라주 (기본) ══ -->
      <template v-if="effect === 'collage'">
        <div class="backdrop" :style="backdropStyle">
          <img :src="bg || img" alt="" draggable="false" />
        </div>
        <!-- 누끼 배치판 — 세로 화면에선 원화 비율 상자로 모아 한 폭처럼 보이게 -->
        <div class="cut-field">
          <span v-for="(c, i) in cuts" :key="'k' + i" class="cut-wrap" :style="cutStyle(c)">
            <MinhwaCut :src="c.src" :parts="c.parts ?? []" :idle="c.idle" />
          </span>
        </div>
      </template>
    </div>

    <!-- 날씨 기운 -->
    <template v-if="rain && (effect !== 'sunrise' || p < 0.66)">
      <span
        v-for="(d, i) in rainDrops"
        :key="'r' + i"
        class="stage-drop"
        :style="{ left: d.left, animationDuration: d.duration, animationDelay: d.delay, opacity: d.opacity }"
      ></span>
    </template>
    <template v-if="snow">
      <span
        v-for="(f, i) in snowFlakes"
        :key="'s' + i"
        class="stage-flake"
        :style="{
          left: f.left,
          width: f.size,
          height: f.size,
          opacity: f.opacity,
          filter: `blur(${f.blur})`,
          animationDuration: f.duration,
          animationDelay: f.delay,
          '--sway': f.sway,
        }"
      ></span>
    </template>

    <!-- 퇴장 먹 번짐 -->
    <div class="ink-wash" :style="washStyle"></div>
  </div>
</template>

<style scoped>
.art-stage {
  position: absolute;
  inset: 0;
  overflow: hidden;
  display: grid;
  place-items: center;
}
.cam {
  position: absolute;
  inset: 0; /* 풀블리드 — 그림이 화면을 가득 채운다 */
  will-change: transform;
}
.art-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  mix-blend-mode: multiply;
  filter: sepia(0.08) contrast(1.02);
  user-select: none;
}

/* ── 콜라주 ── */
.backdrop {
  position: absolute;
  inset: -6%;
  will-change: transform, opacity;
}
.backdrop img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* 누끼 자리는 이미 종이로 메워져 있으니 흐림 없이 또렷하게 */
  filter: saturate(0.97);
}
.cut-field {
  position: absolute;
  inset: 0;
}
/* 세로(모바일) 화면 — 가로 화면 기준 %좌표가 세로로 흩어지지 않게,
   원화 비율(약 1:1.1)의 상자를 가운데 띄우고 그 안에 배치한다 */
@media (max-width: 760px) and (orientation: portrait) {
  .cut-field {
    inset: auto 0;
    top: 50%;
    height: min(118vw, 82vh);
    transform: translateY(-44%);
  }
}
.cut-wrap {
  position: absolute;
  will-change: transform;
  filter: drop-shadow(0 18px 30px rgba(34, 28, 22, 0.28));
}
.cut-img {
  display: block;
  width: 100%;
  height: auto;
  user-select: none;
}

/* 누끼 인물 고유의 잔모션 — 그림 자체가 살아 있다 */
.cut-img.sway {
  animation: idleSway 4.6s ease-in-out infinite alternate;
  transform-origin: 45% 88%;
}
@keyframes idleSway {
  from { transform: rotate(-1.6deg); }
  to { transform: rotate(2deg) translateY(-4px); }
}
.cut-img.bob {
  animation: idleBob 3.6s ease-in-out infinite alternate;
}
@keyframes idleBob {
  from { transform: translateY(0); }
  to { transform: translateY(-6px); }
}
.cut-img.breathe {
  animation: idleBreathe 4.8s ease-in-out infinite;
  transform-origin: 45% 65%;
}
@keyframes idleBreathe {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.02) rotate(0.5deg); }
}
.cut-img.tussle {
  animation: idleTussle 3.8s ease-in-out infinite;
  transform-origin: 50% 80%;
}
@keyframes idleTussle {
  0%, 100% { transform: translateX(-6px) rotate(-1.2deg); }
  45% { transform: translateX(7px) rotate(1.4deg); }
  70% { transform: translateX(3px) translateY(-6px) rotate(0.6deg); }
}
.cut-img.drift {
  animation: idleDrift 6s ease-in-out infinite alternate;
}
@keyframes idleDrift {
  from { transform: translateY(0) rotate(-0.4deg); }
  to { transform: translateY(-8px) rotate(0.6deg); }
}

/* ── 물 위의 그림 (부감) ── */
.w-main {
  position: absolute;
  inset: 0;
  will-change: transform, opacity, filter;
}
.w-tilt {
  position: absolute;
  inset: 0;
  z-index: 3; /* 해·달(z2)이 물결 뒤에서 떠오른다 */
  will-change: transform;
}
.w-dawn {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  /* 해가 뜨는 오른쪽 수평선이 가장 붉고, 달 쪽(왼쪽)으로 갈수록 옅어진다 */
  background: radial-gradient(
    ellipse 75% 52% at 76% 0%,
    rgba(224, 110, 52, 0.6),
    rgba(224, 138, 78, 0.3) 42%,
    transparent 74%
  );
  mix-blend-mode: multiply;
}
/* 밑선 — 색이 채워지기 전의 옅은 골격 (짙은 획만 흐릿하게 남긴다) */
.art-img.lines {
  filter: grayscale(1) brightness(1.45) contrast(1.5);
  opacity: 0.34;
  mix-blend-mode: multiply;
}
.wm-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
/* 빗방울이 수면(그림 표면)에 만드는 파문 고리 */
.rain-ring {
  position: absolute;
  width: 46px;
  height: 30px;
  margin: -15px 0 0 -23px;
  border: 1.5px solid rgba(251, 246, 234, 0.55);
  border-radius: 50%;
  opacity: 0;
  animation: ringSpread ease-out infinite;
  pointer-events: none;
}
@keyframes ringSpread {
  0% { opacity: 0; transform: scale(0.15); }
  12% { opacity: 0.8; }
  100% { opacity: 0; transform: scale(1.6); }
}

/* ── 먹물 낙하 (인왕 도입) ── */
.ink-drops {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 4;
}
.wd {
  position: absolute;
  width: 8px;
  height: 13px;
  border-radius: 50% 50% 58% 58%;
  background: radial-gradient(circle at 40% 28%, #4a4038, #221c16);
  animation: inkFall 2.1s cubic-bezier(0.5, 0, 0.9, 0.4) infinite;
}
.wd1 { left: 30%; animation-delay: 0s; }
.wd2 { left: 70%; animation-delay: 1.1s; }
.wd3 { left: 46%; animation-delay: 1.2s; }
.wd4 { left: 63%; animation-delay: 1.7s; width: 6px; height: 10px; }
@keyframes inkFall {
  0% { top: -4%; opacity: 0; transform: scaleY(1); }
  10% { opacity: 0.9; }
  58% { top: 40%; opacity: 0.9; transform: scaleY(1.3); }
  66% { top: 41%; opacity: 0; transform: scaleY(0.4) scaleX(1.9); }
  100% { opacity: 0; }
}

/* ── 물감 낙하 채색 ── */
.art-img.gray {
  filter: grayscale(1) sepia(0.22) contrast(0.94) brightness(1.04);
}
.art-img.colorized {
  filter: sepia(0.05) saturate(1.12) contrast(1.03);
}
.paint-drops {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.pd {
  position: absolute;
  width: 9px;
  height: 13px;
  border-radius: 50% 50% 55% 55%;
  background: radial-gradient(circle at 40% 30%, #4a7ec2, #2c5aa0);
  animation: paintFall 2.4s cubic-bezier(0.5, 0, 0.9, 0.4) infinite;
}
.pd1 { left: 44%; animation-delay: 0s; }
.pd2 { left: 52%; animation-delay: 0.8s; background: radial-gradient(circle at 40% 30%, #d97f8f, #b23a26); }
.pd3 { left: 38%; animation-delay: 1.6s; background: radial-gradient(circle at 40% 30%, #6aa87a, #3f7d52); }
@keyframes paintFall {
  0% { top: -4%; opacity: 0; transform: scaleY(1); }
  12% { opacity: 0.95; }
  62% { top: 37%; opacity: 0.95; transform: scaleY(1.25); }
  70% { top: 38%; opacity: 0; transform: scaleY(0.4) scaleX(1.8); }
  100% { opacity: 0; }
}

/* 수면에 물드는 노을 */
.iw-dawn {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 46%;
  background: linear-gradient(180deg, rgba(224, 138, 78, 0.5), rgba(224, 138, 78, 0.14) 60%, transparent);
  pointer-events: none;
}

/* 윤슬 기둥 — 디스크에서 수면까지 */
.cel-glint {
  position: absolute;
  left: 50%;
  width: 58%;
  transform: translateX(-50%);
  border-radius: 50%;
  filter: blur(5px);
  animation: glintFlicker 2.8s ease-in-out infinite;
  pointer-events: none;
}
.cel-glint.warm {
  background: radial-gradient(ellipse 50% 46% at 50% 40%, rgba(255, 178, 106, 0.55), transparent 72%);
}
.cel-glint.cool {
  background: radial-gradient(ellipse 50% 46% at 50% 40%, rgba(252, 248, 235, 0.5), transparent 72%);
}
@keyframes glintFlicker {
  0%, 100% { transform: translateX(-50%) scaleX(1); }
  35% { transform: translateX(-50%) scaleX(0.82); }
  65% { transform: translateX(-50%) scaleX(1.12); }
}

/* 물을 벗어나며 듣는 물방울 */
.cel-drip {
  position: absolute;
  left: 50%;
  top: 88%;
  width: 5px;
  height: 9px;
  border-radius: 50% 50% 60% 60%;
  background: rgba(210, 216, 220, 0.85);
  animation: dripFall 1.5s cubic-bezier(0.4, 0, 0.9, 0.5) infinite;
  pointer-events: none;
}
/* 수면 돌파 파문 — 디스크 발치에서 퍼지는 동심 타원 */
.cel-ring {
  position: absolute;
  left: 50%;
  top: 86%;
  width: 120%;
  height: 26%;
  border: 1.5px solid rgba(120, 110, 96, 0.55);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0.3);
  opacity: 0;
  animation: celRing 2.6s ease-out infinite;
  pointer-events: none;
}
.cel-ring.r2 { animation-delay: 0.85s; }
.cel-ring.r3 { animation-delay: 1.7s; }
@keyframes celRing {
  0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0; }
  14% { opacity: 0.75; }
  100% { transform: translate(-50%, -50%) scale(1.65); opacity: 0; }
}
.cel-drip.d1 { margin-left: -26%; animation-delay: 0s; }
.cel-drip.d2 { margin-left: 14%; animation-delay: 0.55s; }
.cel-drip.d3 { margin-left: -6%; animation-delay: 1.05s; width: 4px; height: 7px; }
@keyframes dripFall {
  0% { opacity: 0; transform: translateY(0) scaleY(0.7); }
  12% { opacity: 0.9; }
  85% { opacity: 0.8; }
  100% { opacity: 0; transform: translateY(16vh) scaleY(1.25); }
}

/* ── 수면 도입 : 해·달의 상승 ── */
.celestial {
  position: absolute;
  z-index: 2; /* 물띠(z3) 뒤 — 수면을 뚫고 떠오르는 일출 */
  will-change: transform, opacity;
}
.celestial img {
  display: block;
  width: 100%;
  height: auto;
  user-select: none;
}
.cel-glow {
  position: absolute;
  inset: -55%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 244, 214, 0.5), transparent 65%);
  animation: celPulse 5s ease-in-out infinite;
  pointer-events: none;
}
@keyframes celPulse {
  0%, 100% { opacity: 0.4; transform: scale(0.9); }
  50% { opacity: 0.9; transform: scale(1.08); }
}
.intro-water {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  pointer-events: none;
  overflow: hidden;
  /* 앞 폭이 풀어진 먹빛 물 — 파랗지 않게, 수묵의 잿빛으로 */
  /* 인왕이 풀어진 수면과 같은 밝기 — 한지 위 옅은 잿물 */
  background: linear-gradient(
    180deg,
    rgba(120, 124, 126, 0.22),
    rgba(104, 110, 112, 0.34) 40%,
    rgba(88, 94, 98, 0.5)
  );
  box-shadow: 0 -4px 18px rgba(104, 110, 112, 0.25);
}
.iw-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 160%;
  mix-blend-mode: multiply;
  /* 방금 누운 인왕 수면의 연속 — 같은 각도로 멀어지는 물결 평면 */
  transform: perspective(90vh) rotateX(62deg);
  transform-origin: 50% 100%;
}

/* ── 날씨 기운 ── */
.stage-drop {
  position: absolute;
  top: -6%;
  width: 2px;
  height: 44px;
  background: linear-gradient(180deg, transparent, rgba(40, 72, 104, 0.9));
  transform: rotate(7deg);
  animation: stageFall linear infinite;
  pointer-events: none;
}
@keyframes stageFall {
  to { transform: translateY(112vh) rotate(7deg); }
}
.stage-flake {
  position: absolute;
  top: -4%;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 35%, #fff 0%, rgba(251, 246, 234, 0.95) 55%, rgba(251, 246, 234, 0.4) 100%);
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.55), 0 0 2px rgba(34, 28, 22, 0.12);
  animation: stageSnow ease-in-out infinite;
  pointer-events: none;
}
/* 좌우로 흔들리며 내려앉는다 */
@keyframes stageSnow {
  0% { transform: translate3d(0, 0, 0); }
  25% { transform: translate3d(var(--sway, 20px), 27vh, 0); }
  50% { transform: translate3d(calc(var(--sway, 20px) * -0.4), 55vh, 0); }
  75% { transform: translate3d(var(--sway, 20px), 82vh, 0); }
  100% { transform: translate3d(calc(var(--sway, 20px) * 0.3), 110vh, 0); }
}

/* ── 퇴장 먹 번짐 ── */
.ink-wash {
  position: absolute;
  inset: -10%;
  pointer-events: none;
  background:
    radial-gradient(ellipse 70% 55% at 30% 110%, rgba(34, 28, 22, 0.5), transparent 70%),
    radial-gradient(ellipse 80% 60% at 75% -8%, rgba(34, 28, 22, 0.42), transparent 72%);
  filter: blur(14px);
}

@media (prefers-reduced-motion: reduce) {
  .cut-img,
  .pd,
  .stage-drop,
  .stage-flake,
  .w-sheen {
    animation: none !important;
  }
}
</style>
