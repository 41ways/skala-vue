<script setup>
// 국내 화폭 (팔도청우록)
// 스크롤 진행도에 따라 민화 6폭이 바뀌고, 날씨가 맞는 도시가 그 폭에 들어간다
import { ref, computed, onMounted, onBeforeUnmount, defineAsyncComponent } from 'vue'
import ArtStage from '@/components/minhwa/ArtStage.vue'
import InkRipple from '@/components/minhwa/InkRipple.vue'
import ScrollHint from '@/components/minhwa/ScrollHint.vue'
import { useWeather, cachedGet, codeToStatus } from '@/composables/useWeather.js'
import { laundryScore } from '@/data/weatherData.js'
// 두루마리는 누를 때 처음 불러온다 (초기 번들에서 제외)
const ScrollSheet = defineAsyncComponent(() => import('@/components/minhwa/ScrollSheet.vue'))

import obongdoImg from '@/assets/minhwa-art/obongdo.jpg'
import mudongImg from '@/assets/minhwa-art/mudong.jpg'
import ssireumImg from '@/assets/minhwa-art/ssireum.jpg'
import seodangImg from '@/assets/minhwa-art/seodang.jpg'
import inwangImg from '@/assets/minhwa-art/inwang.jpg'
import tigerImg from '@/assets/minhwa-art/tiger.jpg'
// 대청 분합문 - 오리 이원익 종택 (문화재청, 공공누리 1유형) 사진을 문틀/문짝으로 가공
import dcBase from '@/assets/minhwa-art/daecheong/base.webp'
import dcDoorL from '@/assets/minhwa-art/daecheong/door_l.webp'
import dcDoorR from '@/assets/minhwa-art/daecheong/door_r.webp'

// 누끼 PNG 일괄 로드 - cut('tiger_body') 식으로 꺼내 쓴다
const cutFiles = import.meta.glob('@/assets/minhwa-art/cut/*.png', {
  eager: true,
  import: 'default',
})
const cut = (name) => cutFiles[Object.keys(cutFiles).find((k) => k.includes(name))]

// 누끼 자리를 메운 배경판
const bgFiles = import.meta.glob('@/assets/minhwa-art/bg/*.jpg', {
  eager: true,
  import: 'default',
})
const bgOf = (name) => bgFiles[Object.keys(bgFiles).find((k) => k.includes(name))]

const { cities, loading, error, fetchLive } = useWeather()

