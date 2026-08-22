<script setup>
// 서당 — 김홍도 「서당」 차용
// 훈장님은 회초리를 들고, 종아리 맞은 아이는 눈물을 훔치고, 학동들은 킥킥댄다
const students = [
  { x: 74, y: 250, c: '#f5eedd', d: 0.2, giggle: true },
  { x: 148, y: 300, c: '#dbe4ea', d: 0.8, giggle: false },
  { x: 66, y: 366, c: '#c3d0c0', d: 1.3, giggle: true },
  { x: 590, y: 244, c: '#f5eedd', d: 0.5, giggle: false },
  { x: 660, y: 300, c: '#dbe4ea', d: 1.0, giggle: true },
  { x: 586, y: 366, c: '#f5eedd', d: 1.6, giggle: false },
  { x: 654, y: 428, c: '#c3d0c0', d: 0.3, giggle: true },
]
</script>

<template>
  <svg class="seodang" viewBox="0 0 800 620" aria-label="서당 — 훈장님과 학동들">
    <!-- ══ 훈장님 (상단 중앙) ══ -->
    <g transform="translate(316,52)">
      <g class="master">
        <!-- 도포 -->
        <path d="M20 66 q46 -26 92 0 q20 44 10 96 l-112 0 q-10 -52 10 -96 Z" fill="#e8dfc8" class="inkline" />
        <!-- 옷고름 -->
        <path d="M62 84 q4 20 -2 34 M70 84 q6 18 2 34" stroke="#4a5f7a" stroke-width="4" fill="none" />
        <!-- 얼굴 + 수염 -->
        <circle cx="66" cy="44" r="19" fill="#eccfa5" class="inkline" />
        <path d="M56 56 q10 14 20 0 q-4 18 -10 18 q-6 0 -10 -18 Z" fill="#ded4c2" class="inkline" />
        <path d="M58 42 q3 2 6 2 M74 42 q3 2 6 2" class="ink w2" />
        <path d="M56 38 q4 -4 8 -2 M72 36 q4 -2 8 2" class="ink w2" />
        <!-- 정자관 -->
        <path d="M50 30 l4 -26 h24 l4 26 Z M46 30 h40 M54 12 h24" fill="#221c16" stroke="#221c16" stroke-width="3" />
        <!-- 왼팔 : 책상을 짚는다 -->
        <path d="M32 92 q-12 20 -10 38" class="ink w5" />
        <!-- 회초리 팔 -->
        <g class="switch-arm">
          <path d="M102 88 q22 -8 34 -26" class="ink w5" />
          <path d="M134 64 L176 -14" class="ink w3" />
        </g>
      </g>
      <!-- 서안 (책상) -->
      <g transform="translate(-24,158)">
        <rect x="0" y="0" width="180" height="12" rx="3" fill="#8a6a44" class="inkline" />
        <path d="M16 12 l-8 30 M164 12 l8 30 M30 12 l0 26 M150 12 l0 26" class="ink w4" />
        <rect x="52" y="-14" width="52" height="14" rx="2" fill="#4a5f7a" class="inkline" />
      </g>
    </g>

    <!-- ══ 우는 아이 (중앙 앞) ══ -->
    <g transform="translate(318,318)">
      <g class="crier">
        <path d="M16 48 q30 -18 60 0 q14 34 6 72 l-72 0 q-8 -38 6 -72 Z" fill="#f5eedd" class="inkline" />
        <circle cx="46" cy="32" r="17" fill="#eccfa5" class="inkline" />
        <!-- 댕기머리 -->
        <path d="M34 20 q12 -10 24 0 l-2 -8 h-20 Z" fill="#221c16" />
        <path d="M46 14 q0 -10 5 -12 q4 8 -1 12" fill="#221c16" />
        <!-- 우는 얼굴 : 찡그린 눈, 벌린 입 -->
        <path d="M38 30 q4 -3 7 0 M52 30 q4 -3 7 0" class="ink w2" />
        <path d="M42 42 q5 5 10 0 q-3 6 -5 6 q-3 0 -5 -6 Z" fill="#b23a26" class="ink w2" />
        <!-- 눈물 훔치는 팔 : 눈가로 올라갔다 내려온다 -->
        <g class="wipe-arm">
          <path d="M70 62 q-6 -22 -18 -30" class="ink w5" />
          <path d="M52 32 q-4 -2 -8 0" class="ink w4" />
        </g>
        <!-- 반대팔은 대님을 만진다 -->
        <path d="M20 66 q-8 18 -2 34" class="ink w5" />
        <!-- 눈물방울 -->
        <g class="tears">
          <circle cx="36" cy="44" r="3" fill="#7d97b5" />
          <circle cx="58" cy="46" r="2.6" fill="#7d97b5" />
        </g>
      </g>
      <!-- 바닥에 펼쳐진 책 -->
      <g transform="translate(-64,104)">
        <path d="M0 10 q20 -12 40 0 l0 26 q-20 -10 -40 0 Z M40 10 q20 -12 40 0 l0 26 q-20 -10 -40 0 Z" fill="#f5eedd" class="inkline" />
        <path d="M10 14 h20 M10 22 h20 M50 14 h20 M50 22 h20" class="ink w2" opacity=".5" />
      </g>
    </g>

    <!-- ══ 학동들 (양쪽) ══ -->
    <g v-for="(s, i) in students" :key="i" :transform="`translate(${s.x},${s.y})`">
      <g class="student" :class="{ giggle: s.giggle }" :style="{ animationDelay: s.d + 's' }">
        <path d="M6 30 q22 -14 44 0 q10 24 4 48 l-52 0 q-6 -24 4 -48 Z" :fill="s.c" class="inkline" />
        <circle cx="28" cy="18" r="13" fill="#eccfa5" class="inkline" />
        <path d="M18 8 q10 -8 20 0 l-2 -8 h-16 Z" fill="#221c16" />
        <path d="M28 2 q0 -8 4 -10 q3 6 -1 10" fill="#221c16" />
        <!-- 웃는 눈 -->
        <path v-if="s.giggle" d="M21 17 q3 3 6 0 M33 17 q3 3 6 0" class="ink w2" />
        <path v-else d="M22 17 q2 2 4 2 M33 17 q2 2 4 2" class="ink w2" />
        <!-- 입 가리고 킥킥 -->
        <g v-if="s.giggle" class="cover">
          <path d="M46 40 q-8 -12 -16 -14" class="ink w4" />
        </g>
        <path v-else d="M24 26 q4 3 8 0" class="ink w2" />
        <!-- 무릎 위 책 -->
        <path d="M10 62 q18 -8 36 0 l0 12 q-18 -6 -36 0 Z" fill="#f5eedd" class="inkline" />
      </g>
    </g>

    <!-- 낙관 -->
    <g transform="translate(30,552)">
      <rect width="34" height="34" rx="3" fill="#b23a26" opacity=".85" />
      <path d="M8 8 h18 M8 17 h18 M8 26 h12 M17 8 v18" stroke="#f1e7d0" stroke-width="2.4" />
    </g>
  </svg>
