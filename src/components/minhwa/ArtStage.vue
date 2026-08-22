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
  effect: { type: String, default: 'collage' },
  focal: { type: String, default: '50% 50%' },
  cuts: { type: Array, default: () => [] }, // {src,left,top,w,depth,ox,oy,ds,idle,z}
  p: { type: Number, default: 0 },
  mx: { type: Number, default: 0 },
  my: { type: Number, default: 0 },
  rain: { type: Boolean, default: false },
  snow: { type: Boolean, default: false },
  waterIntro: { type: Boolean, default: false }, // inkfill: 수면에서 해·달이 떠오르는 도입부
})

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const easeOut = (t) => 1 - Math.pow(1 - t, 3)

// 빠져드는 정도
const dive = computed(() => easeOut(clamp01((props.p - 0.22) / 0.5)))

// 효과별 줌 깊이 — 파노라마(inkfill)는 살짝만, 콜라주는 깊게 빠져든다
const diveAmp = computed(() => ({ inkfill: 0.12, water: 0.24 })[props.effect] ?? 0.66)
const camStyle = computed(() => ({
  transform: `scale(${(0.97 + dive.value * diveAmp.value).toFixed(4)})`,
  transformOrigin: props.focal,
}))

// 선염 등장 마스크
const veilStyle = computed(() => {
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
  opacity: (0.78 - dive.value * 0.1).toFixed(3),
}))

// 누끼 인물 — 깊이별 시차 + 빠져들 때 분리
function cutStyle(c) {
  const d = c.depth ?? 14
  const x = props.mx * d * 0.6 + dive.value * (c.ox ?? 0)
  const y = props.my * d * 0.45 + dive.value * (c.oy ?? 0)
  const s = 1 + dive.value * (c.ds ?? 0.06)
  return {
    left: c.left,
    top: c.top,
    width: c.w,
    zIndex: c.z ?? 2,
    transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${s.toFixed(4)})`,
  }
}

// ── inkfill ──
// waterIntro면 해·달이 물에서 떠오른 뒤(p~0.24)에야 물감이 번지기 시작한다
const fillStart = computed(() => (props.waterIntro ? 0.42 : 0.05))
const fillR = computed(() => easeOut(clamp01((props.p - fillStart.value) / 0.36)) * 165)
const fillStyle = computed(() => {
  const g = `radial-gradient(ellipse 85% 90% at 46% 38%, #000 ${Math.max(0, fillR.value - 34)}%, transparent ${fillR.value}%)`
  return { maskImage: g, WebkitMaskImage: g }
})
const dropsDone = computed(() => fillR.value > 150)
// 수면 도입이면 해·달이 다 떠오른 뒤에야 수묵 밑그림이 배어난다
const grayStyle = computed(() => ({
  opacity: props.waterIntro ? clamp01((props.p - 0.38) / 0.1).toFixed(3) : '1',
}))

// 수면 도입 — 해·달이 물에서 떠오르고, 물은 서서히 걷힌다
// 일출의 완급 — 수면에서 천천히 몸을 빼고, 중천으로 갈수록 미끄러진다
const riseT = computed(() => {
  const t = clamp01((props.p - 0.05) / 0.4)
  return t * t * (3 - 2 * t) // smoothstep
})
const introWaterStyle = computed(() => ({
  opacity: (0.95 * (1 - clamp01((props.p - 0.34) / 0.24))).toFixed(3),
}))
function celestialStyle(c) {
  const land = clamp01((props.p - 0.58) / 0.18) // 화폭이 다 차면 원화의 해·달 위에서 스러진다
  // cover 크롭 보정: 화면비에 따라 원화 속 해·달의 실제 화면 좌표를 계산
  const imgAR = c.imgAR ?? 2.315
  const vis = Math.min(1, window.innerWidth / window.innerHeight / imgAR)
  const x0 = 0.5 - vis / 2
  const leftPct = ((c.ix - x0) / vis) * 100
  return {
    left: leftPct.toFixed(2) + '%',
    top: (c.iy * 100).toFixed(2) + '%',
    width: c.dvh + 'vh',
    opacity: (riseT.value * (1 - land)).toFixed(3),
    transform: `translate(-50%, -50%) translateY(${((1 - riseT.value) * 72).toFixed(2)}vh) translate3d(${(props.mx * (c.depth ?? 10) * 0.4).toFixed(1)}px, ${(props.my * 5).toFixed(1)}px, 0)`,
  }
}

