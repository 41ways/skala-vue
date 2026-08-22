<script setup>
// 씨름 — 김홍도 「씨름」 차용
// 씨름꾼 둘은 샅바를 쥔 채 왔다 갔다 힘겨루기, 구경꾼은 팔을 들어 응원한다
const crowd = [
  // 상단 왼쪽 무리
  { x: 60, y: 60, c: '#f5eedd', arm: true, d: 0 },
  { x: 130, y: 44, c: '#dbe4ea', arm: false, d: 0.4 },
  { x: 196, y: 58, c: '#f5eedd', arm: true, d: 0.9 },
  { x: 96, y: 118, c: '#c3d0c0', arm: false, d: 1.3 },
  { x: 168, y: 122, c: '#f5eedd', arm: false, d: 0.6 },
  // 상단 오른쪽 무리
  { x: 560, y: 48, c: '#f5eedd', arm: true, d: 0.2 },
  { x: 632, y: 60, c: '#dbe4ea', arm: false, d: 1.1 },
  { x: 700, y: 46, c: '#f5eedd', arm: true, d: 0.7 },
  { x: 596, y: 120, c: '#c3d0c0', arm: false, d: 1.6 },
  { x: 668, y: 124, c: '#f5eedd', arm: true, d: 0.3 },
  // 하단
  { x: 96, y: 430, c: '#dbe4ea', arm: false, d: 0.8 },
  { x: 170, y: 452, c: '#f5eedd', arm: true, d: 1.4 },
  { x: 590, y: 440, c: '#f5eedd', arm: false, d: 0.5 },
  { x: 664, y: 456, c: '#dbe4ea', arm: true, d: 1.0 },
]
</script>

<template>
  <svg class="ssireum" viewBox="0 0 800 620" aria-label="씨름 — 힘겨루기와 응원">
    <!-- ══ 구경꾼 ══ -->
    <g v-for="(p, i) in crowd" :key="i" :transform="`translate(${p.x},${p.y})`">
      <g class="viewer" :style="{ animationDelay: p.d + 's' }">
        <path d="M4 30 q22 -14 44 0 q8 22 2 44 l-48 0 q-6 -22 2 -44 Z" :fill="p.c" class="inkline" />
        <circle cx="26" cy="18" r="13" fill="#eccfa5" class="inkline" />
        <ellipse v-if="i % 3 === 0" cx="26" cy="4" rx="22" ry="5" fill="#221c16" />
        <path v-else d="M16 8 q10 -8 20 0 l-2 -8 h-16 Z" fill="#221c16" />
        <path d="M20 18 q2 2 4 2 M32 18 q2 2 4 2" class="ink w2" />
        <path d="M22 26 q4 3 8 0" class="ink w2" />
        <!-- 응원하는 팔 -->
        <g v-if="p.arm" class="cheer-arm" :style="{ animationDelay: p.d + 's' }">
          <path d="M44 36 q14 -14 16 -28" class="ink w5" />
        </g>
        <!-- 부채 든 손 -->
        <g v-else-if="i % 4 === 1" class="fan-arm" :style="{ animationDelay: p.d + 's' }">
          <path d="M46 40 q12 -4 18 -12" class="ink w4" />
          <path d="M62 30 l14 -12 l4 14 Z" fill="#f1e7d0" class="inkline" />
        </g>
      </g>
    </g>

    <!-- 벗어둔 갓과 신발 -->
    <g transform="translate(52,210)">
      <ellipse cx="30" cy="12" rx="30" ry="9" fill="#221c16" />
      <ellipse cx="30" cy="6" rx="12" ry="6" fill="#221c16" />
    </g>
    <path d="M690 300 q16 -6 24 0 q-2 8 -12 8 q-10 0 -12 -8 Z" fill="#f5eedd" class="inkline" />
    <path d="M722 316 q16 -6 24 0 q-2 8 -12 8 q-10 0 -12 -8 Z" fill="#f5eedd" class="inkline" />

    <!-- ══ 씨름꾼 (중앙) — 좌우로 힘겨루기 ══ -->
    <g transform="translate(310,190)">
      <g class="grapple">
        <!-- 뒤 선수 : 들배지기 시도 -->
        <g class="wrestler-b">
          <path d="M96 40 q30 -14 54 6 q16 40 4 92 q-30 12 -56 -2 q-14 -48 -2 -96 Z" fill="#f5eedd" class="inkline" />
          <circle cx="122" cy="30" r="17" fill="#eccfa5" class="inkline" />
          <path d="M112 16 q10 -8 20 0 l-4 -10 h-12 Z" fill="#221c16" />
          <!-- 상투 -->
          <path d="M120 12 q2 -8 6 -8" class="ink w3" />
          <!-- 다리 -->
          <path d="M108 136 q-2 34 -6 52" class="ink w6" />
          <g class="step-b">
            <path d="M142 132 q10 30 8 54" class="ink w6" />
          </g>
        </g>
        <!-- 앞 선수 : 상대를 안아 든다 -->
        <g class="wrestler-a">
          <path d="M28 56 q28 -18 56 -4 q20 38 10 90 q-32 14 -60 0 q-16 -44 -6 -86 Z" fill="#e8dfc8" class="inkline" />
          <circle cx="58" cy="42" r="17" fill="#e0b98a" class="inkline" />
          <path d="M48 28 q10 -8 20 0 l-4 -10 h-12 Z" fill="#221c16" />
          <path d="M56 24 q2 -8 6 -8" class="ink w3" />
          <!-- 팔 : 상대 샅바를 감아쥔다 -->
          <path d="M80 66 q28 6 44 24" class="ink w6" />
          <path d="M76 96 q30 2 50 16" class="ink w6" />
          <!-- 샅바 -->
          <path d="M120 92 q14 8 10 26" stroke="#b23a26" stroke-width="8" fill="none" stroke-linecap="round" />
          <!-- 다리 : 버티는 앞다리, 걸어드는 뒷다리 -->
          <path d="M42 140 q-8 32 -10 50" class="ink w6" />
          <g class="step-a">
            <path d="M74 142 q14 26 30 44" class="ink w6" />
          </g>
        </g>
        <!-- 발끝 먼지 -->
        <g class="dust">
          <circle cx="40" cy="196" r="5" fill="rgba(58,47,36,.18)" />
          <circle cx="120" cy="200" r="7" fill="rgba(58,47,36,.14)" />
          <circle cx="160" cy="194" r="4" fill="rgba(58,47,36,.2)" />
        </g>
      </g>
      <ellipse cx="96" cy="204" rx="86" ry="9" fill="rgba(34,28,22,.1)" />
    </g>

    <!-- 낙관 -->
    <g transform="translate(736,560)">
      <rect width="34" height="34" rx="3" fill="#b23a26" opacity=".85" />
      <path d="M8 8 h18 M8 17 h18 M8 26 h12 M17 8 v18" stroke="#f1e7d0" stroke-width="2.4" />
    </g>
  </svg>
