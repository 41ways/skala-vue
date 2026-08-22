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
    <img
      v-for="(pt, i) in parts"
      :key="i"
      class="part"
      :class="pt.anim"
      :src="pt.src"
      alt=""
      draggable="false"
      loading="lazy"
      decoding="async"
      :style="{ left: pt.left, top: pt.top, width: pt.w, transformOrigin: pt.origin }"
    />
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
  .part {
    animation: none !important;
  }
}
</style>
