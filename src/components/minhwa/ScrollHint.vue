<script setup>
// 스크롤 유도 손 모션
defineProps({
  label: { type: String, default: '아래로 쓸어내리세요' },
})
</script>

<template>
  <div class="hint" aria-hidden="true">
    <div class="hand-track">
      <svg class="hand" viewBox="0 0 60 80">
        <!-- 손 : 검지 편 붓잡는 손 -->
        <g fill="#eccfa5" stroke="#3a2f24" stroke-width="2.6" stroke-linejoin="round">
          <!-- 검지 -->
          <path d="M27 4 q5 -4 9 1 l1 26 l-10 1 Z" />
          <!-- 주먹 -->
          <path
            d="M17 34 q-1 -9 8 -9 l12 -1 q7 0 9 5 l7 4 q5 4 3 11 l-3 16 q-2 8 -11 9 l-14 1 q-9 0 -11 -8 Z"
          />
          <path d="M37 30 q6 -1 8 4 M40 42 q6 0 8 4" fill="none" />
        </g>
        <!-- 소맷자락 -->
        <path d="M12 66 q18 8 36 0 l2 12 l-40 0 Z" fill="#a8bfa0" stroke="#3a2f24" stroke-width="2.6" />
      </svg>
      <span class="trail"></span>
    </div>
    <p class="hint-label">{{ label }}</p>
  </div>
</template>

<style scoped>
.hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  pointer-events: none;
}
.hand-track {
  position: relative;
  height: 92px;
  width: 60px;
}
.hand {
  position: absolute;
  left: 50%;
  top: 0;
  width: 44px;
  margin-left: -22px;
  animation: swipe 2.2s cubic-bezier(0.4, 0, 0.3, 1) infinite;
}
@keyframes swipe {
  0% {
    transform: translateY(0);
    opacity: 0;
  }
  18% {
    opacity: 1;
  }
  62% {
    transform: translateY(38px);
    opacity: 1;
  }
  88%,
  100% {
    transform: translateY(48px);
    opacity: 0;
  }
}
/* 손끝이 지나간 자리의 먹 자국 */
.trail {
  position: absolute;
  left: 50%;
  top: 12px;
  width: 3px;
  height: 44px;
  margin-left: -1.5px;
  border-radius: 3px;
  background: linear-gradient(180deg, transparent, currentColor 40%, transparent);
  opacity: 0;
  animation: trail 2.2s cubic-bezier(0.4, 0, 0.3, 1) infinite;
}
@keyframes trail {
  0%, 15% {
    opacity: 0;
    transform: scaleY(0.2);
    transform-origin: top;
  }
  55% {
    opacity: 0.5;
    transform: scaleY(1);
  }
  90%, 100% {
    opacity: 0;
    transform: scaleY(1);
  }
}
.hint-label {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.22em;
  opacity: 0.75;
}

@media (prefers-reduced-motion: reduce) {
  .hand,
  .trail {
    animation: none;
  }
  .hand {
    transform: translateY(20px);
    opacity: 1;
  }
}
</style>