// 화폭 차례 - 그림과 날씨의 궁합
const chapters = [
  {
    id: 'cheongwoo',
    img: inwangImg,
    img2: obongdoImg,
    tall: true,
    title: '인왕제색도',
    hanja: '仁王霽色圖',
    era: '정선 · 1751 · 국보',
    weather: ['비', '뇌우'],
    wHanja: '雨',
    effect: 'sunrise',
    waterIntro: true,
    waterImg: inwangImg,
    focal: '50% 46%',
    rain: true,
    cuts: [
      { src: cut('obongdo_moon'), ix: 0.277, iy: 0.1293, dvh: 10.3, depth: 10, riseX: 24 },
      { src: cut('obongdo_sun'), ix: 0.7172, iy: 0.1212, dvh: 12.7, depth: 14, riseX: 76, warm: true },
    ],
    line: '비에 젖은 인왕산 — 지금 비가 듣는 고을들입니다. 화폭을 내리면 그림이 물이 됩니다.',
    empty: '오늘은 비에 든 고을이 없습니다.',
    phase2: {
      title: '일월오봉도',
      hanja: '日月五峯圖',
      era: '조선 후기 · 궁중 장식화',
      weather: ['맑음'],
      wHanja: '晴',
      tone: 'light',
      line: '그 물 위로 해와 달이 떠올라 다섯 봉우리가 열립니다 — 볕이 좋은 고을들입니다.',
      empty: '오늘은 맑게 갠 고을이 없습니다.',
    },
  },
  {
    id: 'mudong',
    img: mudongImg,
    bg: bgOf('mudong'),
    title: '무동',
    hanja: '舞童',
    era: '김홍도 · 풍속화첩 · 보물',
    weather: ['바람'],
    wHanja: '風',
    effect: 'collage',
    focal: '38% 62%',
    cuts: [
      // 무동이 먼저 - 그 뒤 악단이 시계방향으로 한 명씩
      {
        src: cut('mudong_dancer'),
        t: 0.04,
        left: '18%',
        top: '30%',
        w: '30%',
        depth: 28,
        ox: -14,
        oy: 18,
        ds: 0.12,
        idle: 'sway',
        z: 3,
        parts: [
          { src: cut('mudong_sleeve_r'), left: '45.4%', top: '1.1%', w: '45.4%', anim: 'p-flutter', origin: '8% 82%' },
          { src: cut('mudong_sleeve_l'), left: '0%', top: '27.2%', w: '34.8%', anim: 'p-flutter-s', origin: '88% 18%' },
          { src: cut('mudong_leg'), left: '42.4%', top: '52.2%', w: '27.2%', anim: 'p-kick', origin: '55% 6%' },
        ],
      },
      { src: cut('mudong_buk'), t: 0.1, left: '5%', top: '3%', w: '21%', depth: 8, ox: -8, oy: -10, ds: 0.02, idle: 'bob', z: 1 },
      { src: cut('mudong_janggu'), t: 0.16, left: '27%', top: '7%', w: '20%', depth: 8, oy: -12, ds: 0.02, idle: 'bob', z: 1 },
      { src: cut('mudong_piri'), t: 0.22, left: '47%', top: '8%', w: '15%', depth: 9, oy: -10, ds: 0.02, idle: 'bob', z: 1 },
      { src: cut('mudong_taepyeongso'), t: 0.28, left: '62%', top: '5%', w: '18%', depth: 9, ox: 8, oy: -10, ds: 0.02, idle: 'bob', z: 1 },
      { src: cut('mudong_daegeum'), t: 0.34, left: '64%', top: '38%', w: '20%', depth: 12, ox: 12, ds: 0.03, idle: 'bob', z: 2 },
      { src: cut('mudong_haegeum'), t: 0.4, left: '54%', top: '54%', w: '27%', depth: 14, ox: 12, oy: 10, ds: 0.04, idle: 'bob', z: 2 },
    ],
    line: '소매가 바람을 탑니다 — 바람 부는 고을들입니다.',
    empty: '오늘은 바람 든 고을이 없습니다.',
  },
  {
    id: 'ssireum',
    img: ssireumImg,
    bg: bgOf('ssireum'),
    title: '씨름',
    hanja: '角觝',
    era: '김홍도 · 풍속화첩 · 보물',
    weather: ['구름'],
    wHanja: '雲',
    effect: 'collage',
    focal: '50% 48%',
    cuts: [
      // 구경꾼 네 무리 - 판 가장자리에서 들썩인다
      { src: cut('ssireum_crowd_tl'), left: '2%', top: '1%', w: '36%', depth: 7, ox: -12, oy: -10, ds: 0.015, idle: 'bob', z: 1 },
      { src: cut('ssireum_crowd_tr'), left: '62%', top: '2%', w: '34%', depth: 8, ox: 12, oy: -10, ds: 0.015, idle: 'bob', z: 1 },
      { src: cut('ssireum_crowd_bl'), left: '2%', top: '62%', w: '33%', depth: 10, ox: -12, oy: 10, ds: 0.02, idle: 'bob', z: 2 },
      { src: cut('ssireum_crowd_br'), left: '66%', top: '60%', w: '30%', depth: 10, ox: 12, oy: 10, ds: 0.02, idle: 'bob', z: 2 },
      // 씨름꾼 - 판 한가운데서 힘겨루기
      { src: cut('ssireum_wrestlers'), left: '35.4%', top: '21.6%', w: '29.4%', depth: 24, oy: 12, ds: 0.11, idle: 'tussle', z: 3 },
    ],
    line: '구름처럼 모여든 판 — 구름 낀 고을들입니다.',
    empty: '오늘은 구름 든 고을이 없습니다.',
  },
  {
    id: 'seodang',
    img: seodangImg,
    bg: bgOf('seodang'),
    title: '서당',
    hanja: '書堂',
    era: '김홍도 · 풍속화첩 · 보물',
    weather: ['흐림'],
    wHanja: '陰',
    effect: 'collage',
    focal: '44% 50%',
    cuts: [
      // 훈장님 - 서안 뒤에서 지긋이
      { src: cut('seodang_hunjang'), left: '29%', top: '4%', w: '44%', depth: 8, oy: -12, ds: 0.02, idle: 'bob', z: 2 },
      // 학동들 - 양쪽 줄
      { src: cut('seodang_students_l'), left: '4%', top: '16%', w: '25%', depth: 12, ox: -12, ds: 0.03, idle: 'bob', z: 1 },
      { src: cut('seodang_students_r'), left: '66%', top: '32%', w: '25%', depth: 12, ox: 12, ds: 0.03, idle: 'bob', z: 1 },
      { src: cut('seodang_back'), left: '40%', top: '66%', w: '21%', depth: 16, oy: 12, ds: 0.05, idle: 'bob', z: 2 },
      // 우는 아이 - 한가운데 앞으로
      { src: cut('seodang_crier'), left: '33%', top: '40%', w: '18%', depth: 26, oy: 16, ds: 0.12, idle: 'sway', z: 3 },
    ],
    line: '하늘이 낮은 날은 글 읽기 좋은 날 — 흐린 고을들입니다.',
    empty: '오늘은 흐린 고을이 없습니다.',
  },
  {
    id: 'tiger',
    img: tigerImg,
    bg: bgOf('tiger'),
    zoom: 0.12,
    title: '작호도',
    hanja: '鵲虎圖',
    era: '조선 민화 · 세화(歲畫)',
    weather: ['눈'],
    wHanja: '雪',
    effect: 'collage',
    focal: '40% 48%',
    snow: true,
    cuts: [
      // 까치 - 솔가지에 앉아 까딱인다
      {
        src: cut('tiger_magpie'),
        left: '64%',
        top: '8%',
        w: '24%',
        depth: 10,
        ox: 14,
        oy: -14,
        ds: 0.03,
        idle: 'bob',
        z: 1,
        parts: [
          {
            src: cut('magpie_head'),
            left: '0%',
            top: '6.9%',
            w: '40%',
            anim: 'p-head',
            origin: '85% 80%',
            // 머리는 가만히 두고 - 날개를 한 번 크게 쳐서 눈을 턴다
            snow: { vb: '0 0 110 90', d: 'M28 28 C34 16 44 6 60 2 C76 0 90 10 100 26 C92 22 84 16 72 12 C60 8 48 10 38 18 C34 22 30 26 28 28 Z', hi: 'M48 8 C56 4 66 4 74 7 C66 9 56 10 48 8 Z', still: true },
          },
          { src: cut('magpie_wing'), left: '18.2%', top: '27.6%', w: '47.3%', anim: 'p-flap', origin: '18% 28%', shed: true },
          { src: cut('magpie_tail'), left: '47.3%', top: '46.6%', w: '52.7%', anim: 'p-tail', origin: '10% 15%' },
        ],
      },
      // 호랑이 - 개별로 숨쉬며 앞으로 나온다
      // 호랑이 - 몸은 숨쉬고, 머리/꼬리/앞발은 저마다 따로 움직인다
      {
        src: cut('tiger_body'),
        left: '16%',
        top: '12%',
        w: '45%',
        depth: 22,
        ox: -10,
        oy: 10,
        ds: 0.08,
        idle: 'prowl',
        z: 3,
        parts: [
          { src: cut('tiger_head'), left: '4.1%', top: '1.1%', w: '43.2%', anim: 'p-head', origin: '55% 92%', snow: true },
          { src: cut('tiger_tail'), left: '0%', top: '59.5%', w: '25.3%', anim: 'p-tail', origin: '88% 18%' },
          { src: cut('tiger_paw'), left: '17.8%', top: '80.6%', w: '18.5%', anim: 'p-paw', origin: '50% 20%' },
        ],
      },
    ],
    line: '궂은 하늘을 막아서는 세화 — 눈 오는 고을을 지킵니다.',
    empty: '오늘 눈 내리는 고을은 없습니다. 호랑이가 잘 막고 있습니다.',
  },
]

// 병합 챕터: 진행도 후반이면 2막(오봉도) 정보를 쓴다
const fld = (ch, i, k) =>
  ch.phase2 && (progress.value[i] ?? 0) > 0.65 ? (ch.phase2[k] ?? ch[k]) : ch[k]
// 처음엔 status만 비교했는데 세종기지(남극)는 늘 눈이라 snowAlways 예외를 둠
const citiesFor = (ch, i) =>
  cities.value.filter((c) => {
    const w = fld(ch, i, 'weather')
    return c.snowAlways ? w.includes('눈') : w.includes(c.status)
  })

