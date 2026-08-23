<script setup>
// 소개: 어떤 서비스인지, 무엇으로 만들었는지
import { RouterLink } from 'vue-router'
import inwang from '@/assets/minhwa-art/inwang.jpg'
import obongdo from '@/assets/minhwa-art/obongdo.jpg'
import mudong from '@/assets/minhwa-art/mudong.jpg'
import ssireum from '@/assets/minhwa-art/ssireum.jpg'
import seodang from '@/assets/minhwa-art/seodang.jpg'
import tiger from '@/assets/minhwa-art/tiger.jpg'
import { weatherList, worldList } from '@/data/weatherData.js'

// 머리 숫자
const stats = [
  { n: 6, k: '폭', d: '날씨마다 한 폭' },
  { n: weatherList.length, k: '고을', d: '국내 + 세종기지' },
  { n: worldList.length, k: '곳', d: '세계 화폭' },
  { n: 10, k: '분', d: '실측 갱신 주기' },
]

const menus = [
  { to: '/', name: '국내 화폭', hanja: '八道晴雨錄', desc: '한옥 분합문이 열리며 시작. 국내 열 고을과 남극 세종기지의 오늘 하늘을 여섯 폭 민화가 대신 전합니다.' },
  { to: '/world', name: '세계화폭', hanja: '萬國晴雨錄', desc: '바다 건너 열 곳. 그 나라의 명화 위에 현지 시각과 실황 효과(비·안개·바람)가 얹힙니다.' },
  { to: '/guide', name: '빨래 지침', hanja: '洗濯指針', desc: '기온·습도·바람·하늘을 100점으로 환산하는 규칙.' },
  { to: '/classic', name: '실습 대시보드', hanja: '實習', desc: '수업 실습으로 만든 카드형 대시보드. 단위 전환(℃/℉)과 검색이 됩니다.' },
]

const pairs = [
  { w: '비 · 뇌우', h: '雨', img: inwang, title: '인왕제색도', by: '정선 · 1751' },
  { w: '맑음', h: '晴', img: obongdo, title: '일월오봉도', by: '조선 궁중' },
  { w: '바람', h: '風', img: mudong, title: '무동', by: '김홍도' },
  { w: '구름', h: '雲', img: ssireum, title: '씨름', by: '김홍도' },
  { w: '흐림 · 안개', h: '曇', img: seodang, title: '서당', by: '김홍도' },
  { w: '눈', h: '雪', img: tiger, title: '작호도', by: '민화 · 세화' },
]
</script>

<template>
  <main class="about">
    <header class="head">
      <div class="head-art" aria-hidden="true">
        <img :src="inwang" alt="" decoding="async" />
        <span class="vt">晴雨錄</span>
      </div>
      <p class="eyebrow util">晴雨錄 · 서비스 소개</p>
      <h1>화폭을 내리면 팔도의 날씨가 펼쳐집니다</h1>
      <p class="lead">
        청우록(晴雨錄)은 조선의 민화·풍속화가 지금의 날씨를 대신 말해 주는 스크롤 화폭입니다. 비가 드는 고을은 「인왕제색도」에,
        맑은 고을은 「일월오봉도」에 깃들고, 고을 이름을 누르면 두루마리가 펼쳐져 오늘과 앞날의 하늘을 세로 기문으로 적어 줍니다.
      </p>
      <ul class="stats">
        <li v-for="st in stats" :key="st.k">
          <b>{{ st.n }}<small>{{ st.k }}</small></b>
          <span>{{ st.d }}</span>
        </li>
      </ul>
    </header>

    <section>
      <h2>화폭</h2>
      <ul class="menus">
        <li v-for="m in menus" :key="m.to">
          <RouterLink :to="m.to">
            <span class="mn">{{ m.name }}</span>
            <span class="mh">{{ m.hanja }}</span>
          </RouterLink>
          <p>{{ m.desc }}</p>
        </li>
      </ul>
    </section>

    <section>
      <h2>하늘과 그림의 대응</h2>
      <ul class="pairs">
        <li v-for="p in pairs" :key="p.w">
          <img :src="p.img" :alt="p.title" loading="lazy" decoding="async" />
          <i class="seal">{{ p.h }}</i>
          <b>{{ p.w }}</b>
          <span class="t">{{ p.title }}</span>
          <span class="by">{{ p.by }}</span>
        </li>
      </ul>
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
        <li>Vue 3 (Composition API) · Vite · Vue Router · Pinia · Axios · Element Plus · Lenis</li>
        <li>연출은 CSS/SVG 필터로 — 먹 번짐, 수면 흩어짐, 선묘 에칭, 종이 질감</li>
        <li>민화·명화: 위키미디어 공용 퍼블릭 도메인 스캔 · 분합문 사진: 오리 이원익 종택, 문화재청(공공누리 제1유형) · 두루마리 질감: Poly Haven(CC0)</li>
      </ul>
    </section>

    <p class="back util"><RouterLink to="/">← 국내 화폭으로</RouterLink></p>
  </main>