// ── water ──
// 그림이 일찍 자리잡고(비 소개), 말미에 물결로 퍼지며 흐려진다
const wobble = computed(() => 14 + clamp01(props.p / 0.8) * 80)
const melt = computed(() => clamp01((props.p - 0.62) / 0.28))
const mainWobble = computed(() => (melt.value * 75).toFixed(1))
const reflStyle = computed(() => ({
  opacity: (0.3 + melt.value * 0.7).toFixed(3),
}))
const mainRise = computed(() => {
  const t = easeOut(clamp01((props.p - 0.02) / 0.14))
  return {
    opacity: (t * (1 - melt.value * 0.92)).toFixed(3),
    transform: `translateY(${((1 - t) * 5 + melt.value * 7).toFixed(2)}%)`,
    filter: melt.value > 0.01 ? 'url(#wobmain)' : 'none',
  }
})

const rainDrops = Array.from({ length: 30 }, (_, i) => ({
  left: ((i * 37) % 100) + '%',
  duration: 0.9 + ((i * 13) % 10) / 11 + 's',
  delay: -((i * 7) % 20) / 10 + 's',
  opacity: 0.25 + ((i * 11) % 10) / 22,
}))
const snowFlakes = Array.from({ length: 24 }, (_, i) => ({
  left: ((i * 41) % 100) + '%',
  duration: 7 + ((i * 17) % 50) / 10 + 's',
  delay: -((i * 29) % 90) / 10 + 's',
  size: 3 + ((i * 7) % 30) / 10 + 'px',
}))
</script>

