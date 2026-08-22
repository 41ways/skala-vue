<script setup>
// ArtStage — 실제 민화 스캔을 움직이는 화폭으로 올리는 무대
//  · 누끼: multiply 블렌딩(한지 바탕 소거) + clip-path 레이어 분리
//  · 카메라: 스크롤 진행도(p)에 따라 그림 속으로 빠져드는 줌인
//  · 선염(渲染): 가장자리가 물기로 풀린 라디얼 마스크가 번지며 그림이 나타나고 사라진다
//  · 마우스 시차: mx/my(-1..1)로 레이어별 미세 좌우 시차
//  · effect: 'parallax' | 'inkfill'(물감 낙하 수묵 채색) | 'water'(수면 반영 → 흐트러짐)
import { computed } from 'vue'

const props = defineProps({
  img: { type: String, required: true },
  effect: { type: String, default: 'parallax' },
  focal: { type: String, default: '50% 50%' }, // 빠져들 때 카메라가 향하는 지점
  layers: { type: Array, default: () => [] }, // {clip, depth, ox, oy, ds, idle}
  p: { type: Number, default: 0 },
  mx: { type: Number, default: 0 },
  my: { type: Number, default: 0 },
  rain: { type: Boolean, default: false },
  snow: { type: Boolean, default: false },
})

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const easeOut = (t) => 1 - Math.pow(1 - t, 3)

// 빠져드는 정도 : 그림이 자리잡은 뒤(p 0.22~) 카메라가 안으로 민다
const dive = computed(() => easeOut(clamp01((props.p - 0.22) / 0.5)))

// 카메라 — focal을 향해 줌인
const camStyle = computed(() => ({
  transform: `scale(${(0.94 + dive.value * 0.82).toFixed(4)})`,
  transformOrigin: props.focal,
}))

// 선염 등장 마스크 — 넓은 페더(35%)가 젖은 먹 번짐처럼 퍼진다
const veilStyle = computed(() => {
  const r = 24 + easeOut(clamp01(props.p / 0.24)) * 150
  return {
    maskImage: `radial-gradient(ellipse 90% 75% at 50% 45%, #000 ${Math.max(0, r - 38)}%, transparent ${r}%)`,
    WebkitMaskImage: `radial-gradient(ellipse 90% 75% at 50% 45%, #000 ${Math.max(0, r - 38)}%, transparent ${r}%)`,
  }
})

// 퇴장 — 먹이 화면을 적시며 다음 폭으로
const washStyle = computed(() => ({
  opacity: clamp01((props.p - 0.87) / 0.12).toFixed(3),
}))

// 레이어 시차 : 마우스 + 빠져들수록 깊이 분리
function layerStyle(l) {
  const d = l.depth ?? 12
  const x = props.mx * d * 0.55 + dive.value * (l.ox ?? 0)
  const y = props.my * d * 0.4 + dive.value * (l.oy ?? 0)
  const s = 1 + dive.value * (l.ds ?? 0.05)
  return {
    clipPath: l.clip,
    transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${s.toFixed(4)})`,
  }
}
const baseStyle = computed(() => ({
  transform: `translate3d(${(-props.mx * 5).toFixed(1)}px, ${(-props.my * 3.5).toFixed(1)}px, 0)`,
}))

// ── inkfill : 물감이 떨어지며 수묵→채색 ──
const fillR = computed(() => easeOut(clamp01((props.p - 0.05) / 0.4)) * 165)
const fillStyle = computed(() => ({
  maskImage: `radial-gradient(ellipse 85% 90% at 46% 38%, #000 ${Math.max(0, fillR.value - 34)}%, transparent ${fillR.value}%)`,
  WebkitMaskImage: `radial-gradient(ellipse 85% 90% at 46% 38%, #000 ${Math.max(0, fillR.value - 34)}%, transparent ${fillR.value}%)`,
}))
const dropsDone = computed(() => fillR.value > 150)

// ── water : 수면 위 반영 → 스크롤하면 물이 흐트러지며 사라진다 ──
const wobble = computed(() => 6 + clamp01(props.p / 0.42) * 110) // 물결 강도
const reflStyle = computed(() => ({
  opacity: (1 - clamp01((props.p - 0.1) / 0.34)).toFixed(3),
}))
const mainRise = computed(() => {
  const t = easeOut(clamp01((props.p - 0.16) / 0.3))
  return {
    opacity: t.toFixed(3),
    transform: `translateY(${((1 - t) * 6).toFixed(2)}%)`,
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
      <!-- ══ 수면 반영 연출 ══ -->
      <template v-if="effect === 'water'">
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

      <!-- ══ 물감 낙하 수묵 채색 ══ -->
      <template v-else-if="effect === 'inkfill'">
        <img :src="img" alt="" class="art-img gray" draggable="false" :style="baseStyle" />
        <img :src="img" alt="" class="art-img colorized" draggable="false" :style="[baseStyle, fillStyle]" />
        <div v-if="!dropsDone" class="paint-drops">
          <span class="pd pd1"></span>
          <span class="pd pd2"></span>
          <span class="pd pd3"></span>
        </div>
      </template>

      <!-- ══ 레이어 분리 패럴랙스 (기본) ══ -->
      <template v-else>
        <div class="art-base" :style="baseStyle">
          <img :src="img" alt="" class="art-img" draggable="false" />
        </div>
        <div
          v-for="(l, i) in layers"
          :key="i"
          class="art-layer"
          :style="layerStyle(l)"
        >
          <img :src="img" alt="" class="art-img" :class="l.idle" draggable="false" />
        </div>
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
  position: relative;
  width: min(88vw, 1150px);
  height: min(78vh, 820px);
  will-change: transform;
}
.art-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  /* 누끼: 스캔의 밝은 한지 바탕이 우리 배경에 녹아든다 */
  mix-blend-mode: multiply;
  filter: sepia(0.08) contrast(1.02);
  user-select: none;
}
.art-base,
.art-layer {
  position: absolute;
  inset: 0;
  will-change: transform;
}

/* 레이어 고유의 잔모션 — 그림 자체가 숨쉰다 */
.art-img.sway {
  animation: idleSway 4.6s ease-in-out infinite alternate;
  transform-origin: 40% 85%;
}
@keyframes idleSway {
  from { transform: rotate(-0.9deg); }
  to { transform: rotate(1.1deg) translateY(-3px); }
}
.art-img.bob {
  animation: idleBob 3.6s ease-in-out infinite alternate;
}
@keyframes idleBob {
  from { transform: translateY(0); }
  to { transform: translateY(-5px); }
}
.art-img.breathe {
  animation: idleBreathe 4.8s ease-in-out infinite;
  transform-origin: 45% 60%;
}
@keyframes idleBreathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.014); }
}
.art-img.tussle {
  animation: idleTussle 3.8s ease-in-out infinite;
  transform-origin: 50% 78%;
}
@keyframes idleTussle {
  0%, 100% { transform: translateX(-4px) rotate(-0.7deg); }
  45% { transform: translateX(5px) rotate(0.8deg); }
  70% { transform: translateX(2px) translateY(-4px) rotate(0.4deg); }
}

/* ── 수면 반영 ── */
.w-main {
  position: absolute;
  inset: 0 0 44% 0;
}
.w-main .art-img {
  object-fit: contain;
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
  .art-img,
  .pd,
  .stage-drop,
  .stage-flake,
  .w-sheen {
    animation: none !important;
  }
}
</style>