</template>

<style scoped>
.ssireum {
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
.w6 { stroke-width: 7; }
.inkline {
  stroke: #3a2f24;
  stroke-width: 3;
}

/* 씨름 한 판 — 맞잡은 채 좌우로 왔다 갔다, 이따금 크게 들썩 */
.grapple {
  transform-box: fill-box;
  transform-origin: 50% 92%;
  animation: grapple 5s ease-in-out infinite;
}
@keyframes grapple {
  0%, 100% { transform: translateX(-20px) rotate(-2.5deg); }
  22% { transform: translateX(14px) rotate(2deg); }
  40% { transform: translateX(-10px) rotate(-1.5deg); }
  58% { transform: translateX(22px) rotate(3deg); }
  70% { transform: translateX(18px) translateY(-12px) rotate(4deg); } /* 들어올리기! */
  82% { transform: translateX(-4px) translateY(0) rotate(-1deg); }
}
.wrestler-a {
  transform-box: fill-box;
  transform-origin: 30% 90%;
  animation: strainA 5s ease-in-out infinite;
}
@keyframes strainA {
  0%, 100% { transform: rotate(2deg); }
  58%, 70% { transform: rotate(6deg); }
}
.wrestler-b {
  transform-box: fill-box;
  transform-origin: 60% 90%;
  animation: strainB 5s ease-in-out infinite;
}
@keyframes strainB {
  0%, 100% { transform: rotate(-2deg); }
  58% { transform: rotate(-5deg); }
  70% { transform: rotate(-9deg) translateY(-6px); } /* 들려 올라간다 */
}
.step-a,
.step-b {
  transform-box: fill-box;
  transform-origin: 20% 0%;
  animation: step 2.5s ease-in-out infinite alternate;
}
.step-b { animation-delay: -1.2s; }
@keyframes step {
  from { transform: rotate(-7deg); }
  to { transform: rotate(9deg); }
}
.dust {
  animation: dust 2.5s ease-in-out infinite;
}
@keyframes dust {
  0%, 100% { opacity: 0.2; transform: translateY(0); }
  50% { opacity: 0.7; transform: translateY(-4px); }
}

/* 구경꾼 — 들썩이며 응원 */
.viewer {
  transform-box: fill-box;
  transform-origin: 50% 95%;
  animation: bounce 2.2s ease-in-out infinite;
}
@keyframes bounce {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-5px) rotate(1.5deg); }
}
.cheer-arm {
  transform-box: fill-box;
  transform-origin: 8% 95%;
  animation: cheer 1.1s ease-in-out infinite;
}
@keyframes cheer {
  0%, 100% { transform: rotate(-8deg); }
  50% { transform: rotate(26deg); }
}
.fan-arm {
  transform-box: fill-box;
  transform-origin: 5% 80%;
  animation: fanning 1.6s ease-in-out infinite alternate;
}
@keyframes fanning {
  from { transform: rotate(-6deg); }
  to { transform: rotate(10deg); }
}

@media (prefers-reduced-motion: reduce) {
  .ssireum * {
    animation: none !important;
  }
}
</style>