// 스크롤 진행도 + 마우스 시차 
const heroEl = ref(null)
const chapterEls = ref([])
const progress = ref([])
const heroP = ref(0)
const activeIdx = ref(-1)
const mx = ref(0)
const my = ref(0)
let tx = 0
let ty = 0
let rafId = 0
let lastY = -1

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const easeOut = (t) => 1 - Math.pow(1 - t, 3)

function measure() {
  const vh = window.innerHeight
  if (heroEl.value) {
    const r = heroEl.value.getBoundingClientRect()
    heroP.value = clamp01(-r.top / (r.height - vh || 1))
  }
  let act = -1
  progress.value = chapterEls.value.map((el, i) => {
    if (!el) return 0
    const r = el.getBoundingClientRect()
    const p = clamp01(-r.top / (r.height - vh || 1))
    if (r.top < vh * 0.5 && r.bottom > vh * 0.5) act = i
    return p
  })
  activeIdx.value = act
}
function onMove(e) {
  tx = (e.clientX / window.innerWidth) * 2 - 1
  ty = (e.clientY / window.innerHeight) * 2 - 1
}

// 자석 스냅 - 스크롤이 멈췄을 때 어중간한 지점이면 정착점으로 스르륵
function magnetSnap() {
  const i = activeIdx.value
  if (i < 0) return
  const el = chapterEls.value[i]
  if (!el) return
  const vh = window.innerHeight
  const p = progress.value[i] ?? 0
  const isTall = !!chapters[i]?.phase2
  let target = null
  // 다음 폭 자동 이동은 하지 않는다 - 사용자가 넘길 때만 넘어간다
  if (p > 0.008 && p < 0.1) {
    target = el.getBoundingClientRect().top + window.scrollY + (el.offsetHeight - vh) * (isTall ? 0.16 : 0.42)
  }
  if (target !== null) {
    if (window.__lenis) window.__lenis.scrollTo(target, { duration: 1.7 })
    else window.scrollTo({ top: target, behavior: 'smooth' })
  }
}
let still = 0
let magnetArmed = true
function loop() {
  const y = window.scrollY
  if (y !== lastY) {
    lastY = y
    measure()
    still = 0
    magnetArmed = true
  } else if (magnetArmed && ++still > 20) {
    magnetArmed = false
    magnetSnap()
  }
  mx.value += (tx - mx.value) * 0.06
  my.value += (ty - my.value) * 0.06
  rafId = requestAnimationFrame(loop)
}

onMounted(() => {
  fetchLive()
  measure()
  rafId = requestAnimationFrame(loop)
  window.addEventListener('scroll', measure, { passive: true })
  window.addEventListener('resize', measure, { passive: true })
  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('keydown', onKeyNav)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyNav)
  cancelAnimationFrame(rafId)
  window.removeEventListener('scroll', measure)
  window.removeEventListener('resize', measure)
  window.removeEventListener('pointermove', onMove)
})

// 정보 오버레이 : 그림이 자리잡은 뒤 순차 등장
// 두루마리 날씨첩 - 화기의 고을을 누르면 펼쳐진다
const sheetCity = ref(null)
// 대청 - 스크롤하면 분합문이 양쪽으로 열리고, 문밖에 인왕제색도가 선다
// 처음엔 흐린 대청 - 제목이 물러나는 동안 진해지고 → 문이 열리면 빈 마당에 비 → 틀이 걷히며 인왕제색도 화폭으로 넘어간다
const dcFocus = computed(() => easeOut(clamp01((heroP.value - 0.04) / 0.3)))
const dcOpen = computed(() => easeOut(clamp01((heroP.value - 0.28) / 0.4)))
const dcWash = computed(() => easeOut(clamp01((heroP.value - 0.7) / 0.3)))
const dcRain = computed(() => clamp01((dcOpen.value - 0.1) / 0.4) * (1 - dcWash.value * 0.45))
const dcPhotoStyle = computed(() => ({
  '--o': dcOpen.value.toFixed(3),
  opacity: ((0.22 + dcFocus.value * 0.78) * (1 - dcWash.value)).toFixed(3),
  filter: `contrast(${(0.7 + dcFocus.value * 0.3).toFixed(3)}) brightness(${(1.4 - dcFocus.value * 0.4).toFixed(3)}) saturate(${(0.55 + dcFocus.value * 0.45).toFixed(2)})`,
}))
// 히어로 끝자락 - 마당이 한지 바탕으로 녹아들어 다음 화폭과 경계 없이 이어진다
const dcOut = computed(() => easeOut(clamp01((heroP.value - 0.84) / 0.16)))
const dcViewStyle = computed(() => ({
  transform: `scale(${(1.14 - dcOpen.value * 0.1).toFixed(3)})`,
  opacity: ((0.25 + dcFocus.value * 0.75) * (1 - dcOut.value)).toFixed(3),
}))
const dcCapStyle = computed(() => ({ opacity: (1 - dcWash.value).toFixed(3) }))
const heroDrops = Array.from({ length: 48 }, (_, i) => ({
  left: ((i * 37) % 100) + '%',
  animationDuration: 0.85 + ((i * 13) % 10) / 11 + 's',
  animationDelay: -((i * 7) % 20) / 10 + 's',
  opacity: 0.3 + ((i * 11) % 10) / 20,
}))
const activeToneLight = computed(() => {
  const i = activeIdx.value
  if (i < 0) return false
  return fld(chapters[i], i, 'tone') === 'light'
})
function sideStyle(i) {
  const o = infoStyle(i, 1).opacity
  // 겹쳐 쌓인 고정 패널끼리 클릭이 새지 않게 - 안 보이면 숨긴다
  return { opacity: o, visibility: o < 0.05 ? 'hidden' : 'visible' }
}
function infoStyle(i, order = 0) {
  const p = progress.value[i] ?? 0
  if (chapters[i]?.phase2) {
    // 병합 챕터 - 1막 문구는 그림이 흐트러지기 전에 먼저 물러나고,
    // 2막(일월오봉도) 문구는 화폭이 다 차오른 뒤에야 든다
    const in1 = easeOut(clamp01((p - 0.08 - order * 0.04) / 0.12))
    const out1 = clamp01((p - 0.36 - order * 0.02) / 0.06)
    const in2 = easeOut(clamp01((p - 0.87 - order * 0.02) / 0.05))
    const t = Math.max(in1 * (1 - out1), in2)
    return {
      opacity: t.toFixed(3),
      transform: `translateY(${((1 - Math.max(in1, in2)) * 26).toFixed(1)}px)`,
    }
  }
  const t = easeOut(clamp01((p - 0.3 - order * 0.05) / 0.16))
  const leave = clamp01((p - 0.88) / 0.1)
  return {
    opacity: (t * (1 - leave)).toFixed(3),
    transform: `translateY(${((1 - t) * 26).toFixed(1)}px)`,
  }
}
const heroStyle = computed(() => ({
  pointerEvents: heroP.value > 0.3 ? 'none' : 'auto',
  transform: `scale(${(1 - heroP.value * 0.12).toFixed(4)}) translateY(${(heroP.value * -6).toFixed(2)}%)`,
  opacity: (1 - clamp01((heroP.value - 0.08) / 0.24)).toFixed(3), // 대청이 진해지는 동안 제목이 먼저 물러난다
}))

