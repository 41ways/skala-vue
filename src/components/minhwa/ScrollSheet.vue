<script setup>
// ScrollSheet — 두루마리(卷軸) 날씨첩.
// 고을을 누르면 옻칠 축 사이로 시전지(詩箋紙)가 펼쳐지고, 그 고을의 하늘을 세로 기문으로 적는다.
import { computed, watch, onBeforeUnmount, nextTick, ref } from 'vue'
import axios from 'axios'
import { cityCoords, codeToStatus } from '@/composables/useWeather.js'
import hanjiImg from '@/assets/minhwa-art/bg/mudong.jpg'
import rodImg from '@/assets/minhwa-art/rod.png'
import silkImg from '@/assets/minhwa-art/silk.jpg'

const props = defineProps({
  city: { type: Object, default: null },
})
const emit = defineEmits(['close'])

const HANJA = { 맑음: '晴', 구름: '雲', 흐림: '陰', 비: '雨', 눈: '雪', 바람: '風', 뇌우: '雷', 안개: '霧' }
const statusHanja = computed(() => HANJA[props.city?.status] ?? '天')
const CITY_HANJA = { 서울: '漢城', 수원: '水原', 부산: '釜山', 광주: '光州', 강릉: '江陵', 제주: '濟州', 인천: '仁川', 대전: '大田', 대구: '大邱', 춘천: '春川', 세종기지: '世宗基地' }
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
// 숫자 표기 — 한자 ⇄ 아라비아 (낙관 버튼으로 전환)
const hanjaMode = ref(true)
const num = (n) => (hanjaMode.value ? toHanja(n) : String(Math.round(n)))
const tempTxt = computed(() => {
  const t = props.city?.temp ?? 0
  return hanjaMode.value ? (t < 0 ? '零下' : '') + toHanja(t) + '度' : `${Math.round(t)}°`
})
const humTxt = computed(() => (hanjaMode.value ? num(props.city?.humidity ?? 0) + '分' : `${Math.round(props.city?.humidity ?? 0)}%`))
const windTxt = computed(() => (hanjaMode.value ? num(props.city?.wind ?? 0) + '米' : `${props.city?.wind ?? 0} m/s`))
const today = computed(() => {
  const d = new Date()
  return hanjaMode.value
    ? `${toHanja(d.getMonth() + 1)}月 ${toHanja(d.getDate())}日`
    : `${d.getMonth() + 1}월 ${d.getDate()}일`
})
const windWord = computed(() => {
  const w = props.city?.wind ?? 0
  if (w >= 8) return '세찬 바람'
  if (w >= 4) return '선선한 바람'
  if (w >= 1.5) return '실바람'
  return '바람 고요'
})

