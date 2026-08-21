<script setup>
import { computed } from 'vue'
import { starCount, skyGrade } from '@/data/weatherData.js'

const props = defineProps({
  city: { type: Object, required: true },
})

const emit = defineEmits(['open-nav'])

const stars = computed(() => {
  const n = starCount(props.city)
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 62,
    size: Math.random() < 0.86 ? 1 : 2,
    delay: Math.random() * 4,
  }))
})

const isRain = computed(() => props.city.status === '비' || props.city.status === '눈')

const raindrops = computed(() =>
  isRain.value
    ? Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 70,
        delay: Math.random() * 2,
      }))
    : [],
)

// 풍속이 셀수록 풀이 크게 눕는다
const windLean = computed(() => Math.min(props.city.wind * 4, 32))
const windSpeed = computed(() => Math.max(0.5, 2.6 - props.city.wind * 0.22))

const grasses = computed(() =>
  Array.from({ length: 26 }, (_, i) => ({
    id: i,
    left: (i / 26) * 100 + Math.random() * 2,
    h: 12 + Math.random() * 18,
    delay: Math.random() * 1.2,
  })),
)

const cloudLevel = computed(() => {
  if (props.city.status === '흐림') return 0.5
  if (props.city.status === '구름') return 0.3
  if (isRain.value) return 0.62
  return 0.08
})
</script>

<template>
  <div class="scene" :class="{ rain: isRain }">
    <div class="sky">
      <span
        v-for="s in stars"
        :key="s.id"
        class="star"
        :style="{
          left: s.left + '%',
          top: s.top + '%',
          width: s.size + 'px',
          height: s.size + 'px',
          animationDelay: s.delay + 's',
        }"
      ></span>

      <span class="haze" :style="{ opacity: cloudLevel }"></span>
    </div>

    <div class="hills">
      <span class="hill h1"></span>
      <span class="hill h2"></span>
      <span class="hill h3"></span>
    </div>

    <div class="grassline">
      <span
        v-for="g in grasses"
        :key="g.id"
        class="grass"
        :style="{
          left: g.left + '%',
          height: g.h + 'px',
          animationDuration: windSpeed + 's',
          animationDelay: g.delay + 's',
          '--lean': windLean + 'deg',
        }"
      ></span>
    </div>

    <div class="road"></div>

    <div v-if="isRain" class="drops">
      <span
        v-for="d in raindrops"
        :key="d.id"
        class="drop"
        :style="{ left: d.left + '%', top: d.top + '%', animationDelay: d.delay + 's' }"
      ></span>
    </div>

    <div v-if="isRain" class="wipers">
      <span class="wiper left"></span>
      <span class="wiper right"></span>
    </div>

    <div class="cabin">
      <span class="pillar l"></span>
      <span class="pillar r"></span>
      <div class="dash">
        <button class="nav" @click="emit('open-nav')">
          <span class="navtitle">NAVI</span>
          <span class="navsub">다른 하늘로</span>
        </button>

        <div class="info">
          <p class="cityname">{{ city.name }}</p>
          <p class="grade">{{ skyGrade(starCount(city)) }}</p>
        </div>

        <div class="gauges">
          <span>{{ city.temp }}°</span>
          <span>습 {{ city.humidity }}%</span>
          <span>풍 {{ city.wind }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scene {
  position: relative;
  height: 100%;
  overflow: hidden;
  background: linear-gradient(#070b1c 0%, #101a3a 42%, #1d2a4d 62%, #14203c 100%);
}

/* 하늘과 별 */
.sky {
  position: absolute;
  inset: 0 0 38% 0;
}

.star {
  position: absolute;
  border-radius: 50%;
  background-color: #eef3ff;
  animation: twinkle 4s ease-in-out infinite;
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.25;
  }
  50% {
    opacity: 1;
  }
}

.haze {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 30%, #7f8ba8, transparent 60%),
    radial-gradient(circle at 72% 45%, #6d7994, transparent 55%);
  filter: blur(18px);
}

/* 언덕 무한 스크롤 */
.hills {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 26%;
  height: 34%;
}

.hill {
  position: absolute;
  bottom: 0;
  width: 60%;
  height: 190%;
  border-radius: 50% 50% 0 0;
  animation: roll linear infinite;
}

.h1 {
  background-color: #1b2b4a;
  animation-duration: 9s;
  left: -10%;
}
.h2 {
  background-color: #182541;
  animation-duration: 6.5s;
  left: 45%;
  height: 150%;
}
.h3 {
  background-color: #131e36;
  animation-duration: 4.5s;
  left: 100%;
  height: 120%;
}

@keyframes roll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-165%);
  }
}

/* 바람에 눕는 풀 */
.grassline {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 25%;
  height: 40px;
}

.grass {
  position: absolute;
  bottom: 0;
  width: 2px;
  background-color: #24406a;
  transform-origin: bottom center;
  animation: sway ease-in-out infinite alternate;
}

@keyframes sway {
  from {
    transform: rotate(calc(var(--lean) * -0.25));
  }
  to {
    transform: rotate(var(--lean));
  }
}

/* 도로 */
.road {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 26%;
  background: linear-gradient(#22283a, #0d1120);
}

/* 빗방울과 와이퍼 */
.drop {
  position: absolute;
  width: 2px;
  height: 9px;
  border-radius: 2px;
  background-color: rgba(196, 216, 255, 0.75);
  animation: fall 1.1s linear infinite;
}

@keyframes fall {
  from {
    transform: translateY(-10px);
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  to {
    transform: translateY(90px);
    opacity: 0;
  }
}

.wipers {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.wiper {
  position: absolute;
  bottom: 26%;
  width: 3px;
  height: 46%;
  border-radius: 3px;
  background-color: #2c3550;
  transform-origin: bottom center;
  animation: wipe 2.4s ease-in-out infinite;
}

.wiper.left {
  left: 28%;
}
.wiper.right {
  left: 66%;
  animation-delay: 0.12s;
}

@keyframes wipe {
  0%,
  100% {
    transform: rotate(-48deg);
  }
  50% {
    transform: rotate(42deg);
  }
}

/* 운전석 */
.pillar {
  position: absolute;
  top: 0;
  bottom: 24%;
  width: 26px;
  background: linear-gradient(#0b0f1c, #141a2c);
}

.pillar.l {
  left: 0;
  transform: skewX(6deg);
}
.pillar.r {
  right: 0;
  transform: skewX(-6deg);
}

.dash {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 25%;
  background: linear-gradient(#12182a, #080b15);
  border-top: 1px solid #2a3350;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 18px;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 7px 12px;
  border: 1px solid #33608f;
  border-radius: 5px;
  background: linear-gradient(#12284a, #0d1d38);
  color: #9fc3ec;
  cursor: pointer;
  text-align: left;
}

.nav:hover {
  border-color: #6ea8e0;
  color: #d6ebff;
}

.navtitle {
  font-size: 9px;
  letter-spacing: 0.16em;
}

.navsub {
  font-size: 12px;
}

.info {
  flex: 1;
}

.info p {
  margin: 0;
}

.cityname {
  font-size: 17px;
  font-weight: 600;
  color: #e8eefc;
}

.grade {
  font-size: 12px;
  color: #93a4c2;
  margin-top: 2px !important;
}

.gauges {
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: #7c8cab;
}

@media (prefers-reduced-motion: reduce) {
  .star,
  .hill,
  .grass,
  .drop,
  .wiper {
    animation: none;
  }
}
</style>
