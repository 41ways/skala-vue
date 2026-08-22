<script setup>
// 먹 파문 — 손끝이 화폭에 닿으면 먹물이 번지듯 파문이 퍼진다
// 부모 요소(position 지정)에 오버레이로 얹어 쓴다
import { ref, onMounted, onBeforeUnmount } from 'vue'

const host = ref(null)
const ripples = ref([])
let seq = 0

function splash(e) {
  const rect = host.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const id = ++seq
  // 파문 세 겹 + 먹방울 튐
  const drops = Array.from({ length: 5 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 5 + Math.random() * 1.2
    const dist = 26 + Math.random() * 44
    return {
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist,
      size: 3 + Math.random() * 5,
      delay: Math.random() * 0.1,
    }
  })
  ripples.value.push({ id, x, y, drops })
  setTimeout(() => {
    ripples.value = ripples.value.filter((r) => r.id !== id)
  }, 1600)
}

onMounted(() => {
  const parent = host.value.parentElement
  parent.addEventListener('pointerdown', splash)
  host.value._cleanup = () => parent.removeEventListener('pointerdown', splash)
})
onBeforeUnmount(() => host.value?._cleanup?.())
</script>

<template>
  <div ref="host" class="ink-layer" aria-hidden="true">
    <div
      v-for="r in ripples"
      :key="r.id"
      class="splash"
      :style="{ left: r.x + 'px', top: r.y + 'px' }"
    >
      <span class="ring r1"></span>
      <span class="ring r2"></span>
      <span class="ring r3"></span>
      <span class="blot"></span>
      <span
        v-for="(d, i) in r.drops"
        :key="i"
        class="droplet"
        :style="{
          '--dx': d.dx + 'px',
          '--dy': d.dy + 'px',
          width: d.size + 'px',
          height: d.size + 'px',
          animationDelay: d.delay + 's',
        }"
      ></span>
    </div>
  </div>
</template>

<style scoped>
.ink-layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 30;
}
.splash {
  position: absolute;
  width: 0;
  height: 0;
}
.ring {
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 50%;
  border: 2px solid rgba(34, 28, 22, 0.55);
  transform: translate(-50%, -50%) scale(0);
  animation: ringOut 1.3s cubic-bezier(0.16, 0.66, 0.35, 1) forwards;
}
.r1 {
  width: 130px;
  height: 130px;
}
.r2 {
  width: 190px;
  height: 190px;
  border-width: 1.5px;
  animation-delay: 0.1s;
  animation-duration: 1.5s;
}
.r3 {
  width: 250px;
  height: 250px;
  border-width: 1px;
  animation-delay: 0.22s;
  animation-duration: 1.6s;
}
@keyframes ringOut {
  0% {
    transform: translate(-50%, -50%) scale(0.1);
    opacity: 0.9;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }
}
/* 중심 먹 번짐 */
.blot {
  position: absolute;
  left: 0;
  top: 0;
  width: 34px;
  height: 34px;
  border-radius: 46% 54% 52% 48%;
  background: radial-gradient(circle, rgba(34, 28, 22, 0.5), rgba(34, 28, 22, 0.12) 65%, transparent 75%);
  filter: blur(1.5px);
  transform: translate(-50%, -50%) scale(0.2);
  animation: blot 1.1s ease-out forwards;
}
@keyframes blot {
  0% {
    transform: translate(-50%, -50%) scale(0.2);
    opacity: 0.95;
  }
  55% {
    transform: translate(-50%, -50%) scale(1.25) rotate(14deg);
    opacity: 0.5;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.6) rotate(20deg);
    opacity: 0;
  }
}
/* 튀는 먹방울 */
.droplet {
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 50%;
  background: rgba(34, 28, 22, 0.6);
  transform: translate(-50%, -50%);
  animation: fling 0.85s cubic-bezier(0.1, 0.7, 0.4, 1) forwards;
}
@keyframes fling {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.9;
  }
  100% {
    transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.3);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ink-layer {
    display: none;
  }
}
</style>
