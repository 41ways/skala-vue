<script setup>
// 과제
import WeatherMockup from './components/exercise/WeatherMockup.vue'
import WeatherComposition from './components/exercise/WeatherComposition.vue'
import WeatherParent from './components/exercise/WeatherParent.vue'
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from './components/exercise/UnitToggler.vue'

// 1. 학습환경 구성
import SampleOne from './components/practices/basic/SampleOne.vue'
import SampleTwo from './components/practices/basic/SampleTwo.vue'

// 2. Vue Directive
import VHtmlBasic from './components/practices/directive/VHtmlBasic.vue'
import VHtmlXss from './components/practices/directive/VHtmlXss.vue'
import VTextBasic from './components/practices/directive/VTextBasic.vue'
import VBindBasic from './components/practices/directive/VBindBasic.vue'
import VBindClass from './components/practices/directive/VBindClass.vue'
import VBindStyle from './components/practices/directive/VBindStyle.vue'
import VBindShorthand from './components/practices/directive/VBindShorthand.vue'
import VIfBasic from './components/practices/directive/VIfBasic.vue'
import VShowBasic from './components/practices/directive/VShowBasic.vue'
import VForBasic from './components/practices/directive/VForBasic.vue'
import VPreBasic from './components/practices/directive/VPreBasic.vue'
import VCloakBasic from './components/practices/directive/VCloakBasic.vue'
import VOnceBasic from './components/practices/directive/VOnceBasic.vue'
import VMemoBasic from './components/practices/directive/VMemoBasic.vue'

// 3. Vue Event Handling
import EventBasic from './components/practices/event/EventBasic.vue'
import EventObject from './components/practices/event/EventObject.vue'
import EventModifier from './components/practices/event/EventModifier.vue'

// 4. Vue Form Handling
import ModelBasic from './components/practices/form/ModelBasic.vue'
import ModelForm from './components/practices/form/ModelForm.vue'
import ModelModifier from './components/practices/form/ModelModifier.vue'
import FormSubmit from './components/practices/form/FormSubmit.vue'

// 5. Vue Style Handling
import StyleScoped from './components/practices/style/StyleScoped.vue'

// 6. Reactive State
import ReactiveRef from './components/practices/composition/ReactiveRef.vue'
import ReactiveReactive from './components/practices/composition/ReactiveReactive.vue'

// 7. Computed & Watchers
import ComputedBasic from './components/practices/composition/ComputedBasic.vue'
import WatchersBasic from './components/practices/composition/WatchersBasic.vue'
import WatchersMulti from './components/practices/composition/WatchersMulti.vue'
import WatchersDeep from './components/practices/composition/WatchersDeep.vue'
import WatchersReactive from './components/practices/composition/WatchersReactive.vue'
import WatchersWatchEffect from './components/practices/composition/WatchersWatchEffect.vue'

// 8. Component Lifecycle
import LifecycleParent from './components/practices/component/LifecycleParent.vue'

// 9. Props & Emits
import PropsEmitsParent from './components/practices/component/PropsEmitsParent.vue'

// 10. Component Slot
import SlotDefaultParent from './components/practices/component/SlotDefaultParent.vue'
import SlotNamedParent from './components/practices/component/SlotNamedParent.vue'
import SlotScopedParent from './components/practices/component/SlotScopedParent.vue'

// 11. Pinia Store
import StoreCounter from './components/practices/library/StoreCounter.vue'
</script>

