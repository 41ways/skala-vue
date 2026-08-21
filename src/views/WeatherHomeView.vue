<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'
import SummaryBar from '@/components/exercise/SummaryBar.vue'
import { weatherList, laundryScore, laundryGrade } from '@/data/weatherData.js'

const router = useRouter()

const searchQuery = ref('')
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

const goDetail = (city) => {
  router.push('/weather/' + city.id)
}
</script>

<template>
  <div class="laundry">
    <header class="head">
      <h3>오늘 빨래 널기 좋은 곳</h3>
      <p>기온, 습도, 바람, 하늘 상태를 합쳐 100점으로 계산합니다.</p>
    </header>

    <button class="banner" @click="router.push('/sky')">
      <span class="btitle">별 보러 가기</span>
      <span class="bsub">도시를 고르면 그 하늘로 내려갑니다</span>
      <span class="barrow">→</span>
    </button>

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
  </div>
</template>

<style scoped>
.laundry {
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

.banner {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  margin-bottom: 14px;
  padding: 14px 18px;
  border: none;
  border-radius: 6px;
  background: linear-gradient(100deg, #0d1730, #21325c 60%, #33406b);
  color: #dbe4ef;
  cursor: pointer;
  text-align: left;
}

.banner:hover {
  background: linear-gradient(100deg, #121e3d, #2a3d6d 60%, #3d4c7d);
}

.btitle {
  font-size: 15px;
  font-weight: 600;
  color: #f2f6ff;
}

.bsub {
  font-size: 12px;
  color: #94a3bd;
}

.barrow {
  margin-left: auto;
  font-size: 16px;
  color: #94a3bd;
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
