<script setup>
// ScrollSheet — 두루마리(卷軸) 날씨첩.
// 도시를 누르면 좌우 나무 축 사이로 한지가 펼쳐지며 그 고을의 하늘을 세로글로 적는다.
import { computed, watch, onBeforeUnmount, nextTick, ref } from 'vue'

const props = defineProps({
  city: { type: Object, default: null },
})
const emit = defineEmits(['close'])

const HANJA = { 맑음: '晴', 구름: '雲', 흐림: '陰', 비: '雨', 눈: '雪', 바람: '風', 뇌우: '雷', 안개: '霧' }
const statusHanja = computed(() => HANJA[props.city?.status] ?? '天')
// 국내 고을 한자 (데이터에 없을 때)
const CITY_HANJA = { 서울: '漢城', 수원: '水原', 부산: '釜山', 광주: '光州', 강릉: '江陵', 제주: '濟州' }
const cityHanja = computed(() => props.city?.hanja ?? CITY_HANJA[props.city?.name] ?? '')

const today = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
})
const feel = computed(() => {
  const t = props.city?.temp ?? 0
  if (t >= 30) return '한낮 볕이 따갑습니다'
  if (t >= 24) return '더위가 몸에 감깁니다'
  if (t >= 17) return '바람이 옷깃에 알맞습니다'
  if (t >= 9) return '겹옷 하나가 좋겠습니다'
  return '손끝이 시립니다'
})
const windWord = computed(() => {
  const w = props.city?.wind ?? 0
  if (w >= 8) return '세찬 바람'
  if (w >= 4) return '선선한 바람'
  if (w >= 1.5) return '실바람'
  return '바람 없음'
})

const closeBtn = ref(null)
let lastFocus = null
function onKey(e) {
  if (e.key === 'Escape') emit('close')
}
watch(
  () => props.city,
  async (c) => {
    if (c) {
      window.addEventListener('keydown', onKey)
      lastFocus = document.activeElement
      await nextTick()
      closeBtn.value?.focus({ preventScroll: true })
    } else {
      window.removeEventListener('keydown', onKey)
      lastFocus?.focus?.({ preventScroll: true })
      lastFocus = null
    }
  },
  { immediate: true },
)
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <Transition name="sheet">
    <div v-if="city" class="sheet-veil" @click.self="emit('close')">
      <div class="scroll" role="dialog" aria-modal="true" :aria-label="city.name + ' 날씨첩'">
        <!-- 좌우 나무 축 — 옥 축두 -->
        <span class="rod rod-l"></span>
        <span class="rod rod-r"></span>

        <!-- 비단 표장 + 한지 -->
        <div class="silk">
          <div class="paper">
            <!-- 낙관: 날씨 한자 -->
            <i class="seal">{{ statusHanja }}</i>

            <div class="columns">
              <p class="col title">
                {{ city.name }}<span class="hanja">{{ cityHanja }}</span>
              </p>
              <p class="col big">{{ city.temp }}<small>°</small><span class="status">{{ city.status }}</span></p>
              <p class="col">하늘 — {{ city.status }}, {{ city.isDay ? '낮' : '밤' }}</p>
              <p class="col">습기 — {{ city.humidity }}푼</p>
              <p class="col">바람 — {{ windWord }} · 초속 {{ city.wind }}자</p>
              <p class="col note">{{ feel }}</p>
              <p class="col date">{{ today }} · {{ city.live ? '실측' : '표본' }}</p>
            </div>

            <button ref="closeBtn" class="close util" @click="emit('close')">거두기 ✕</button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.sheet-veil {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  padding: 24px;
  background: radial-gradient(ellipse at 50% 50%, rgba(34, 28, 22, 0.55), rgba(18, 16, 14, 0.82));
  backdrop-filter: blur(3px);
}
.scroll {
  position: relative;
  width: min(920px, 94vw);
  height: min(420px, 70vh);
  display: flex;
  align-items: stretch;
  filter: drop-shadow(0 30px 50px rgba(0, 0, 0, 0.55));
}
/* 축 — 검붉은 옻칠 나무, 양끝 옥 축두 */
.rod {
  position: relative;
  z-index: 3;
  flex: 0 0 22px;
  margin: -26px 0;
  border-radius: 11px;
  background: linear-gradient(90deg, #3a1f16, #7a4a33 35%, #a86a48 50%, #6b3d2a 70%, #2d1710);
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5), 0 4px 10px rgba(0, 0, 0, 0.4);
}
.rod::before,
.rod::after {
  content: '';
  position: absolute;
  left: 50%;
  width: 30px;
  height: 30px;
  transform: translateX(-50%);
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #e9e4cf, #9aa285 55%, #5c6a4e);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.45), inset 0 0 0 2px rgba(60, 40, 24, 0.5);
}
.rod::before { top: -14px; }
.rod::after { bottom: -14px; }
/* 비단 표장 — 쪽빛 명주에 잔무늬 */
.silk {
  flex: 1;
  padding: 18px 22px;
  background-color: #23355c;
  background-image:
    radial-gradient(circle at 6px 6px, rgba(255, 255, 255, 0.08) 1.2px, transparent 1.8px),
    linear-gradient(180deg, rgba(255, 255, 255, 0.06), transparent 40%, rgba(0, 0, 0, 0.18));
  background-size: 14px 14px, 100% 100%;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.14);
  transform-origin: 50% 50%;
  animation: unroll 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
