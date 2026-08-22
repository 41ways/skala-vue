<script setup>
// MinhwaCut — 누끼 인물 한 점.
// 몸통(base) 위에 머리·꼬리·앞발 같은 부위 누끼(parts)가 정위치에 겹쳐져
// 각자 다른 리듬으로 움직인다 → 관절 인형(紙人形)의 입체감.
// silhouette: 어두운 화폭용 한지 실루엣 받침.
defineProps({
  src: { type: String, required: true },
  parts: { type: Array, default: () => [] }, // {src, left, top, w, anim, origin}
  idle: { type: String, default: '' }, // 몸 전체 잔모션 클래스
  silhouette: { type: Boolean, default: false },
})
</script>

<template>
  <span class="mcut" :class="[idle, { 'with-sil': silhouette }]">
    <img v-if="silhouette" class="sil" :src="src" alt="" draggable="false" />
    <img class="base" :src="src" alt="" draggable="false" loading="lazy" decoding="async" />
    <span
      v-for="(pt, i) in parts"
      :key="i"
      class="part"
      :class="[pt.anim, { snowy: pt.snow }]"
      :style="{ left: pt.left, top: pt.top, width: pt.w, transformOrigin: pt.origin }"
    >
      <span class="part-in">
        <img :src="pt.src" alt="" draggable="false" loading="lazy" decoding="async" />
        <!-- 머리 위에 눈이 쌓이고, 이따금 털어 낸다 -->
        <template v-if="pt.snow">
          <svg class="snowcap" viewBox="0 0 315 350" aria-hidden="true">
            <path
              d="M44 62 C52 40 70 26 96 24 C126 22 150 30 176 38 C198 44 214 40 230 22 C244 10 254 20 258 36 C266 46 272 54 276 70 C268 66 258 60 246 56 C232 52 220 56 204 60 C184 64 164 58 144 50 C120 42 96 40 76 44 C62 48 52 54 44 62 Z"
              class="sc-main"
            />
            <path d="M86 28 C100 20 122 22 136 28 C122 32 104 34 86 28 Z" class="sc-hi" />
            <path d="M212 32 C224 20 240 18 250 28 C238 30 226 34 212 32 Z" class="sc-hi" />
          </svg>
          <span class="sc-fall f1"></span>
          <span class="sc-fall f2"></span>
          <span class="sc-fall f3"></span>
          <span class="sc-fall f4"></span>
        </template>
      </span>
    </span>
  </span>
</template>

<style scoped>
.mcut {
  position: relative;
  display: block;
}
.mcut img {
  display: block;
  width: 100%;
  height: auto;
  user-select: none;
}
.sil {
  position: absolute;
  inset: 0;
  filter: brightness(0) invert(0.93) sepia(0.55) saturate(0.9) brightness(1.04);
  /* 확대 없음 — 몸통의 관절 구멍과 정확히 겹쳐야 한다 */
}
/* 스티커 테두리 — 모든 조각(부위 포함)의 윤곽을 따라 흰 선이 돈다 (꼭두각시 관절) */
.mcut.with-sil {
  filter: drop-shadow(0 0 1.5px rgba(251, 246, 234, 0.95)) drop-shadow(0 0 1px rgba(251, 246, 234, 0.8));
}
.base {
  position: relative;
  z-index: 1;
}
.part {
  position: absolute;
  z-index: 2;
  will-change: transform;
}
.part-in {
  position: relative;
  display: block;
}
.part img {
  display: block;
  width: 100%;
}

