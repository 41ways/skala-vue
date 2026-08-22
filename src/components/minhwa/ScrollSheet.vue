<script setup>
// ScrollSheet: 두루마리 날씨첩. 도시를 누르면 열리고 세로글로 날씨를 적는다
import { computed, watch, onBeforeUnmount, nextTick, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { cityCoords, codeToStatus, cachedGet } from '@/composables/useWeather.js'
import { toHanja, ganjiYear, STATUS_HANJA as HANJA } from '@/utils/hanja.js'
import { laundryScore, laundryGrade } from '@/data/weatherData.js'
import hanjiImg from '@/assets/minhwa-art/bg/mudong.jpg'
import rodImg from '@/assets/minhwa-art/rod.png'
import silkImg from '@/assets/minhwa-art/silk.jpg'

const props = defineProps({
  city: { type: Object, default: null },
})
const emit = defineEmits(['close'])

const statusHanja = computed(() => HANJA[props.city?.status] ?? '天')
const CITY_HANJA = { 서울: '漢城', 수원: '水原', 부산: '釜山', 광주: '光州', 강릉: '江陵', 제주: '濟州', 인천: '仁川', 대전: '大田', 대구: '大邱', 춘천: '春川', 세종기지: '世宗基地' }
const cityHanja = computed(() => props.city?.hanja ?? CITY_HANJA[props.city?.name] ?? '')

// 숫자 표기 - 한자 ⇄ 아라비아 (낙관 버튼으로 전환)
const hanjaMode = ref(true)
const num = (n) => (hanjaMode.value ? toHanja(n) : String(Math.round(n)))
const tempTxt = computed(() => {
  const t = props.city?.temp ?? 0
  return hanjaMode.value ? (t < 0 ? '零下' : '') + toHanja(t) + '度' : `${Math.round(t)}°`
})
const humTxt = computed(() => (hanjaMode.value ? num(props.city?.humidity ?? 0) + '分' : `${Math.round(props.city?.humidity ?? 0)}%`))
const windTxt = computed(() => (hanjaMode.value ? num(props.city?.wind ?? 0) + '米' : `${props.city?.wind ?? 0}`))
const today = computed(() => {
  const d = new Date()
  return hanjaMode.value
    ? `${ganjiYear(d.getFullYear())}年 ${toHanja(d.getMonth() + 1)}月 ${toHanja(d.getDate())}日`
    : `${d.getMonth() + 1}월 ${d.getDate()}일`
})
// 빨래 지수 (실습 대시보드와 같은 규칙)
const laundry = computed(() => {
  const sc = laundryScore(props.city ?? {})
  return { score: sc, grade: laundryGrade(sc) }
})
const laundryTxt = computed(() => (hanjaMode.value ? toHanja(laundry.value.score) + '點' : `${laundry.value.score}점`))
const windWord = computed(() => {
  const w = props.city?.wind ?? 0
  if (w >= 8) return '세찬 바람'
  if (w >= 4) return '선선한 바람'
  if (w >= 1.5) return '실바람'
  return '바람 고요'
})

// 앞날 - Open-Meteo 일별 예보 (내일/모레/글피)
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
      const data = await cachedGet({
        latitude: co.lat,
        longitude: co.lon,
        daily: 'weather_code,temperature_2m_max,temperature_2m_min',
        forecast_days: 4,
        timezone: 'auto',
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
const sheetEl = ref(null)
let lastFocus = null
function onKey(e) {
  if (e.key === 'Escape') return emit('close')
  // Tab은 두루마리 안에서만 돈다
  if (e.key !== 'Tab' || !sheetEl.value) return
  const items = [...sheetEl.value.querySelectorAll('button, a[href]')].filter((el) => !el.disabled)
  if (!items.length) return
  const first = items[0]
  const last = items[items.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  } else if (!sheetEl.value.contains(document.activeElement)) {
    e.preventDefault()
    first.focus()
  }
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
      <div ref="sheetEl" class="scroll" role="dialog" aria-modal="true" :aria-label="city.name + ' 날씨첩'">
        <!-- 옻칠 축 - 옥 축두 -->
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
              <p class="col"><span class="k">바람</span><b>{{ windTxt }}</b><small v-if="!hanjaMode" class="unit">m/s</small><span class="sub">{{ windWord }}</span></p>
              <p class="col"><span class="k">빨래</span><b>{{ laundryTxt }}</b><span class="sub">{{ laundry.grade.label }}</span></p>
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
            <button ref="closeBtn" class="close" @click="emit('close')">✕ 닫기</button>
            <RouterLink to="/guide" class="guide-link" @click="emit('close')">빨래 지침 보기 ↓</RouterLink>
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
/* 축 - 로즈우드 사진 텍스처 + 옥 축두 (rod.png) */
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

/* 비단 표장 - 쪽빛 명주 만자(卍)문 */
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
    inset 0 2px 0 rgba(255, 255, 255, 0.1),
    inset 46px 0 40px -30px rgba(0, 0, 0, 0.6), /* 축에 말려 들어가는 그늘 */
    inset -46px 0 40px -30px rgba(0, 0, 0, 0.6);
  position: relative;
  transform-origin: 50% 50%;
  animation: unroll 1.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
/* 금선 이중 테 - 표구의 회장(回裝) 선, 세월에 닳아 군데군데 옅다 */
.silk::after {
  content: '';
  position: absolute;
  inset: 9px 24px;
  pointer-events: none;
  border: 1px solid rgba(214, 178, 98, 0.55);
  outline: 1px solid rgba(214, 178, 98, 0.28);
  outline-offset: 3px;
  -webkit-mask: linear-gradient(90deg, #000 0, rgba(0, 0, 0, 0.5) 18%, #000 40%, rgba(0, 0, 0, 0.6) 70%, #000);
  mask: linear-gradient(90deg, #000 0, rgba(0, 0, 0, 0.5) 18%, #000 40%, rgba(0, 0, 0, 0.6) 70%, #000);
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
/* 시전지 - 진짜 한지 결 위에 주홍 괘선 */
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
/* 종이 면의 미세한 굴곡 - 빛이 스치는 결 */
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
  border-top: 1.5px solid rgba(170, 62, 44, 0.42);
  border-bottom: 1.5px solid rgba(170, 62, 44, 0.42);
  background: repeating-linear-gradient(
    90deg,
    rgba(170, 62, 44, 0.36) 0 1px,
    transparent 1px 58px
  );
  background-position: right top;
  -webkit-mask: linear-gradient(180deg, rgba(0, 0, 0, 0.7), #000 30%, #000 70%, rgba(0, 0, 0, 0.65));
  mask: linear-gradient(180deg, rgba(0, 0, 0, 0.7), #000 30%, #000 70%, rgba(0, 0, 0, 0.65));
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
  padding-right: 84px; /* 오른쪽 낙관/거두기 자리 확보 */
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
/* 아라비아 숫자 모드 - 기온/습도/바람 값은 세로글 속에서 가로로 한 덩어리(縦中横) */
.columns.arabic .col b {
  text-combine-upright: all;
  -webkit-text-combine: horizontal;
  font-size: 1.05em;
  letter-spacing: 0;
}
.columns.arabic .col .unit {
  display: inline-block;
  margin-top: 4px;
  font-family: var(--font-util);
  font-size: 0.6em;
  letter-spacing: 0.02em;
  color: var(--jeok);
  text-combine-upright: all;
  -webkit-text-combine: horizontal;
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
  z-index: 4; /* 세로글 영역 위 - 실제 클릭이 닿아야 한다 */
  right: 36px;
  bottom: 30px;
  width: 74px;
  height: 84px;
  display: grid;
  place-items: center;
  gap: 0;
  padding: 0;
  color: var(--baek);
  border: 0;
  border-radius: 2px;
  cursor: pointer;
  transform: rotate(-4deg);
  /* 인주가 종이에 배어 번진 가장자리 */
  filter: drop-shadow(0 0 0.8px rgba(170, 45, 30, 0.7)) drop-shadow(0 1px 1px rgba(120, 30, 20, 0.35));
  /* 인주가 고르지 않게 닿은 가장자리 - 거친 윤곽 마스크 */
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='72' viewBox='0 0 64 72'%3E%3Cfilter id='r' x='-10%25' y='-10%25' width='120%25' height='120%25'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.16' numOctaves='3' seed='7'/%3E%3CfeDisplacementMap in='SourceGraphic' scale='5'/%3E%3C/filter%3E%3Crect x='3' y='3' width='58' height='66' rx='2' fill='%23fff' filter='url(%23r)'/%3E%3C/svg%3E") center / 100% 100% no-repeat;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='72' viewBox='0 0 64 72'%3E%3Cfilter id='r' x='-10%25' y='-10%25' width='120%25' height='120%25'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.16' numOctaves='3' seed='7'/%3E%3CfeDisplacementMap in='SourceGraphic' scale='5'/%3E%3C/filter%3E%3Crect x='3' y='3' width='58' height='66' rx='2' fill='%23fff' filter='url(%23r)'/%3E%3C/svg%3E") center / 100% 100% no-repeat;
  /* 인주(印朱) - 고르지 않게 찍힌 붉은 면 + 안쪽 이중 테 */
  background:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='90'%3E%3Cfilter id='s'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' seed='11'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 0.96 0 0 0 0 0.9 0 0 0 4 -2.6'/%3E%3C/filter%3E%3Crect width='90' height='90' filter='url(%23s)'/%3E%3C/svg%3E") 0 0 / 90px 90px repeat, /* 인주가 덜 묻어 종이가 비치는 점들 */
    radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.12), transparent 40%),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='4'/%3E%3CfeColorMatrix values='0 0 0 0 0.45 0 0 0 0 0.08 0 0 0 0 0.05 0 0 0 0.35 0'/%3E%3C/filter%3E%3Crect width='80' height='80' filter='url(%23n)'/%3E%3C/svg%3E"),
    radial-gradient(circle at 70% 80%, rgba(60, 10, 6, 0.35), transparent 55%),
    linear-gradient(160deg, #c8452f, #a0301f 60%, #8d2719);
  /* 양각 테두리 - 바깥 굵은 테 + 안쪽 가는 테(음각 홈) */
  box-shadow:
    inset 0 0 0 3px rgba(251, 246, 234, 0.7),
    inset 0 0 0 5px rgba(150, 42, 30, 1),
    inset 0 0 0 6px rgba(251, 246, 234, 0.38);
  mix-blend-mode: normal;
  transition: transform 0.2s, box-shadow 0.2s;
  animation: stampIn 0.5s cubic-bezier(0.2, 1.4, 0.4, 1) 1.35s both;
}
/* 낙관 - 두루마리가 다 펼쳐진 뒤 쿵, 찍힌다 */
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
  font-size: 32px;
  font-weight: 900;
  line-height: 1;
  opacity: 0.55;
  transform: scaleX(1.08); /* 전서처럼 넓적하게 */
  letter-spacing: 0.1em;
  color: rgba(251, 246, 234, 0.95);
  -webkit-text-stroke: 1px rgba(251, 246, 234, 0.95);
  filter: drop-shadow(0 0 0.6px rgba(90, 20, 12, 0.8));
  transition: opacity 0.2s;
}
.seal-arrow {
  font-family: var(--font-util);
  font-size: 12px;
  line-height: 1;
  opacity: 0.85;
  margin: -2px 0;
}
.seal-face.num {
  font-family: var(--font-util);
  font-size: 17px;
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
/* 빨래 지침 - 닫기 아래, 세로쓰기로 종이 오른쪽 여백에 */
.guide-link {
  position: absolute;
  right: 34px;
  top: 112px;
  z-index: 2;
  writing-mode: vertical-lr;
  font-family: var(--font-display);
  font-size: 19px;
  font-weight: 700;
  letter-spacing: 0.28em;
  color: var(--jeok);
  text-decoration: none;
  border-left: 1.5px solid rgba(178, 58, 44, 0.5);
  padding-left: 8px;
}
.guide-link:hover,
.guide-link:focus-visible {
  color: #8e2a22;
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
  .guide-link { right: 18px; top: 96px; font-size: 15px; }
  .rules { inset: 12px 14px; }
}
@media (prefers-reduced-motion: reduce) {
  .silk, .paper, .rod, .seal { animation: none !important; }
}
</style>
