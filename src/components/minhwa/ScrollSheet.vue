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
  transform: perspective(1400px) rotateX(3deg);
}
.scroll::after {
  /* 바닥에 깔리는 그림자 */
  content: '';
  position: absolute;
  left: 6%;
  right: 6%;
  bottom: -54px;
  height: 40px;
  border-radius: 50%;
  background: radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0.55), transparent 70%);
  filter: blur(6px);
  z-index: -1;
}
/* 축 — 옻칠 나무에 결 */
.rod {
  position: relative;
  z-index: 3;
  flex: 0 0 34px;
  margin: -34px 0;
  border-radius: 17px;
  background:
    /* 옻칠 광택 띠 */
    linear-gradient(90deg, transparent 30%, rgba(255, 235, 210, 0.38) 40%, rgba(255, 245, 225, 0.55) 44%, rgba(255, 235, 210, 0.2) 50%, transparent 62%),
    /* 세로 나뭇결 */
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='34' height='200'%3E%3Cfilter id='w'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.55 0.012' numOctaves='3' seed='5'/%3E%3CfeColorMatrix values='0 0 0 0 0.08 0 0 0 0 0.03 0 0 0 0 0.01 0 0 0 0.55 0'/%3E%3C/filter%3E%3Crect width='34' height='200' filter='url(%23w)'/%3E%3C/svg%3E"),
    /* 원기둥 음영 */
    linear-gradient(90deg, #1a0a06 0%, #4a2416 14%, #8a4a2c 38%, #b2673d 48%, #7d4226 66%, #3a1a10 86%, #140805 100%);
  box-shadow:
    inset 0 0 10px rgba(0, 0, 0, 0.6),
    inset -4px 0 8px rgba(0, 0, 0, 0.45),
    0 10px 18px rgba(0, 0, 0, 0.5);
  animation: rodIn 1.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
.rod-l { --dir: 1; }
.rod-r { --dir: -1; }
/* 축 두 개가 아래서 함께 솟아오른 뒤, 양옆으로 벌어진다 */
@keyframes rodIn {
  0% { transform: translateX(calc(var(--dir) * (min(960px, 94vw) / 2 - 14px))) translateY(75vh); }
  45% { transform: translateX(calc(var(--dir) * (min(960px, 94vw) / 2 - 14px))) translateY(0); }
  100% { transform: translateX(0) translateY(0); }
}
.rod::before,
.rod::after {
  content: '';
  position: absolute;
  left: 50%;
  width: 46px;
  height: 46px;
  transform: translateX(-50%);
  border-radius: 50%;
  background:
    radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.95) 0 6%, transparent 18%),
    radial-gradient(circle at 38% 36%, #eef0e0, #a9b99b 38%, #6f8262 62%, #3f4f37 84%, #25301f);
  box-shadow:
    0 6px 12px rgba(0, 0, 0, 0.5),
    inset -5px -6px 10px rgba(0, 0, 0, 0.35),
    inset 0 0 0 2px rgba(50, 30, 18, 0.45);
}
.rod::before { top: -23px; }
.rod::after { bottom: -23px; }

/* 비단 표장 — 쪽빛 명주 만자(卍)문 */
.silk {
  flex: 1;
  padding: 16px 18px;
  background-color: #22345a;
  background-image:
    /* 비단 광택 */
    linear-gradient(115deg, rgba(255, 255, 255, 0.16), transparent 28%, transparent 60%, rgba(255, 255, 255, 0.1) 78%, transparent),
    /* 만자문 */
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Cg fill='none' stroke='rgba(255,255,255,0.12)' stroke-width='1.2'%3E%3Cpath d='M4 4h8v8M12 4v8h8M4 12h8M20 12v8h-8M12 20v4M4 20h8'/%3E%3C/g%3E%3C/svg%3E"),
    /* 직조 결 (씨실·날실) */
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.05) 0 1px, transparent 1px 3px),
    repeating-linear-gradient(90deg, rgba(0, 0, 0, 0.08) 0 1px, transparent 1px 3px);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.14),
    inset 0 0 46px rgba(0, 0, 0, 0.4),
    inset 0 2px 0 rgba(255, 255, 255, 0.12);
  transform-origin: 50% 50%;
  animation: unroll 1.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
@keyframes unroll {
  0% { transform: translateY(75vh) scaleX(0.03); }
  45% { transform: translateY(0) scaleX(0.03); }
  100% { transform: translateY(0) scaleX(1); }
}
/* 시전지 — 진짜 한지 결 위에 주홍 괘선 */
.paper {
  position: relative;
  height: 100%;
  padding: 26px 34px 26px 30px;
  background-size: cover;
  background-position: 50% 50%;
  box-shadow:
    inset 0 0 0 1px rgba(120, 80, 40, 0.35),
    inset 0 0 60px rgba(120, 90, 50, 0.28),
    inset 0 -18px 30px -20px rgba(80, 55, 25, 0.35);
  overflow: hidden;
  animation: inkIn 0.6s ease-out 1.15s both;
}
@keyframes inkIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
/* 종이 면의 미세한 굴곡 — 빛이 스치는 결 */
.paper::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0.14) 18%, rgba(0, 0, 0, 0.05) 34%, rgba(255, 255, 255, 0.1) 52%, rgba(0, 0, 0, 0.05) 70%, rgba(255, 255, 255, 0.12) 86%, rgba(0, 0, 0, 0.06));
  mix-blend-mode: soft-light;
}
.roll {
  position: absolute;
  top: -6px;
  bottom: -6px;
  width: 58px;
  pointer-events: none;
  z-index: 2;
}
/* 겹겹이 감긴 종이 — 밝고 어두운 띠가 원통처럼 반복 */
.roll-l {
  left: -10px;
  background:
    linear-gradient(90deg,
      rgba(80, 55, 30, 0.55) 0, rgba(250, 242, 225, 0.85) 6px, rgba(120, 90, 55, 0.5) 11px,
      rgba(250, 242, 225, 0.8) 17px, rgba(120, 90, 55, 0.42) 23px, rgba(250, 242, 225, 0.7) 30px,
      rgba(120, 90, 55, 0.3) 38px, rgba(250, 242, 225, 0.35) 46px, transparent 58px);
  box-shadow: 8px 0 14px -4px rgba(40, 25, 10, 0.35);
  border-radius: 0 40% 40% 0 / 0 8% 8% 0;
}
.roll-r {
  right: -10px;
  background:
    linear-gradient(270deg,
      rgba(80, 55, 30, 0.55) 0, rgba(250, 242, 225, 0.85) 6px, rgba(120, 90, 55, 0.5) 11px,
      rgba(250, 242, 225, 0.8) 17px, rgba(120, 90, 55, 0.42) 23px, rgba(250, 242, 225, 0.7) 30px,
      rgba(120, 90, 55, 0.3) 38px, rgba(250, 242, 225, 0.35) 46px, transparent 58px);
  box-shadow: -8px 0 14px -4px rgba(40, 25, 10, 0.35);
  border-radius: 40% 0 0 40% / 8% 0 0 8%;
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
  animation: unroll 0.7s ease-in reverse both;
}
.sheet-leave-active .rod {
  animation: rodIn 0.7s ease-in reverse both;
}
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.7s ease;
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
