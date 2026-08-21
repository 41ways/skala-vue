<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/stores/configStore.js'
import {
  findCity,
  laundryScore,
  laundryGrade,
  humidityText,
  windText,
} from '@/data/weatherData.js'

const route = useRoute()
const router = useRouter()

const configStore = useConfigStore()
const { unitSymbol } = storeToRefs(configStore)

const city = ref(null)
const score = ref(0)
const grade = ref(null)

onMounted(() => {
  const found = findCity(route.params.cityId)
  if (!found) return

  city.value = found
  score.value = laundryScore(found)
  grade.value = laundryGrade(score.value)
})

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div v-if="city" class="detail">
    <button class="back" @click="goBack">← 목록으로</button>

    <header :class="grade.key">
      <p class="city">{{ city.name }}</p>
      <p class="big">{{ score }}<span>점</span></p>
      <p class="label">{{ grade.label }}</p>
    </header>

    <dl class="obs">
      <dt>하늘</dt>
      <dd>{{ city.status }}</dd>

      <dt>기온</dt>
      <dd>{{ configStore.toTemp(city.temp) }}{{ unitSymbol }}</dd>

      <dt>습도</dt>
      <dd>{{ city.humidity }}% ({{ humidityText(city.humidity) }})</dd>

      <dt>바람</dt>
      <dd>{{ city.wind }}m/s ({{ windText(city.wind) }})</dd>

      <dt>도시 코드</dt>
      <dd>{{ city.id }}</dd>
    </dl>
  </div>

  <div v-else class="detail">
    <button class="back" @click="goBack">← 목록으로</button>
    <p class="none">"{{ route.params.cityId }}"에 해당하는 도시를 찾을 수 없습니다.</p>
  </div>
</template>

<style scoped>
.detail {
  color: #1e2f33;
}

.back {
  border: none;
  background: none;
  padding: 0;
  margin-bottom: 14px;
  font-size: 13px;
  color: #6b7a80;
  cursor: pointer;
}

.back:hover {
  color: #1e2f33;
}

header {
  padding: 20px;
  border-radius: 4px;
  border-left: 5px solid;
  margin-bottom: 16px;
}

header.best {
  background-color: #e0f1f2;
  border-left-color: #1f8a8f;
  color: #14666a;
}
header.good {
  background-color: #e5f1ea;
  border-left-color: #4a8f6b;
  color: #326b4f;
}
header.fair {
  background-color: #f6eeda;
  border-left-color: #a8813c;
  color: #7d5f24;
}
header.none {
  background-color: #edf0f2;
  border-left-color: #8b969d;
  color: #5f6c74;
}

header p {
  margin: 0;
}

.city {
  font-size: 15px;
}

.big {
  font-size: 44px;
  font-weight: 300;
  line-height: 1.1;
}

.big span {
  font-size: 16px;
  margin-left: 3px;
}

.label {
  font-size: 13px;
}

.obs {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 10px 16px;
  margin: 0;
  padding: 16px 18px;
  border: 1px solid #e4eaec;
  border-radius: 4px;
  font-size: 13px;
}

.obs dt {
  color: #7f8b92;
}

.obs dd {
  margin: 0;
}

.none {
  padding: 40px 0;
  text-align: center;
  color: #9aa6ab;
}
</style>
