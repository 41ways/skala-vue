<script setup>
// 소개 — 청우록이 무엇이고, 무엇으로 만들었는지 (제출·검수용 설명)
import { RouterLink } from 'vue-router'

const menus = [
  { to: '/', name: '국내 화폭 · 팔도청우록', desc: '첫 화면의 한옥 분합문이 스크롤로 열리며 시작. 국내 열 고을과 남극 세종기지의 오늘 날씨를 여섯 폭 민화가 대신 전합니다.' },
  { to: '/world', name: '세계화폭 · 만국청우록', desc: '바다 건너 열 곳. 각 나라의 명화 위에 현지 시각·낮밤과 실황 효과(비·안개·바람 휘날림)가 얹힙니다.' },
  { to: '/guide', name: '빨래 지침', desc: '기온·습도·바람·하늘을 100점으로 환산하는 빨래 지수의 규칙.' },
  { to: '/classic', name: '실습 대시보드', desc: '수업 실습으로 만든 카드형 대시보드. 표본 데이터로 동작합니다.' },
]

const pairs = [
  ['비 · 뇌우', '인왕제색도 — 정선'],
  ['맑음', '일월오봉도'],
  ['바람', '무동 — 김홍도'],
  ['구름', '씨름 — 김홍도'],
  ['흐림 · 안개', '서당 — 김홍도'],
  ['눈', '작호도 — 까치호랑이'],
]
</script>

<template>
  <main class="about">
    <header class="head">
      <p class="eyebrow">晴雨錄 · 서비스 소개</p>
      <h1>화폭을 내리면 팔도의 날씨가 펼쳐집니다</h1>
      <p class="lead">
        청우록(晴雨錄)은 조선의 민화·풍속화가 지금의 날씨를 대신 말해 주는 스크롤 화폭입니다. 비가 드는 고을은 「인왕제색도」에,
        맑은 고을은 「일월오봉도」에 깃들고, 고을 이름을 누르면 두루마리가 펼쳐져 오늘과 앞날의 하늘을 세로 기문으로 적어 줍니다.
      </p>
    </header>

    <section>
      <h2>화폭</h2>
      <ul class="menus">
        <li v-for="m in menus" :key="m.to">
          <RouterLink :to="m.to">{{ m.name }}</RouterLink>
          <p>{{ m.desc }}</p>
        </li>
      </ul>
    </section>

    <section>
      <h2>하늘과 그림의 대응</h2>
      <table class="pairs">
        <tbody>
          <tr v-for="[w, p] in pairs" :key="w">
            <th>{{ w }}</th>
            <td>{{ p }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section>
      <h2>날씨 자료</h2>
      <p>
        <a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo</a> 공개 API에서 현재 기온·습도·풍속·날씨코드·낮밤과
        3일 예보를 받습니다(키 불필요). 국내·해외 도시를 좌표 묶음으로 한 번에 조회하고, 응답이 없으면 표본 자료로 물러나 "표본"이라 표시합니다.
        세계화폭은 <code>timezone=auto</code>로 현지 시각을, '스칼라'는 시연을 위해 고정값(뇌우·비바람)을 씁니다.
      </p>
    </section>

    <section>
      <h2>만든 재료</h2>
      <ul class="plain">
        <li>Vue 3 (Composition API) · Vite · Vue Router · Pinia · Axios · Lenis(스무스 스크롤)</li>
        <li>연출은 CSS/SVG 필터로 — 먹 번짐, 수면 흩어짐, 선묘 에칭, 종이 질감</li>
        <li>민화·명화: 위키미디어 공용 퍼블릭 도메인 스캔 · 분합문 사진: 오리 이원익 종택, 문화재청(공공누리 제1유형) · 두루마리 질감: Poly Haven(CC0)</li>
      </ul>
    </section>

    <p class="back"><RouterLink to="/">← 국내 화폭으로</RouterLink></p>
  </main>
</template>

<style scoped>
.about {
  max-width: 720px;
  margin: 0 auto;
  padding: 48px 24px 96px;
  color: var(--ink);
}
.eyebrow {
  margin: 0 0 8px;
  font-family: var(--font-util);
  font-size: 12px;
  letter-spacing: 0.3em;
  color: var(--jeok);
}
h1 {
  margin: 0 0 16px;
  font-family: var(--font-display);
  font-size: clamp(26px, 4vw, 36px);
  letter-spacing: 0.06em;
  line-height: 1.3;
}
.lead {
  margin: 0;
  font-size: 16px;
  line-height: 1.85;
  color: var(--ink-soft);
}
section {
  margin-top: 40px;
  padding-top: 18px;
  border-top: 1px solid var(--line);
}
h2 {
  margin: 0 0 12px;
  font-family: var(--font-display);
  font-size: 18px;
  letter-spacing: 0.16em;
}
section p {
  margin: 0;
  font-size: 14.5px;
  line-height: 1.8;
  color: var(--ink-soft);
}
.menus {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 14px;
}
.menus a {
  font-family: var(--font-display);
  font-size: 16px;
  color: var(--ink);
  text-decoration: none;
  border-bottom: 1px solid var(--jeok);
}
.menus a:hover { color: var(--jeok); }
.menus p { margin: 4px 0 0; }
.pairs { border-collapse: collapse; width: 100%; font-size: 14.5px; }
.pairs th, .pairs td { text-align: left; padding: 7px 0; border-bottom: 1px dotted var(--line); }
.pairs th { font-family: var(--font-display); font-weight: 700; width: 120px; color: var(--jeok); }
.plain { margin: 0; padding-left: 18px; font-size: 14.5px; line-height: 1.8; color: var(--ink-soft); }
code { font-family: var(--font-util); font-size: 0.9em; }
a { color: var(--jeok); }
.back { margin-top: 48px; font-family: var(--font-util); font-size: 14px; }
.back a { text-decoration: none; }
</style>