/* ── 눈 쌓임 — 12초 주기: 천천히 쌓이다(0~80%) 머리를 털면(84%) 눈이 떨어진다 ── */
.part.snowy .part-in {
  animation: scShake 12s ease-in-out infinite;
  transform-origin: 55% 92%;
}
@keyframes scShake {
  0%, 82%, 92%, 100% { transform: rotate(0deg) translateX(0); }
  84% { transform: rotate(-4deg) translateX(-5px); }
  86% { transform: rotate(4.5deg) translateX(5px); }
  88% { transform: rotate(-3deg) translateX(-3px); }
  90% { transform: rotate(1.5deg) translateX(1px); }
}
.snowcap {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  transform-origin: 50% 18%;
  animation: scPile 12s linear infinite;
  filter: drop-shadow(0 1px 1px rgba(34, 28, 22, 0.18));
}
.sc-main { fill: rgba(252, 250, 246, 0.96); }
.sc-hi { fill: rgba(255, 255, 255, 0.9); }
@keyframes scPile {
  0% { opacity: 0; transform: scaleY(0.1) translateY(4px); }
  14% { opacity: 0.45; transform: scaleY(0.35) translateY(3px); }
  50% { opacity: 0.9; transform: scaleY(0.78) translateY(1px); }
  82% { opacity: 1; transform: scaleY(1) translateY(0); }
  85% { opacity: 0.9; transform: scaleY(0.9) translateY(6px); }
  88% { opacity: 0; transform: scaleY(0.5) translateY(26px); }
  100% { opacity: 0; transform: scaleY(0.1) translateY(4px); }
}
/* 털어 낸 눈덩이 — 네 조각이 흩어져 떨어진다 */
.sc-fall {
  position: absolute;
  top: 12%;
  width: 7%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: rgba(252, 250, 246, 0.95);
  opacity: 0;
  pointer-events: none;
  animation: scFall 12s ease-in infinite;
}
.sc-fall.f1 { left: 18%; animation-delay: 0s; }
.sc-fall.f2 { left: 40%; width: 9%; animation-delay: 0.12s; }
.sc-fall.f3 { left: 60%; animation-delay: 0.05s; }
.sc-fall.f4 { left: 76%; width: 5%; animation-delay: 0.2s; }
@keyframes scFall {
  0%, 83% { opacity: 0; transform: translate(0, 0) scale(1); }
  84% { opacity: 1; transform: translate(0, 0) scale(1); }
  96% { opacity: 0; transform: translate(var(--sx, 0), 120%) scale(0.6); }
  100% { opacity: 0; }
}
.sc-fall.f1 { --sx: -14px; }
.sc-fall.f2 { --sx: -4px; }
.sc-fall.f3 { --sx: 8px; }
.sc-fall.f4 { --sx: 16px; }

/* ── 부위 모션 ─────────────────────────────────────── */
/* 머리 — 갸웃갸웃 (목 기준) */
.part.p-head {
  animation: pHead 7s ease-in-out infinite;
}
@keyframes pHead {
  0%, 26%, 100% { transform: rotate(0deg); }
  34%, 46% { transform: rotate(-5.5deg) translateY(-4px); }
  54% { transform: rotate(2deg); }
  68%, 80% { transform: rotate(4.2deg) translateY(-2px); }
  88% { transform: rotate(-1.5deg); }
}
/* 꼬리 — 말렸다 풀렸다 */
.part.p-tail {
  animation: pTail 4.4s ease-in-out infinite alternate;
}
@keyframes pTail {
  from { transform: rotate(-9deg); }
  to { transform: rotate(13deg) translateY(-5px); }
}
/* 앞발 — 지그시 눌렀다 든다 */
.part.p-paw {
  animation: pPaw 4.4s ease-in-out infinite;
}
@keyframes pPaw {
  0%, 52%, 100% { transform: translateY(0) rotate(0deg); }
  62% { transform: translateY(-10px) rotate(-6deg); }
  70% { transform: translateY(-2px) rotate(1deg); }
  78% { transform: translateY(-7px) rotate(-3deg); }
  86% { transform: translateY(0) rotate(0deg); }
}
/* 소매·팔 — 나부낌 */
.part.p-flutter {
  animation: pFlutter 2.6s ease-in-out infinite alternate;
}
@keyframes pFlutter {
  from { transform: rotate(-4deg); }
  to { transform: rotate(6deg) translateY(-3px); }
}
.part.p-flutter-b {
  animation: pFlutter 2.6s ease-in-out infinite alternate-reverse;
}
/* 날개 — 제자리 날갯짓 */
.part.p-flap {
  animation: pFlap 0.9s ease-in-out infinite alternate;
}
@keyframes pFlap {
  from { transform: rotate(-3deg); }
  55% { transform: rotate(2deg); }
  to { transform: rotate(13deg) translateY(-2px); }
}
/* 다리 — 차올림 */
.part.p-kick {
  animation: pKick 1.6s ease-in-out infinite;
}
@keyframes pKick {
  0%, 100% { transform: rotate(4deg); }
  45% { transform: rotate(-11deg) translateY(-4px); }
  70% { transform: rotate(-3deg); }
}