// 레일: 병합 챕터는 두 항목(인왕/오봉)으로 나눠 표시
const railItems = computed(() => {
  const items = []
  chapters.forEach((ch, i) => {
    items.push({ label: ch.title, i, f: ch.phase2 ? 0.22 : 0.42 })
    if (ch.phase2) items.push({ label: ch.phase2.title, i, f: 0.78 })
  })
  return items
})
const railActive = computed(() => {
  const i = activeIdx.value
  if (i < 0) return -1
  let k = 0
  for (let c = 0; c < chapters.length; c++) {
    if (c === i) {
      if (chapters[c].phase2 && (progress.value[c] ?? 0) > 0.65) return k + 1
      return k
    }
    k += chapters[c].phase2 ? 2 : 1
  }
  return -1
})
// 지금 계신 곳: 위치 권한을 받아 그 자리의 하늘을 한 줄로
const hereSky = ref('')
const hereBusy = ref(false)
function askHere() {
  if (!navigator.geolocation) return (hereSky.value = '이 브라우저는 위치를 알 수 없습니다')
  hereBusy.value = true
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      try {
        const d = await cachedGet({
          latitude: pos.coords.latitude.toFixed(2),
          longitude: pos.coords.longitude.toFixed(2),
          current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
          wind_speed_unit: 'ms',
          timezone: 'auto',
        })
        const cur = d.current
        const c = { temp: Math.round(cur.temperature_2m), humidity: cur.relative_humidity_2m, wind: cur.wind_speed_10m, status: codeToStatus(cur.weather_code) }
        hereSky.value = `지금 계신 곳 — ${c.status} ${c.temp}° · 습도 ${c.humidity}% · 빨래 ${laundryScore(c)}점`
      } catch {
        hereSky.value = '지금 계신 곳의 하늘을 받지 못했습니다'
      } finally {
        hereBusy.value = false
      }
    },
    () => {
      hereBusy.value = false
      hereSky.value = '위치 권한이 없어 팔도만 보여 드립니다'
    },
    { timeout: 8000 },
  )
}
// 히어로 한 줄 요약: 오늘 팔도 하늘 - 비 3 · 맑음 4 …
const skySummary = computed(() => {
  const count = {}
  for (const c of cities.value) count[c.status] = (count[c.status] ?? 0) + 1
  const parts = Object.entries(count)
    .sort((a, b) => b[1] - a[1])
    .map(([k, n]) => `${k} ${n}`)
  const live = cities.value.some((c) => c.live)
  return `오늘 팔도 — ${parts.join(' · ')} · ${live ? '실측 Open-Meteo' : '표본'}`
})
// 키보드: ↓/→ 다음 폭, ↑/← 앞 폭 (두루마리가 열려 있으면 무시)
function onKeyNav(e) {
  if (sheetCity.value || e.altKey || e.metaKey || e.ctrlKey) return
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName)) return
  const next = ['ArrowDown', 'ArrowRight', 'PageDown'].includes(e.key)
  const prev = ['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)
  if (!next && !prev) return
  const i = activeIdx.value + (next ? 1 : -1)
  if (i < 0 || i >= chapters.length) return
  e.preventDefault()
  jumpTo({ i, f: 0.42 })
}
function jumpTo(r) {
  const el = chapterEls.value[r.i]
  if (!el) return
  const vh = window.innerHeight
  const target = el.getBoundingClientRect().top + window.scrollY + (el.offsetHeight - vh) * r.f
  if (window.__lenis) window.__lenis.scrollTo(target, { duration: 1.6 })
  else window.scrollTo({ top: target, behavior: 'smooth' })
}
</script>