</template>

<style scoped>
.seodang {
  display: block;
  width: 100%;
  height: 100%;
}
.ink {
  stroke: #3a2f24;
  fill: none;
  stroke-linecap: round;
}
.w2 { stroke-width: 2; }
.w3 { stroke-width: 3; }
.w4 { stroke-width: 4; }
.w5 { stroke-width: 5.5; }
.inkline {
  stroke: #3a2f24;
  stroke-width: 3;
}

/* 훈장님 — 몸을 앞뒤로 흔들며 회초리를 든다 */
.master {
  transform-box: fill-box;
  transform-origin: 50% 92%;
  animation: masterRock 4.5s ease-in-out infinite;
}
@keyframes masterRock {
  0%, 100% { transform: rotate(-1deg); }
  50% { transform: rotate(1.6deg); }
}
.switch-arm {
  transform-box: fill-box;
  transform-origin: 6% 92%;
  animation: switchWave 4.5s ease-in-out infinite;
}
@keyframes switchWave {
  0%, 55%, 100% { transform: rotate(0deg); }
  65% { transform: rotate(-24deg); } /* 회초리를 치켜든다 */
  72% { transform: rotate(-18deg); }
  80% { transform: rotate(6deg); } /* 내려친다 (허공에) */
  86% { transform: rotate(-4deg); }
}

/* 우는 아이 — 어깨를 들썩이며 눈물을 훔친다 */
.crier {
  transform-box: fill-box;
  transform-origin: 50% 95%;
  animation: sob 1.4s ease-in-out infinite;
}
@keyframes sob {
  0%, 100% { transform: rotate(-1.2deg) translateY(0); }
  30% { transform: rotate(0.6deg) translateY(-3px); }
  55% { transform: rotate(-0.4deg) translateY(0); }
  70% { transform: rotate(0.8deg) translateY(-2px); }
}
.wipe-arm {
  transform-box: fill-box;
  transform-origin: 95% 95%;
  animation: wipe 2.8s ease-in-out infinite;
}
@keyframes wipe {
  0%, 100% { transform: rotate(4deg); }
  35% { transform: rotate(-14deg); } /* 눈가로 */
  48% { transform: rotate(-10deg); }
  58% { transform: rotate(-16deg); } /* 비빈다 */
  75% { transform: rotate(2deg); }
}
.tears circle {
  animation: tearFall 2.8s ease-in infinite;
}
.tears circle:nth-child(2) {
  animation-delay: -1.3s;
}
@keyframes tearFall {
  0%, 20% { opacity: 0; transform: translateY(0); }
  30% { opacity: 0.9; }
  70% { opacity: 0; transform: translateY(26px); }
  100% { opacity: 0; }
}

/* 학동들 — 몸을 흔들고, 웃는 아이는 입을 가린다 */
.student {
  transform-box: fill-box;
  transform-origin: 50% 95%;
  animation: rock 3.2s ease-in-out infinite;
}
.student.giggle {
  animation: giggle 1.8s ease-in-out infinite;
}
@keyframes rock {
  0%, 100% { transform: rotate(-1.4deg); }
  50% { transform: rotate(1.8deg); }
}
@keyframes giggle {
  0%, 100% { transform: rotate(-2deg) translateY(0); }
  25% { transform: rotate(1.5deg) translateY(-2.5px); }
  50% { transform: rotate(-1deg) translateY(0); }
  75% { transform: rotate(2deg) translateY(-2px); }
}
.cover {
  transform-box: fill-box;
  transform-origin: 90% 95%;
  animation: coverMouth 1.8s ease-in-out infinite;
}
@keyframes coverMouth {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-7deg); }
}

@media (prefers-reduced-motion: reduce) {
  .seodang * {
    animation: none !important;
  }
}
</style>
