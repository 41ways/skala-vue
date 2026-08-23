// 수업에서 배운 것과 이 프로젝트에서 쓴 자리. README와 같은 내용
export const learned = [
  {
    unit: 'Modern JavaScript',
    hanja: '文法',
    items: [
      ['구조분해, spread', 'API 응답 받을 때 const { data }, 도시에 날씨 덮어쓸 때 { ...c, temp }', 'useWeather.js'],
      ['?. 와 ??', '아직 값이 없을 수도 있는 곳에 props.city?.temp ?? 0', 'ScrollSheet.vue'],
      ['map, filter, find, toSorted', '도시 검색하고 점수순으로 정렬', 'WeatherHomeView.vue'],
      ['템플릿 리터럴', '스타일 문자열 만들 때', 'ArtStage.vue'],
    ],
  },
  {
    unit: 'Vue가 뭔지',
    hanja: '根本',
    items: [
      ['MVVM', '데이터만 바꾸면 화면이 따라옴. DOM을 직접 고치는 코드는 하나도 없음', '전체'],
      ['SPA', 'index.html 하나에 Router로 화면만 바꿈. 서버는 날씨 숫자만 줌', 'router/'],
      ['컴포넌트', '그림 무대, 누끼 인물, 두루마리를 각각 만들어서 조립', 'components/minhwa/'],
    ],
  },
  {
    unit: '프로젝트 구조, SFC',
    hanja: '構造',
    items: [
      ['진입 흐름', 'index.html → main.js → App.vue. main.js에 Pinia, Router, Element Plus 등록', 'main.js'],
      ['SFC', '모든 .vue 파일은 script setup, template, style scoped 세 칸. Options API는 안 씀', '전체'],
      ['파일 이름', '파스칼 케이스', '전체'],
    ],
  },
  {
    unit: '반응성',
    hanja: '反應',
    items: [
      ['ref', '스크롤 진행도, 두루마리에 띄울 도시, 한자/숫자 모드', 'MinhwaHomeView · ScrollSheet'],
      ['computed', '검색 결과, 평균 점수, 한자로 바꾼 숫자', 'WeatherHomeView · ScrollSheet'],
      ['watch / watchEffect', '도시가 바뀌면 예보 다시 부르기 / 검색어 따라가기', 'ScrollSheet · WeatherHomeView'],
      ['생명주기', 'onMounted에서 API 부르고 스크롤 리스너 달기, onBeforeUnmount에서 떼기', 'MinhwaHomeView.vue'],
      ['컴포저블', 'useWeather(날씨 조회), useDisplayTemp(단위 바꾸기)', 'composables/'],
    ],
  },
  {
    unit: '디렉티브',
    hanja: '指示',
    items: [
      [':class', "어두운 폭은 데이터에 tone: 'light'라고 적어 두고 글자를 흰색으로. 배경색을 읽는 건 아님", 'MinhwaHomeView.vue'],
      [':style', '스크롤 진행도 숫자로 투명도와 위치를 계속 바꿈', 'ArtStage.vue'],
      ['v-if / v-show', 'v-if는 비 안 오는 화폭엔 아예 없는 빗방울에, v-show는 스크롤마다 보였다 안 보였다 하는 차례에', 'ArtStage · MinhwaHomeView'],
      ['v-for + :key', '도시, 챕터, 누끼 부위, 빗방울까지 전부', '전체'],
      ['@click, .stop', '두루마리 열고 닫기. 카드 안 버튼은 .stop으로 카드 클릭 같이 터지는 거 막기', 'WeatherCard.vue'],
    ],
  },
  {
    unit: '컴포넌트 통신',
    hanja: '部品',
    items: [
      ['props / emit', '검색창, 날씨 카드, 두루마리 닫기', 'components/exercise/ · ScrollSheet'],
      ['slot', '대시보드 카드 틀', 'BaseDashboardCard.vue'],
      ['Transition', '두루마리 열릴 때, 맨 위로 버튼, 개발 일지 펼칠 때', 'ScrollSheet · App · DevLog'],
      ['defineAsyncComponent', '두루마리는 누를 때 처음 불러옴', 'MinhwaHomeView · WorldWeatherView'],
    ],
  },
  {
    unit: 'Router',
    hanja: '路程',
    items: [
      ['기본', '지연 로딩, 없는 주소는 404, /weather/:cityId, router.push와 replace, 화면 바뀌면 맨 위로', 'router/index.js'],
      ['route.meta', '기온 나오는 화면에서만 단위 토글', 'App.vue'],
    ],
  },
  {
    unit: 'Pinia',
    hanja: '狀態',
    items: [
      ['configStore', '단위 하나를 state로, 기호는 getter, 바꾸는 건 action. storeToRefs로 꺼내 씀. localStorage에 저장', 'stores/configStore.js'],
    ],
  },
  {
    unit: 'Axios',
    hanja: '通信',
    items: [
      ['openMeteo.js', 'axios.create로 주소 한 곳에, 인터셉터로 오류 문구', 'api/openMeteo.js'],
      ['요청 줄이기', '도시를 묶어서 부르고 10분 캐시, 안 되면 표본으로', 'composables/useWeather.js'],
    ],
  },
  {
    unit: 'UI Library',
    hanja: '部件',
    items: [['Element Plus', 'input, tag, progress, button, tabs', '실습 대시보드']],
  },
  {
    unit: '빌드, 배포',
    hanja: '配布',
    items: [
      ['ESLint, Prettier', '규칙 추가, lint 에러 0', 'eslint.config.js'],
      ['.env', 'staging / production 두 개로 나누고 build:staging', 'package.json'],
      ['배포', 'GitHub Actions로 Pages에 올리기', '.github/workflows'],
    ],
  },
]

