<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'
import SummaryBar from './SummaryBar.vue'

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', humidity: 62, wind: 2.4 },
  { id: 'city_02', name: '수원', temp: 23, status: '비', humidity: 88, wind: 3.1 },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', humidity: 74, wind: 4.7 },
  { id: 'city_04', name: '광주', temp: 30, status: '맑음', humidity: 55, wind: 1.8 },
  { id: 'city_05', name: '강릉', temp: 19, status: '흐림', humidity: 70, wind: 5.2 },
  { id: 'city_06', name: '제주', temp: 24, status: '바람', humidity: 81, wind: 7.3 },
])

const searchQuery = ref('')
const selectedCityInfo = ref(null)
const sortOrder = ref('')
const onlyDryable = ref(false)

const laundryScore = (city) => {
  if (city.status === '비' || city.status === '눈') return 0

  let score = 100
  score -= (city.humidity - 40) * 1.8
  score += Math.min(city.wind, 6) * 6
  if (city.status === '맑음') score += 8
  if (city.temp >= 20) score += 4

  return Math.max(0, Math.min(100, Math.round(score)))
}

const laundryGrade = (score) => {
  if (score === 0) return { key: 'none', label: '널 수 없음' }
  if (score >= 90) return { key: 'best', label: '아주 잘 마름' }
  if (score >= 70) return { key: 'good', label: '잘 마름' }
  return { key: 'fair', label: '더디게 마름' }
}

const laundryReason = (city) => {
  if (city.status === '비' || city.status === '눈') {
    return `${city.status} 예보라 밖에 널 수 없습니다.`
  }

  const parts = []
  if (city.humidity >= 80) parts.push(`습도가 ${city.humidity}%로 높아 잘 안 마릅니다`)
  else if (city.humidity < 60) parts.push(`습도가 ${city.humidity}%로 낮아 잘 마릅니다`)
  else parts.push(`습도는 ${city.humidity}%로 무난합니다`)

  if (city.wind >= 4.5) parts.push(`바람이 ${city.wind}m/s로 강해 건조에 유리합니다`)
  else if (city.wind < 3) parts.push(`바람이 ${city.wind}m/s로 약해 시간이 걸립니다`)
  else parts.push(`바람은 ${city.wind}m/s로 적당합니다`)

  return parts.join('. ') + '.'
}

const scoredList = computed(() =>
  weatherList.value.map((city) => {
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

const hasBatchim = (word) => (word.charCodeAt(word.length - 1) - 0xac00) % 28 !== 0

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
  console.log(`[watch] 선택 도시 변경: ${before} → ${newCity.name} / 상태바: ${statusBar.value}`)
})

watchEffect(() => {
  console.log(`[watchEffect] 검색어 추적: "${searchQuery.value}"`)
})

const updateQuery = (value) => {
  searchQuery.value = value
}

const changeSort = (order) => {
  sortOrder.value = sortOrder.value === order ? '' : order
}

const selectCard = (city) => {
  selectedCityInfo.value = city
}

const clickDetail = (city) => {
  window.alert(
    `${city.name} 빨래 지수 ${city.score}점 (${city.grade.label})\n\n` +
      `${city.status} · ${city.temp}도\n` +
      `${laundryReason(city)}`,
  )
}
</script>

<template>
  <div class="laundry">
    <header class="head">
      <h3>오늘 빨래 널기 좋은 곳</h3>
      <p>기온, 습도, 바람, 하늘 상태를 합쳐 100점으로 계산합니다.</p>
    </header>

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
          @click-detail="clickDetail"
        />

        <p v-if="filteredWeatherList.length === 0" class="empty">
          조건에 맞는 도시가 없습니다.
        </p>
      </div>
    </BaseDashboardCard>

    <p class="bar">{{ statusBar }}</p>
  </div>
</template>

<style scoped>
.laundry {
  max-width: 560px;
  color: #1e2f33;
}

.head {
  margin-bottom: 16px;
}

.head h3 {
  margin: 0 0 4px;
  font-size: 18px;
}

.head p {
  margin: 0;
  font-size: 12px;
  color: #7f8b92;
}

.list {
  margin-top: 14px;
}

.empty {
  padding: 28px 0;
  text-align: center;
  color: #9aa6ab;
  font-size: 14px;
}

.bar {
  margin: 6px 0 0;
  padding: 11px 16px;
  background-color: #1e2f33;
  color: #dde8e9;
  border-radius: 4px;
  font-size: 13px;
}
</style>
