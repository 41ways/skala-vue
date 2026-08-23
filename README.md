# 청우록 晴雨錄

그림으로 보는 오늘 날씨.

배포 https://41ways.github.io/skala-vue/
저장소 https://github.com/41ways/skala-vue

수업 과제인 날씨 대시보드는 /classic에 그대로 두고, 그 위에 "그림이 날씨를 대신 말해주는 사이트"를 얹음.
원래 화면에 그림을 꽉 채우는 디자인을 좋아하기도 했고, 날씨 카드를 만들다 보니 숫자보다 그림 한 장이 더 와닿겠다 싶어서 시작.


## 화면

| 경로 | 화면 | 설명 |
|---|---|---|
| / | 국내 화폭 | 한옥 문이 열리면서 시작. 국내 10개 도시 날씨에 따라 민화 6폭이 차례로 나오고, 도시 이름을 누르면 두루마리가 펼쳐짐 |
| /world | 세계화폭 | 해외 10곳. 나라마다 그 나라 그림 한 폭, 현지 시각, 비·안개·바람 효과. 두 번째 '스칼라'는 시연용이라 날씨 고정 |
| /guide | 빨래 지침 | 빨래 지수 계산 규칙과 예시 |
| /classic | 실습 대시보드 | 과제 화면. 아래에 개발 일지 / 배운 점 / 회고 탭 |
| /weather/:cityId | 상세 | 과제의 동적 라우트 |
| /about | 소개 | 만든 재료와 그림 출처 |


## 과제 단원별로 한 것

교재 순서대로. 괄호 안은 교재 쪽수. 화살표 뒤는 사이트 어디서 보이는지 — 표시 없는 건 실습 대시보드(/classic) 안에 있음.

1. Vue 문법 (views/WeatherHomeView.vue)
- v-for + :key로 도시 카드 출력 (p.87, p.116)
- v-if로 25도 기준 더움/선선함 라벨 (p.84, p.116)
- 검색 input 한글 입력 출력 (p.116)
- 카드 클릭 시 상태바 "OO이 선택되었습니다" (p.116)
- 상세보기 버튼은 @click.stop으로 카드 클릭 같이 터지는 거 방지 (p.102)
- 도시 3개 → 10개 + 세종기지, 습도·바람 필드 추가해서 빨래 지수 계산 → 국내 화폭(/) 고을 목록과 두루마리에도 같은 데이터

2. Composition API (같은 파일)
- searchQuery, selectedCityInfo, weatherList를 ref로 (p.65)
- filteredWeatherList는 computed로 검색어 필터 (p.127, p.145)
- watch(selectedCityInfo) 콘솔 출력, watchEffect(searchQuery) 콘솔 출력 (p.130, p.141)
- 추가 computed: scoredList, sortedList, averageScore, dryableCount

3. 컴포넌트 (components/exercise/)
- BaseDashboardCard: slot으로 내용 주입 (p.173, p.178)
- SearchBar: props로 검색어 받고 update-query emit (p.157, p.165)
- WeatherCard: select-card, click-detail emit (p.165)
- SummaryBar 추가 분리, 각 컴포넌트 style scoped (p.178)
- 과제 1~3 원본은 /classic 탭에서 그대로 실행됨

4. Router (router/index.js, App.vue)
- 지연 로딩 import(), catch-all /:pathMatch(.*)* → 404 (p.195, p.196) → 전체 화면, 없는 주소 입력 시 404 페이지
- /weather/:cityId 동적 경로, onMounted에서 route.params로 도시 선택 (p.186, p.189) → 상세(/weather/city_01)
- 상세보기 window.alert → router.push (p.190, p.196)
- RouterLink 내비 + RouterView (p.183) → 상단 내비 5개 메뉴
- 추가: 라우트 meta로 기온 화면에서만 단위 토글 표시 → 상단 내비(대시보드·상세에서만 ℃/℉ 보임), 검색어 ?q= 동기화(router.replace), 라우트별 document.title → 브라우저 탭 제목

