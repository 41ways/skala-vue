// 수업에서 배운 것 → 이 프로젝트 어디에 썼는지. 대시보드 '배운 점' 탭과 README가 같은 데이터를 본다
export const learned = [
  {
    unit: 'Modern JavaScript',
    hanja: '文法',
    items: [
      ['구조분해·spread', '응답에서 const { data } = …, 도시 객체 복사 { ...c, temp, live: true }', 'composables/useWeather.js'],
      ['옵셔널 체이닝 ?. / ??', 'props.city?.temp ?? 0, progress.value[i] ?? 0', 'ScrollSheet.vue · 각 뷰'],
      ['배열 메서드', 'map / filter / find / toSorted 로 도시 필터·정렬', 'WeatherHomeView.vue'],
      ['템플릿 리터럴', '인라인 스타일 문자열 `translateY(${…}px)`', 'ArtStage.vue'],
    ],
  },
  {
    unit: 'Vue 기본 문법',
    hanja: '指示',
    items: [
      ['v-for + :key', '도시 카드, 챕터, 누끼 부위, 빗방울 입자까지 전부 key 지정', '전 뷰'],
      ['v-if / v-show', '드물게 바뀌는 빗방울·눈은 v-if, 자주 토글되는 차례는 v-show', 'ArtStage · MinhwaHomeView'],
      [':class / :style', '어두운 화폭이면 글자색 반전, 스크롤 진행도로 opacity·transform 실시간 계산', 'MinhwaHomeView · ArtStage'],
      ['@click.stop', '카드 선택과 상세보기 버튼이 겹치지 않게 버블링 차단', 'WeatherCard.vue'],
      ['{{ }} 안 표현식', '{{ city.temp }}°, {{ fld(ch, i, "title") }}', 'MinhwaHomeView.vue'],
    ],
  },
  {
    unit: 'Composition API · 반응성',
    hanja: '反應',
    items: [
      ['ref()', '스크롤 진행도, 두루마리에 띄울 도시, 한자/숫자 모드', 'MinhwaHomeView · ScrollSheet'],
      ['computed()', '검색 결과 filteredWeatherList, 평균 점수, 한자 숫자 텍스트', 'WeatherHomeView · ScrollSheet'],
      ['watch / watchEffect', '선택 도시 변경 콘솔, 검색어 추적, 도시 바뀌면 예보 재호출', 'WeatherHomeView · ScrollSheet'],
      ['생명주기', 'onMounted에서 API 호출·리스너 등록, onBeforeUnmount에서 해제', 'MinhwaHomeView.vue'],
      ['컴포저블', 'useWeather(조회), useDisplayTemp(단위 변환, toValue로 값·ref·getter 모두 받음)', 'composables/'],
    ],
  },
  {
    unit: '컴포넌트',
    hanja: '部品',
    items: [
      ['props / emits', 'SearchBar(update-query), WeatherCard(select-card, click-detail), ScrollSheet(close)', 'components/'],
      ['slot', 'BaseDashboardCard가 제목만 갖고 내용은 부모가 주입', 'BaseDashboardCard.vue'],
      ['<Transition>', '두루마리 등장·퇴장, 맨 위로 버튼, 개발 일지 펼침', 'ScrollSheet · App · DevNotes'],
      ['defineAsyncComponent', '두루마리는 처음 누를 때 불러온다', 'MinhwaHomeView · WorldWeatherView'],
      ['scoped style + :deep()', 'Element Plus 기본 스킨을 한지 톤으로 덧입힘', 'SearchBar · WeatherCard'],
    ],
  },
  {
    unit: 'Vue Router',
    hanja: '路程',
    items: [
      ['지연 로딩 · catch-all', '첫 화면 외 전부 import(), /:pathMatch(.*)* → 404', 'router/index.js'],
      ['동적 경로', '/weather/:cityId, onMounted에 route.params로 도시 선택', 'WeatherDetailView.vue'],
      ['Programmatic Navigation', '상세보기 = router.push, 검색어 = router.replace({ query })', 'WeatherHomeView.vue'],
      ['route.meta', 'meta.showsTemp 인 화면에서만 내비에 단위 토글', 'router · App.vue'],
      ['scrollBehavior · 문서 제목', '화폭 이동 시 맨 위로, 라우트마다 document.title', 'router · App.vue'],
    ],
  },
  {
    unit: 'Pinia',
    hanja: '狀態',
    items: [
      ['state / getter / action', 'unit, unitSymbol, toggleUnit (+ toTemp 변환)', 'stores/configStore.js'],
      ['storeToRefs', '구조분해해도 반응성이 살아 있게', 'UnitToggler · useDisplayTemp'],
      ['영속화', '고른 단위를 localStorage에 기억, 새로고침해도 유지', 'stores/configStore.js'],
    ],
  },
  {
    unit: 'Axios',
    hanja: '通信',
    items: [
      ['axios.create', 'baseURL·timeout을 한 곳에, 응답 인터셉터로 429/타임아웃을 한국어 문구로', 'api/openMeteo.js'],
      ['호출 예산', '도시 21곳을 좌표 묶음으로 2회, 예보는 열 때만, 10분 캐시', 'composables/useWeather.js'],
      ['폴백', '실패하면 표본 자료로 물러나고 화면에 "표본"이라 표시', 'useWeather · ScrollSheet'],
      ['Geolocation + API', '내 위치 → 좌표 → 날씨 → 빨래 지수', 'MinhwaHomeView.vue'],
    ],
  },
  {
    unit: 'UI Library',
    hanja: '部件',
    items: [
      ['Element Plus', 'el-input(clearable) · el-tag · el-progress · el-button · el-tabs', '실습 대시보드'],
    ],
  },
  {
    unit: '빌드 · 배포',
    hanja: '配布',
    items: [
      ['ESLint 규칙', "eqeqeq 'always', no-console 'off', 린트 0 에러", 'eslint.config.js'],
      ['env 분리', '.env.staging / .env.production, build:staging', 'package.json'],
      ['GitHub Pages', 'Actions로 빌드·배포, %BASE_URL%로 하위 경로 대응, 404.html 폴백', '.github/workflows'],
      ['PWA · 메타', 'manifest·아이콘, OG 이미지, 라우트별 제목', 'public/ · index.html'],
    ],
  },
]

// 회고 - 짧게
export const reflections = [
  '일반 변수는 화면이 안 바뀐다. 스크롤 진행도를 만들며 ref가 왜 필요한지 몸으로 확인.',
  'API가 실패해도 화면이 깨지지 않게, 표본 폴백을 먼저 두고 개발하니 시연 걱정이 없어졌다.',
  '단위는 꼭 명시한다. 풍속 km/h를 m/s라고 써 놓고 한참을 지나쳤다.',
  '경계값(100)을 테스트하지 않으면 숫자가 글자로 새어 나온다. 순수 함수엔 작은 테스트라도 붙인다.',
  '설치·등록만 한 라이브러리는 안 쓴 것과 같다. 요구사항 표와 코드를 한 줄씩 대조해야 보인다.',
  '보기 좋은 전환보다 확실히 동작하는 전환. 화면을 막을 수 있는 연출은 뺐다.',
  '같은 과제를 푼 동료 11명의 저장소에서 라우트 meta, 단위 영속화, 검색어 URL 동기화를 배워 들였다.',
]
