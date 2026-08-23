// 개발 일지. kind 없으면 진짜 트러블슈팅(빨강), 'tweak'는 고치다 발견한 수정사항·손질(노랑)
export const devLog = [
  {
    date: '2026-08-21',
    kind: 'tweak',
    title: 'Mock 데이터에서 Axios 실시간으로',
    summary: '표본 날씨를 Open-Meteo 실시간으로 바꿈. 키가 필요 없는 API를 골라서 키 노출 걱정을 없앰',
    tags: ['axios'],
    detail: [
      '문제: OpenWeatherMap은 키를 발급받아야 하고, 키를 Git에 올리면 안 됨. .env로 빼도 GitHub Pages 같은 정적 배포에서는 결국 번들에 들어감',
      '해결: 키 없는 Open-Meteo로 교체. 호출은 composables/useWeather.js 한 곳에 모으고, 실패하면 weatherData.js 표본으로 돌아가게 함',
      '배운 것: 정적 사이트에선 "키를 환경 변수로"보다 "키가 필요 없는 설계"가 안전함',
    ],
  },
  {
    date: '2026-08-22',
    title: '429 Too Many Requests',
    summary: '도시마다 따로 부르니 새로고침 몇 번에 요청 한도에 걸림',
    tags: ['axios', 'cache'],
    detail: [
      '문제: 국내 11곳 + 해외 10곳 + 두루마리 예보까지 페이지 한 번에 20번 넘게 호출. 개발하면서 새로고침을 반복하니 429가 뜸',
      '해결 1: latitude, longitude에 좌표를 쉼표로 묶어 넘기면 배열로 옴. 국내 1번, 해외 1번으로 줄임',
      '해결 2: 같은 요청은 sessionStorage에 10분 캐시. 여러 번 열어도 실측이 유지됨',
    ],
  },
  {
    date: '2026-08-23',
    title: '풍속이 km/h였음',
    summary: '화면엔 m/s라고 써 놓고 값은 km/h를 쓰고 있었음. 검수하다 발견',
    tags: ['bug', 'qa'],
    detail: [
      '증상: 도쿄 풍속이 11m/s로 나오는데 실제는 3m/s. 그 탓에 해외 그림 7폭이 바람에 흔들리고 4폭은 강풍 처리됨',
      '원인: Open-Meteo 풍속 기본 단위가 km/h. 문서를 끝까지 안 읽음',
      '해결: 요청에 wind_speed_unit=ms 추가. 지금은 1~4m/s로 정상, 강풍은 시연 도시만',
      '배운 것: 단위는 꼭 적고, 값이 그럴듯한지 한 번은 눈으로 봄',
    ],
  },
  {
    date: '2026-08-23',
    title: '한자 숫자가 99에서 멈춤',
    summary: '습도 100%가 "100"으로 찍힘. 百 단위를 빼먹음',
    tags: ['bug'],
    detail: [
      '증상: 두루마리 한자 모드에서 습도 100%, 빨래 100점이 아라비아 숫자 그대로 나옴',
      '원인: toHanja()가 두 자리까지만 처리. 경계값(100)을 테스트 안 함',
      '해결: 百 단위 추가. 순수 함수라 node 스크립트로 작은 테스트를 붙임',
    ],
  },
  {
    date: '2026-08-23',
    kind: 'tweak',
    title: 'Element Plus를 등록만 함',
    summary: 'main.js에 app.use만 있고 el- 컴포넌트가 한 곳도 없었음',
    tags: ['ui-library', 'qa'],
    detail: [
      '발견: 제출 전 과제 요구사항과 대조하다 발견. 번들엔 들어가는데 화면엔 없는 상태',
      '해결: 검색은 el-input, 카드는 el-tag + el-progress + el-button, 아래 탭은 el-tabs. props/emit은 그대로 둬서 부모 코드는 안 건드림',
      '덤: 기본 흰 스킨이 한지 톤과 겉돌아 :deep()으로 색만 덧입힘',
    ],
  },
  {
    date: '2026-08-23',
    title: '페이지 전환 애니메이션이 화면을 막음',
    summary: 'Transition mode="out-in"을 걸었더니 어떤 상황에서 다음 페이지가 안 뜸',
    tags: ['router', 'transition'],
    detail: [
      '증상: 상세보기를 눌러 주소는 바뀌었는데 화면이 그대로. 탭이 비활성일 때 재현됨',
      '원인: out-in은 나가는 화면의 transitionend를 기다리는데, 프레임이 안 그려지면 그 이벤트가 안 옴',
      '결정: 연출보다 동작이 먼저. 전환 페이드는 빼고 두루마리 같은 오버레이에만 전환을 남김',
    ],
  },
  {
    date: '2026-08-23',
    title: 'GitHub Pages 하위 경로에서 파비콘 404',
    summary: '/favicon.ico처럼 절대 경로로 쓰면 /skala-vue/ 밑에선 못 찾음',
    tags: ['deploy', 'vite'],
    detail: [
      '원인: 저장소 이름이 경로에 붙는 GitHub Pages에서 "/manifest.webmanifest"는 루트를 가리킴',
      '해결: index.html에서 %BASE_URL% 치환을 써서 vite.config의 base를 따라가게 함',
      '함께: /world를 직접 열면 404라서 dist/404.html을 index.html 복사본으로 둠',
    ],
  },
  {
    date: '2026-08-23',
    title: '반응형 겹침 5건',
    summary: '768, 1024, 1440 폭에서 차례 레일, 고을 칩, 설명글이 서로 올라탐',
    tags: ['responsive', 'qa'],
    detail: [
      '방법: 브라우저에서 요소 좌표를 계산하는 스크립트로 폭 320~1440을 훑어 겹치는 쌍을 찾음',
      '수정: 설명글 왼쪽 여백을 레일 폭만큼 확보, 태블릿 구간은 레일 숨김, 휴대폰에선 고을 칩이 다음 폭 버튼을 덮지 않게 위치 조정',
      '배운 것: 미디어 쿼리 기준점 사이(900~1100px)가 제일 자주 깨짐',
    ],
  },
  {
    date: '2026-08-23',
    kind: 'tweak',
    title: 'watch와 watchEffect',
    summary: '수업에서 둘 다 배웠고 어떻게 다른지도 배웠으나 과제에서는 필요가 생기기 전까지 감이 잘 안 잡혔음',
    tags: ['composition'],
    detail: [
      '선택 도시는 "어디서 어디로 바뀌었는지"가 필요해서 watch. 이전 값(oldCity)을 같이 받을 수 있음',
      '검색어는 지금 값만 찍으면 돼서 watchEffect. 안에서 읽은 값을 알아서 따라감',
    ],
  },
  {
    date: '2026-08-24',
    kind: 'tweak',
    title: '로딩 화면이 너무 빨리 걷힘',
    summary: '첫 화면 자원이 가벼워서 load 이벤트가 0.5초 안에 끝남. 먹 제호 번짐(1.4초)이 중간에 잘림',
    tags: ['ux'],
    detail: [
      '원래는 load 이벤트가 오면 바로 걷히게 했는데, 실제 로딩이 빠르니 연출이 채 끝나기 전에 사라짐',
      '최소 2.4초는 보여주고, 로딩이 느려도 3.8초에는 걷히도록 하한·상한을 둠',
      '버그는 아니고 손질. 트러블슈팅과 구분하려고 노란 표시',
    ],
  },
  {
    date: '2026-08-23',
    kind: 'tweak',
    title: 'staging / production 환경별 빌드',
    summary: '.env.staging과 .env.production에 VITE_API_URL을 나눠 넣고 build:staging으로 따로 빌드',
    tags: ['env', 'build'],
    detail: [
      'package.json에 "build:staging": "vite build --mode staging" 추가',
      '대시보드 script에서 console.log(import.meta.env.VITE_API_URL)로 어느 env가 로드됐는지 확인',
      '주의: VITE_ 접두사가 없는 변수는 클라이언트에 안 나옴. 비밀값은 넣으면 안 됨',
    ],
  },
]