<template>
  <main class="gukfok">
    <InkRipple />

    <!-- 표제 - 만국청우록의 획 드로잉 스타일, 국내판 -->
    <section ref="heroEl" class="hero-wrap">
      <div class="hero-stage">
        <!-- 대청 - 문밖엔 오늘의 하늘(인왕제색도), 앞엔 분합문. 스크롤하면 문이 열린다 -->
        <div class="dc-view" :style="dcViewStyle">
          <span class="dc-blank"></span>
          <span class="dc-rain" :style="{ opacity: dcRain.toFixed(3) }">
            <span v-for="(d, j) in heroDrops" :key="j" class="dc-drop" :style="d"></span>
          </span>
          <span class="dc-haze" :style="{ opacity: (1 - dcWash * 0.7).toFixed(3) }"></span>
        </div>
        <div class="dc-photo" :style="dcPhotoStyle">
          <img class="dc-base" :src="dcBase" alt="" fetchpriority="high" decoding="async" draggable="false" />
          <img class="dc-door l" :src="dcDoorL" alt="" fetchpriority="high" decoding="async" draggable="false" />
          <img class="dc-door r" :src="dcDoorR" alt="" fetchpriority="high" decoding="async" draggable="false" />
        </div>
        <p class="dc-cap util" :style="dcCapStyle">오리 이원익 종택 분합문 · 문화재청 (공공누리 제1유형)</p>
        <div class="hero-inner" :style="heroStyle">
          <svg class="title-svg" viewBox="0 0 900 260">
            <text x="450" y="118" class="stroke-title t-main">팔도청우록</text>
            <text x="450" y="196" class="stroke-title t-sub">八 道 晴 雨 錄</text>
          </svg>
          <p class="hero-copy">
            옛 그림은 늘 오늘의 하늘이었습니다.<br />
            화폭을 내리면, 여섯 폭 민화가 지금 팔도의 날씨를 대신 전합니다.
          </p>
          <p class="hero-note util">
            {{ loading ? '팔도의 하늘을 살피는 중…' : skySummary }}
          </p>
          <p class="hero-here util" aria-live="polite">
            <button v-if="!hereSky" type="button" :disabled="hereBusy" @click="askHere">{{ hereBusy ? '하늘을 살피는 중…' : '지금 계신 곳의 하늘 보기' }}</button>
            <span v-else>{{ hereSky }}</span>
          </p>
          <div class="hero-hint"><ScrollHint /></div>
        </div>
      </div>
    </section>

    <!-- 화폭 챕터 -->
    <section
      v-for="(ch, i) in chapters"
      :key="ch.id"
      :ref="(el) => (chapterEls[i] = el)"
      class="chapter"
      :id="ch.id"
      :style="ch.tall ? { height: '640vh' } : null"
    >
      <div class="stage">
        <ArtStage
          role="img"
          :aria-label="`${fld(ch, i, 'title')} (${fld(ch, i, 'era')})`"
          :img="ch.img"
          :img2="ch.img2 ?? ''"
          :bg="ch.bg ?? ''"
          :effect="ch.effect"
          :focal="ch.focal"
          :cuts="ch.cuts ?? []"
          :p="progress[i] ?? 0"
          :mx="mx"
          :my="my"
          :rain="!!ch.rain"
          :snow="!!ch.snow"
          :water-intro="!!ch.waterIntro"
          :intro-water-img="ch.waterImg ?? ''"
          :zoom="ch.zoom ?? 0"
        />

        <!-- 초대형 화제(畫題) - 그림과 겹친다 -->
        <h2 class="mega" :class="{ light: fld(ch, i, 'tone') === 'light' }" :style="infoStyle(i, 0)">
          {{ fld(ch, i, 'title') }}
          <small>{{ fld(ch, i, 'hanja') }} · 제{{ i + 1 }}폭 · {{ fld(ch, i, 'era') }}</small>
        </h2>

        <!-- 드롭캡 내러티브 + 날씨 도시 -->
        <div class="foot" :class="{ light: fld(ch, i, 'tone') === 'light' }" :style="infoStyle(i, 1)">
          <p class="narrative">
            <span class="dcap">{{ fld(ch, i, 'line').slice(0, 1) }}</span>{{ fld(ch, i, 'line').slice(1) }}
          </p>
        </div>

        <!-- 우측 - 그림 곁에 띄운 도시 정보 -->
        <aside class="side-cities" :class="{ light: fld(ch, i, 'tone') === 'light' }" :style="sideStyle(i)">
          <p class="side-cap"><i class="cap-seal">{{ fld(ch, i, 'wHanja') }}</i>이 화폭의 고을</p>
          <template v-if="citiesFor(ch, i).length">
            <button v-for="c in citiesFor(ch, i)" :key="c.id" class="vc" :aria-label="`${c.name} 날씨첩 열기 — ${c.temp}° ${c.status}`" @click="sheetCity = c">
              <b>{{ c.name }}</b><span><i class="n">{{ c.temp }}°</i> {{ c.status }}</span>
            </button>
          </template>
          <p v-else class="vc vc-empty">{{ fld(ch, i, 'empty') }}</p>
        </aside>

        <!-- 다음 폭으로 - 하단의 작은 손짓 -->
        <button
          v-if="i < chapters.length - 1"
          class="next-fab util"
          :class="{ light: fld(ch, i, 'tone') === 'light' }"
          :style="{ opacity: infoStyle(i, 1).opacity }"
          aria-label="다음 폭으로 이동"
          @click="jumpTo({ i: i + 1, f: 0.42 })"
        >
          다음 폭 <span>↓</span>
        </button>
      </div>
    </section>

    <ScrollSheet :city="sheetCity" @close="sheetCity = null" />

    <!-- 발문 -->
    <section class="outro">
      <div class="saekdong"></div>
      <p class="outro-copy">여섯 폭을 모두 거두었습니다.</p>
      <div class="outro-cities util">
        <router-link v-for="c in cities" :key="c.id" class="chip" :to="`/weather/${c.id}`">
          <b>{{ c.name }}</b> {{ c.temp }}° · {{ c.status }}
        </router-link>
      </div>
      <nav class="outro-links util">
        <router-link to="/world">세계화폭 →</router-link>
        <router-link to="/guide">빨래 지침</router-link>
      </nav>
      <p v-if="error" class="err util">실시간 조회 실패 — 표본 자료로 표시 중입니다.</p>
    </section>

    <!-- 좌측 여백 - 세로 표제 -->
    <p v-show="activeIdx >= 0" class="side-title" :class="{ light: activeToneLight }">
      팔도청우록<span class="st-hanja">八道晴雨錄</span><i class="st-seal">晴雨</i>
    </p>

    <!-- 좌측 차례 레일 (챕터 진입 후) -->
    <nav v-show="activeIdx >= 0" class="rail util" :class="{ light: activeToneLight }" aria-label="화폭 차례">
      <button
        v-for="(r, k) in railItems"
        :key="k"
        class="rail-item"
        :class="{ on: railActive === k }"
        :style="{ animationDelay: (0.5 + k * 0.09).toFixed(2) + 's' }"
        @click="jumpTo(r)"
      >
        <span class="rail-name">{{ r.label }}</span>
        <span class="rail-num">{{ ['一', '二', '三', '四', '五', '六', '七', '八'][k] }}</span>
      </button>
    </nav>
  </main>
</template>

<style scoped>
.gukfok {
  position: relative;
  background: var(--paper);
}
.util {
  font-family: var(--font-util);
}

