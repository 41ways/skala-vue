<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
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
  router.push('/classic')
}
</script>

<template>
  <div v-if="city" class="detail">
    <button class="back" @click="goBack">← 목록으로</button>

    <header :class="grade.key">
      <p class="city">{{ city.name }}</p>
      <p class="big">{{ score }}<span>점</span></p>
      <p class="label">{{ grade.label }}</p>
      <i class="seal">{{ { best: '上上', good: '上', fair: '中', none: '下' }[grade.key] }}</i>
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

    <p class="src">
      실습용 표본 자료입니다. 오늘의 실측 하늘은 <RouterLink to="/">국내 화폭</RouterLink>에서 볼 수 있습니다.
    </p>
  </div>

  <div v-else class="detail">
    <button class="back" @click="goBack">← 목록으로</button>
    <p class="none">"{{ route.params.cityId }}"에 해당하는 도시를 찾을 수 없습니다.</p>
  </div>
</template>

<style scoped>
.detail {
  color: var(--ink);
}

.back {
  border: none;
  background: none;
  padding: 0;
  margin-bottom: 14px;
  font-size: 13px;
  color: var(--ink-soft);
  cursor: pointer;
}

.back:hover {
  color: var(--ink);
}

header {
  position: relative;
  padding: 20px 22px;
  border-radius: 4px;
  border-left: 5px solid;
  margin-bottom: 16px;
}
/* 등급 낙관 */
.seal {
  position: absolute;
  right: 18px;
  top: 18px;
  display: grid;
  place-items: center;
  min-width: 34px;
  height: 34px;
  padding: 0 6px;
  background: var(--jeok);
  color: var(--baek);
  font-family: var(--font-display);
  font-style: normal;
  font-size: 14px;
  letter-spacing: 0.08em;
  border-radius: 3px;
  box-shadow: inset 0 0 0 1.5px rgba(251, 246, 234, 0.4);
  transform: rotate(-4deg);
}

header.best {
  background-color: rgba(47, 86, 122, 0.1);
  border-left-color: var(--cheong);
  color: var(--cheong);
}
header.good {
  background-color: rgba(63, 125, 82, 0.12);
  border-left-color: var(--rok);
  color: var(--rok);
}
header.fair {
  background-color: rgba(206, 155, 59, 0.16);
  border-left-color: var(--hwang);
  color: var(--hwang);
}
header.none {
  background-color: rgba(251, 246, 234, 0.7);
  border-left-color: var(--ink-soft);
  color: var(--ink-soft);
}

header p {
  margin: 0;
}

.city {
  font-family: var(--font-display);
  font-size: 16px;
  letter-spacing: 0.12em;
}

.big {
  font-family: var(--font-display);
  font-size: 48px;
  font-weight: 400;
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
  border: 1px solid var(--line);
  border-radius: 4px;
  font-size: 13px;
}

.obs dt {
  color: var(--ink-soft);
}

.obs dd {
  margin: 0;
}

.src {
  margin: 14px 0 0;
  font-size: 12.5px;
  color: var(--ink-soft);
}
.src a {
  color: var(--jeok);
}
.none {
  padding: 40px 0;
  text-align: center;
  color: var(--ink-soft);
}
</style>
