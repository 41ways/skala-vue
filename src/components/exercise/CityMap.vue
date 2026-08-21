<script setup>
import { weatherList, starCount } from '@/data/weatherData.js'

const emit = defineEmits(['pick-city'])
</script>

<template>
  <div class="map">
    <p class="title">어느 하늘로 갈까요</p>
    <p class="sub">도시를 고르면 그곳 하늘로 내려갑니다</p>

    <div class="board">
      <span
        v-for="city in weatherList"
        :key="city.id"
        class="pin"
        :style="{ left: city.x + '%', top: city.y + '%' }"
        @click="emit('pick-city', city)"
      >
        <span class="dot" :style="{ opacity: 0.35 + starCount(city) / 340 }"></span>
        <span class="name">{{ city.name }}</span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.map {
  position: relative;
  height: 100%;
  padding: 26px 20px;
  color: #dbe4ef;
}

.title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.sub {
  margin: 5px 0 0;
  font-size: 12px;
  color: #8493a8;
}

.board {
  position: relative;
  height: calc(100% - 60px);
  margin-top: 16px;
}

.pin {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background-color: #f4f7ff;
  box-shadow: 0 0 12px 3px rgba(200, 220, 255, 0.55);
}

.pin:hover .dot {
  background-color: #ffe9a8;
  box-shadow: 0 0 18px 6px rgba(255, 220, 140, 0.75);
}

.name {
  font-size: 12px;
  color: #c3cfe0;
  white-space: nowrap;
}

.pin:hover .name {
  color: white;
}
</style>