/* 표제 (만국청우록 스타일 이식) */
.hero-wrap {
  height: 270vh; /* 제목 → 문 열림 → 빈 마당의 비 → 틀이 걷힘 */
}
.hero-stage {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  display: grid;
  place-items: center;
}
/* 한지에 배접된 오봉도 - 표제 뒤 은은하게 */
.hero-bg {
  position: absolute;
  inset: 0;
}
.hero-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 30%;
  mix-blend-mode: multiply;
  opacity: 0.1;
  filter: blur(1.5px) saturate(0.9);
}
.hero-inner {
  text-align: center;
  padding: 0 24px;
  will-change: transform, opacity;
}
.title-svg {
  width: min(720px, 92vw);
  display: block;
  margin: 0 auto;
}
.stroke-title {
  font-family: var(--font-display);
  text-anchor: middle;
  fill: var(--ink);
  stroke: var(--ink);
  fill-opacity: 0;
  stroke-dasharray: 2600;
  stroke-dashoffset: 2600;
  animation:
    draw 2.6s ease-out forwards,
    fillIn 1.2s ease-out 1.9s forwards;
}
.t-main {
  font-size: 104px;
  letter-spacing: 0.14em;
  stroke-width: 1.6;
}
.t-sub {
  font-size: 40px;
  letter-spacing: 0.5em;
  stroke-width: 1;
  fill: var(--jeok);
  stroke: var(--jeok);
  animation-delay: 0.7s, 2.4s;
}
@keyframes draw {
  to { stroke-dashoffset: 0; }
}
@keyframes fillIn {
  to { fill-opacity: 1; }
}
.hero-copy {
  font-size: clamp(15px, 2vw, 18px);
  line-height: 2;
  margin: 18px 0 6px;
  opacity: 0;
  animation: rise 1s ease-out 2.6s forwards;
}
.hero-here {
  margin: -18px 0 26px;
  font-size: 12px;
  letter-spacing: 0.08em;
  color: var(--ink-soft);
  opacity: 0;
  animation: rise 1s ease-out 3.3s forwards;
}
.hero-here button {
  background: none;
  border: 0;
  border-bottom: 1px solid rgba(178, 58, 44, 0.5);
  padding: 0 2px 1px;
  font: inherit;
  letter-spacing: inherit;
  color: var(--jeok);
  cursor: pointer;
}
.hero-here button:disabled {
  color: var(--ink-soft);
  cursor: default;
}
.hero-note {
  font-size: 12.5px;
  color: var(--ink-soft);
  margin: 0 0 26px;
  opacity: 0;
  animation: rise 1s ease-out 3s forwards;
}
.hero-hint {
  color: var(--ink);
  opacity: 0;
  animation: rise 1s ease-out 3.3s forwards;
}
@keyframes rise {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 챕터 */
.chapter {
  height: 300vh;
  position: relative;
}
.stage {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  background: var(--paper);
}
/* 화폭 위 은은한 비네트 - 그림이 무대 중앙으로 모인다 */
.stage::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(ellipse 120% 100% at 50% 45%, transparent 62%, rgba(34, 28, 22, 0.12));
}

/* 초대형 화제 - 그림과 겹치는 헤드라인 (세계화폭과 같은 문법) */
.mega {
  position: absolute;
  left: max(5%, 104px);
  right: 5%;
  top: 30%;
  z-index: 2;
  margin: 0;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(64px, 13vw, 180px);
  line-height: 0.98;
  letter-spacing: 0.08em;
  color: var(--ink);
  text-shadow:
    0 0 6px rgba(241, 231, 208, 1),
    0 0 18px rgba(241, 231, 208, 1),
    0 0 40px rgba(241, 231, 208, 0.95),
    0 0 80px rgba(241, 231, 208, 0.8);
  will-change: transform, opacity;
  pointer-events: none;
}
.mega small {
  display: block;
  font-size: clamp(12px, 1.5vw, 18px);
  letter-spacing: 0.42em;
  margin-top: 14px;
  color: var(--ink);
  text-shadow:
    0 0 4px rgba(241, 231, 208, 1),
    0 0 10px rgba(241, 231, 208, 1),
    0 0 22px rgba(241, 231, 208, 0.95);
}
.mega.light {
  color: var(--baek);
  text-shadow:
    0 1px 4px rgba(0, 0, 0, 0.85),
    0 4px 20px rgba(0, 0, 0, 0.7),
    0 4px 44px rgba(0, 0, 0, 0.6);
}
.mega.light small {
  color: rgba(251, 246, 234, 0.95);
  text-shadow:
    0 1px 3px rgba(0, 0, 0, 0.9),
    0 2px 12px rgba(0, 0, 0, 0.75);
}

.foot {
  position: absolute;
  left: max(5%, 118px);
  right: 5%;
  bottom: 6%;
  z-index: 5;
  max-width: 760px;
  will-change: transform, opacity;
}
.narrative {
  display: inline-block;
  margin: 0;
  padding: 4px 10px;
  font-size: clamp(16px, 2.2vw, 24px);
  line-height: 1.7;
  color: var(--ink);
  /* 한지 바탕은 글자 주변만 옅게 - 그림을 가리지 않게 */
  background: rgba(241, 231, 208, 0.42);
  border-radius: 5px;
  box-shadow: 0 0 14px 8px rgba(241, 231, 208, 0.42);
  text-shadow: 0 0 10px rgba(241, 231, 208, 0.9), 0 0 3px rgba(241, 231, 208, 0.9);
}
.foot.light .narrative {
  /* 어두운 화폭(일월오봉도)은 먹빛 바탕을 더 진하게 - 흰 글자가 또렷해야 한다 */
  color: #fff;
  padding: 8px 14px;
  background: rgba(12, 10, 18, 0.58);
  box-shadow: 0 0 22px 14px rgba(12, 10, 18, 0.58);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9), 0 2px 14px rgba(0, 0, 0, 0.7);
}
.dcap {
  float: left;
  font-family: var(--font-display);
  font-size: 3em;
  line-height: 0.9;
  margin: 0.05em 0.14em 0 0;
  color: var(--jeok);
}
.foot.light .dcap {
  color: #e8a5b0;
}
.city-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
  clear: left;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  border: 1px solid var(--line);
  border-radius: 4px;
  background: rgba(251, 246, 234, 0.92);
  font-size: 13px;
  color: var(--ink);
  text-decoration: none;
  box-shadow: 0 10px 26px rgba(34, 28, 22, 0.16);
  transition: border-color 0.2s, transform 0.2s;
}
.chip:hover {
  border-color: var(--jeok);
  transform: translateY(-2px);
  color: var(--ink);
}
.chip-hanja {
  display: inline-grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border: 1.2px solid var(--jeok);
  color: var(--jeok);
  border-radius: 3px;
  font-family: var(--font-display);
  font-size: 13px;
}
.chip b {
  font-weight: 700;
}
.chip-empty {
  font-size: 13.5px;
  color: var(--ink-soft);
  margin: 0;
  text-shadow: 0 0 14px rgba(241, 231, 208, 0.95);
}
.foot.light .chip-empty {
  color: rgba(251, 246, 234, 0.85);
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.6);
}

/* 발문 */
.outro {
  text-align: center;
  padding: 0 24px 90px;
}
.outro .saekdong {
  margin-bottom: 56px;
}
.outro-copy {
  font-family: var(--font-display);
  font-size: clamp(20px, 3vw, 28px);
  letter-spacing: 0.12em;
  margin: 0 0 22px;
}
.outro-cities {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-bottom: 30px;
}
.outro-links {
  display: flex;
  gap: 22px;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
}
.err {
  color: var(--jeok);
  font-size: 13px;
  margin-top: 22px;
}

