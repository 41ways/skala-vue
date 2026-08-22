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
    <img class="base" :src="src" alt="" draggable="false" />
    <img
      v-for="(pt, i) in parts"
      :key="i"
      class="part"
      :class="pt.anim"
      :src="pt.src"
      alt=""
      draggable="false"
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
  0%, 30%, 100% { transform: rotate(0deg); }
  38%, 50% { transform: rotate(-3.2deg) translateY(-2px); }
  58% { transform: rotate(1.2deg); }
  74%, 86% { transform: rotate(2.6deg); }
}
/* 꼬리 — 말렸다 풀렸다 */
.part.p-tail {
  animation: pTail 4.4s ease-in-out infinite alternate;
}
@keyframes pTail {
  from { transform: rotate(-5deg); }
  to { transform: rotate(8deg) translateY(-3px); }
}
/* 앞발 — 지그시 눌렀다 든다 */
.part.p-paw {
  animation: pPaw 4.4s ease-in-out infinite;
}
@keyframes pPaw {
  0%, 62%, 100% { transform: translateY(0) rotate(0deg); }
  72% { transform: translateY(-6px) rotate(-4deg); }
  82% { transform: translateY(-1px) rotate(1deg); }
}
/* 소매·팔 — 나부낌 */
.part.p-flutter {
  animation: pFlutter 2.6s ease-in-out infinite alternate;
}
@keyframes pFlutter {
  from { transform: rotate(-4deg); }
  to { transform: rotate(6deg) translateY(-3px); }
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

@media (prefers-reduced-motion: reduce) {
  .mcut,
  .part {
    animation: none !important;
  }
}
</style>
