<script setup>
// 민화 날씨 장면 — 일월오봉도 구도(해/달·다섯 봉우리·물결) + 매화가지·까치
// 화폭 자체가 움직인다: 물결이 흐르고, 폭포가 떨어지고, 까치가 깃을 털고,
// 매화가지가 흔들리고, 산허리로 안개가 지나간다.
import { computed } from 'vue'

const props = defineProps({
  status: { type: String, default: '맑음' }, // 맑음 | 구름 | 흐림 | 비 | 눈 | 뇌우 | 바람
  isDay: { type: Boolean, default: true },
})

// 하늘 팔레트 — 오봉도의 쪽빛을 기준으로 날씨별 변주
const sky = computed(() => {
  if (!props.isDay) return 'linear-gradient(180deg,#141d33,#1f2c4d)'
  switch (props.status) {
    case '맑음':
      return 'linear-gradient(180deg,#2c5aa0,#4a7ec2)'
    case '구름':
    case '바람':
      return 'linear-gradient(180deg,#4a6d99,#7d97b5)'
    case '흐림':
      return 'linear-gradient(180deg,#5d6a72,#8b969b)'
    case '비':
      return 'linear-gradient(180deg,#3d4a55,#5d6d78)'
    case '뇌우':
      return 'linear-gradient(180deg,#232b33,#3a4750)'
    case '눈':
      return 'linear-gradient(180deg,#8a97a5,#b5bfc8)'
    default:
      return 'linear-gradient(180deg,#2c5aa0,#4a7ec2)'
  }
})

// 흐림·비·뇌우에는 장면 전체 채도를 낮춰 수묵 톤으로 (레퍼런스: 수묵 우경도)
const sceneFilter = computed(() => {
  if (props.status === '비') return 'saturate(.45) brightness(.92)'
  if (props.status === '뇌우') return 'saturate(.35) brightness(.8)'
  if (props.status === '흐림') return 'saturate(.55)'
  return 'none'
})

const showRain = computed(() => props.status === '비' || props.status === '뇌우')
const showSnow = computed(() => props.status === '눈')
const showClouds = computed(() =>
  ['구름', '흐림', '바람', '비', '뇌우', '눈'].includes(props.status),
)
const showSunny = computed(() => props.status === '맑음' && props.isDay)
const showStars = computed(() => !props.isDay && ['맑음', '구름'].includes(props.status))
// 잉어는 물결이 잔잔한 낮에만 뛰어오른다 (어해도 차용)
const showCarp = computed(() => props.isDay && ['맑음', '구름', '바람'].includes(props.status))
// 바람이 세면 가지가 크게 흔들린다
const branchSway = computed(() => (['바람', '뇌우'].includes(props.status) ? '2.6s' : '7.5s'))
const branchAngle = computed(() => (['바람', '뇌우'].includes(props.status) ? '2.2deg' : '0.8deg'))

// 입자류는 마운트 시 1회 생성해 고정 (리렌더마다 흔들리지 않게)
const rand = (a, b) => a + Math.random() * (b - a)
const drops = Array.from({ length: 46 }, () => ({
  left: rand(0, 100) + '%',
  duration: rand(0.9, 1.7) + 's',
  delay: -rand(0, 2) + 's',
  opacity: rand(0.3, 0.75),
}))
const flakes = Array.from({ length: 34 }, () => ({
  left: rand(0, 100) + '%',
  duration: rand(6, 12) + 's',
  delay: -rand(0, 10) + 's',
  size: rand(3, 6) + 'px',
  sway: rand(1.8, 3.2) + 's',
}))
const petals = Array.from({ length: 14 }, () => ({
  left: rand(0, 100) + '%',
  duration: rand(7, 13) + 's',
  delay: -rand(0, 12) + 's',
  sway: rand(1.6, 3) + 's',
  deep: Math.random() < 0.4,
}))
const motes = Array.from({ length: 10 }, () => ({
  left: rand(35, 92) + '%',
  top: rand(8, 60) + '%',
  duration: rand(2.5, 5.5) + 's',
  delay: -rand(0, 4) + 's',
}))
const stars = Array.from({ length: 40 }, () => ({
  left: rand(0, 100) + '%',
  top: rand(2, 50) + '%',
  duration: rand(2, 5) + 's',
  delay: -rand(0, 5) + 's',
  size: rand(1.5, 3) + 'px',
}))
const clouds = Array.from({ length: 3 }, (_, i) => ({
  top: 8 + i * 14 + rand(0, 6) + '%',
  duration: rand(46, 80) + 's',
  delay: -rand(0, 60) + 's',
  scale: rand(0.7, 1.25),
}))
// 산허리를 지나는 안개 띠 — 정지된 산에 깊이를 만든다
const mists = Array.from({ length: 4 }, (_, i) => ({
  bottom: 17 + i * 8 + rand(0, 4) + '%',
  height: rand(18, 34) + 'px',
  duration: rand(34, 58) + 's',
  delay: -rand(0, 40) + 's',
  opacity: rand(0.18, 0.42),
}))
</script>