// 앞날 — Open-Meteo 일별 예보 (내일·모레·글피)
const forecast = ref([])
const DAY = ['내일', '모레', '글피']
watch(
  () => props.city,
  async (c) => {
    forecast.value = []
    if (!c) return
    const co = cityCoords[c.id] ?? { lat: c.lat, lon: c.lon }
    if (co.lat === undefined || co.lat === null) return
    try {
      const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude: co.lat,
          longitude: co.lon,
          daily: 'weather_code,temperature_2m_max,temperature_2m_min',
          forecast_days: 4,
          timezone: 'auto',
        },
      })
      const d = data.daily
      forecast.value = [1, 2, 3].map((i) => ({
        label: DAY[i - 1],
        status: codeToStatus(d.weather_code[i]),
        hi: Math.round(d.temperature_2m_max[i]),
        lo: Math.round(d.temperature_2m_min[i]),
      }))
    } catch {
      forecast.value = []
    }
  },
  { immediate: true },
)
const deg = (n) => (hanjaMode.value ? toHanja(n) + '度' : `${n}°`)

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
        <span class="rod rod-l"><img :src="rodImg" alt="" draggable="false" /></span>
        <span class="rod rod-r"><img :src="rodImg" alt="" draggable="false" /></span>

        <!-- 비단 표장(만자문) → 시전지 -->
        <div class="silk" :style="{ backgroundImage: `url(${silkImg})` }">
          <div class="paper" :style="{ backgroundImage: `url(${hanjiImg})` }">
            <!-- 시전지 괘선 -->
            <div class="rules" aria-hidden="true"></div>

            <!-- 우상단 제첨: 청우록 -->
            <p class="head">晴雨錄 · 날씨첩</p>

            <div class="columns" :class="{ arabic: !hanjaMode }">
              <p class="col title">
                {{ city.name }}<span class="hanja">{{ cityHanja }}</span>
              </p>
              <p class="col sky"><i class="sky-hanja">{{ statusHanja }}</i>{{ city.status }} · {{ city.isDay ? '낮' : '밤' }}</p>
              <p class="col"><span class="k">기온</span><b>{{ tempTxt }}</b></p>
              <p class="col"><span class="k">습도</span><b>{{ humTxt }}</b></p>
              <p class="col"><span class="k">바람</span><b>{{ windTxt }}</b><span class="sub">{{ windWord }}</span></p>
              <p class="col date">{{ today }} · {{ city.demo ? '시연' : city.live ? '실측' : '표본' }}</p>
              <template v-if="forecast.length">
                <span class="col divider" aria-hidden="true"></span>
                <p v-for="f in forecast" :key="f.label" class="col fc">
                  <span class="k">{{ f.label }}</span>
                  <i class="fc-h">{{ HANJA[f.status] ?? '天' }}</i>{{ f.status }}
                  <span class="sub">{{ deg(f.hi) }} / {{ deg(f.lo) }}</span>
                </p>
              </template>
            </div>

            <!-- 낙관 = 숫자 표기 전환 버튼 -->
            <button
              class="seal"
              type="button"
              :aria-pressed="hanjaMode"
              aria-label="숫자 표기 전환 (한자 ⇄ 아라비아)"
              :title="hanjaMode ? '아라비아 숫자로 보기' : '한자 숫자로 보기'"
              @click="hanjaMode = !hanjaMode"
            >
              <span class="seal-face" :class="{ on: hanjaMode }">文</span>
              <span class="seal-arrow" aria-hidden="true">⇅</span>
              <span class="seal-face num" :class="{ on: !hanjaMode }">123</span>
            </button>
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
/* 축 — 로즈우드 사진 텍스처 + 옥 축두 (rod.png) */
.rod {
  position: relative;
  z-index: 3;
  flex: 0 0 40px;
  margin: -44px 0;
  animation: rodIn 1.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
  filter: drop-shadow(0 10px 14px rgba(0, 0, 0, 0.55));
}
.rod img {
  position: absolute;
  left: 50%;
  top: 0;
  height: 100%;
  width: auto;
  transform: translateX(-50%);
  user-select: none;
  pointer-events: none;
}
.rod-l { --dir: 1; order: 1; }
.rod-r { --dir: -1; order: 3; }
.silk { order: 2; }
/* 축 두 개가 아래서 함께 솟아오른 뒤, 양옆으로 벌어진다 */
@keyframes rodIn {
  0% { transform: translateX(calc(var(--dir) * (min(960px, 94vw) / 2 - 22px))) translateY(75vh); }
  45% { transform: translateX(calc(var(--dir) * (min(960px, 94vw) / 2 - 22px))) translateY(0); }
  100% { transform: translateX(0) translateY(0); }
}

/* 비단 표장 — 쪽빛 명주 만자(卍)문 */
.silk {
  flex: 1;
  min-width: 0; /* 세로글 내용이 축 밖으로 밀어내지 않게 */
  margin: 0 -16px; /* 축 몸통 밑으로 파고들어 붙는다 */
  padding: 18px 34px;
  z-index: 1;
  background-color: #22345a;
  background-size: 360px 360px;
  background-blend-mode: normal;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.12),
    inset 0 0 48px rgba(0, 0, 0, 0.45),
    inset 0 2px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  transform-origin: 50% 50%;
  animation: unroll 1.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