/* 좌측 차례 레일 (세계화폭과 동일 문법, 한지 팔레트) */
.rail {
  position: fixed;
  left: 18px;
  bottom: 34px;
  z-index: 30;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.rail-item {
  display: flex;
  align-items: baseline;
  gap: 12px;
  background: none;
  border: 0;
  padding: 4px 0;
  cursor: pointer;
  color: var(--ink);
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-shadow:
    0 0 4px rgba(241, 231, 208, 1),
    0 0 10px rgba(241, 231, 208, 1),
    0 0 20px rgba(241, 231, 208, 0.9);
  transition: color 0.9s ease, text-shadow 0.9s ease, transform 0.25s;
  animation: marginIn 0.55s ease-out backwards;
}
/* 여백 요소 등장 - 위에서 아래로 스며들 듯 */
@keyframes marginIn {
  from {
    opacity: 0;
    transform: translateY(-18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.rail-item:hover,
.rail-item.on {
  color: var(--ink);
  transform: translateX(3px);
}
.rail.light .rail-item {
  color: rgba(251, 246, 234, 0.9);
  text-shadow:
    0 1px 3px rgba(0, 0, 0, 0.9),
    0 0 10px rgba(0, 0, 0, 0.8),
    0 0 20px rgba(0, 0, 0, 0.6);
}
.rail.light .rail-item:hover,
.rail.light .rail-item.on {
  color: var(--baek);
}
.rail.light .rail-num {
  color: rgba(251, 246, 234, 0.45);
}
.rail-item.on .rail-num {
  color: var(--jeok);
}
.rail-num {
  font-family: var(--font-display);
  font-size: 13px;
  color: rgba(34, 28, 22, 0.4);
}

/* 대청(히어로 배경) */
.dc-view {
  position: absolute;
  inset: -4%;
  will-change: transform, filter;
}
.dc-view img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 40%;
  user-select: none;
  will-change: opacity, filter;
}
/* 문이 열리면 보이는 빈 마당 - 비 오는 날의 한지 빛 */
.dc-blank {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 50% 30%, rgba(255, 252, 244, 0.55), transparent 60%),
    linear-gradient(180deg, #e6e0d2 0%, #d8d1c1 55%, #cdc5b3 100%);
}
.dc-rain {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.dc-drop {
  position: absolute;
  top: -6%;
  width: 2px;
  height: 48px;
  background: linear-gradient(180deg, transparent, rgba(52, 68, 88, 0.92));
  transform: rotate(7deg);
  animation: dcFall linear infinite;
}
@keyframes dcFall {
  to { transform: translateY(112vh) rotate(7deg); }
}
.dc-haze {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 55%, transparent 45%, rgba(42, 33, 26, 0.55));
}
/* 사진(3:2)을 화면에 cover - 문짝 좌표는 사진 기준 % */
.dc-photo {
  position: absolute;
  left: 50%;
  top: 50%;
  width: max(100vw, 150vh);
  aspect-ratio: 3 / 2;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
.dc-base {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}
.dc-door {
  position: absolute;
  top: 9%;
  height: 83.28%;
  z-index: 1;
  backface-visibility: hidden;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.45);
  filter: brightness(calc(1 - var(--o) * 0.3));
  will-change: transform;
}
.dc-door.l {
  left: 8.28%;
  width: 41.73%;
  transform-origin: left center;
  transform: perspective(1600px) rotateY(calc(var(--o) * -96deg));
}
.dc-door.r {
  left: 50%;
  width: 41.42%;
  transform-origin: right center;
  transform: perspective(1600px) rotateY(calc(var(--o) * 96deg));
}
.dc-cap {
  position: absolute;
  right: 16px;
  bottom: 12px;
  margin: 0;
  z-index: 3;
  font-size: 10.5px;
  letter-spacing: 0.06em;
  color: rgba(251, 246, 234, 0.6);
}

/* 화기 부기 서체 - 표제와 동일 (뒤따르는 규칙에 덮이지 않게 마지막에 선언) */
.vc span { font-family: var(--font-display); }

/* 다음 폭 버튼 */
.next-fab {
  position: absolute;
  left: 50%;
  bottom: 2.6%;
  transform: translateX(-50%);
  z-index: 6;
  background: none;
  border: 0;
  cursor: pointer;
  font-size: 12.5px;
  letter-spacing: 0.22em;
  color: var(--ink);
  text-shadow:
    0 0 4px rgba(241, 231, 208, 1),
    0 0 10px rgba(241, 231, 208, 1),
    0 0 20px rgba(241, 231, 208, 0.9);
  transition: color 0.25s;
}
.next-fab span {
  display: inline-block;
  animation: nextNudge 2.2s ease-in-out infinite;
}
@keyframes nextNudge {
  0%, 100% { transform: translateY(0); }
  55% { transform: translateY(4px); }
}
.next-fab:hover {
  color: var(--jeok);
}
.next-fab.light {
  color: rgba(251, 246, 234, 0.85);
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);
}
.next-fab.light:hover {
  color: #e8a5b0;
}

/* 좌측 여백 세로 표제 - 두루마리 제첨(題簽)과 낙관 */
.side-title {
  position: fixed;
  left: 18px;
  top: 90px;
  z-index: 30;
  margin: 0;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-family: var(--font-display);
  font-size: clamp(26px, 2.6vw, 38px);
  font-weight: 700;
  letter-spacing: 0.3em;
  color: var(--ink);
  /* 판 없이 글자만 - 글자 가장자리에서 바깥으로 옅어지는 은은한 흰 테(겹 그림자 그라데이션) */
  text-shadow:
    0 0 1px rgba(247, 241, 226, 0.9),
    0 0 2px rgba(247, 241, 226, 0.75),
    0 0 5px rgba(247, 241, 226, 0.55),
    0 0 10px rgba(247, 241, 226, 0.35),
    0 0 18px rgba(247, 241, 226, 0.18);
  transition: color 0.9s ease, text-shadow 0.9s ease;
  animation: marginIn 0.8s ease-out backwards;
}
.st-hanja {
  margin-top: 16px;
  font-size: 0.38em;
  font-weight: 400;
  letter-spacing: 0.52em;
  color: var(--ink-soft);
}
/* 낙관 - 붉은 도장 */
.st-seal {
  display: inline-block;
  margin-top: 20px;
  padding: 7px 5px;
  background: var(--jeok);
  color: var(--baek);
  border-radius: 3px;
  font-style: normal;
  font-size: 0.42em;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-orientation: upright;
  text-shadow: none;
  box-shadow: 0 2px 8px rgba(34, 28, 22, 0.25), inset 0 0 0 1px rgba(251, 246, 234, 0.35);
}
.side-title.light {
  color: var(--baek);
  text-shadow:
    0 0 1px rgba(14, 12, 10, 0.9),
    0 0 2px rgba(14, 12, 10, 0.75),
    0 0 5px rgba(14, 12, 10, 0.55),
    0 0 10px rgba(14, 12, 10, 0.35),
    0 0 18px rgba(14, 12, 10, 0.18);
}
.side-title.light .st-hanja {
  color: rgba(251, 246, 234, 0.6);
}

/* 우측 여백 - 화기(畫記): 그림에 적어 넣은 세로 기문처럼 */
.side-cities {
  position: fixed;
  right: 26px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 30;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
  max-height: 72vh;
  padding: 18px 14px;
  border-radius: 8px;
  color: var(--ink);
  /* 테두리 없는 종이 물결 - 부드럽게 번지는 한지 바탕이 글자를 받친다 */
  background: rgba(241, 231, 208, 0.72);
  box-shadow: 0 0 26px 18px rgba(241, 231, 208, 0.72);
  will-change: opacity;
  pointer-events: none;
  transition: color 0.9s ease, background 0.9s ease, box-shadow 0.9s ease;
}
.side-cities.light {
  color: var(--baek);
  background: rgba(18, 16, 24, 0.46);
  box-shadow: 0 0 26px 18px rgba(18, 16, 24, 0.46);
}
.side-cap {
  margin: 0;
  font-family: var(--font-display);
  font-size: 16px;
  letter-spacing: 0.34em;
  color: inherit;
  opacity: 0.78;
  text-shadow: 0 0 3px rgba(241, 231, 208, 0.9), 0 0 10px rgba(241, 231, 208, 0.8);
  transition: text-shadow 0.9s ease;
}
.side-cities.light .side-cap {
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8), 0 0 10px rgba(0, 0, 0, 0.6);
}
/* 기문 첫머리의 작은 인장 */
.cap-seal {
  display: inline-block;
  font-style: normal;
  background: var(--jeok);
  color: var(--baek);
  font-size: 12px;
  padding: 4px 3px;
  border-radius: 2px;
  margin-bottom: 10px;
  letter-spacing: 0;
  text-orientation: upright;
  text-shadow: none;
  box-shadow: inset 0 0 0 1px rgba(251, 246, 234, 0.35);
}
/* 도시 한 줄 = 세로 글줄 하나 */
.vc {
  pointer-events: auto;
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  text-align: left;
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: inherit;
  text-decoration: none;
  text-shadow: 0 0 3px rgba(241, 231, 208, 0.9), 0 0 10px rgba(241, 231, 208, 0.8);
  transition: color 0.9s ease, text-shadow 0.9s ease;
}
.side-cities.light .vc {
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8), 0 0 10px rgba(0, 0, 0, 0.6);
}
.vc:hover,
.vc:focus-visible {
  color: var(--jeok);
  transition: color 0.2s ease;
  outline: none;
}
.vc b {
  font-weight: 700;
}
.vc span {
  display: inline-block;
  margin-top: 10px;
  font-family: var(--font-display);
  font-size: 0.66em;
  font-weight: 700;
  letter-spacing: 0.18em;
  opacity: 1;
  color: var(--jeok);
}
.side-cities.light .vc span {
  color: #f2b3bb;
}
/* 숫자는 세로글 속에서 가로로 한 덩어리(縦中横) */
.vc span .n {
  font-style: normal;
  text-combine-upright: all;
  -webkit-text-combine: horizontal;
  font-weight: 700;
}
.vc-empty {
  margin: 0;
  font-size: 16px;
  opacity: 0.75;
  max-height: 300px;
}
.side-cities .chip-empty {
  padding: 8px 12px;
  border: 1px solid var(--line);
  border-radius: 4px;
  background: rgba(251, 246, 234, 0.92);
  box-shadow: 0 10px 26px rgba(34, 28, 22, 0.14);
  text-shadow: none;
}
.side-cities.light .side-cap {
  color: rgba(251, 246, 234, 0.85);
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.6);
  border-bottom-color: rgba(251, 246, 234, 0.3);
}