5. Pinia (stores/configStore.js, components/exercise/UnitToggler.vue)
- unit state / unitSymbol getter / toggleUnit action (p.203, p.212)
- UnitToggler 내비 옆 배치, 메인·상세 단위 적용 (p.212) → 상단 내비 오른쪽, 상세(/weather/…)
- storeToRefs로 구조분해 (p.205)
- 교재 참고란의 "중복은 Composable로" → composables/useDisplayTemp.js (p.212)
- 추가: 단위를 localStorage에 저장 (p.207) → 새로고침 후에도 내비 토글 상태 유지

6. Axios (api/openMeteo.js, composables/useWeather.js)
- OpenWeatherMap 대신 키 없는 Open-Meteo 사용. 정적 배포에서 키가 번들에 남는 문제 회피 (p.274 API 키 주의) → 국내 화폭(/), 세계화폭(/world), 두루마리, '지금 계신 곳의 하늘 보기'
- axios.create로 baseURL·timeout, 인터셉터로 오류를 한글 문구로 (p.222, p.226) → 국내 화폭 '지금 계신 곳의 하늘 보기' 실패 시 문구
- 도시 21곳 좌표 묶음 요청 국내 1회·해외 1회 → 국내 화폭·세계화폭, 예보는 두루마리 열 때 1회 → 두루마리 내일·모레·글피, sessionStorage 10분 캐시
- 실패 시 표본 데이터 폴백, 화면에 "표본" 표시 → 국내 화폭 첫 화면 한 줄, 두루마리 날짜 옆, 세계화폭 독법

7. UI Library (Element Plus) (p.233~249)
- el-input 검색창, el-tag 등급, el-progress 점수 막대, el-button 상세보기, el-tabs 하단 탭
- :deep()으로 한지 톤에 맞게 색만 변경

8. 빌드·배포
- ESLint eqeqeq 'always', no-console 'off', lint 에러 0 (p.270)
- .env.staging / .env.production VITE_API_URL, build:staging, 대시보드 콘솔 출력으로 확인 (p.272)
- npm run build → dist, GitHub Actions → GitHub Pages (p.273, p.274) → 배포 주소
- 하위 경로 /skala-vue/ 때문에 index.html 링크는 %BASE_URL%, 딥링크는 404.html = index.html 복사 → 배포 주소에서 /world 직접 접속, 파비콘


## 실습에서 배운 것

교재 단원 순서. 수업에서 한 것과 이 프로젝트에서 실제로 쓴 자리.

Modern JavaScript
- 구조분해·spread - API 응답 const { data } = …, 도시 객체 복사 { ...c, temp, live: true } (useWeather.js)
- 옵셔널 체이닝 ?. / 널 병합 ?? - props.city?.temp ?? 0 (ScrollSheet.vue 등)
- map / filter / find / toSorted - 도시 검색·정렬 (WeatherHomeView.vue)
- 템플릿 리터럴 - 인라인 스타일 translateY(${…}px) (ArtStage.vue)

Vue가 뭔지 (MVVM, SPA, 컴포넌트)
- 데이터가 바뀌면 화면이 따라옴. DOM을 직접 만지는 코드 없음
- index.html 하나 + Router로 화면 전환. 서버는 날씨 데이터만 줌
- 그림 무대(ArtStage), 누끼 인물(MinhwaCut), 두루마리(ScrollSheet)를 부품으로 조립

프로젝트 구조 · SFC
- index.html - main.js - App.vue 흐름 그대로. main.js에서 Pinia·Router·Element Plus 등록
- 모든 .vue가 <script setup> / <template> / <style scoped>. Options API는 안 씀
- 파일명은 파스칼 케이스

반응성
- ref - 스크롤 진행도, 두루마리에 띄울 도시, 한자/숫자 모드
- computed - 검색 결과, 평균 점수, 한자 숫자 텍스트
- watch - 도시가 바뀌면 예보 다시 호출, 라우트 바뀌면 맨 위로 / watchEffect - 검색어 추적
- onMounted에서 API 호출·리스너 등록, onBeforeUnmount에서 해제
- 컴포저블: useWeather(조회), useDisplayTemp(단위 변환, toValue로 값·ref·getter 다 받음)

