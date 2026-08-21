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
      <span class="roof"></span>
      <span class="pillar l"></span>
      <span class="pillar r"></span>

      <div class="dash">
        <div class="console">
          <span class="vent">
            <i></i><i></i><i></i>
          </span>

          <button class="navi" @click="emit('open-nav')">
            <span class="ntitle">{{ city.name }}</span>
            <span class="nsub">{{ skyGrade(starCount(city)) }}</span>
            <span class="ngo">다른 하늘로 ▸</span>
          </button>

          <span class="knobs">
            <i></i><i></i><i></i><i></i>
          </span>
        </div>

        <span class="vent side"><i></i><i></i></span>
      </div>

      <div class="cluster">
        <span class="cg">{{ city.temp }}°</span>
        <span class="cg">습 {{ city.humidity }}</span>
        <span class="cg">풍 {{ city.wind }}</span>
      </div>

      <div class="wheel">
        <span class="spoke sl"></span>
        <span class="spoke sr"></span>
        <span class="spoke sd"></span>
        <span class="hub"></span>
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
.roof {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 7%;
  background: linear-gradient(#1a1f2c, #0d1119);
  border-bottom: 1px solid #2b3244;
  border-radius: 0 0 40% 40% / 0 0 26% 26%;
}

.pillar {
  position: absolute;
  top: 5%;
  bottom: 34%;
  width: 44px;
  background: linear-gradient(#20263a, #10141e);
}

.pillar.l {
  left: -8px;
  transform: skewX(9deg);
  border-right: 1px solid #333c52;
}

.pillar.r {
  right: -8px;
  transform: skewX(-9deg);
  border-left: 1px solid #333c52;
}

.dash {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 36%;
  background: linear-gradient(#262c3a 0%, #171c27 32%, #0a0d14 100%);
  border-radius: 46% 46% 0 0 / 22% 22% 0 0;
  border-top: 2px solid #3d4557;
}

/* 센터 콘솔 */
.console {
  position: absolute;
  left: 50%;
  transform: translateX(-28%);
  top: 16%;
  width: 40%;
  min-width: 190px;
  padding: 8px;
  border-radius: 6px;
  background: linear-gradient(#1b202c, #10141c);
  border: 1px solid #333b4d;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.vent {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 5px 8px;
  border-radius: 3px;
  background-color: #0b0e15;
}

.vent i {
  height: 3px;
  border-radius: 2px;
  
  background-color: #2c3446;
}

.vent.side {
  position: absolute;
  right: 8%;
  top: 20%;
  width: 62px;
}

.navi {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 8px 10px;
  border: 1px solid #2f5c8c;
  border-radius: 4px;
  
  background-color: #0e2038;
  color: #9fc3ec;
  cursor: pointer;
  text-align: left;
}

.navi:hover {
  border-color: #6ea8e0;
  background-color: #14294a;
}

.ntitle {
  font-size: 14px;
  font-weight: 600;
  color: #e6f1ff;
}

.nsub {
  font-size: 11px;
  color: #8fb2d8;
}

.ngo {
  margin-top: 4px;
  font-size: 10px;
  letter-spacing: 0.08em;
  color: #5d86b4;
}

.knobs {
  display: flex;
  gap: 6px;
  justify-content: center;
}

.knobs i {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  
  background-color: #2b3345;
}

/* 계기판 */
.cluster {
  position: absolute;
  left: 12%;
  bottom: 27%;
  display: flex;
  gap: 10px;
  font-size: 10px;
  color: #7f8ea8;
}

/* 핸들 */
.wheel {
  position: absolute;
  left: 5%;
  bottom: -72px;
  width: 210px;
  height: 210px;
  border: 16px solid #171c27;
  border-radius: 50%;
  box-shadow:
    
    inset 0 0 0 2px #2f3646,
    0 -3px 10px rgba(0, 0, 0, 0.5);
}

.spoke {
  position: absolute;
  background-color: #1b212e;
  border-radius: 3px;
}

.spoke.sl {
  left: -6px;
  top: 44%;
  width: 46%;
  height: 15px;
  transform: rotate(-9deg);
}

.spoke.sr {
  right: -6px;
  top: 44%;
  width: 46%;
  height: 15px;
  transform: rotate(9deg);
}

.spoke.sd {
  left: 50%;
  top: 50%;
  width: 15px;
  height: 46%;
  transform: translateX(-50%);
}

.hub {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 66px;
  height: 44px;
  transform: translate(-50%, -50%);
  border-radius: 8px;
  background: linear-gradient(#232a38, #141924);
  border: 1px solid #333b4d;
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
