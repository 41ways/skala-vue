<script setup>
// 과제
import WeatherMockup from './components/exercise/WeatherMockup.vue'

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
</script>

<template>
  <div class="page">
    <header class="page-head">
      <h1>SKALA Vue.js 실습</h1>
      <p>교재 70쪽부터 116쪽까지. 과제 1개, 실습 24개.</p>
    </header>

    <section class="chapter">
      <h2>과제</h2>
      <WeatherMockup />
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
