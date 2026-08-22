<script setup>
// 까치호랑이(작호도) — 세화(歲畫) 액막이 그림 차용
// 호랑이는 눈을 굴리고 몸을 뒤척이며, 까치는 소나무 가지에서 날아오른다
</script>

<template>
  <svg class="tiger-scene" viewBox="0 0 800 620" aria-label="까치호랑이 — 눈을 굴리는 호랑이와 나는 까치">
    <!-- ══ 소나무 (우측) ══ -->
    <g class="pine">
      <path d="M700 620 q-14 -180 8 -300 q10 -60 -6 -110" stroke="#6a5138" stroke-width="26" fill="none" stroke-linecap="round" />
      <path d="M706 300 q-60 -30 -150 -22 M700 200 q-40 -26 -96 -24" stroke="#6a5138" stroke-width="13" fill="none" stroke-linecap="round" />
      <path d="M698 400 q-40 -14 -80 -6" stroke="#6a5138" stroke-width="10" fill="none" stroke-linecap="round" />
      <!-- 솔잎 뭉치 -->
      <g fill="#4c6b4a" class="inkline">
        <ellipse cx="540" cy="268" rx="52" ry="22" />
        <ellipse cx="596" cy="166" rx="46" ry="20" />
        <ellipse cx="688" cy="120" rx="54" ry="24" />
        <ellipse cx="612" cy="386" rx="40" ry="17" />
      </g>
      <g stroke="#31502f" stroke-width="2" opacity=".6">
        <path d="M500 264 l24 -10 M540 276 l30 -12 M572 160 l26 -10 M660 114 l30 -10 M700 128 l28 -10 M588 382 l26 -8" fill="none" />
      </g>
    </g>

    <!-- ══ 앉은 까치 (가지 위) — 꼬리를 까딱인다 ══ -->
    <g transform="translate(548,224)">
      <g class="perched">
        <g class="p-tail">
          <path d="M26 22 L64 10 L68 16 L30 28 Z" fill="#221c16" />
        </g>
        <ellipse cx="18" cy="20" rx="15" ry="10" fill="#221c16" />
        <ellipse cx="14" cy="24" rx="8" ry="5" fill="#fbf6ea" />
        <circle cx="4" cy="12" r="6.5" fill="#221c16" />
        <path d="M-2 12 L-9 14 L-2 16 Z" fill="#ce9b3b" />
        <circle cx="2" cy="10" r="1.2" fill="#fbf6ea" />
        <path d="M14 14 q8 -8 16 -6 q-6 8 -12 9 Z" fill="#2f567a" />
        <path d="M12 30 l-2 8 M20 30 l-1 8" class="ink w2" />
      </g>
    </g>

    <!-- ══ 나는 까치 — 화면을 크게 가로질러 날아간다 ══ -->
    <g class="flier">
      <g class="flap">
        <g class="wing-t"><path d="M0 0 Q-26 -30 -50 -26 Q-30 -6 -6 2 Z" fill="#221c16" /></g>
        <g class="wing-b"><path d="M0 4 Q-24 26 -44 24 Q-26 8 -4 2 Z" fill="#2f567a" /></g>
        <ellipse cx="6" cy="2" rx="16" ry="8" fill="#221c16" />
        <ellipse cx="2" cy="5" rx="8" ry="4" fill="#fbf6ea" />
        <circle cx="20" cy="-2" r="5.5" fill="#221c16" />
        <path d="M25 -2 L32 0 L25 2 Z" fill="#ce9b3b" />
        <path d="M-14 2 L-40 12 L-38 6 Z" fill="#221c16" />
      </g>
    </g>

    <!-- ══ 호랑이 (좌측 크게) ══ -->
    <g transform="translate(30,120)">
      <g class="tiger">
        <!-- 말린 꼬리 -->
        <g class="tail">
          <path d="M60 336 q-64 10 -66 -46 q-2 -40 38 -38 q28 2 24 28 q-3 18 -22 14" stroke="#c8a87c" stroke-width="24" fill="none" stroke-linecap="round" />
          <path d="M60 336 q-64 10 -66 -46 q-2 -40 38 -38 q28 2 24 28 q-3 18 -22 14" stroke="#3a2f24" stroke-width="24" fill="none" stroke-linecap="round" stroke-dasharray="7 26" />
        </g>
        <!-- 몸통 -->
        <g class="body">
          <path d="M96 180 q10 -80 92 -86 q96 -6 150 62 q40 54 34 150 q-4 66 -36 96 l-206 0 q-44 -96 -34 -222 Z" fill="#d9bc90" class="inkline-b" />
          <!-- 줄무늬 -->
          <g stroke="#3a2f24" stroke-width="9" fill="none" stroke-linecap="round">
            <path d="M150 110 q26 26 24 52 M204 100 q28 30 28 62 M258 112 q26 32 28 64 M304 148 q20 34 20 62 M330 218 q12 32 8 58 M150 200 q22 24 22 48 M130 280 q18 22 18 44 M196 292 q16 26 14 48 M262 288 q16 28 14 52 M318 310 q10 26 6 48" />
          </g>
          <!-- 흰 배 반점 -->
          <path d="M116 300 q30 -30 78 -20 q-10 52 -44 82 l-32 0 q-10 -32 -2 -62 Z" fill="#f0e6d2" class="inkline-b" />
          <g fill="none" stroke="#3a2f24" stroke-width="3" opacity=".55">
            <circle cx="142" cy="316" r="5" /><circle cx="164" cy="304" r="5" /><circle cx="156" cy="336" r="5" /><circle cx="136" cy="344" r="4" />
          </g>
          <!-- 앞다리 -->
          <path d="M128 356 q-4 32 2 46 l50 0 q4 -26 0 -44" fill="#d9bc90" class="inkline-b" />
          <path d="M120 398 q28 12 64 4" class="ink w3" />
          <g class="paw"><ellipse cx="152" cy="404" rx="34" ry="12" fill="#e8c46a" class="inkline-b" /></g>
        </g>
        <!-- 머리 -->
        <g class="head">
          <!-- 얼굴 판 -->
          <path d="M52 26 q60 -44 128 -6 q34 20 30 74 q-4 48 -46 66 q-52 22 -100 -6 q-38 -24 -32 -72 q4 -38 20 -56 Z" fill="#d9bc90" class="inkline-b" />
          <!-- 이마 王자 주름 -->
          <g stroke="#3a2f24" stroke-width="6" fill="none" stroke-linecap="round">
            <path d="M96 18 q22 -8 44 0 M100 34 q20 -6 38 0 M108 4 q14 -4 24 0" />
          </g>
          <!-- 귀 -->
          <path d="M46 40 q-16 -24 2 -38 q20 -2 24 24 Z M186 34 q16 -26 -2 -38 q-20 0 -22 26 Z" fill="#c8a87c" class="inkline-b" />
          <!-- 눈두덩 (노란 판) -->
          <ellipse cx="86" cy="72" rx="30" ry="26" fill="#e8c46a" class="inkline-b" />
          <ellipse cx="152" cy="70" rx="30" ry="26" fill="#e8c46a" class="inkline-b" />
          <!-- 붉은 눈가 -->
          <path d="M54 88 q10 12 26 12 M172 86 q-8 12 -24 12" stroke="#c65b3f" stroke-width="7" fill="none" stroke-linecap="round" />
          <!-- 눈 : 흰자 + 굴러다니는 눈동자 + 깜빡이는 눈꺼풀 -->
          <circle cx="86" cy="72" r="15" fill="#fbf6ea" class="inkline-b" />
          <circle cx="152" cy="70" r="15" fill="#fbf6ea" class="inkline-b" />
          <g class="pupils">
            <circle cx="86" cy="72" r="7" fill="#221c16" />
            <circle cx="152" cy="70" r="7" fill="#221c16" />
            <circle cx="83" cy="69" r="2" fill="#fbf6ea" />
            <circle cx="149" cy="67" r="2" fill="#fbf6ea" />
          </g>
          <g class="lids">
            <rect x="68" y="54" width="36" height="17" rx="8" fill="#e8c46a" />
            <rect x="134" y="52" width="36" height="17" rx="8" fill="#e8c46a" />
          </g>
          <!-- 코 -->
          <path d="M108 96 q12 -8 24 0 q-4 14 -12 14 q-8 0 -12 -14 Z" fill="#c65b3f" class="inkline-b" />
          <!-- 씩 웃는 입 + 송곳니 -->
          <path d="M78 116 q42 34 84 -2 q-10 28 -42 30 q-32 2 -42 -28 Z" fill="#b23a26" class="inkline-b" />
          <path d="M88 122 l7 14 l8 -12 Z M148 120 l-7 14 l-8 -12 Z" fill="#fbf6ea" class="ink w2" />
          <path d="M96 132 h44" stroke="#3a2f24" stroke-width="3" opacity=".5" />
          <!-- 수염 -->
          <g class="whiskers" stroke="#f0e6d2" stroke-width="3" fill="none" stroke-linecap="round">
            <path d="M60 100 q-34 -6 -56 -18 M62 110 q-36 2 -60 -4 M64 120 q-32 10 -54 10" />
            <path d="M172 98 q34 -8 56 -20 M174 108 q36 0 60 -6 M172 118 q32 8 54 8" />
          </g>
        </g>
      </g>
      <ellipse cx="220" cy="418" rx="150" ry="12" fill="rgba(34,28,22,.1)" />
    </g>

    <!-- 낙관 -->
    <g transform="translate(736,560)">
      <rect width="34" height="34" rx="3" fill="#b23a26" opacity=".85" />
      <path d="M8 8 h18 M8 17 h18 M8 26 h12 M17 8 v18" stroke="#f1e7d0" stroke-width="2.4" />
    </g>
  </svg>
