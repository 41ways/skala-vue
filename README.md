# skala-vue

SKALA 프론트엔드 프레임워크(Vue.js) 과정 실습 저장소.

## 개발 환경

- Node.js v26.5.1 / npm 12.0.2
- create-vue 3.22.3 으로 스캐폴딩
- 스캐폴딩 옵션: TypeScript 미사용, JSX 미사용, Vue Router 사용, Pinia 사용, Vitest 미사용, E2E 미사용, ESLint 사용, Prettier 사용

강의 자료 기준 Node 버전은 v24.16.0 이지만 package.json 의 engines 가 >=22.12.0 이라 상위 버전으로 진행함.

## 실행

```sh
npm install
npm run dev
```

개발 서버는 http://localhost:5173 에서 뜬다.

```sh
npm run lint     # oxlint + eslint
npm run format   # prettier
npm run build    # dist 생성
```

## 폴더 구조

```
src/
  App.vue                        루트 컴포넌트
  main.js                        진입점, createApp 으로 앱 인스턴스 생성
  components/
    practices/basic/             단원별 실습 컴포넌트
  router/                        라우팅 경로 정의
  stores/                        Pinia 저장소
  views/                         페이지 단위 화면
```

실습 컴포넌트는 `components/practices/` 아래에 단원별로 나눠서 넣는다.

## 실습 기록

### 2. Getting Started with Vue.js

프로젝트 스캐폴딩과 개발 서버 구동까지 진행.

HMR 확인은 개발 서버를 띄운 상태에서 `views/AboutView.vue` 의 template 을 수정하는 방식으로 했다. 새로고침 없이 화면이 바뀌는 것을 확인한 뒤 원래 내용으로 되돌렸다.

커스터마이징 내역:

- (작성 예정)

### 3. Vue Syntax

`App.vue` 를 비우고 실습용 컴포넌트를 자식으로 갈아 끼우는 구조로 바꿨다.

SampleOne.vue - 반응형 데이터

- `let normalCount` 은 값이 바뀌어도 화면에 반영되지 않는다.
- `ref()` 로 감싼 `vueCount` 는 값이 바뀌는 즉시 화면에 반영된다.
- 일반 변수를 여러 번 누른 뒤 반응성 변수를 누르면, 리렌더가 일어나면서 그동안 누적된 일반 변수 값도 같이 화면에 나타난다.

SampleTwo.vue - 텍스트 보간

- `{{ }}` 안에서 변수뿐 아니라 `toUpperCase()`, `Math.ceil()` 같은 자바스크립트 표현식도 쓸 수 있다.

강의 자료 71쪽 예제에는 `import { ref } from 'vue'` 가 들어 있는데 SampleTwo 에서는 ref 를 쓰지 않는다. 그대로 두면 ESLint 에서 미사용 변수로 잡히기 때문에 import 를 뺐다.

커스터마이징 내역:

- (작성 예정)

## 배포

- (작성 예정)
