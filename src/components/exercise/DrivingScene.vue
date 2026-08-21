<script setup>
import { computed } from 'vue'
import { starCount, skyGrade, humidityText, windText } from '@/data/weatherData.js'

const props = defineProps({
  city: { type: Object, required: true },
})

const emit = defineEmits(['open-nav'])

const stars = computed(() => {
  const n = starCount(props.city)
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 58,
    size: Math.random() < 0.86 ? 1 : 2,
    delay: Math.random() * 4,
  }))
})

const isRain = computed(() => props.city.status === '비' || props.city.status === '눈')

const raindrops = computed(() =>
  isRain.value
    ? Array.from({ length: 46 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 62,
        delay: Math.random() * 2,
      }))
    : [],
)

// 풍속이 셀수록 풀이 크게 눕고 빠르게 흔들린다
const windLean = computed(() => Math.min(props.city.wind * 4, 32))
const windSpeed = computed(() => Math.max(0.5, 2.6 - props.city.wind * 0.22))

const grasses = computed(() =>
  Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: (i / 30) * 100 + Math.random() * 2,
    h: 12 + Math.random() * 18,
    delay: Math.random() * 1.2,
  })),
)

const cloudLevel = computed(() => {
  if (isRain.value) return 0.62
  if (props.city.status === '흐림') return 0.5
  if (props.city.status === '구름') return 0.3
  return 0.08
})
</script>

<template>
  <div class="scene">
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

    <div class="road"><span class="lane"></span></div>

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

    <span class="roof"></span>
    <span class="pillar l"></span>
    <span class="pillar r"></span>

    <div class="dash">
      <span class="dashtop"></span>
      <span class="trim"></span>

      <div class="cluster">
        <span class="needle"></span>
        <span class="ctext">{{ city.name }}</span>
      </div>

      <div class="console">
        <button class="navi" @click="emit('open-nav')">
          <span class="nlabel">NAVIGATION</span>
          <span class="ncity">{{ city.name }}</span>
          <span class="ngrade">{{ skyGrade(starCount(city)) }}</span>
          <span class="ngo">다른 하늘로 ▸</span>
        </button>

        <span class="vent"><i></i><i></i><i></i></span>

        <div class="wx">
          <span>
            <b>{{ city.temp }}°</b>
            기온
          </span>
          <span>
            <b>{{ city.humidity }}%</b>
            {{ humidityText(city.humidity) }}
          </span>
          <span>
            <b>{{ city.wind }}</b>
            {{ windText(city.wind) }}
          </span>
        </div>
      </div>

      <span class="vent side"><i></i><i></i></span>
    </div>

    <div class="wheel">
      <span class="spoke sl"></span>
      <span class="spoke sr"></span>
      <span class="spoke sd"></span>
      <span class="hub"></span>
      <span class="hand hl"><i></i></span>
      <span class="hand hr"><i></i></span>
    </div>
  </div>
</template>

<style scoped>
.scene {
  position: relative;
  height: 100%;
  overflow: hidden;
  background: linear-gradient(#050818 0%, #0d1631 40%, #1a2646 58%, #101a33 100%);
}

/* 하늘 */
.sky {
  position: absolute;
  inset: 0 0 40% 0;
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
    opacity: 0.22;
  }
  50% {
    opacity: 1;
  }
}

.haze {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 28% 32%, #808da8, transparent 58%),
    radial-gradient(circle at 74% 46%, #6d7994, transparent 52%);
  filter: blur(20px);
}

/* 언덕 */
.hills {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 27%;
  height: 30%;
}

.hill {
  position: absolute;
  bottom: 0;
  width: 62%;
  height: 190%;
  border-radius: 50% 50% 0 0;
  animation: roll linear infinite;
}

.h1 {
  background-color: #172643;
  animation-duration: 9s;
  left: -12%;
}
.h2 {
  background-color: #142138;
  animation-duration: 6.5s;
  left: 46%;
  height: 150%;
}
.h3 {
  background-color: #0f192d;
  animation-duration: 4.5s;
  left: 102%;
  height: 118%;
}

@keyframes roll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-168%);
  }
}

/* 풀 */
.grassline {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 26%;
  height: 40px;
}

