<script setup>
// 무동(舞童) — 김홍도 「무동」 차용
// 무동은 소매를 휘저으며 춤추고, 악단은 북·장구·피리·해금을 연주한다
</script>

<template>
  <svg class="mudong" viewBox="0 0 800 560" aria-label="무동 — 춤과 연주">
    <!-- ══ 악단 (반원 배치) ══ -->

    <!-- 북잡이 (좌) -->
    <g transform="translate(70,120)">
      <!-- 북틀 -->
      <path d="M10 150 L14 6 M96 150 L92 10" class="ink w3" />
      <path d="M8 10 L98 12" class="ink w3" />
      <circle cx="104" cy="8" r="7" fill="#b23a26" />
      <!-- 북 -->
      <circle cx="53" cy="66" r="40" fill="#e8d9bc" class="inkline" />
      <path d="M53 42 a24 24 0 0 1 0 48 a14 14 0 0 1 0 -28 a7 7 0 0 0 0 14" class="ink w2" fill="none" opacity=".55" />
      <!-- 고수 -->
      <g transform="translate(88,64)">
        <g class="drummer">
          <path d="M8 30 q22 -14 44 0 q10 26 2 56 l-50 0 q-6 -30 4 -56 Z" fill="#f5eedd" class="inkline" />
          <circle cx="30" cy="18" r="15" fill="#eccfa5" class="inkline" />
          <path d="M14 10 q16 -10 32 0 l-4 -12 h-24 Z" fill="#221c16" />
          <!-- 북채 팔 : 어깨 기준 회전 -->
          <g class="beat-arm">
            <path d="M18 34 q-24 -6 -44 -22" class="ink w5" />
            <path d="M-26 12 l-24 -18" class="ink w3" />
          </g>
        </g>
      </g>
    </g>

    <!-- 장구잡이 -->
    <g transform="translate(250,140)">
      <g class="sway s1">
        <path d="M10 44 q28 -18 56 0 q14 32 4 70 l-64 0 q-10 -38 4 -70 Z" fill="#dbe4ea" class="inkline" />
        <circle cx="38" cy="28" r="16" fill="#eccfa5" class="inkline" />
        <ellipse cx="38" cy="10" rx="26" ry="6" fill="#221c16" />
        <path d="M30 -14 h16 l3 24 h-22 Z" fill="#221c16" />
        <!-- 장구 -->
        <g transform="translate(6,84)">
          <path d="M0 0 L18 14 L18 30 L0 44 Z" fill="#c98d4b" class="inkline" />
          <path d="M64 0 L46 14 L46 30 L64 44 Z" fill="#c98d4b" class="inkline" />
          <path d="M18 14 L46 14 M18 30 L46 30" class="ink w2" />
        </g>
        <!-- 양손 : 궁채/열채 교대 -->
        <g class="janggu-l"><path d="M18 58 q-14 14 -12 30" class="ink w5" /></g>
        <g class="janggu-r"><path d="M58 58 q16 12 14 30" class="ink w5" /></g>
      </g>
    </g>

    <!-- 피리 부는 사람 둘 -->
    <g transform="translate(420,120)">
      <g class="sway s2">
        <path d="M8 46 q26 -16 52 0 q12 32 4 68 l-60 0 q-8 -36 4 -68 Z" fill="#f5eedd" class="inkline" />
        <circle cx="34" cy="30" r="15" fill="#eccfa5" class="inkline" />
        <ellipse cx="34" cy="13" rx="30" ry="7" fill="#221c16" />
        <path d="M26 -9 h16 l2 22 h-20 Z" fill="#221c16" />
        <g class="pipe">
          <path d="M40 36 l34 26" class="ink w4" />
          <path d="M22 52 q12 -4 22 -10 M46 66 q6 -8 6 -14" class="ink w5" />
        </g>
      </g>
    </g>
    <g transform="translate(540,138)">
      <g class="sway s3">
        <path d="M8 46 q26 -16 52 0 q12 30 4 64 l-60 0 q-8 -34 4 -64 Z" fill="#c3d0c0" class="inkline" />
        <circle cx="34" cy="30" r="15" fill="#eccfa5" class="inkline" />
        <ellipse cx="34" cy="13" rx="26" ry="6" fill="#221c16" />
        <g class="pipe p2">
          <path d="M40 36 l30 30" class="ink w4" />
          <path d="M22 52 q12 -4 20 -8 M44 66 q6 -8 8 -14" class="ink w5" />
        </g>
      </g>
    </g>

    <!-- 해금잡이 (우) -->
    <g transform="translate(660,150)">
      <g class="sway s1">
        <path d="M8 40 q26 -16 52 0 q12 30 4 66 l-60 0 q-8 -36 4 -66 Z" fill="#dbe4ea" class="inkline" />
        <circle cx="34" cy="24" r="15" fill="#eccfa5" class="inkline" />
        <ellipse cx="34" cy="7" rx="26" ry="6" fill="#221c16" />
        <!-- 해금 몸통과 활 -->
        <path d="M12 100 q-4 -50 4 -74" class="ink w3" />
        <circle cx="14" cy="102" r="9" fill="#c98d4b" class="inkline" />
        <g class="bow"><path d="M2 66 l44 14" class="ink w3" /><path d="M40 62 q8 8 6 18" class="ink w5" /></g>
      </g>
    </g>

    <!-- ══ 무동 (중앙 앞) ══ -->
    <g transform="translate(310,320)">
      <g class="dancer">
        <!-- 뒷소매 (왼팔) -->
        <g class="sleeve-l">
          <path d="M52 44 q-52 -20 -84 6 q-8 10 4 14 q42 6 80 -8 Z" fill="#8fa682" class="inkline" />
          <path d="M-30 52 q-14 6 -22 18" class="ink w3" />
        </g>
        <!-- 몸통 : 옥색 쾌자 -->
        <path d="M44 32 q26 -12 48 4 q18 34 6 74 q-32 14 -62 0 q-12 -42 8 -78 Z" fill="#a8bfa0" class="inkline" />
        <!-- 허리 붉은 띠 -->
        <path d="M34 84 q34 12 68 0" stroke="#b23a26" stroke-width="7" fill="none" stroke-linecap="round" />
        <!-- 머리 -->
        <circle cx="70" cy="20" r="17" fill="#eccfa5" class="inkline" />
        <path d="M56 8 q14 -12 28 0 l-2 -10 h-24 Z" fill="#221c16" />
        <path d="M62 20 q3 3 7 3 M76 19 q3 2 5 1" class="ink w2" />
        <path d="M66 30 q5 4 10 0" class="ink w2" />
        <!-- 앞소매 (오른팔) : 크게 휘두른다 -->
        <g class="sleeve-r">
          <path d="M86 40 q56 -30 92 -14 q10 6 -2 14 q-46 22 -88 16 Z" fill="#8fa682" class="inkline" />
          <path d="M172 26 q14 -2 24 4" class="ink w3" />
        </g>
        <!-- 다리 : 한 발은 딛고 한 발은 차올린다 -->
        <path d="M56 108 q-4 26 -8 44" class="ink w6" />
        <path d="M40 152 q-12 4 -18 2" stroke="#b23a26" stroke-width="9" fill="none" stroke-linecap="round" />
        <g class="kick">
          <path d="M86 108 q22 12 40 10" class="ink w6" />
          <path d="M124 118 q12 -2 16 -8" stroke="#b23a26" stroke-width="9" fill="none" stroke-linecap="round" />
        </g>
      </g>
      <!-- 그림자 먹선 -->
      <ellipse cx="60" cy="168" rx="52" ry="7" fill="rgba(34,28,22,.12)" class="shadow" />
    </g>

    <!-- 낙관 -->
    <g transform="translate(28,470)">
      <rect width="34" height="34" rx="3" fill="#b23a26" opacity=".85" />
      <path d="M8 8 h18 M8 16 h18 M8 24 h12 M17 8 v18" stroke="#f1e7d0" stroke-width="2.4" />
    </g>
  </svg>
