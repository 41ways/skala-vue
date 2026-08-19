<script setup>
import { ref } from 'vue'

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 23, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])

const keyword = ref('')
const statusBar = ref('카드를 클릭하거나 검색해 보세요.')
const selected = ref('')

// v-model 대신 직접 받는 이유는 README에 정리
const onInput = (e) => {
  keyword.value = e.target.value
}

const selectCity = (cityName) => {
  selected.value = cityName
  statusBar.value = `${cityName}이 선택되었습니다.`
}

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

// 기온이 색을 정한다. 25도를 경계로 따뜻한 쪽과 서늘한 쪽
const tempColor = (temp) => (temp >= 25 ? '#c85a3c' : '#3b7d9e')
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
        :class="{ on: selected === city.name }"
        :style="{ borderLeftColor: tempColor(city.temp) }"
        @click="selectCity(city.name)"
      >
        <div class="left">
          <p class="name">{{ city.name }}</p>
          <p class="status">{{ city.status }}</p>
          <span v-if="city.temp >= 25" class="tag hot">더움 25도 이상</span>
          <span v-else class="tag cool">선선함 25도 미만</span>
        </div>

        <div class="right">
          <p class="temp" :style="{ color: tempColor(city.temp) }">{{ city.temp }}<sup>°</sup></p>
          <button @click.stop="showDetail(city.name, city.status)">상세보기</button>
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

/* 검색 */
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
  letter-spacing: 0.08em;
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

/* 목록 */
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
}

.card.on {
  border-left-width: 5px;
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
  letter-spacing: 0.02em;
}

.hot {
  background-color: #fbeae5;
  color: #a8432a;
}

.cool {
  background-color: #e6f0f5;
  color: #2d6480;
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
  font-variant-numeric: tabular-nums;
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

/* 상태바 */
.bar {
  margin: 20px 0 0;
  padding: 11px 16px;
  background-color: #22303a;
  color: #dfe7eb;
  border-radius: 4px;
  font-size: 13px;
}
</style>