@keyframes unroll {
  from { transform: scaleX(0.04); }
  to { transform: scaleX(1); }
}
.paper {
  position: relative;
  height: 100%;
  padding: 22px 28px;
  background:
    radial-gradient(ellipse at 20% 10%, rgba(255, 252, 240, 0.7), transparent 55%),
    linear-gradient(160deg, #f3e9d2, #e9dcc0 60%, #e2d2b3);
  box-shadow: inset 0 0 40px rgba(120, 90, 50, 0.22), inset 0 0 0 1px rgba(120, 90, 50, 0.25);
  overflow: hidden;
  animation: inkIn 0.7s ease-out 0.45s both;
}
@keyframes inkIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.paper::after {
  /* 한지 결 */
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.18;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' seed='7'/%3E%3CfeColorMatrix values='0 0 0 0 0.4 0 0 0 0 0.3 0 0 0 0 0.15 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23g)'/%3E%3C/svg%3E");
}
.seal {
  position: absolute;
  right: 26px;
  bottom: 24px;
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  background: var(--jeok);
  color: var(--baek);
  font-family: var(--font-display);
  font-style: normal;
  font-size: 32px;
  font-weight: 700;
  border-radius: 4px;
  transform: rotate(-4deg);
  box-shadow: inset 0 0 0 2px rgba(251, 246, 234, 0.4), 0 3px 8px rgba(34, 28, 22, 0.3);
}
/* 세로글 — 오른쪽에서 왼쪽으로 */
.columns {
  height: 100%;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  display: flex;
  flex-direction: column;
  gap: 22px;
  color: var(--ink);
  font-family: var(--font-display);
  padding-right: 8px;
}
.col {
  margin: 0;
  font-size: clamp(16px, 2vw, 21px);
  letter-spacing: 0.18em;
  line-height: 1.3;
}
.col.title {
  font-size: clamp(34px, 4.6vw, 52px);
  font-weight: 700;
  letter-spacing: 0.26em;
}
.col.title .hanja {
  display: inline-block;
  margin-top: 14px;
  font-size: 0.4em;
  letter-spacing: 0.5em;
  color: var(--ink-soft);
}
.col.big {
  font-size: clamp(44px, 6vw, 68px);
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--jeok);
  text-orientation: upright;
}
.col.big small {
  font-size: 0.5em;
}
.col.big .status {
  display: inline-block;
  margin-top: 12px;
  font-size: 0.42em;
  letter-spacing: 0.2em;
  color: var(--ink);
}
.col.note {
  color: var(--ink-soft);
}
.col.date {
  font-family: var(--font-util);
  font-size: 12px;
  letter-spacing: 0.22em;
  color: var(--ink-soft);
  margin-left: auto;
}
.close {
  position: absolute;
  left: 22px;
  bottom: 20px;
  background: none;
  border: 1px solid rgba(34, 28, 22, 0.35);
  border-radius: 3px;
  padding: 6px 12px;
  cursor: pointer;
  color: var(--ink);
  font-size: 12.5px;
  letter-spacing: 0.12em;
}
.close:hover,
.close:focus-visible {
  border-color: var(--jeok);
  color: var(--jeok);
  outline: none;
}
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.4s ease;
}
.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}
.sheet-leave-active .silk {
  animation: unroll 0.4s ease-in reverse both;
}
@media (max-width: 640px) {
  .scroll {
    height: min(560px, 78vh);
  }
  .silk { padding: 12px 14px; }
  .paper { padding: 16px 18px; }
  .columns { gap: 14px; }
  .col { font-size: 14px; letter-spacing: 0.12em; }
  .col.title { font-size: 28px; }
  .col.big { font-size: 40px; }
  .seal { width: 44px; height: 44px; font-size: 24px; right: 16px; bottom: 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .silk,
  .paper {
    animation: none !important;
  }
}
</style>