</template>

<style scoped>
.mudong {
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

/* 무동 — 몸 전체가 튀어오르고, 양 소매가 엇갈려 휘돈다 */
.dancer {
  transform-box: fill-box;
  transform-origin: 50% 90%;
  animation: hop 1.5s ease-in-out infinite;
}
@keyframes hop {
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-14px) rotate(2.5deg); }
}
.sleeve-l {
  transform-box: fill-box;
  transform-origin: 92% 40%;
  animation: swingL 1.5s ease-in-out infinite;
}
@keyframes swingL {
  0%, 100% { transform: rotate(14deg); }
  50% { transform: rotate(-20deg); }
}
.sleeve-r {
  transform-box: fill-box;
  transform-origin: 4% 55%;
  animation: swingR 1.5s ease-in-out infinite;
}
@keyframes swingR {
  0%, 100% { transform: rotate(-16deg); }
  50% { transform: rotate(18deg); }
}
.kick {
  transform-box: fill-box;
  transform-origin: 0% 20%;
  animation: kick 1.5s ease-in-out infinite;
}
@keyframes kick {
  0%, 100% { transform: rotate(6deg); }
  50% { transform: rotate(-22deg); }
}
.shadow {
  animation: shadowPulse 1.5s ease-in-out infinite;
  transform-box: fill-box;
  transform-origin: 50% 50%;
}
@keyframes shadowPulse {
  0%, 100% { transform: scaleX(1); opacity: 0.7; }
  50% { transform: scaleX(0.8); opacity: 0.4; }
}