<template>
  <div class="scene" :style="{ filter: sceneFilter }">
    <!-- 하늘 -->
    <div class="sky" :style="{ background: sky }"></div>

    <!-- 별 (맑은 밤) -->
    <template v-if="showStars">
      <span
        v-for="(s, i) in stars"
        :key="'st' + i"
        class="star"
        :style="{
          left: s.left,
          top: s.top,
          width: s.size,
          height: s.size,
          animationDuration: s.duration,
          animationDelay: s.delay,
        }"
      ></span>
    </template>

    <!-- 해 / 달 — 오봉도의 붉은 해와 흰 달. 후광이 천천히 숨쉰다 -->
    <div class="orb-wrap">
      <div v-if="isDay" class="halo"></div>
      <div class="orb" :class="isDay ? 'sun' : 'moon'"></div>
    </div>

    <!-- 구름문 -->
    <template v-if="showClouds">
      <svg
        v-for="(c, i) in clouds"
        :key="'cl' + i"
        class="cloud"
        viewBox="0 0 220 90"
        :style="{
          top: c.top,
          animationDuration: c.duration,
          animationDelay: c.delay,
          '--s': c.scale,
        }"
      >
        <path
          d="M40 70 a30 30 0 0 1 58 0 a24 24 0 0 1 44 10 a20 20 0 0 1 -16 32 l-104 0 a26 26 0 0 1 18 -42"
          transform="translate(0,-30)"
          fill="rgba(251,246,234,.85)"
        />
      </svg>
    </template>

    <!-- 햇살 광선 (맑은 낮) -->
    <div v-if="showSunny" class="rays"></div>

    <!-- 다섯 봉우리 — 오봉도의 청록 산. 폭포가 실제로 떨어진다 -->
    <svg class="peaks" viewBox="0 0 1200 420" preserveAspectRatio="xMidYMax slice">
      <defs>
        <clipPath id="mh-fall-a">
          <path d="M470 420 L480 250 L500 250 L494 420 Z" />
        </clipPath>
        <clipPath id="mh-fall-b">
          <path d="M715 420 L725 260 L743 260 L738 420 Z" />
        </clipPath>
      </defs>
      <g>
        <path d="M-40 420 L120 150 L300 420 Z" fill="#3f7d52" />
        <path d="M180 420 L360 90 L560 420 Z" fill="#356b46" />
        <path d="M420 420 L600 40 L790 420 Z" fill="#3f7d52" />
        <path d="M650 420 L840 90 L1030 420 Z" fill="#356b46" />
        <path d="M900 420 L1080 150 L1250 420 Z" fill="#3f7d52" />
        <!-- 능선의 청색 준법(주름) 선 — 먹이 마르고 배는 호흡 -->
        <g class="gyeon" stroke="#2f567a" stroke-width="5" fill="none">
          <path d="M360 90 L330 200 M360 90 L395 210 M360 130 L340 250" />
          <path d="M600 40 L565 180 M600 40 L640 190 M600 90 L575 260" />
          <path d="M840 90 L810 200 M840 90 L875 210 M840 130 L820 250" />
          <path d="M120 150 L95 260 M120 150 L150 270" />
          <path d="M1080 150 L1055 260 M1080 150 L1110 270" />
        </g>

        <!-- 폭포 : 물기둥 + 그 안을 흐르는 물줄기 -->
        <g clip-path="url(#mh-fall-a)">
          <rect x="466" y="245" width="40" height="180" fill="rgba(251,246,234,.85)" />
          <g class="stream">
            <rect
              v-for="n in 6"
              :key="'fa' + n"
              x="472"
              :y="245 + (n - 1) * 32"
              width="5"
              height="18"
              fill="#fff"
              opacity=".6"
            />
            <rect
              v-for="n in 6"
              :key="'fa2' + n"
              x="487"
              :y="261 + (n - 1) * 32"
              width="4"
              height="14"
              fill="#cfe0ee"
              opacity=".7"
            />
          </g>
        </g>
        <g clip-path="url(#mh-fall-b)">
          <rect x="712" y="255" width="36" height="170" fill="rgba(251,246,234,.85)" />
          <g class="stream slow">
            <rect
              v-for="n in 6"
              :key="'fb' + n"
              x="719"
              :y="255 + (n - 1) * 32"
              width="5"
              height="18"
              fill="#fff"
              opacity=".6"
            />
            <rect
              v-for="n in 6"
              :key="'fb2' + n"
              x="732"
              :y="271 + (n - 1) * 32"
              width="4"
              height="14"
              fill="#cfe0ee"
              opacity=".7"
            />
          </g>
        </g>
        <!-- 폭포 아래 물보라 -->
        <g class="spray">
          <ellipse cx="484" cy="416" rx="26" ry="7" fill="rgba(251,246,234,.5)" />
          <ellipse cx="729" cy="418" rx="24" ry="6" fill="rgba(251,246,234,.5)" />
        </g>
      </g>
    </svg>

    <!-- 산허리 안개 -->
    <div
      v-for="(m, i) in mists"
      :key="'mi' + i"
      class="mist"
      :style="{
        bottom: m.bottom,
        height: m.height,
        opacity: m.opacity,
        animationDuration: m.duration,
        animationDelay: m.delay,
      }"
    ></div>

    <!-- 물결 — 오봉도 하단의 비늘 파도가 실제로 흐른다 -->
    <div class="waves">
      <div class="wave back"></div>
      <div class="wave front"></div>
      <div class="foam"></div>
    </div>

    <!-- 잉어 — 이따금 물 밖으로 솟구친다 -->
    <template v-if="showCarp">
      <div class="ripple"></div>
      <div class="carp">
        <svg viewBox="0 0 88 44">
          <g class="fin-tail">
            <path d="M14 22 Q4 9 6 4 Q18 11 22 18 Z" fill="#b23a26" />
            <path d="M14 22 Q4 35 6 40 Q18 33 22 26 Z" fill="#d1543c" />
          </g>
          <ellipse cx="48" cy="22" rx="30" ry="11.5" fill="#fbf6ea" />
          <path d="M32 12 Q48 3 60 12 Q48 15 32 12 Z" fill="#b23a26" />
          <path d="M36 20 a11 8 0 0 1 20 -3 a13 9 0 0 1 -20 3 Z" fill="#ce9b3b" />
          <path class="fin-pec" d="M58 26 q9 7 3 11 q-9 -2 -11 -9 Z" fill="#d1543c" />
          <path d="M30 12 v20" stroke="rgba(34,28,22,.16)" stroke-width="1.6" fill="none" />
          <circle cx="69" cy="18" r="2.4" fill="#221c16" />
          <path d="M76 22 q5 3 1 6" stroke="#221c16" stroke-width="1.3" fill="none" />
        </svg>
      </div>
    </template>

    <!-- 매화가지 + 까치 (좌상단) — 가지는 흔들리고 까치는 깃을 턴다 -->
    <svg
      class="branch"
      viewBox="0 0 420 200"
      :style="{ '--sway-dur': branchSway, '--sway-deg': branchAngle }"
    >
      <path
        d="M-10 60 C120 30 210 70 330 45 M330 45 C360 40 390 46 415 55"
        stroke="#4a3a2a"
        stroke-width="11"
        fill="none"
      />
      <g class="blossoms" fill="#e8a5b0">
        <circle cx="90" cy="48" r="13" />
        <circle cx="180" cy="60" r="11" />
        <circle cx="255" cy="47" r="12" />
        <circle cx="345" cy="50" r="10" />
      </g>
      <g fill="#b23a26">
        <circle cx="90" cy="48" r="4.5" />
        <circle cx="180" cy="60" r="4" />
        <circle cx="255" cy="47" r="4.5" />
        <circle cx="345" cy="50" r="3.5" />
      </g>
      <!-- 까치 -->
      <g transform="translate(120,8)">
        <g class="magpie">
          <g class="tail">
            <path d="M28 40 L64 30 L69 36 L32 46 Z" fill="#221c16" />
          </g>
          <ellipse cx="22" cy="36" rx="16" ry="10" fill="#221c16" />
          <ellipse cx="18" cy="40" rx="9" ry="5.5" fill="#fbf6ea" />
          <g class="head">
            <circle cx="6" cy="28" r="7" fill="#221c16" />
            <path d="M-1 28 L-8 30 L-1 32 Z" fill="#ce9b3b" />
            <circle class="eye" cx="4" cy="26" r="1.3" fill="#fbf6ea" />
          </g>
          <g class="wing">
            <path d="M20 30 Q28 20 38 22 Q30 30 24 33 Z" fill="#2f567a" />
          </g>
        </g>
      </g>
    </svg>

    <!-- 빗줄기 + 뇌우 섬광 -->
    <template v-if="showRain">
      <span
        v-for="(d, i) in drops"
        :key="'d' + i"
        class="drop"
        :style="{
          left: d.left,
          animationDuration: d.duration,
          animationDelay: d.delay,
          opacity: d.opacity,
        }"
      ></span>
      <div v-if="status === '뇌우'" class="flash"></div>
    </template>

    <!-- 눈송이 -->
    <template v-if="showSnow">
      <span
        v-for="(f, i) in flakes"
        :key="'f' + i"
        class="flake-wrap"
        :style="{
          left: f.left,
          animationDuration: f.duration,
          animationDelay: f.delay,
        }"
      >
        <span
          class="flake"
          :style="{ width: f.size, height: f.size, animationDuration: f.sway }"
        ></span>
      </span>
    </template>

    <!-- 맑은 날: 꽃잎·나비·티끌 -->
    <template v-if="showSunny">
      <span
        v-for="(p, i) in petals"
        :key="'p' + i"
        class="petal-wrap"
        :style="{
          left: p.left,
          animationDuration: p.duration,
          animationDelay: p.delay,
        }"
      >
        <span class="petal" :class="{ deep: p.deep }" :style="{ animationDuration: p.sway }"></span>
      </span>
      <span
        v-for="(m, i) in motes"
        :key="'m' + i"
        class="mote"
        :style="{
          left: m.left,
          top: m.top,
          animationDuration: m.duration,
          animationDelay: m.delay,
        }"
      ></span>
      <div class="butterfly">
        <svg viewBox="0 0 54 44">
          <g class="wl">
            <path d="M27 24 Q10 4 3 12 Q2 24 20 26 Z" fill="#ce9b3b" />
            <path d="M27 24 Q12 38 6 33 Q6 26 20 25 Z" fill="#b23a26" />
          </g>
          <g class="wr">
            <path d="M27 24 Q44 4 51 12 Q52 24 34 26 Z" fill="#ce9b3b" />
            <path d="M27 24 Q42 38 48 33 Q48 26 34 25 Z" fill="#b23a26" />
          </g>
          <ellipse cx="27" cy="24" rx="3" ry="9" fill="#221c16" />
        </svg>
      </div>
    </template>

    <slot></slot>
  </div>
