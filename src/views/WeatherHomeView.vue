<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'
import SummaryBar from '@/components/exercise/SummaryBar.vue'
import DevNotes from '@/components/exercise/DevNotes.vue'
import PracticeTabs from '@/components/exercise/PracticeTabs.vue'
import { weatherList, laundryScore, laundryGrade } from '@/data/weatherData.js'

const router = useRouter()

const route = useRoute()
// 위 세부 탭 - 아래에 더 있다는 걸 놓치지 않게
const notesTab = ref('log')
const sections = [
  { id: 'board', label: '대시보드' },
  { id: 'practice', label: '과제·실습 1~13' },
  { id: 'notes', label: '개발 일지', tab: 'log' },
  { id: 'notes', label: '배운 점', tab: 'learned' },
  { id: 'notes', label: '회고', tab: 'reflect' },
]
const goto = (sec) => {
  if (sec.tab) notesTab.value = sec.tab
  const el = document.getElementById(sec.id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - 72
  if (window.__lenis) window.__lenis.scrollTo(top, { duration: 1 })
  else window.scrollTo({ top, behavior: 'smooth' })
}
// 검색어는 주소 ?q= 에도 적어 둔다 - 새로고침·공유해도 같은 결과
const searchQuery = ref(typeof route.query.q === 'string' ? route.query.q : '')
const selectedCityInfo = ref(null)
const sortOrder = ref('')
const onlyDryable = ref(false)

const hasBatchim = (word) => (word.charCodeAt(word.length - 1) - 0xac00) % 28 !== 0

const scoredList = computed(() =>
  weatherList.map((city) => {
    const score = laundryScore(city)
    return { ...city, score, grade: laundryGrade(score) }
  }),
)

const filteredWeatherList = computed(() =>
  scoredList.value
    .filter((c) => c.name.includes(searchQuery.value))
    .filter((c) => (onlyDryable.value ? c.score > 0 : true)),
)

const sortedList = computed(() => {
  if (sortOrder.value === 'desc') {
    return filteredWeatherList.value.toSorted((a, b) => b.score - a.score)
  }
  if (sortOrder.value === 'asc') {
    return filteredWeatherList.value.toSorted((a, b) => a.score - b.score)
  }
  return filteredWeatherList.value
})

const statusBar = computed(() => {
  if (!selectedCityInfo.value) return '카드를 클릭하거나 검색해 보세요.'
  const name = selectedCityInfo.value.name
  return `${name}${hasBatchim(name) ? '이' : '가'} 선택되었습니다.`
})

const averageScore = computed(() => {
  if (filteredWeatherList.value.length === 0) return 0
  const sum = filteredWeatherList.value.reduce((acc, c) => acc + c.score, 0)
  return (sum / filteredWeatherList.value.length).toFixed(1)
})

const dryableCount = computed(() => filteredWeatherList.value.filter((c) => c.score > 0).length)

watch(selectedCityInfo, (newCity, oldCity) => {
  const before = oldCity ? oldCity.name : '없음'
  console.log(`[watch] 선택 도시 변경: ${before} → ${newCity.name}`)
})

// env 확인용 (build:staging 이면 stage 주소가 찍힌다)
console.log('[env] VITE_API_URL =', import.meta.env.VITE_API_URL)

watchEffect(() => {
  console.log(`[watchEffect] 검색어 추적: "${searchQuery.value}"`)
})

const updateQuery = (value) => {
  searchQuery.value = value
  router.replace({ query: value ? { ...route.query, q: value } : { ...route.query, q: undefined } })
}

const changeSort = (order) => {
  sortOrder.value = sortOrder.value === order ? '' : order
}

const selectCard = (city) => {
  selectedCityInfo.value = city
}

const goDetail = (city) => {
  router.push('/weather/' + city.id)
}
</script>

<template>
  <div class="laundry">
    <header class="head">
      <h3>오늘 빨래 널기 좋은 곳</h3>
      <p>기온, 습도, 바람, 하늘 상태를 합쳐 100점으로 계산합니다.</p>
      <p class="src">
        수업 실습 화면이라 표본 자료로 동작합니다. 오늘의 실측 하늘은
        <RouterLink to="/">국내 화폭</RouterLink>, 계산 규칙은
        <RouterLink to="/guide">빨래 지침</RouterLink>에 있습니다.
      </p>
    </header>

    <nav class="subnav util" aria-label="이 페이지 안 이동">
      <button v-for="sec in sections" :key="sec.label" type="button" @click="goto(sec)">{{ sec.label }}</button>
    </nav>

    <div id="board"></div>
    <BaseDashboardCard title="도시 검색">
      <SearchBar :query="searchQuery" @update-query="updateQuery" />
    </BaseDashboardCard>

    <BaseDashboardCard title="지역별 빨래 지수">
      <SummaryBar
        :count="filteredWeatherList.length"
        :average="averageScore"
        :dryable-count="dryableCount"
        :sort-order="sortOrder"
        :only-dryable="onlyDryable"
        @change-sort="changeSort"
        @toggle-filter="onlyDryable = !onlyDryable"
      />

      <div class="list">
        <WeatherCard
          v-for="city in sortedList"
          :key="city.id"
          :city="city"
          :score="city.score"
          :grade="city.grade"
          :is-selected="selectedCityInfo?.id === city.id"
          @select-card="selectCard"
          @click-detail="goDetail"
        />

        <p v-if="filteredWeatherList.length === 0" class="empty">조건에 맞는 도시가 없습니다.</p>
      </div>
    </BaseDashboardCard>

    <p class="bar">{{ statusBar }}</p>

    <PracticeTabs />

    <DevNotes v-model:tab="notesTab" />
  </div>
</template>

<style scoped>
.laundry {
  color: var(--ink);
}

.head {
  margin-bottom: 14px;
}
.subnav {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 18px;
  padding: 8px 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}
.subnav button {
  border: 1px solid var(--line);
  background: rgba(251, 246, 234, 0.7);
  border-radius: 999px;
  padding: 6px 13px;
  font-family: var(--font-display);
  font-size: 13px;
  letter-spacing: 0.06em;
  color: var(--ink);
  cursor: pointer;
}
.subnav button:hover {
  border-color: var(--jeok);
  color: var(--jeok);
}
.src {
  margin: 8px 0 0;
  font-size: 13.5px;
  color: var(--ink-soft);
}
.src a {
  color: var(--jeok);
}

.head h3 {
  margin: 0 0 6px;
  font-family: var(--font-display);
  font-size: 24px;
  letter-spacing: 0.08em;
}

.head p {
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: var(--ink-soft);
}


.list {
  margin-top: 14px;
}

.empty {
  padding: 28px 0;
  text-align: center;
  color: var(--ink-soft);
  font-size: 15px;
}

.bar {
  margin: 6px 0 0;
  padding: 11px 16px;
  background-color: var(--ink);
  color: var(--line);
  border-radius: 4px;
  font-size: 14px;
  letter-spacing: 0.02em;
}
</style>
