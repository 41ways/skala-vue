<script setup>
// ScrollSheet — 두루마리(卷軸) 날씨첩.
// 고을을 누르면 옻칠 축 사이로 시전지(詩箋紙)가 펼쳐지고, 그 고을의 하늘을 세로 기문으로 적는다.
import { computed, watch, onBeforeUnmount, nextTick, ref } from 'vue'
import hanjiImg from '@/assets/minhwa-art/bg/mudong.jpg'

const props = defineProps({
  city: { type: Object, default: null },
})
const emit = defineEmits(['close'])

const HANJA = { 맑음: '晴', 구름: '雲', 흐림: '陰', 비: '雨', 눈: '雪', 바람: '風', 뇌우: '雷', 안개: '霧' }
const statusHanja = computed(() => HANJA[props.city?.status] ?? '天')
const CITY_HANJA = { 서울: '漢城', 수원: '水原', 부산: '釜山', 광주: '光州', 강릉: '江陵', 제주: '濟州' }
const cityHanja = computed(() => props.city?.hanja ?? CITY_HANJA[props.city?.name] ?? '')

// 한자 숫자 — 二十五 식
const DIG = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九']
function toHanja(n) {
  n = Math.round(Math.abs(n))
  if (n < 10) return DIG[n]
  if (n < 100) {
    const t = Math.floor(n / 10), o = n % 10
    return (t > 1 ? DIG[t] : '') + '十' + (o ? DIG[o] : '')
  }
  return String(n)
}
const tempH = computed(() => (props.city?.temp < 0 ? '零下' : '') + toHanja(props.city?.temp ?? 0))
const humH = computed(() => toHanja(props.city?.humidity ?? 0))
const windH = computed(() => toHanja(props.city?.wind ?? 0))

