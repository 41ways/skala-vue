<script setup>
import { ref } from 'vue'

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', humidity: 62, wind: 2.4 },
  { id: 'city_02', name: '수원', temp: 23, status: '비', humidity: 88, wind: 3.1 },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', humidity: 74, wind: 4.7 },
  { id: 'city_04', name: '광주', temp: 30, status: '맑음', humidity: 55, wind: 1.8 },
  { id: 'city_05', name: '강릉', temp: 19, status: '흐림', humidity: 70, wind: 5.2 },
  { id: 'city_06', name: '제주', temp: 24, status: '바람', humidity: 81, wind: 7.3 },
])

const keyword = ref('')
const statusBar = ref('카드를 클릭하거나 검색해 보세요.')
const selected = ref('')

const onInput = (e) => {
  keyword.value = e.target.value
}

const hasBatchim = (word) => (word.charCodeAt(word.length - 1) - 0xac00) % 28 !== 0

const selectCity = (cityName) => {
  selected.value = cityName
  statusBar.value = `${cityName}${hasBatchim(cityName) ? '이' : '가'} 선택되었습니다.`
}

const humidityText = (h) => {
  if (h >= 80) return '매우 습함'
  if (h >= 70) return '습함'
  if (h >= 60) return '적당함'
  return '쾌적'
}

const windText = (w) => {
  if (w >= 7) return '매우 강한 바람'
  if (w >= 4.5) return '강한 바람'
  if (w >= 3) return '약한 바람'
  return '아주 약한 바람'
}

const showDetail = (city) => {
  window.alert(
    `${city.name}의 현재 날씨는 [${city.status}] 상태입니다.\n` +
      `습도 ${city.humidity}% (${humidityText(city.humidity)})\n` +
      `바람 ${city.wind}m/s (${windText(city.wind)})`,
  )
}

const level = (temp) => {
  if (temp >= 28) return 'hot'
  if (temp >= 25) return 'warm'
  if (temp >= 20) return 'mild'
  return 'cold'
}
</script>

<template>
  <div class="weather">
    <div class="search">
      <label for="city-search">도시 검색</label>
      <input
        id="city-search"
        :value="keyword"
        @input="onInput"
        placeholder="도시 이름을 입력하세요"
      />
      <span class="typing">{{ keyword }}</span>
    </div>

    <div class="list">
      <article
        v-for="city in weatherList.filter((c) => c.name.includes(keyword))"
        :key="city.id"
        class="card"
        :class="[level(city.temp), { on: selected === city.name }]"
        @click="selectCity(city.name)"
      >
        <div class="left">
          <p class="name">{{ city.name }}</p>
          <p class="status">{{ city.status }}</p>

          <span v-if="city.temp >= 28" class="tag">무더움 28도 이상</span>
          <span v-else-if="city.temp >= 25" class="tag">더움 25도 이상</span>
          <span v-else-if="city.temp >= 20" class="tag">선선함 20도 이상</span>
          <span v-else class="tag">쌀쌀함 20도 미만</span>

          <p class="detail">습도 {{ city.humidity }}% · 바람 {{ city.wind }}m/s</p>
        </div>

        <div class="right">
          <p class="temp">{{ city.temp }}<sup>°</sup></p>
          <button @click.stop="showDetail(city)">상세보기</button>
        </div>
      </article>

      <p v-if="weatherList.filter((c) => c.name.includes(keyword)).length === 0" class="empty">
        "{{ keyword }}"에 해당하는 도시가 없습니다.
      </p>
    </div>

    <p class="bar">{{ statusBar }}</p>
  </div>
</template>

<style scoped>
.weather {
  max-width: 560px;
  color: #22303a;
}

.search {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding-bottom: 10px;
  border-bottom: 2px solid #22303a;
  margin-bottom: 20px;
}

.search label {
  font-size: 12px;
  color: #6b7a84;
  white-space: nowrap;
}

.search input {
  flex: 1;
  border: none;
  outline: none;
  background: none;
  font-size: 16px;
  padding: 4px 0;
  color: inherit;
}

.typing {
  font-size: 12px;
  color: #9aa6ad;
  min-width: 40px;
  text-align: right;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 14px 18px;
  border: 1px solid #e6ebee;
  border-left-width: 5px;
  border-radius: 4px;
  cursor: pointer;
}

.card:hover {
  background-color: #fafcfd;
}

.card.on {
  background-color: #f4f8fa;
  border-color: #22303a;
  border-left-width: 5px;
}

.card.hot {
  border-left-color: #b23a20;
}
.card.warm {
  border-left-color: #d8813a;
}
.card.mild {
  border-left-color: #4a9070;
}
.card.cold {
  border-left-color: #3b7d9e;
}

.card.hot .temp {
  color: #b23a20;
}
.card.warm .temp {
  color: #d8813a;
}
.card.mild .temp {
  color: #4a9070;
}
.card.cold .temp {
  color: #3b7d9e;
}

.card.hot .tag {
  background-color: #f8e4de;
  color: #93301a;
}
.card.warm .tag {
  background-color: #fbeedd;
  color: #9c5b1f;
}
.card.mild .tag {
  background-color: #e3f0e9;
  color: #2f6a51;
}
.card.cold .tag {
  background-color: #e6f0f5;
  color: #2d6480;
}

.left p {
  margin: 0;
}

.name {
  font-size: 17px;
  font-weight: 600;
}

.status {
  font-size: 13px;
  color: #7b8892;
  margin-bottom: 6px !important;
}

.tag {
  display: inline-block;
  padding: 2px 7px;
  border-radius: 3px;
  font-size: 11px;
}

.detail {
  margin-top: 7px !important;
  font-size: 12px;
  color: #8b979f;
}

.right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.temp {
  margin: 0;
  font-size: 30px;
  font-weight: 300;
  line-height: 1;
}

.temp sup {
  font-size: 15px;
  font-weight: 400;
}

.right button {
  border: 1px solid #ccd5da;
  background: white;
  border-radius: 3px;
  padding: 4px 10px;
  font-size: 12px;
  color: #4a5860;
  cursor: pointer;
}

.right button:hover {
  border-color: #22303a;
  color: #22303a;
}

.empty {
  padding: 28px 0;
  text-align: center;
  color: #9aa6ad;
  font-size: 14px;
}

.bar {
  margin: 20px 0 0;
  padding: 11px 16px;
  background-color: #22303a;
  color: #dfe7eb;
  border-radius: 4px;
  font-size: 13px;
}
</style>