</template>

<style scoped>
.scene {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 420px;
  overflow: hidden;
  transition: filter 1.2s ease;
}
.sky {
  position: absolute;
  inset: 0;
  transition: background 1.2s ease;
}

.star {
  position: absolute;
  border-radius: 50%;
  background: #fbf6ea;
  animation: twinkle ease-in-out infinite;
}

/* ── 해 / 달 ─────────────────────────────────────────── */
.orb-wrap {
  position: absolute;
  right: 12%;
  top: 10%;
  width: clamp(52px, 7vw, 84px);
  aspect-ratio: 1;
}
.orb {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  transition:
    background 1.2s ease,
    box-shadow 1.2s ease;
}
.orb.sun {
  background: #b23a26;
  box-shadow: 0 0 46px 10px rgba(206, 155, 59, 0.45);
  animation: sunPulse 6s ease-in-out infinite;
}
.orb.moon {
  background: #fbf6ea;
  box-shadow: 0 0 40px 8px rgba(251, 246, 234, 0.3);
  animation: moonPulse 9s ease-in-out infinite;
}
@keyframes sunPulse {
  0%,
  100% {
    box-shadow: 0 0 40px 8px rgba(206, 155, 59, 0.38);
  }
  50% {
    box-shadow: 0 0 66px 16px rgba(206, 155, 59, 0.6);
  }
}
@keyframes moonPulse {
  0%,
  100% {
    box-shadow: 0 0 34px 6px rgba(251, 246, 234, 0.24);
  }
  50% {
    box-shadow: 0 0 52px 12px rgba(251, 246, 234, 0.42);
  }
}
/* 후광 — 오봉도 해 둘레의 서기(瑞氣) */
.halo {
  position: absolute;
  inset: -55%;
  border-radius: 50%;
  border: 1px solid rgba(206, 155, 59, 0.35);
  animation: haloOut 5.5s ease-out infinite;
}
@keyframes haloOut {
  0% {
    transform: scale(0.62);
    opacity: 0.75;
  }
  100% {
    transform: scale(1.25);
    opacity: 0;
  }
}