디렉티브
- v-bind 클래스 - 일월오봉도처럼 어두운 폭은 챕터 데이터에 tone: 'light'를 하드코딩해 두고, :class="{ light }"로 글자를 흰색으로 바꿈. 배경색을 읽어서 판단하는 건 아님
- v-bind 스타일 - 스크롤 진행도로 opacity·transform 실시간 계산 (교재의 "수치를 실시간으로 미세 조정할 때" 그 경우)
- v-if / v-show - 드물게 바뀌는 빗방울은 v-if, 자주 토글되는 차례는 v-show
- v-for + :key - 도시, 챕터, 누끼 부위, 빗방울까지 전부
- v-on - @click으로 두루마리 열고 닫기, @click.stop으로 버블링 차단

컴포넌트 통신
- props / emits - SearchBar(update-query), WeatherCard(select-card, click-detail), ScrollSheet(close)
- slot - BaseDashboardCard
- <Transition> - 두루마리, 맨 위로 버튼, 개발 일지 펼침
- defineAsyncComponent - 두루마리는 처음 누를 때 불러옴

Router
- 지연 로딩, catch-all, 동적 경로, router.push / router.replace, scrollBehavior
- route.meta - 기온 나오는 화면에서만 단위 토글

Pinia
- state / getter / action, storeToRefs, localStorage에 단위 저장

Axios
- axios.create + 인터셉터, 요청 묶기, 캐시, 실패 시 표본 폴백

UI Library
- Element Plus: el-input, el-tag, el-progress, el-button, el-tabs

빌드·배포
- ESLint 커스텀 규칙, Prettier, .env 모드 분리, build:staging, GitHub Actions - Pages


## 날씨와 그림

| 날씨 | 그림 |
|---|---|
| 비·뇌우 | 인왕제색도 (정선) |
| 맑음 | 일월오봉도 |
| 바람 | 무동 (김홍도) |
| 구름 | 씨름 (김홍도) |
| 흐림·안개 | 서당 (김홍도) |
| 눈 | 작호도 |

WMO 날씨코드를 이 여섯으로 묶어서 도시를 배정.
연출은 CSS/SVG 필터로만 함. 먹 번짐, 물에서 해 떠오르기, 누끼 딴 인물 부위별로 움직이기, 호랑이 머리에 눈 쌓였다 털리기.


## 실행

```
npm install
npm run dev
npm run lint
npm run build
npm run build:staging
```


## 막혔던 것

전부는 /classic 개발 일지에 카드로 있고, 여기엔 크게 걸린 것만.

- 429 - 도시마다 따로 부르니까 새로고침 몇 번에 막힘. 좌표를 쉼표로 묶어 한 번에 받게 바꾸고 10분 캐시를 달음.
- 풍속이 km/h - 화면엔 m/s라고 써놓고 값은 km/h였음. 해외 그림이 전부 바람에 흔들리길래 이상해서 봤더니 Open-Meteo 기본 단위가 km/h. wind_speed_unit=ms.
- Element Plus 등록만 함 - app.use만 해두고 실제로는 한 군데도 안 쓰고 있었음. 제출 전에 과제 표랑 대조하다 발견.
- 페이지 전환 애니메이션 - Transition mode="out-in"을 걸었더니 탭이 비활성일 때 다음 화면이 안 뜸. 뺌.
- Pages 하위 경로 - /favicon.ico 같은 절대 경로가 404. %BASE_URL%로.
- watch와 watchEffect - 수업에서 둘 다 배웠고 어떻게 다른지도 배웠으나 막상 과제에서는 필요가 생기기 전까지 감이 잘 안잡혔음. 선택 도시는 "어디서 어디로 바뀌었는지"가 필요해서 watch, 검색어는 지금 값만 찍으면 돼서 watchEffect로 정리함.


## 회고