</template>

<style scoped>
.about {
  max-width: 760px;
  margin: 0 auto;
  padding: 48px 24px 96px;
  color: var(--ink);
}
.head {
  position: relative;
  padding-top: 12px;
}
/* 머리 그림: 인왕제색도를 옅게 깔고 오른쪽에 세로 제호 */
.head-art {
  position: relative;
  height: 220px;
  margin: 0 0 26px;
  overflow: hidden;
  border: 1px solid var(--line);
  background: var(--baek);
}
.head-art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 40%;
  filter: saturate(0.7) contrast(0.95);
  -webkit-mask-image: linear-gradient(90deg, #000 40%, rgba(0, 0, 0, 0.35) 100%);
  mask-image: linear-gradient(90deg, #000 40%, rgba(0, 0, 0, 0.35) 100%);
}
.head-art .vt {
  position: absolute;
  right: 22px;
  top: 18px;
  writing-mode: vertical-rl;
  font-family: var(--font-display);
  font-size: 40px;
  letter-spacing: 0.3em;
  color: var(--ink);
  text-shadow: 0 0 12px rgba(251, 246, 234, 0.9);
}
.stats {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin: 26px 0 0;
  padding: 16px 0 0;
  border-top: 1px solid var(--line);
}
.stats li {
  display: grid;
  gap: 2px;
}
.stats b {
  font-family: var(--font-display);
  font-size: 30px;
  font-weight: 400;
  line-height: 1;
  color: var(--jeok);
}
.stats small {
  margin-left: 3px;
  font-size: 13px;
  color: var(--ink);
}
.stats span {
  font-size: 13px;
  color: var(--ink-soft);
}
.eyebrow {
  margin: 0 0 8px;
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
  font-size: 17px;
  line-height: 1.9;
  color: var(--ink-soft);
}
section {
  margin-top: 44px;
  padding-top: 20px;
  border-top: 1px solid var(--line);
}
h2 {
  margin: 0 0 16px;
  font-family: var(--font-display);
  font-size: 20px;
  letter-spacing: 0.16em;
}
section p {
  margin: 0;
  font-size: 15.5px;
  line-height: 1.85;
  color: var(--ink-soft);
}
.menus {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px 28px;
}
.menus a {
  display: flex;
  align-items: baseline;
  gap: 10px;
  font-family: var(--font-display);
  font-size: 18px;
  color: var(--ink);
  text-decoration: none;
}
.menus .mh {
  font-size: 12px;
  letter-spacing: 0.3em;
  color: var(--jeok);
}
.menus a:hover .mn {
  color: var(--jeok);
}
.menus p {
  margin: 4px 0 0;
}
/* 화폭 여섯 장의 작은 도록 */
.pairs {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(136px, 1fr));
  gap: 18px 14px;
}
.pairs li {
  position: relative;
  display: grid;
  gap: 3px;
  font-size: 14px;
}
.pairs img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border: 1px solid var(--line);
  padding: 4px;
  background: var(--baek);
  box-shadow: 0 6px 16px -10px rgba(34, 28, 22, 0.5);
  transition: transform 0.4s ease;
}
.pairs li:hover img {
  transform: translateY(-3px) rotate(-0.6deg);
}
.pairs .seal {
  position: absolute;
  top: 10px;
  left: 10px;
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  background: var(--jeok);
  color: var(--baek);
  font-style: normal;
  font-size: 13px;
  border-radius: 3px;
  box-shadow: inset 0 0 0 1.5px rgba(251, 246, 234, 0.4);
}
.pairs b {
  margin-top: 6px;
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--jeok);
}
.pairs .t {
  font-family: var(--font-display);
}
.pairs .by {
  font-size: 12px;
  color: var(--ink-soft);
}
.plain {
  margin: 0;
  padding-left: 18px;
  font-size: 15px;
  line-height: 1.85;
  color: var(--ink-soft);
}
code {
  font-family: var(--font-util);
  font-size: 0.9em;
}
a {
  color: var(--jeok);
}
.back {
  margin-top: 48px;
  font-size: 14px;
}
.back a {
  text-decoration: none;
}
@media (max-width: 520px) {
  .head-art { height: 150px; }
  .head-art .vt { font-size: 28px; right: 14px; top: 12px; }
  .stats { grid-template-columns: repeat(2, 1fr); }
}
</style>