/* ── 구름문 ─────────────────────────────────────────── */
.cloud {
  position: absolute;
  left: -260px;
  width: clamp(140px, 18vw, 220px);
  animation: drift linear infinite;
}
@keyframes drift {
  from {
    transform: translateX(0) translateY(0) scale(var(--s, 1));
  }
  50% {
    transform: translateX(calc((100vw + 520px) / 2)) translateY(-10px) scale(var(--s, 1));
  }
  to {
    transform: translateX(calc(100vw + 520px)) translateY(0) scale(var(--s, 1));
  }
}

.rays {
  position: absolute;
  inset: -20%;
  pointer-events: none;
  background:
    linear-gradient(115deg, transparent 44%, rgba(255, 244, 214, 0.4) 48%, transparent 54%),
    linear-gradient(115deg, transparent 64%, rgba(255, 244, 214, 0.28) 68%, transparent 74%);
  mix-blend-mode: overlay;
  animation: breathe 7s ease-in-out infinite;
}
@keyframes breathe {
  0%,
  100% {
    opacity: 0.5;
    transform: translateX(0);
  }
  50% {
    opacity: 1;
    transform: translateX(-24px);
  }
}

/* ── 다섯 봉우리 ─────────────────────────────────────── */
.peaks {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 12%;
  height: 55%;
}
/* 준법 선의 먹 농담이 천천히 오간다 */
.gyeon {
  animation: inkBreath 11s ease-in-out infinite;
}
@keyframes inkBreath {
  0%,
  100% {
    opacity: 0.55;
  }
  50% {
    opacity: 0.85;
  }
}
/* 폭포 물줄기 — 타일 간격(32)만큼 내려가고 되돌아 무한 반복 */
.stream {
  animation: stream 1.1s linear infinite;
}
.stream.slow {
  animation-duration: 1.5s;
}
@keyframes stream {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(32px);
  }
}
.spray {
  animation: spray 2.4s ease-in-out infinite;
  transform-box: fill-box;
  transform-origin: 50% 100%;
}
@keyframes spray {
  0%,
  100% {
    opacity: 0.35;
    transform: scaleX(0.92);
  }
  50% {
    opacity: 0.75;
    transform: scaleX(1.08);
  }
}