// 회고
export const reflections = [
  '교재의 "스타일 바인딩은 수치를 실시간으로 미세 조정할 때 쓴다"는 말에서 영감을 얻어, 스크롤 진행도에 따라 달라지는 그림을 만들어 봄. 클래스 바인딩만 쓸 때는 스타일 바인딩을 잘 안쓰게되고 잘 안 와닿았는데, 활용할 생각으로 시작하니 두개의 활용도를 더 잘 계획하고 활용 할 수 있게됨',
  'v-if / v-show 쓰는 기준이 헷갈렸음. 빗방울은 비 오는 화폭이 아니면 아예 없는 거라 v-if, 왼쪽 차례는 스크롤할 때마다 보였다 안 보였다 하는 거라 v-show로 둠. 그렇게 나누고 보니 "얼마나 자주 바뀌나"보다 "없앨 거냐 숨길 거냐"로 생각하는 게 더 쉬웠음.',
  '그림이 움직이는 건 전부 CSS 애니메이션이고 Vue는 스크롤 진행도 숫자 하나만 관리함. 처음엔 Vue로 다 하려다가 중간에 UI 구성을 먼저 하는 걸로 순서를 바꾸면서 상태는 Vue, 연출은 CSS로 나눠서 짰는데 코드 가독성이 눈에 띄게 좋아짐. 적당한 분리가 필요하다고 느낌.',
  'API를 몇 번 부르는지도 설계 - 429가 뜨기 전엔 호출 횟수를 세어 본 적이 없었는데, 묶어서 부르고 캐시하니 페이지당 20번이 2번이 됨. 기능이 되는 것과 쓸 만하게 되는 건 다르다는 걸 트러블슈팅으로 알게 됨.',
  '그림을 웹 화면 기준으로 꽉 채우다 보니 화면 폭별로 반응형 이슈가 많았음. 미디어 쿼리 경계 사이 폭을 일부러 열어봐야겠다는 생각이 들었고, 설계 순서를 모바일에서 웹으로 가는 게 더 편할지도 모르겠다 싶었음. 당근 같은 회사는 색, 글자, 컴포넌트 같은 디자인 시스템을 미리 만들어 두고 모바일과 웹이 같은 디자인 토큰을 씀. 이번 과제에서도 minhwa.css에 색 7개와 서체 3개를 토큰으로 모아 두고 화면 전부가 그 변수만 쓰게 했는데, 토큰은 잘 세웠어도 설계 순서와 방식에는 아쉬움이 남았음.',
]