<template>
  <div class="art-stage" :style="veilStyle">
    <div class="cam" :style="camStyle">
      <!-- ══ 수면 반영 ══ -->
      <template v-if="effect === 'water'">
        <!-- 본화용 물결 필터 — 말미에 그림이 수면처럼 일렁이며 풀어진다 -->
        <svg width="0" height="0" style="position: absolute" aria-hidden="true">
          <filter id="wobmain" x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.045" numOctaves="2" seed="9" result="n2">
              <animate attributeName="baseFrequency" values="0.008 0.045;0.01 0.055;0.008 0.045" dur="6s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="n2" :scale="mainWobble" xChannelSelector="R" yChannelSelector="G" />
            <feGaussianBlur :stdDeviation="(melt * 2.2).toFixed(2)" />
          </filter>
        </svg>
        <div class="w-main" :style="mainRise">
          <img :src="img" alt="" class="art-img" draggable="false" />
        </div>
        <div class="w-line"></div>
        <div class="w-refl" :style="reflStyle">
          <svg class="w-svg" preserveAspectRatio="xMidYMin slice">
            <defs>
              <filter id="wob" x="-20%" y="-20%" width="140%" height="140%">
                <feTurbulence type="fractalNoise" baseFrequency="0.011 0.09" numOctaves="2" seed="4" result="n">
                  <animate attributeName="baseFrequency" values="0.011 0.09;0.014 0.11;0.011 0.09" dur="7s" repeatCount="indefinite" />
                </feTurbulence>
                <feDisplacementMap in="SourceGraphic" in2="n" :scale="wobble" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>
            <image :href="img" x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMin slice" filter="url(#wob)" transform="scale(1,-1)" transform-origin="center" />
          </svg>
          <div class="w-sheen"></div>
        </div>
      </template>

      <!-- ══ 물감 낙하 수묵 채색 (+ 해·달 누끼 부유) ══ -->
      <template v-else-if="effect === 'inkfill'">
        <img :src="img" alt="" class="art-img gray" draggable="false" :style="grayStyle" />
        <img :src="img" alt="" class="art-img colorized" draggable="false" :style="fillStyle" />
        <!-- 수면 도입: 해·달이 물에서 떠오르고, 화폭이 차면 제 자리에 스며든다 -->
        <template v-if="waterIntro">
          <span v-for="(c, i) in cuts" :key="'cel' + i" class="celestial" :style="celestialStyle(c)">
            <img :src="c.src" alt="" draggable="false" />
            <span class="cel-glow"></span>
          </span>
          <div class="intro-water" :style="introWaterStyle">
            <div class="iw-shimmer"></div>
          </div>
        </template>
        <template v-else>
          <span v-for="(c, i) in cuts" :key="'c' + i" class="cut-wrap" :style="cutStyle(c)">
            <MinhwaCut :src="c.src" :parts="c.parts ?? []" :idle="c.idle" />
          </span>
        </template>
        <div v-if="!dropsDone && p > fillStart" class="paint-drops">
          <span class="pd pd1"></span>
          <span class="pd pd2"></span>
          <span class="pd pd3"></span>
        </div>
      </template>

      <!-- ══ 누끼 콜라주 (기본) ══ -->
      <template v-else>
        <div class="backdrop" :style="backdropStyle">
          <img :src="img" alt="" draggable="false" />
        </div>
        <span v-for="(c, i) in cuts" :key="'k' + i" class="cut-wrap" :style="cutStyle(c)">
          <MinhwaCut :src="c.src" :parts="c.parts ?? []" :idle="c.idle" silhouette />
        </span>
      </template>
    </div>

    <!-- 날씨 기운 -->
    <template v-if="rain">
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
        :style="{ left: f.left, width: f.size, height: f.size, animationDuration: f.duration, animationDelay: f.delay }"
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
  filter: blur(12px) saturate(0.95);
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

/* ── 수면 반영 ── */
.w-main {
  position: absolute;
  inset: 0 0 44% 0;
}
.w-main .art-img {
  object-position: bottom center;
}
.w-line {
  position: absolute;
  left: 4%;
  right: 4%;
  top: 56%;
  height: 1.5px;
  background: linear-gradient(90deg, transparent, rgba(47, 86, 122, 0.5), transparent);
}
.w-refl {
  position: absolute;
  left: 0;
  right: 0;
  top: 56.2%;
  bottom: 0;
  overflow: hidden;
}
.w-svg {
  width: 100%;
  height: 240%;
  display: block;
  mix-blend-mode: multiply;
  opacity: 0.8;
}
.w-sheen {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(241, 231, 208, 0.15), rgba(47, 86, 122, 0.22)),
    repeating-linear-gradient(180deg, transparent 0 7px, rgba(251, 246, 234, 0.05) 7px 9px);
  animation: sheen 6s ease-in-out infinite alternate;
}
@keyframes sheen {
  from { transform: translateY(0); }
  to { transform: translateY(4px); }
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
  height: 26%;
  z-index: 3;
  pointer-events: none;
  /* 수면 위쪽부터 진하게 — 뒤에서 올라오는 해·달이 물속에서 어른거리다 떠오른다 */
  background: linear-gradient(
    180deg,
    rgba(47, 86, 122, 0.62),
    rgba(41, 76, 108, 0.8) 35%,
    rgba(36, 67, 95, 0.96)
  );
  box-shadow: 0 -6px 22px rgba(47, 86, 122, 0.35);
}
.iw-shimmer {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    180deg,
    transparent 0 9px,
    rgba(251, 246, 234, 0.09) 9px 11px
  );
  animation: iwFlow 5s ease-in-out infinite alternate;
}
@keyframes iwFlow {
  from { transform: translateY(0); }
  to { transform: translateY(6px); }
}

/* ── 날씨 기운 ── */
.stage-drop {
  position: absolute;
  top: -6%;
  width: 1.5px;
  height: 30px;
  background: linear-gradient(180deg, transparent, rgba(47, 86, 122, 0.65));
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
  background: rgba(251, 246, 234, 0.95);
  box-shadow: 0 0 4px rgba(34, 28, 22, 0.15);
  animation: stageSnow linear infinite;
  pointer-events: none;
}
@keyframes stageSnow {
  to { transform: translateY(110vh) translateX(24px); }
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