/* ── 산허리 안개 ─────────────────────────────────────── */
.mist {
  position: absolute;
  left: 0;
  width: 46%;
  pointer-events: none;
  border-radius: 50%;
  background: radial-gradient(
    ellipse at center,
    rgba(251, 246, 234, 0.95),
    rgba(251, 246, 234, 0) 70%
  );
  filter: blur(7px);
  animation: mistDrift linear infinite;
}
@keyframes mistDrift {
  from {
    transform: translateX(-110%);
  }
  to {
    transform: translateX(320%);
  }
}

/* ── 비늘 파도 — 두 겹이 서로 다른 속도로 흐른다 ───────── */
.waves {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 15%;
  overflow: hidden;
  background-color: #2f567a;
}
.wave {
  position: absolute;
  inset: -6px 0;
}
.wave.back {
  --tile: 120px;
  background-image:
    radial-gradient(circle at 50% 0, #35608a 0 26%, transparent 27%),
    radial-gradient(circle at 0 55%, #204058 0 26%, transparent 27%),
    radial-gradient(circle at 100% 55%, #204058 0 26%, transparent 27%);
  background-size: 120px 84px;
  opacity: 0.85;
  animation:
    waveShift 17s linear infinite reverse,
    bob 7s ease-in-out infinite alternate;
}
.wave.front {
  --tile: 84px;
  background-image:
    radial-gradient(circle at 50% 0, #3d6a94 0 26%, transparent 27%),
    radial-gradient(circle at 0 55%, #24435f 0 26%, transparent 27%),
    radial-gradient(circle at 100% 55%, #24435f 0 26%, transparent 27%);
  background-size: 84px 60px;
  animation:
    waveShift 9s linear infinite,
    bob 4.5s ease-in-out infinite alternate;
}
@keyframes waveShift {
  from {
    background-position: 0 0;
  }
  to {
    background-position: var(--tile) 0;
  }
}
@keyframes bob {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-4px);
  }
}
/* 물마루의 흰 선 */
.foam {
  position: absolute;
  left: -10%;
  right: -10%;
  top: 0;
  height: 4px;
  background: repeating-linear-gradient(
    90deg,
    rgba(251, 246, 234, 0.65) 0 26px,
    transparent 26px 84px
  );
  animation: foamShift 6s linear infinite;
}
@keyframes foamShift {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(84px);
  }
}

/* ── 잉어 ────────────────────────────────────────────── */
.carp {
  position: absolute;
  left: 30%;
  bottom: 11%;
  width: clamp(56px, 7vw, 88px);
  pointer-events: none;
  animation: leap 15s ease-in-out infinite;
}
@keyframes leap {
  0%,
  60% {
    transform: translate(0, 46px) rotate(-72deg) scale(0.6);
    opacity: 0;
  }
  64% {
    transform: translate(8px, -6px) rotate(-48deg) scale(1);
    opacity: 1;
  }
  70% {
    transform: translate(44px, -54px) rotate(-12deg) scale(1);
    opacity: 1;
  }
  76% {
    transform: translate(88px, -50px) rotate(24deg) scale(1);
    opacity: 1;
  }
  82% {
    transform: translate(124px, 2px) rotate(66deg) scale(1);
    opacity: 1;
  }
  87%,
  100% {
    transform: translate(138px, 48px) rotate(86deg) scale(0.6);
    opacity: 0;
  }
}
.carp .fin-tail {
  transform-box: fill-box;
  transform-origin: 100% 50%;
  animation: swish 0.35s ease-in-out infinite alternate;
}
.carp .fin-pec {
  transform-box: fill-box;
  transform-origin: 0% 0%;
  animation: swish 0.5s ease-in-out infinite alternate;
}
@keyframes swish {
  from {
    transform: rotate(-11deg);
  }
  to {
    transform: rotate(11deg);
  }
}
/* 입수·출수 지점의 파문 */
.ripple {
  position: absolute;
  left: 30%;
  bottom: 12%;
  width: 46px;
  height: 12px;
  margin-left: -8px;
  border: 1.5px solid rgba(251, 246, 234, 0.75);
  border-radius: 50%;
  opacity: 0;
  animation: ripple 15s linear infinite;
}
@keyframes ripple {
  0%,
  61%,
  72%,
  85%,
  100% {
    opacity: 0;
    transform: scale(0.4);
  }
  63% {
    opacity: 0.8;
    transform: scale(0.6) translateX(0);
  }
  70% {
    opacity: 0;
    transform: scale(1.8) translateX(0);
  }
  87% {
    opacity: 0.8;
    transform: scale(0.6) translateX(130px);
  }
  95% {
    opacity: 0;
    transform: scale(1.9) translateX(130px);
  }
}

/* ── 매화가지 · 까치 ─────────────────────────────────── */
.branch {
  position: absolute;
  left: 0;
  top: 2%;
  width: clamp(220px, 34vw, 420px);
  transform-origin: 0% 25%;
  animation: branchSway var(--sway-dur, 7.5s) ease-in-out infinite alternate;
}
@keyframes branchSway {
  from {
    transform: rotate(calc(var(--sway-deg, 0.8deg) * -1));
  }
  to {
    transform: rotate(var(--sway-deg, 0.8deg));
  }
}
.blossoms circle {
  transform-box: fill-box;
  transform-origin: 50% 50%;
  animation: bloom 4.5s ease-in-out infinite alternate;
}
.blossoms circle:nth-child(2) {
  animation-duration: 5.6s;
  animation-delay: -1.4s;
}
.blossoms circle:nth-child(3) {
  animation-duration: 3.9s;
  animation-delay: -2.6s;
}
.blossoms circle:nth-child(4) {
  animation-duration: 6.2s;
  animation-delay: -0.8s;
}
@keyframes bloom {
  from {
    transform: scale(0.92);
  }
  to {
    transform: scale(1.06);
  }
}

/* 까치 — 4.5초에 한 번 깃을 털고 폴짝 */
.magpie {
  transform-box: fill-box;
  transform-origin: 50% 90%;
  animation: magpieHop 6.5s ease-in-out infinite;
}
@keyframes magpieHop {
  0%,
  70%,
  100% {
    transform: translate(0, 0) rotate(0deg);
  }
  74% {
    transform: translate(1px, -7px) rotate(-4deg);
  }
  79% {
    transform: translate(3px, 0) rotate(2deg);
  }
  83% {
    transform: translate(1px, -2px) rotate(0deg);
  }
}
.magpie .tail {
  transform-box: fill-box;
  transform-origin: 0% 60%;
  animation: tailFlick 6.5s ease-in-out infinite;
}
@keyframes tailFlick {
  0%,
  60%,
  100% {
    transform: rotate(0deg);
  }
  66% {
    transform: rotate(7deg);
  }
  73% {
    transform: rotate(-4deg);
  }
  80% {
    transform: rotate(3deg);
  }
}
.magpie .head {
  transform-box: fill-box;
  transform-origin: 90% 70%;
  animation: headTurn 6.5s ease-in-out infinite;
}
@keyframes headTurn {
  0%,
  28%,
  100% {
    transform: rotate(0deg);
  }
  36%,
  48% {
    transform: rotate(-9deg);
  }
  58% {
    transform: rotate(4deg);
  }
}
.magpie .wing {
  transform-box: fill-box;
  transform-origin: 10% 90%;
  animation: wingTwitch 6.5s ease-in-out infinite;
}
@keyframes wingTwitch {
  0%,
  71%,
  100% {
    transform: rotate(0deg) scaleY(1);
  }
  75% {
    transform: rotate(-16deg) scaleY(1.15);
  }
  80% {
    transform: rotate(4deg) scaleY(1);
  }
}
.magpie .eye {
  transform-box: fill-box;
  transform-origin: 50% 50%;
  animation: blink 5.3s linear infinite;
}
@keyframes blink {
  0%,
  95%,
  100% {
    transform: scaleY(1);
  }
  97% {
    transform: scaleY(0.1);
  }
}

/* ── 날씨 입자 ───────────────────────────────────────── */
.drop {
  position: absolute;
  top: -8%;
  width: 2px;
  height: 34px;
  background: linear-gradient(180deg, transparent, rgba(251, 246, 234, 0.75));
  transform: rotate(8deg);
  animation: fall linear infinite;
}
@keyframes fall {
  to {
    transform: translateY(115vh) rotate(8deg);
  }
}
.flash {
  position: absolute;
  inset: 0;
  background: rgba(251, 246, 234, 0.9);
  opacity: 0;
  animation: flash 7s linear infinite;
  pointer-events: none;
}
@keyframes flash {
  0%,
  91%,
  95%,
  100% {
    opacity: 0;
  }
  92%,
  94% {
    opacity: 0.55;
  }
  93% {
    opacity: 0.15;
  }
}

.flake-wrap {
  position: absolute;
  top: -6%;
  animation: fallSlow linear infinite;
}
@keyframes fallSlow {
  to {
    transform: translateY(112vh);
  }
}
.flake {
  display: block;
  border-radius: 50%;
  background: rgba(251, 246, 234, 0.9);
  animation: sway ease-in-out infinite alternate;
}

.petal-wrap {
  position: absolute;
  top: -6%;
  animation: fallSlow linear infinite;
}
.petal {
  display: block;
  width: 13px;
  height: 9px;
  background: #e8a5b0;
  border-radius: 60% 40% 55% 45%;
  animation: swayRot ease-in-out infinite alternate;
}
.petal.deep {
  background: #d97f8f;
}
@keyframes sway {
  from {
    transform: translateX(-16px);
  }
  to {
    transform: translateX(16px);
  }
}
@keyframes swayRot {
  from {
    transform: translateX(-26px) rotate(-30deg);
  }
  to {
    transform: translateX(26px) rotate(40deg);
  }
}

.mote {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(255, 240, 200, 0.95);
  box-shadow: 0 0 8px 2px rgba(206, 155, 59, 0.5);
  animation: twinkle ease-in-out infinite;
}
@keyframes twinkle {
  0%,
  100% {
    opacity: 0;
    transform: translateY(0);
  }
  50% {
    opacity: 1;
    transform: translateY(-12px);
  }
}

.butterfly {
  position: absolute;
  top: 0;
  left: 0;
  width: 48px;
  offset-path: path(
    'M 180 300 C 380 180, 520 380, 700 260 C 850 170, 950 320, 1080 240 C 950 380, 700 420, 500 360 C 360 320, 240 380, 180 300'
  );
  offset-rotate: auto;
  animation: flutterPath 26s ease-in-out infinite;
}
@keyframes flutterPath {
  from {
    offset-distance: 0%;
  }
  to {
    offset-distance: 100%;
  }
}
.butterfly .wl,
.butterfly .wr {
  transform-origin: 27px 24px;
}
.butterfly .wl {
  animation: wing 0.22s ease-in-out infinite alternate;
}
.butterfly .wr {
  animation: wing 0.22s ease-in-out infinite alternate-reverse;
}
@keyframes wing {
  from {
    transform: scaleY(1);
  }
  to {
    transform: scaleY(0.35);
  }
}

/* 모션 최소화 — 화폭은 정지된 민화로 되돌아간다 */
@media (prefers-reduced-motion: reduce) {
  .drop,
  .flake-wrap,
  .petal-wrap,
  .mist,
  .carp,
  .ripple,
  .halo {
    display: none;
  }
  .butterfly {
    offset-distance: 30%;
  }
}
</style>