</template>

<style scoped>
.tiger-scene {
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
.inkline {
  stroke: #3a2f24;
  stroke-width: 3;
}
.inkline-b {
  stroke: #3a2f24;
  stroke-width: 4;
}

/* 호랑이 — 몸은 숨쉬고, 고개는 갸웃, 눈은 굴러다닌다 */
.tiger {
  transform-box: fill-box;
  transform-origin: 50% 95%;
  animation: breathe 4.2s ease-in-out infinite;
}
@keyframes breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.014); }
}
.head {
  transform-box: fill-box;
  transform-origin: 55% 90%;
  animation: cock 9s ease-in-out infinite;
}
@keyframes cock {
  0%, 34%, 100% { transform: rotate(0deg); }
  40%, 52% { transform: rotate(-4.5deg); } /* 까치 쪽으로 갸웃 */
  58% { transform: rotate(1.5deg); }
  74%, 86% { transform: rotate(3deg); }
}
.pupils {
  animation: dart 9s ease-in-out infinite;
}
@keyframes dart {
  0%, 30%, 100% { transform: translate(0, 0); }
  36%, 52% { transform: translate(5px, -2px); } /* 까치를 본다 */
  58%, 68% { transform: translate(-4px, 1px); }
  74%, 86% { transform: translate(2px, 2px); }
}
.lids rect {
  transform-box: fill-box;
  transform-origin: 50% 0%;
  transform: scaleY(0.12);
  animation: blink 5.5s linear infinite;
}
@keyframes blink {
  0%, 91%, 100% { transform: scaleY(0.12); }
  94%, 96% { transform: scaleY(1); }
}
.tail {
  transform-box: fill-box;
  transform-origin: 90% 20%;
  animation: tailCurl 4.2s ease-in-out infinite alternate;
}
@keyframes tailCurl {
  from { transform: rotate(-4deg); }
  to { transform: rotate(6deg); }
}
.whiskers {
  animation: whisker 4.2s ease-in-out infinite alternate;
  transform-box: fill-box;
  transform-origin: 50% 50%;
}
@keyframes whisker {
  from { transform: rotate(-0.8deg); }
  to { transform: rotate(1.2deg); }
}
.paw {
  transform-box: fill-box;
  transform-origin: 50% 100%;
  animation: pawTap 4.2s ease-in-out infinite;
}
@keyframes pawTap {
  0%, 70%, 100% { transform: translateY(0); }
  78% { transform: translateY(-5px); }
  86% { transform: translateY(0); }
}