.grass {
  position: absolute;
  bottom: 0;
  width: 2px;
  background-color: #223c63;
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
  height: 27%;
  background: linear-gradient(#1e2334, #090c16);
  overflow: hidden;
}

.lane {
  position: absolute;
  left: 50%;
  top: -60px;
  width: 6px;
  height: 200%;
  transform: translateX(-50%);
  background: repeating-linear-gradient(#44506b 0 26px, transparent 26px 60px);
  animation: dashline 0.5s linear infinite;
}

@keyframes dashline {
  to {
    transform: translate(-50%, 60px);
  }
}

/* 비 */
.drop {
  position: absolute;
  width: 2px;
  height: 10px;
  border-radius: 2px;
  background-color: rgba(196, 216, 255, 0.7);
  animation: fall 1.1s linear infinite;
}

@keyframes fall {
  from {
    transform: translateY(-12px);
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  to {
    transform: translateY(95px);
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
  bottom: 34%;
  width: 4px;
  height: 42%;
  border-radius: 3px;
  background: linear-gradient(#39435f, #222a3d);
  transform-origin: bottom center;
  animation: wipe 2.4s ease-in-out infinite;
}

.wiper.left {
  left: 27%;
}
.wiper.right {
  left: 65%;
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

/* 천장과 필러 */
.roof {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 8%;
  background: linear-gradient(#232838, #12161f);
  border-radius: 0 0 44% 44% / 0 0 30% 30%;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.6);
}

.pillar {
  position: absolute;
  top: 6%;
  bottom: 36%;
  width: 46px;
  background: linear-gradient(90deg, #2a3145, #171c28);
}

.pillar.l {
  left: -10px;
  transform: skewX(9deg);
}
.pillar.r {
  right: -10px;
  transform: skewX(-9deg);
}

/* 대시보드 */
.dash {
  position: absolute;
  left: -2%;
  right: -2%;
  bottom: 0;
  height: 38%;
  background: linear-gradient(#151a26 0%, #0d111a 55%, #05070d 100%);
  border-radius: 44% 44% 0 0 / 26% 26% 0 0;
}

.dashtop {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 26px;
  border-radius: 44% 44% 0 0 / 100% 100% 0 0;
  background: linear-gradient(#39415a, #202636);
}

.trim {
  position: absolute;
  left: 6%;
  right: 6%;
  top: 30%;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, transparent, #4b566f, transparent);
}

/* 계기판 */
.cluster {
  position: absolute;
  left: 11%;
  top: 16%;
  width: 128px;
  height: 44px;
  border-radius: 8px 8px 4px 4px;
  background: radial-gradient(circle at 50% 120%, #1b2233, #0e121b);
  border: 1px solid #2c344a;
  display: flex;
  align-items: center;
}

.needle {
  position: absolute;
  left: 26px;
  bottom: 9px;
  width: 34px;
  height: 2px;
  border-radius: 2px;
  background-color: #d8663f;
  transform-origin: left center;
  animation: rev 3.4s ease-in-out infinite alternate;
}

@keyframes rev {
  from {
    transform: rotate(-32deg);
  }
  to {
    transform: rotate(-8deg);
  }
}

.ctext {
  font-size: 11px;
  color: #6f7c96;
  margin-left: 72px;
}

/* 센터 콘솔 */
.console {
  position: absolute;
  left: 52%;
  transform: translateX(-28%);
  top: 2%;
  width: 40%;
  min-width: 196px;
  padding: 7px;
  border-radius: 7px;
  background: linear-gradient(#1a1f2c, #0c1018);
  border: 1px solid #313a4f;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.navi {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 8px 10px;
  border: 1px solid #2d5a8a;
  border-radius: 4px;
  background: linear-gradient(#12263f, #0b192e);
  color: #9fc3ec;
  cursor: pointer;
  text-align: left;
}

.navi:hover {
  border-color: #6ea8e0;
  background: linear-gradient(#173350, #102240);
}

.nlabel {
  font-size: 8px;
  color: #5d86b4;
}

.ncity {
  font-size: 15px;
  font-weight: 600;
  color: #eaf3ff;
}

.ngrade {
  font-size: 11px;
  color: #8fb2d8;
}

.ngo {
  margin-top: 3px;
  font-size: 10px;
  color: #5d86b4;
}

.vent {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 5px 8px;
  border-radius: 3px;
  background-color: #080b12;
  border: 1px solid #232a3a;
}

.vent i {
  height: 3px;
  border-radius: 2px;
  background: linear-gradient(#39425a, #232a3a);
}

.vent.side {
  position: absolute;
  right: 9%;
  top: 16%;
  width: 60px;
}

/* 에어컨 아래 날씨 정보 */
.wx {
  display: flex;
  justify-content: space-between;
  gap: 5px;
  padding: 6px 8px;
  border-radius: 4px;
  background-color: #0a0e16;
  border: 1px solid #232a3a;
}

.wx span {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  font-size: 8px;
  color: #6b7791;
}

.wx b {
  font-size: 13px;
  font-weight: 500;
  color: #b9d0ea;
}

/* 핸들과 손 */
.wheel {
  position: absolute;
  left: 4%;
  bottom: -74px;
  width: 216px;
  height: 216px;
  border: 17px solid #191e2a;
  border-radius: 50%;
  box-shadow:
    inset 0 0 0 2px #333b50,
    0 0 0 2px #0b0e15,
    0 -4px 14px rgba(0, 0, 0, 0.55);
  animation: steer 6.5s ease-in-out infinite alternate;
}

@keyframes steer {
  from {
    transform: rotate(-5deg);
  }
  to {
    transform: rotate(6deg);
  }
}

.spoke {
  position: absolute;
  background: linear-gradient(#242b3b, #161b26);
  border-radius: 3px;
}

.spoke.sl {
  left: -8px;
  top: 43%;
  width: 47%;
  height: 16px;
  transform: rotate(-9deg);
}

.spoke.sr {
  right: -8px;
  top: 43%;
  width: 47%;
  height: 16px;
  transform: rotate(9deg);
}

.spoke.sd {
  left: 50%;
  top: 50%;
  width: 16px;
  height: 46%;
  transform: translateX(-50%);
}

.hub {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 70px;
  height: 46px;
  transform: translate(-50%, -50%);
  border-radius: 9px;
  background: linear-gradient(#262e3f, #131822);
  border: 1px solid #3a435a;
}

.hand {
  position: absolute;
  top: 32%;
  width: 34px;
  height: 48px;
  border-radius: 16px 16px 13px 13px;
  background: linear-gradient(#a87a58, #7d5740);
  box-shadow: inset 0 2px 3px rgba(255, 220, 190, 0.2);
}

.hand i {
  position: absolute;
  top: 9px;
  width: 12px;
  height: 22px;
  border-radius: 7px;
  background: linear-gradient(#b18562, #8a6046);
}

.hand.hl {
  left: -22px;
  transform: rotate(-14deg);
}

.hand.hl i {
  right: -5px;
}

.hand.hr {
  right: -22px;
  transform: rotate(14deg);
}

.hand.hr i {
  left: -5px;
}

@media (prefers-reduced-motion: reduce) {
  .star,
  .hill,
  .grass,
  .drop,
  .wiper,
  .lane,
  .needle,
  .wheel {
    animation: none;
  }
}
</style>
