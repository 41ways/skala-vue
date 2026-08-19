<script setup>
// 변수명을 HTML 표준 속성명과 똑같이 맞추면 ="값" 부분을 생략할 수 있음 (Vue 3.4+)
const id = 'user-profile-card'
const src = 'https://vuejs.org/images/logo.png'
</script>

<template>
  <div class="practice-section">
    <h2>v-bind 디렉티브 고급 (단축 문법)</h2>

    <div :id>
      <img :src alt="Vue 로고" style="width: 50px" />
    </div>
  </div>
</template>