<template>
  <div class="page">
    <header class="page-head">
      <h1>SKALA Vue.js 실습</h1>
      <p>교재 70쪽부터 116쪽까지. 과제 1개, 실습 24개.</p>
    </header>

    <section class="chapter">
      <h2>과제 1: 날씨 목업</h2>
      <WeatherMockup />
    </section>

    <section class="chapter">
      <h2>과제 2: 날씨 컴포지션</h2>
      <WeatherComposition />
    </section>

    <section class="chapter">
      <h2>과제 3: 날씨 컴포넌트 분리</h2>
      <WeatherParent />
    </section>

    <section class="chapter">
      <h2>과제 4 · 5: 라우터와 스토어 적용</h2>

      <div class="router-app">
        <nav>
          <RouterLink to="/">날씨 대시보드</RouterLink>
          <RouterLink to="/guide">지수 기준</RouterLink>
          <RouterLink to="/about">서비스 소개</RouterLink>
          <UnitToggler />
        </nav>

        <main>
          <RouterView />
        </main>
      </div>
    </section>

    <section class="chapter">
      <h2>1. 학습환경 구성</h2>
      <SampleOne />
      <SampleTwo />
    </section>

    <section class="chapter">
      <h2>2. Vue Directive</h2>
      <VHtmlBasic />
      <VHtmlXss />
      <VTextBasic />
      <VBindBasic />
      <VBindClass />
      <VBindStyle />
      <VBindShorthand />
      <VIfBasic />
      <VShowBasic />
      <VForBasic />
      <VPreBasic />
      <VCloakBasic />
      <VOnceBasic />
      <VMemoBasic />
    </section>

    <section class="chapter">
      <h2>3. Vue Event Handling</h2>
      <EventBasic />
      <EventObject />
      <EventModifier />
    </section>

    <section class="chapter">
      <h2>4. Vue Form Handling</h2>
      <ModelBasic />
      <ModelForm />
      <ModelModifier />
      <FormSubmit />
    </section>

    <section class="chapter">
      <h2>5. Vue Style Handling</h2>
      <StyleScoped />
    </section>

    <section class="chapter">
      <h2>6. Reactive State</h2>
      <ReactiveRef />
      <ReactiveReactive />
    </section>

    <section class="chapter">
      <h2>7. Computed &amp; Watchers</h2>
      <ComputedBasic />
      <WatchersBasic />
      <WatchersMulti />
      <WatchersDeep />
      <WatchersReactive />
      <WatchersWatchEffect />
    </section>

    <section class="chapter">
      <h2>8. Component Lifecycle</h2>
      <LifecycleParent />
    </section>

    <section class="chapter">
      <h2>9. Props &amp; Emits</h2>
      <PropsEmitsParent />
    </section>

    <section class="chapter">
      <h2>10. Component Slot</h2>
      <SlotDefaultParent />
      <SlotNamedParent />
      <SlotScopedParent />
    </section>

    <section class="chapter">
      <h2>11. Pinia Store</h2>
      <StoreCounter />
    </section>
  </div>
</template>

<style>
.page {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 20px 80px;
}

.page-head {
  padding-bottom: 16px;
  border-bottom: 2px solid #35495e;
  margin-bottom: 32px;
}

.page-head h1 {
  margin: 0 0 6px;
}

.page-head p {
  margin: 0;
  color: #7f8c8d;
}

.chapter {
  margin-bottom: 40px;
}

.chapter > h2 {
  padding-bottom: 8px;
  border-bottom: 2px solid #42b883;
  margin-bottom: 16px;
}

.router-app {
  border: 1px solid #d8e0e2;
  border-radius: 6px;
  overflow: hidden;
}

.router-app nav {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 14px;
  background-color: #1e2f33;
}

.router-app nav > button {
  margin-left: auto;
}

.router-app nav a {
  padding: 5px 11px;
  border-radius: 3px;
  font-size: 13px;
  color: #b7c6c9;
  text-decoration: none;
}

.router-app nav a:hover {
  color: white;
}

.router-app nav a.router-link-exact-active {
  background-color: #35494e;
  color: white;
}

.router-app main {
  padding: 20px;
}

/* 각 실습 컴포넌트를 카드로 구분 */
.practice-section {
  border: 1px solid #e1e6ea;
  border-radius: 6px;
  padding: 16px 18px;
  margin-bottom: 12px;
}

.practice-section h2 {
  margin: 0 0 12px;
  font-size: 17px;
}

.practice-section h3 {
  margin: 12px 0 6px;
  font-size: 14px;
  color: #55606a;
}
</style>