const today = computed(() => {
  const d = new Date()
  return `${toHanja(d.getMonth() + 1)}月 ${toHanja(d.getDate())}日`
})
const feel = computed(() => {
  const t = props.city?.temp ?? 0
  if (t >= 30) return '한낮 볕이 따가우니 그늘을 찾을 일'
  if (t >= 24) return '더위가 옷에 감기니 얇게 입을 일'
  if (t >= 17) return '바람이 옷깃에 알맞은 날'
  if (t >= 9) return '겹옷 하나 걸칠 일'
  return '손끝이 시리니 화로를 가까이할 일'
})
const windWord = computed(() => {
  const w = props.city?.wind ?? 0
  if (w >= 8) return '세찬 바람'
  if (w >= 4) return '선선한 바람'
  if (w >= 1.5) return '실바람'
  return '바람 고요'
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
        <!-- 옻칠 축 — 옥 축두 -->
        <span class="rod rod-l"></span>
        <span class="rod rod-r"></span>

        <!-- 비단 표장(만자문) → 시전지 -->
        <div class="silk">
          <div class="paper" :style="{ backgroundImage: `url(${hanjiImg})` }">
            <span class="roll roll-l"></span>
            <span class="roll roll-r"></span>

            <!-- 시전지 괘선 -->
            <div class="rules" aria-hidden="true"></div>

            <!-- 우상단 제첨: 청우록 -->
            <p class="head">晴雨錄 · 날씨첩</p>

            <div class="columns">
              <p class="col title">
                {{ city.name }}<span class="hanja">{{ cityHanja }}</span>
              </p>
              <p class="col sky"><i class="sky-hanja">{{ statusHanja }}</i>{{ city.status }} · {{ city.isDay ? '낮' : '밤' }}</p>
              <p class="col">기온 <b>{{ tempH }}度</b></p>
              <p class="col">습기 <b>{{ humH }}分</b></p>
              <p class="col">바람 <b>{{ windWord }}</b> {{ windH }}尺</p>
              <p class="col note">{{ feel }}</p>
              <p class="col date">{{ today }} {{ city.live ? '實測' : '標本' }}</p>
            </div>

            <!-- 낙관 -->
            <i class="seal">{{ statusHanja }}</i>
            <button ref="closeBtn" class="close" @click="emit('close')">거두기</button>
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
  background: radial-gradient(ellipse at 50% 50%, rgba(34, 28, 22, 0.5), rgba(18, 16, 14, 0.84));
  backdrop-filter: blur(3px);
}
.scroll {
  --h: min(440px, 72vh);
  position: relative;
  width: min(960px, 94vw);
  height: var(--h);
  display: flex;
  align-items: stretch;
  filter: drop-shadow(0 34px 50px rgba(0, 0, 0, 0.6));
}
/* 축 — 옻칠 나무에 결 */
.rod {
  position: relative;
  z-index: 3;
  flex: 0 0 24px;
  margin: -30px 0;
  border-radius: 12px;
  background:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='120'%3E%3Cfilter id='w'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9 0.02' numOctaves='2' seed='3'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.22 0'/%3E%3C/filter%3E%3Crect width='24' height='120' filter='url(%23w)'/%3E%3C/svg%3E"),
    linear-gradient(90deg, #2a140d, #6d3b26 30%, #a3603f 48%, #6d3b26 70%, #22100a);
  box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.55), 0 6px 12px rgba(0, 0, 0, 0.45);
  animation: rodIn 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
.rod-l { --dir: 1; }
.rod-r { --dir: -1; }
@keyframes rodIn {
  from { transform: translateX(calc(var(--dir) * (min(960px, 94vw) / 2 - 14px))); }
  to { transform: translateX(0); }
}
.rod::before,
.rod::after {
  content: '';
  position: absolute;
  left: 50%;
  width: 34px;
  height: 34px;
  transform: translateX(-50%);
  border-radius: 50%;
  background: radial-gradient(circle at 36% 34%, #edead8, #9fb094 52%, #516045 86%);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.45), inset 0 0 0 2px rgba(50, 30, 18, 0.55);
}
.rod::before { top: -17px; }
.rod::after { bottom: -17px; }

/* 비단 표장 — 쪽빛 명주 만자(卍)문 */
.silk {
  flex: 1;
  padding: 16px 18px;
  background-color: #24365a;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Cg fill='none' stroke='rgba(255,255,255,0.13)' stroke-width='1.2'%3E%3Cpath d='M4 4h8v8M12 4v8h8M4 12h8M20 12v8h-8M12 20v4M4 20h8'/%3E%3C/g%3E%3C/svg%3E");
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12), inset 0 0 40px rgba(0, 0, 0, 0.35);
  transform-origin: 50% 50%;
  animation: unroll 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
@keyframes unroll {
  from { transform: scaleX(0.03); }
  to { transform: scaleX(1); }
}
/* 시전지 — 진짜 한지 결 위에 주홍 괘선 */
.paper {
  position: relative;
  height: 100%;
  padding: 26px 34px 26px 30px;
  background-size: cover;
  background-position: 50% 50%;
  box-shadow: inset 0 0 0 1px rgba(120, 80, 40, 0.35), inset 0 0 50px rgba(120, 90, 50, 0.25);
  overflow: hidden;
  animation: inkIn 0.6s ease-out 0.5s both;
}
@keyframes inkIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.roll {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 46px;
  pointer-events: none;
  z-index: 2;
}
.roll-l {
  left: 0;
  background: linear-gradient(90deg, rgba(60, 40, 20, 0.32), rgba(60, 40, 20, 0.08) 40%, transparent);
}
.roll-r {
  right: 0;
  background: linear-gradient(270deg, rgba(60, 40, 20, 0.32), rgba(60, 40, 20, 0.08) 40%, transparent);
}
.rules {
  position: absolute;
  inset: 18px 26px;
  pointer-events: none;
  border-top: 1.5px solid rgba(178, 58, 44, 0.55);
  border-bottom: 1.5px solid rgba(178, 58, 44, 0.55);
  background: repeating-linear-gradient(
    90deg,
    rgba(178, 58, 44, 0.45) 0 1px,
    transparent 1px 58px
  );
  background-position: right top;
}
.head {
  position: absolute;
  right: 40px;
  top: 24px;
  margin: 0;
  writing-mode: vertical-rl;
  font-family: var(--font-display);
  font-size: 12.5px;
  letter-spacing: 0.36em;
  color: rgba(178, 58, 44, 0.85);
}
.columns {
  position: relative;
  z-index: 1;
  height: 100%;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-right: 52px;
  color: var(--ink);
  font-family: var(--font-display);
}
.col {
  margin: 0;
  font-size: clamp(16px, 2vw, 22px);
  letter-spacing: 0.2em;
  line-height: 1.3;
}
.col b {
  font-weight: 700;
  color: var(--jeok);
}
.col.title {
  font-size: clamp(36px, 4.8vw, 56px);
  font-weight: 700;
  letter-spacing: 0.28em;
}
.col.title .hanja {
  display: inline-block;
  margin-top: 14px;
  font-size: 0.38em;
  letter-spacing: 0.5em;
  color: var(--ink-soft);
}
.col.sky {
  font-size: clamp(20px, 2.4vw, 26px);
  font-weight: 700;
}
.sky-hanja {
  display: inline-block;
  margin-bottom: 12px;
  font-style: normal;
  font-size: 1.5em;
  color: var(--jeok);
  text-orientation: upright;
}
.col.note {
  color: var(--ink-soft);
  font-size: clamp(15px, 1.7vw, 18px);
}
.col.date {
  margin-left: auto;
  font-size: 13px;
  letter-spacing: 0.3em;
  color: var(--ink-soft);
}
.seal {
  position: absolute;
  left: 34px;
  bottom: 30px;
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  background: var(--jeok);
  color: var(--baek);
  font-family: var(--font-display);
  font-style: normal;
  font-size: 30px;
  font-weight: 700;
  border-radius: 3px;
  transform: rotate(-3deg);
  box-shadow: inset 0 0 0 2px rgba(251, 246, 234, 0.4), 0 3px 8px rgba(34, 28, 22, 0.3);
  mix-blend-mode: multiply;
  opacity: 0.92;
}
.close {
  position: absolute;
  left: 34px;
  top: 26px;
  z-index: 2;
  writing-mode: vertical-rl;
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  color: var(--ink-soft);
  font-family: var(--font-display);
  font-size: 14px;
  letter-spacing: 0.34em;
}
.close::after {
  content: '';
  display: block;
  width: 1px;
  height: 22px;
  margin: 8px auto 0;
  background: rgba(34, 28, 22, 0.4);
}
.close:hover,
.close:focus-visible {
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
.sheet-leave-active .rod {
  animation: rodIn 0.4s ease-in reverse both;
}
@media (max-width: 640px) {
  .scroll { --h: min(600px, 80vh); }
  .col.title { font-size: 30px; }
  .columns { padding-right: 34px; }
}
@media (prefers-reduced-motion: reduce) {
  .silk, .paper, .rod { animation: none !important; }
}
</style>