@media (max-width: 1100px) {
  /* 여백이 좁아지면 - 처음처럼 내러티브 아래 하단 나열로 */
  .side-cities {
    position: absolute;
    right: 5%;
    left: auto;
    top: auto;
    bottom: 3%;
    transform: none;
    writing-mode: horizontal-tb;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: flex-end;
    gap: 14px;
    max-width: 58%;
    max-height: none;
    z-index: 5;
  }
  .side-cap {
    display: none;
  }
  .vc span {
    margin-top: 0;
    margin-left: 6px;
  }
  .foot {
    bottom: 12%;
  }
}

@media (max-width: 760px) {
  .rail,
  .side-title {
    display: none;
  }
  .hero-copy { font-size: 15px; padding: 0 16px; }
  .hero-note { font-size: 11px; }
  .mega { font-size: clamp(48px, 17vw, 96px); }
  .mega small { font-size: 10px; letter-spacing: 0.2em; }
  .narrative { font-size: 14.5px; line-height: 1.55; }
  .dcap { font-size: 2.2em; }
  .foot { bottom: 17%; }
  .side-cities { bottom: 2.5%; gap: 10px; }
  /* 터치 화면: 고을·다음 폭 버튼을 손가락 크기로 */
  .vc { font-size: 18px; padding: 9px 10px; margin: -9px -10px; min-height: 40px; display: inline-flex; align-items: baseline; }
  .next-fab { padding: 12px 18px; }
  .vc span { font-size: 0.7em; }
  /* 숫자는 세로글 속에서 가로로 한 덩어리(縦中横) */
.vc span .n {
  font-style: normal;
  text-combine-upright: all;
  -webkit-text-combine: horizontal;
  font-weight: 700;
}
.vc-empty { font-size: 14px; font-weight: 400; }
  .mega {
    top: 22%;
    left: 5%;
  }
  .foot {
    left: 5%;
  }
  .side-cities {
    left: 5%;
    max-width: none;
    justify-content: flex-start;
  }
  .next-fab {
    bottom: 1.6%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .side-title,
  .rail-item,
  .dc-drop {
    animation: none !important;
  }
  .stroke-title {
    animation: none;
    fill-opacity: 1;
    stroke-dashoffset: 0;
  }
  .hero-copy,
  .hero-note,
  .hero-here,
  .hero-hint {
    animation: none;
    opacity: 1;
  }
}
</style>