- 일반 변수로는 화면이 안 바뀐다는 걸 스크롤 진행도 만들면서 제대로 겪음.
- 교재의 "스타일 바인딩은 수치를 실시간으로 미세 조정할 때 쓴다"는 말에서 영감을 얻어, 스크롤 진행도에 따라 달라지는 그림을 만들어 봄. 클래스 바인딩만 쓸 때는 스타일 바인딩을 잘 안쓰게되고 잘 안 와닿았는데, 활용할 생각으로 시작하니 두개의 활용도를 더 잘 계획하고 활용 할 수 있게됨
- Axios 수업에서 try/catch를 배웠지만 catch 안에 뭘 넣을지는 막연했음. 표본 데이터로 돌아가게 해 두니 API가 죽어도 시연이 되고, 화면에 "표본"이라고 찍히니 오히려 솔직해 보임. 에러는 숨기는 것보다 보여주는 쪽이 낫다는 걸 알게 됨.
- 풍속 km/h와 습도 100% 둘 다 화면엔 멀쩡히 찍혀서 몰랐음. 값이 그럴듯하면 의심을 안 하게 되는데, 단위와 끝값은 일부러 한 번 찍어 봐야 한다는 걸 검수하면서 배움.
- Element Plus를 main.js에 등록해 두고 다 한 줄 알았는데, 제출 전 과제 표와 대조하니 한 군데도 안 쓰고 있었음. 등록은 시작일 뿐이고 어디에 쓸지 정해야 배운 게 된다는 걸 느낌.
- v-if / v-show 쓰는 기준이 헷갈렸음. 빗방울은 비 오는 화폭이 아니면 아예 없는 거라 v-if, 왼쪽 차례는 스크롤할 때마다 보였다 안 보였다 하는 거라 v-show로 둠. 그렇게 나누고 보니 "얼마나 자주 바뀌나"보다 "없앨 거냐 숨길 거냐"로 생각하는 게 더 쉬웠음.
- 그림이 움직이는 건 전부 CSS 애니메이션이고 Vue는 스크롤 진행도 숫자 하나만 관리함. 처음엔 Vue로 다 하려다가 중간에 UI 구성을 먼저 하는 걸로 순서를 바꾸면서 상태는 Vue, 연출은 CSS로 나눠서 짰는데 코드 가독성이 눈에 띄게 좋아짐. 적당한 분리가 필요하다고 느낌.
- API를 몇 번 부르는지도 설계 - 429가 뜨기 전엔 호출 횟수를 세어 본 적이 없었는데, 묶어서 부르고 캐시하니 페이지당 20번이 2번이 됨. 기능이 되는 것과 쓸 만하게 되는 건 다르다는 걸 트러블슈팅으로 알게 됨.
- 그림을 웹 화면 기준으로 꽉 채우다 보니 화면 폭별로 반응형 이슈가 많았음. 미디어 쿼리 경계 사이 폭을 일부러 열어봐야겠다는 생각이 들었고, 설계 순서를 모바일에서 웹으로 가는 게 더 편할지도 모르겠다 싶었음. 실무에서의 설계 방식을 따로 학습하고 경험해보고자 따로 공부하고 검색해본 결과, 색, 글자, 컴포넌트 같은 디자인 시스템을 미리 만들어놓고 쓰는 당근 같은 회사는 모바일과 웹이 같은 디자인 토큰을 쓰고 있음. 그 위에서 화면을 넓혀 가는 쪽이 내가 한 것처럼 웹부터 채우고 줄이는 것보다 덜 깨질 것 같았음. 강사님이 말씀하신 "더하는 건 문제가 되지 않는다, 줄이는 것이 문제다"라는 말이 이런 부분에도 적용되는 것 같았음. 이번 과제에서도 minhwa.css에 한지색·먹색·주홍 같은 색 7개와 서체 3개를 디자인 토큰(--paper, --ink, --jeok, --font-display …)으로 모아 두고 화면 전부가 그 변수만 쓰게 해서, 실습 대시보드 색을 바꿀 때도 값 몇 개만 고치면 됐음. 토큰은 잘 세웠는데 설계 순서와 방식에는 아쉬움이 남았음.
- 라우트 meta로 화면마다 설정을 붙이고, 고른 단위는 localStorage에 남기고, 검색어는 주소에 넣어 새로고침해도 남게 함. 수업에서 배운 Router·Pinia를 한 발씩 더 써 본 것.


## 출처

- 민화·풍속화: 위키미디어 공용 (퍼블릭 도메인)
- 세계 명화: 퍼블릭 도메인 (호쿠사이, 모네, 터너 등)
- 첫 화면 문 사진: 오리 이원익 종택, 문화재청 공공누리 제1유형
- 두루마리 질감: Poly Haven (CC0)
- 날씨: Open-Meteo