/* 고수 — 북채가 북면을 때린다 */
.beat-arm {
  transform-box: fill-box;
  transform-origin: 95% 85%;
  animation: beat 0.75s ease-in-out infinite;
}
@keyframes beat {
  0%, 100% { transform: rotate(0deg); }
  35% { transform: rotate(-26deg); }
  50% { transform: rotate(8deg); }
}
.drummer {
  transform-box: fill-box;
  transform-origin: 50% 95%;
  animation: nod 1.5s ease-in-out infinite;
}

/* 장구 — 양손 교대 */
.janggu-l {
  transform-box: fill-box;
  transform-origin: 90% 8%;
  animation: patL 0.75s ease-in-out infinite;
}
.janggu-r {
  transform-box: fill-box;
  transform-origin: 10% 8%;
  animation: patR 0.75s ease-in-out infinite;
}
@keyframes patL {
  0%, 100% { transform: rotate(0deg); }
  40% { transform: rotate(-22deg); }
}
@keyframes patR {
  0%, 100% { transform: rotate(18deg); }
  40% { transform: rotate(0deg); }
}

/* 관악 — 상체가 가락을 탄다 */
.sway {
  transform-box: fill-box;
  transform-origin: 50% 95%;
  animation: nod 3s ease-in-out infinite;
}
.sway.s2 { animation-duration: 2.6s; animation-delay: -0.9s; }
.sway.s3 { animation-duration: 3.4s; animation-delay: -1.7s; }
@keyframes nod {
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2.4deg); }
}
.pipe {
  transform-box: fill-box;
  transform-origin: 10% 10%;
  animation: pipeBob 1.5s ease-in-out infinite;
}
.pipe.p2 { animation-delay: -0.7s; }
@keyframes pipeBob {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-5deg); }
}

/* 해금 활 — 밀고 당긴다 */
.bow {
  transform-box: fill-box;
  transform-origin: 0% 50%;
  animation: bowing 1.5s ease-in-out infinite alternate;
}
@keyframes bowing {
  from { transform: translateX(-7px) rotate(-3deg); }
  to { transform: translateX(7px) rotate(3deg); }
}

@media (prefers-reduced-motion: reduce) {
  .mudong * {
    animation: none !important;
  }
}
</style>