.silk::before {
  /* 비단 광택 */
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(112deg, rgba(255, 255, 255, 0.18), transparent 26%, transparent 58%, rgba(255, 255, 255, 0.12) 76%, transparent);
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
  right: 92px;
  top: 24px;
  margin: 0;
  writing-mode: vertical-lr;
  font-family: var(--font-display);
  font-size: 12.5px;
  letter-spacing: 0.36em;
  color: rgba(178, 58, 44, 0.85);
}
.columns {
  position: relative;
  z-index: 1;
  height: 100%;
  writing-mode: vertical-lr; /* 왼쪽에서 오른쪽으로 읽는다 */
  text-orientation: mixed;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-left: 8px;
  padding-right: 84px; /* 오른쪽 낙관·거두기 자리 확보 */
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
  font-size: 1.25em;
  letter-spacing: 0.08em;
}
/* 아라비아 숫자 모드 — 세로글 속 숫자는 반대 방향(아래→위)으로 눕힌다 */
.columns.arabic .col b,
.columns.arabic .col.date,
.columns.arabic .col.fc .sub {
  display: inline-block;
  rotate: 180deg;
}
.col .k {
  display: inline-block;
  margin-bottom: 14px;
  font-size: 0.8em;
  color: var(--ink-soft);
  letter-spacing: 0.3em;
}
.col.divider {
  width: 1px;
  margin: 6px 4px;
  background: rgba(178, 58, 44, 0.5);
}
.col.fc {
  font-size: clamp(15px, 1.8vw, 19px);
}
.fc-h {
  display: inline-block;
  margin-bottom: 8px;
  font-style: normal;
  font-size: 1.3em;
  color: var(--jeok);
  text-orientation: upright;
}
.col .sub {
  display: inline-block;
  margin-top: 12px;
  font-size: 0.78em;
  color: var(--ink-soft);
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
  font-size: 13px;
  letter-spacing: 0.3em;
  color: var(--ink-soft);
}
.seal {
  position: absolute;
  z-index: 4; /* 세로글 영역 위 — 실제 클릭이 닿아야 한다 */
  right: 36px;
  bottom: 30px;
  width: 64px;
  height: 72px;
  display: grid;
  place-items: center;
  gap: 0;
  padding: 0;
  background: var(--jeok);
  color: var(--baek);
  border: 0;
  border-radius: 4px;
  cursor: pointer;
  transform: rotate(-3deg);
  box-shadow: inset 0 0 0 2px rgba(251, 246, 234, 0.45), 0 4px 10px rgba(34, 28, 22, 0.35);
  transition: transform 0.2s, box-shadow 0.2s;
  animation: stampIn 0.5s cubic-bezier(0.2, 1.4, 0.4, 1) 1.35s both;
}
/* 낙관 — 두루마리가 다 펼쳐진 뒤 쿵, 찍힌다 */
@keyframes stampIn {
  0% { transform: rotate(-12deg) scale(1.9); opacity: 0; filter: blur(2px); }
  60% { transform: rotate(-2deg) scale(0.94); opacity: 1; filter: blur(0); }
  100% { transform: rotate(-3deg) scale(1); opacity: 1; }
}
.seal:hover,
.seal:focus-visible {
  transform: rotate(-3deg) scale(1.06);
  outline: none;
  box-shadow: inset 0 0 0 2px rgba(251, 246, 234, 0.7), 0 6px 14px rgba(34, 28, 22, 0.4);
}
.seal-face {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  line-height: 1;
  opacity: 0.45;
  transition: opacity 0.2s;
}
.seal-arrow {
  font-family: var(--font-util);
  font-size: 13px;
  line-height: 1;
  opacity: 0.85;
  margin: -2px 0;
}
.seal-face.num {
  font-family: var(--font-util);
  font-size: 15px;
  letter-spacing: 0.04em;
}
.seal-face.on {
  opacity: 1;
}
.close {
  position: absolute;
  right: 34px;
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
  .rod { flex-basis: 30px; }
  .silk { padding: 14px 24px; margin: 0 -12px; }
  .paper { padding: 20px 18px 20px 16px; overflow-x: auto; }
  .columns { gap: 12px; padding-left: 4px; padding-right: 64px; }
  .col { font-size: 15px; letter-spacing: 0.14em; }
  .col.title { font-size: 30px; letter-spacing: 0.2em; }
  .col.sky { font-size: 18px; }
  .head { display: none; }
  .seal { right: 18px; bottom: 18px; width: 52px; height: 62px; }
  .seal-face { font-size: 16px; }
  .close { right: 18px; top: 18px; }
  .rules { inset: 12px 14px; }
}
@media (prefers-reduced-motion: reduce) {
  .silk, .paper, .rod, .seal { animation: none !important; }
}
</style>