/* ── 몸 전체 잔모션 ─────────────────────────────────── */
.mcut.sway {
  animation: mcSway 4.8s ease-in-out infinite alternate;
  transform-origin: 45% 88%;
}
@keyframes mcSway {
  from { transform: rotate(-1.8deg); }
  to { transform: rotate(2.2deg) translateY(-5px); }
}
.mcut.bob {
  animation: mcBob 3.8s ease-in-out infinite alternate;
}
@keyframes mcBob {
  from { transform: translateY(0); }
  to { transform: translateY(-7px); }
}
.mcut.breathe {
  animation: mcBreathe 5s ease-in-out infinite;
  transform-origin: 45% 65%;
}
@keyframes mcBreathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.018); }
}
/* 호랑이 — 숨쉬며 무게중심을 옮기고 이따금 으르렁 들썩 */
.mcut.prowl {
  animation: mcProwl 7s ease-in-out infinite;
  transform-origin: 45% 70%;
}
@keyframes mcProwl {
  0%, 100% { transform: scale(1) rotate(0deg) translateX(0); }
  18% { transform: scale(1.016) rotate(-0.8deg) translateX(-5px); }
  36% { transform: scale(1.005) rotate(0.4deg) translateX(3px); }
  52% { transform: scale(1.02) rotate(-0.5deg) translateX(-2px) translateY(-3px); }
  64% { transform: scale(1.028) rotate(1deg) translateX(4px) translateY(-6px); }
  72% { transform: scale(1.01) rotate(0.2deg) translateX(1px); }
  86% { transform: scale(1.015) rotate(-0.6deg) translateX(-3px); }
}
.mcut.tussle {
  animation: mcTussle 4s ease-in-out infinite;
  transform-origin: 50% 80%;
}
@keyframes mcTussle {
  0%, 100% { transform: translateX(-7px) rotate(-1.4deg); }
  45% { transform: translateX(8px) rotate(1.6deg); }
  70% { transform: translateX(3px) translateY(-7px); }
}
.mcut.drift {
  animation: mcDrift 6s ease-in-out infinite alternate;
}
@keyframes mcDrift {
  from { transform: translateY(0) rotate(-0.4deg); }
  to { transform: translateY(-9px) rotate(0.6deg); }
}
/* 까치 — 이따금 훌쩍 날아올랐다 되돌아온다 */
.mcut.fly {
  animation: mcFly 15s ease-in-out infinite;
  transform-origin: 45% 60%;
}
@keyframes mcFly {
  0%, 54% { transform: translate(0, 0) rotate(0deg); }
  57% { transform: translate(-2vw, -3vh) rotate(-7deg); }
  63% { transform: translate(-11vw, -10vh) rotate(-11deg); }
  70% { transform: translate(-17vw, -4vh) rotate(-3deg); }
  78% { transform: translate(-9vw, -11vh) rotate(6deg); }
  86% { transform: translate(-2vw, -3vh) rotate(3deg); }
  91%, 100% { transform: translate(0, 0) rotate(0deg); }
}

@media (prefers-reduced-motion: reduce) {
  .mcut,
  .part,
  .part-in,
  .snowcap,
  .sc-fall {
    animation: none !important;
  }
}
</style>
