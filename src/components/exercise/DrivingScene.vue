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
    top: Math.random() * 56,
    size: Math.random() < 0.84 ? 1 : 2,
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

const windLean = computed(() => Math.min(props.city.wind * 4, 32))
const windSpeed = computed(() => Math.max(0.5, 2.6 - props.city.wind * 0.22))

const grasses = computed(() =>
  Array.from({ length: 34 }, (_, i) => ({
    id: i,
    left: (i / 34) * 100 + Math.random() * 2,
    h: 10 + Math.random() * 20,
    delay: Math.random() * 1.2,
  })),
)

const cloudLevel = computed(() => {
  if (isRain.value) return 0.6
  if (props.city.status === '흐림') return 0.48
  if (props.city.status === '구름') return 0.28
  return 0.07
})

// 내비 화면에 띄울 임시 주행 정보
const eta = computed(() => 12 + (props.city.name.length % 3) * 7)
</script>

<template>
  <div class="scene">
    <div class="world">
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
        <span class="glow"></span>
      </div>

      <div class="hills">
        <span class="hill h1"></span>
        <span class="hill h2"></span>
        <span class="hill h3"></span>
        <span class="hill h4"></span>
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

      <div class="road">
        <span class="lane"></span>
        <span class="edge le"></span>
        <span class="edge re"></span>
      </div>
    </div>

    <span class="glass"></span>

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
    <span class="mirror"></span>
    <span class="pillar l"></span>
    <span class="pillar r"></span>

    <div class="dash">
      <span class="dashtop"></span>
      <span class="trim"></span>

      <div class="cluster">
        <span class="dial">
          <span class="needle"></span>
        </span>
        <span class="ctext">
          <b>{{ city.temp }}°</b>
          {{ city.name }}
        </span>
      </div>

      <div class="console">
        <button class="navi" @click="emit('open-nav')">
          <span class="map">
            <span class="grid"></span>
            <span class="route"></span>
            <span class="pin"></span>
          </span>

          <span class="guide">
            <span class="arrow"></span>
            <span class="dist">2.4<i>km</i></span>
            <span class="dest">{{ city.name }} 전망대</span>
            <span class="etaline">{{ eta }}분 · {{ skyGrade(starCount(city)) }}</span>
            <span class="ngo">다른 하늘로 ▸</span>
          </span>
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
      <span class="glowcast"></span>
    </div>

    <div class="wheel">
      <span class="spoke sl"></span>
      <span class="spoke sr"></span>
      <span class="spoke sd"></span>
      <span class="hub"><i></i></span>

      <span class="limb ll">
        <span class="arm"></span>
        <span class="hand"><i></i></span>
      </span>
      <span class="limb lr">
        <span class="arm"></span>
        <span class="hand"><i></i></span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.scene {
  position: relative;
  height: 100%;
  overflow: hidden;
  background: linear-gradient(#04061a 0%, #0b1330 38%, #16203f 56%, #0c1428 100%);
}

/* 언덕을 넘어가는 상하 움직임. 차는 그대로, 길이 아래로 흐른다 */
.world {
  position: absolute;
  inset: -4% 0 0 0;
  animation: crest 5.5s ease-in-out infinite alternate;
}

@keyframes crest {
  from {
    transform: translateY(-9px) rotate(-0.5deg);
  }
  to {
    transform: translateY(11px) rotate(0.5deg);
  }
}

/* 하늘 */
.sky {
  position: absolute;
  inset: 0 0 38% 0;
}

.star {
  position: absolute;
  border-radius: 50%;
  background-color: #f0f5ff;
  animation: twinkle 4s ease-in-out infinite;
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
}

.haze {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 26% 30%, #7e8ba6, transparent 56%),
    radial-gradient(circle at 72% 44%, #6b7792, transparent 50%);
  filter: blur(22px);
}

.glow {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 34%;
  background: linear-gradient(transparent, rgba(94, 124, 178, 0.28));
}

/* 언덕 */
.hills {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 26%;
  height: 32%;
}

.hill {
  position: absolute;
  bottom: 0;
  border-radius: 50% 50% 0 0;
  animation: roll linear infinite;
}

.h1 {
  background-color: #16243f;
  width: 68%;
  height: 200%;
  left: -14%;
  animation-duration: 10s;
}
.h2 {
  background-color: #121e34;
  width: 58%;
  height: 158%;
  left: 44%;
  animation-duration: 7s;
}
.h3 {
  background-color: #0e182b;
  width: 50%;
  height: 124%;
  left: 100%;
  animation-duration: 5s;
}
.h4 {
  background-color: #0b1424;
  width: 44%;
  height: 96%;
  left: 150%;
  animation-duration: 3.8s;
}

@keyframes roll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-210%);
  }
}