/* 앉은 까치 — 몸을 까딱, 꼬리를 튕긴다 */
.perched {
  transform-box: fill-box;
  transform-origin: 40% 95%;
  animation: perchBob 3.4s ease-in-out infinite;
}
@keyframes perchBob {
  0%, 100% { transform: rotate(0deg) translateY(0); }
  30% { transform: rotate(-3deg) translateY(-2px); }
  60% { transform: rotate(2deg) translateY(0); }
}
.p-tail {
  transform-box: fill-box;
  transform-origin: 5% 60%;
  animation: pTailFlick 3.4s ease-in-out infinite;
}
@keyframes pTailFlick {
  0%, 55%, 100% { transform: rotate(0deg); }
  65% { transform: rotate(9deg); }
  78% { transform: rotate(-5deg); }
}

/* 나는 까치 — 하늘을 크게 한 바퀴 가로지른다 */
.flier {
  animation: flyPath 18s ease-in-out infinite;
}
@keyframes flyPath {
  0% { transform: translate(560px, 210px) scale(0.9); opacity: 0; }
  4% { opacity: 1; }
  18% { transform: translate(430px, 80px) scale(1); }
  38% { transform: translate(180px, 40px) scale(1.06) scaleX(1); }
  50% { transform: translate(60px, 110px) scale(1) scaleX(-1); }
  64% { transform: translate(300px, 60px) scale(1) scaleX(-1); }
  80% { transform: translate(520px, 150px) scale(0.95) scaleX(-1); }
  92% { transform: translate(560px, 205px) scale(0.9) scaleX(-1); opacity: 1; }
  100% { transform: translate(560px, 210px) scale(0.9) scaleX(-1); opacity: 0; }
}
.wing-t {
  transform-box: fill-box;
  transform-origin: 100% 100%;
  animation: flapT 0.34s ease-in-out infinite alternate;
}
.wing-b {
  transform-box: fill-box;
  transform-origin: 100% 0%;
  animation: flapB 0.34s ease-in-out infinite alternate;
}
@keyframes flapT {
  from { transform: rotate(-26deg); }
  to { transform: rotate(24deg); }
}
@keyframes flapB {
  from { transform: rotate(18deg); }
  to { transform: rotate(-16deg); }
}

/* 솔가지 — 미풍 */
.pine {
  transform-box: fill-box;
  transform-origin: 90% 100%;
  animation: pineSway 8s ease-in-out infinite alternate;
}
@keyframes pineSway {
  from { transform: rotate(-0.5deg); }
  to { transform: rotate(0.7deg); }
}

@media (prefers-reduced-motion: reduce) {
  .tiger-scene * {
    animation: none !important;
  }
  .flier {
    opacity: 0;
  }
}
</style>