/* 풀 */
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
  border-radius: 2px;
  background: linear-gradient(#2b4a78, #16263f);
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

/* 원근이 있는 도로 */
.road {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 27%;
  background: linear-gradient(#232a3d, #0a0d17);
  clip-path: polygon(41% 0, 59% 0, 122% 100%, -22% 100%);
  overflow: hidden;
}

.lane {
  position: absolute;
  left: 50%;
  top: -60px;
  width: 5px;
  height: 220%;
  transform: translateX(-50%);
  background: repeating-linear-gradient(#4f5c7c 0 24px, transparent 24px 58px);
  animation: dashline 0.45s linear infinite;
}

@keyframes dashline {
  to {
    transform: translate(-50%, 58px);
  }
}

.edge {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(transparent, rgba(150, 175, 220, 0.5));
}

.edge.le {
  left: 6%;
  transform: skewX(-22deg);
}
.edge.re {
  right: 6%;
  transform: skewX(22deg);
}

/* 앞유리 반사 */
.glass {
  position: absolute;
  inset: 6% 0 34% 0;
  pointer-events: none;
  background: linear-gradient(
    112deg,
    rgba(255, 255, 255, 0.055) 0 18%,
    transparent 18% 42%,
    rgba(255, 255, 255, 0.03) 42% 52%,
    transparent 52%
  );
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
  width: 5px;
  height: 42%;
  border-radius: 3px;
  background: linear-gradient(#3d4763, #1e2537);
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

/* 천장, 룸미러, 필러 */
.roof {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 8%;
  background: linear-gradient(#252a3b, #11151e);
  border-radius: 0 0 46% 46% / 0 0 34% 34%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.65);
}

.mirror {
  position: absolute;
  top: 6.5%;
  left: 50%;
  width: 96px;
  height: 24px;
  transform: translateX(-50%);
  border-radius: 5px;
  background: linear-gradient(#2b3244, #151a26);
  border: 1px solid #3a4257;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.5);
}

.pillar {
  position: absolute;
  top: 6%;
  bottom: 36%;
  width: 50px;
  background: linear-gradient(90deg, #2e3549, #161b26);
}

.pillar.l {
  left: -12px;
  transform: skewX(10deg);
  box-shadow: 3px 0 10px rgba(0, 0, 0, 0.5);
}
.pillar.r {
  right: -12px;
  transform: skewX(-10deg);
  box-shadow: -3px 0 10px rgba(0, 0, 0, 0.5);
}

/* 대시보드 */
.dash {
  position: absolute;
  left: -3%;
  right: -3%;
  bottom: 0;
  height: 38%;
  background: linear-gradient(#171d2a 0%, #0c1119 52%, #04060c 100%);
  border-radius: 44% 44% 0 0 / 28% 28% 0 0;
}

.dashtop {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 24px;
  border-radius: 44% 44% 0 0 / 100% 100% 0 0;
  background: linear-gradient(#414a66, #222839);
}

.trim {
  position: absolute;
  left: 5%;
  right: 5%;
  top: 33%;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, transparent, #566280, transparent);
  opacity: 0.5;
}

.glowcast {
  position: absolute;
  left: 34%;
  top: -6px;
  width: 34%;
  height: 40px;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(96, 150, 210, 0.3), transparent 70%);
  filter: blur(6px);
}

/* 계기판 */
.cluster {
  position: absolute;
  left: 10%;
  top: 12%;
  width: 136px;
  height: 48px;
  border-radius: 9px 9px 5px 5px;
  background: radial-gradient(circle at 30% 130%, #1d2536, #0c1017);
  border: 1px solid #2f374d;
  box-shadow: inset 0 1px 0 #454e68;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
}

.dial {
  position: relative;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 2px solid #2c3448;
  background: radial-gradient(circle, #10151f, #080b12);
}

.needle {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 14px;
  height: 2px;
  border-radius: 2px;
  background-color: #e2703f;
  transform-origin: left center;
  animation: rev 3.2s ease-in-out infinite alternate;
}

@keyframes rev {
  from {
    transform: rotate(140deg);
  }
  to {
    transform: rotate(58deg);
  }
}

.ctext {
  display: flex;
  flex-direction: column;
  font-size: 10px;
  color: #6f7c96;
}

.ctext b {
  font-size: 15px;
  font-weight: 500;
  color: #c3d6ee;
}

/* 센터 콘솔 */
.console {
  position: absolute;
  left: 52%;
  transform: translateX(-28%);
  top: 0;
  width: 41%;
  min-width: 210px;
  padding: 7px;
  border-radius: 8px;
  background: linear-gradient(#1c2230, #0a0e16);
  border: 1px solid #353e54;
  box-shadow: inset 0 1px 0 #4a5470;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* 내비 화면 */
.navi {
  display: flex;
  gap: 8px;
  padding: 7px;
  border: 1px solid #2b4f77;
  border-radius: 5px;
  background: linear-gradient(#0a1a2e, #061220);
  cursor: pointer;
  text-align: left;
}

.navi:hover {
  border-color: #5f9ed4;
}

.map {
  position: relative;
  width: 62px;
  min-width: 62px;
  border-radius: 4px;
  overflow: hidden;
  background: #071726;
}

.grid {
  position: absolute;
  inset: -30%;
  background:
    repeating-linear-gradient(90deg, #10314d 0 1px, transparent 1px 15px);
  background:
    repeating-linear-gradient(0deg, #10314d 0 1px, transparent 1px 15px),
    repeating-linear-gradient(90deg, #10314d 0 1px, transparent 1px 15px);
  transform: rotate(-18deg);
}

.route {
  position: absolute;
  left: 22%;
  bottom: -6px;
  width: 12px;
  height: 130%;
  border-radius: 6px;
  background: linear-gradient(#59d6c8, #2b8fb8);
  transform: rotate(16deg);
  box-shadow: 0 0 10px rgba(89, 214, 200, 0.5);
}

.pin {
  position: absolute;
  left: 54%;
  top: 16%;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background-color: #ffd166;
  box-shadow: 0 0 8px 2px rgba(255, 209, 102, 0.6);
}

.guide {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
}

.arrow {
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-bottom: 11px solid #59d6c8;
  transform: rotate(38deg);
  margin-bottom: 3px;
}

.dist {
  font-size: 17px;
  font-weight: 600;
  color: #e9f6ff;
  line-height: 1;
}

.dist i {
  font-size: 10px;
  font-style: normal;
  margin-left: 2px;
  color: #8ab6d8;
}

.dest {
  font-size: 11px;
  color: #cfe3f5;
}

.etaline {
  font-size: 9px;
  color: #6c96bb;
}

.ngo {
  margin-top: 3px;
  font-size: 9px;
  color: #4e7ba6;
}

.vent {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 5px 8px;
  border-radius: 3px;
  background-color: #070a11;
  border: 1px solid #262e40;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.7);
}

.vent i {
  height: 3px;
  border-radius: 2px;
  background: linear-gradient(#3d465f, #232a3a);
}

.vent.side {
  position: absolute;
  right: 8%;
  top: 14%;
  width: 62px;
}

/* 에어컨 아래 날씨 정보 */
.wx {
  display: flex;
  justify-content: space-between;
  gap: 6px;
  padding: 6px 8px;
  border-radius: 4px;
  background-color: #080c14;
  border: 1px solid #262e40;
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

/* 핸들 */
.wheel {
  position: absolute;
  left: 3%;
  bottom: -78px;
  width: 222px;
  height: 222px;
  border: 18px solid #1b212e;
  border-radius: 50%;
  box-shadow:
    inset 0 0 0 2px #39425a,
    inset 0 6px 12px rgba(0, 0, 0, 0.5),
    0 0 0 2px #090c13,
    0 -5px 16px rgba(0, 0, 0, 0.55);
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
  background: linear-gradient(#2a3243, #141924);
  border-radius: 4px;
  box-shadow: inset 0 1px 0 #3f4a63;
}

.spoke.sl {
  left: -9px;
  top: 43%;
  width: 48%;
  height: 17px;
  transform: rotate(-9deg);
}

.spoke.sr {
  right: -9px;
  top: 43%;
  width: 48%;
  height: 17px;
  transform: rotate(9deg);
}

.spoke.sd {
  left: 50%;
  top: 50%;
  width: 17px;
  height: 46%;
  transform: translateX(-50%);
}

.hub {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 72px;
  height: 48px;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  background: linear-gradient(#2b3345, #121722);
  border: 1px solid #414b64;
  box-shadow: inset 0 1px 0 #4f5a76;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hub i {
  width: 20px;
  height: 14px;
  border-radius: 3px;
  background: linear-gradient(#5d6b8a, #38415a);
}

/* 팔과 손을 한 덩어리로 묶어 끊겨 보이지 않게 한다 */
.limb {
  position: absolute;
  top: 30%;
  width: 40px;
  height: 190px;
}

.limb.ll {
  left: -26px;
  transform: rotate(-15deg);
  transform-origin: top center;
}

.limb.lr {
  right: -26px;
  transform: rotate(15deg);
  transform-origin: top center;
}

.arm {
  position: absolute;
  top: 26px;
  left: 50%;
  width: 34px;
  height: 170px;
  transform: translateX(-50%);
  border-radius: 17px 17px 0 0;
  background: linear-gradient(#8d6549, #5c4130);
  box-shadow: inset 2px 0 4px rgba(255, 220, 190, 0.12);
}

.hand {
  position: absolute;
  top: 0;
  left: 50%;
  width: 40px;
  height: 52px;
  transform: translateX(-50%);
  border-radius: 18px 18px 14px 14px;
  background: linear-gradient(#ab7d5a, #7b5540);
  box-shadow: inset 0 2px 4px rgba(255, 226, 198, 0.24);
}

.hand i {
  position: absolute;
  top: 10px;
  width: 13px;
  height: 24px;
  border-radius: 8px;
  background: linear-gradient(#b58865, #8c6247);
}

.limb.ll .hand i {
  right: -5px;
}

.limb.lr .hand i {
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
  .wheel,
  .world {
    animation: none;
  }
}
</style>
