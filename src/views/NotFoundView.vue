<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
</script>

<template>
  <div class="notfound">
    <p class="code">404</p>
    <p class="msg">요청하신 경로를 찾을 수 없습니다.</p>
    <p class="path">{{ decodeURIComponent(route.fullPath) }}</p>
    <button @click="router.push('/')">메인 대시보드로 돌아가기</button>
  </div>
</template>

<style scoped>
.notfound {
  padding: 40px 0;
  text-align: center;
  color: #1e2f33;
}

.notfound p {
  margin: 0;
}

.code {
  font-size: 44px;
  font-weight: 300;
  color: #b4c0c4;
}

.msg {
  margin-top: 8px !important;
  font-size: 14px;
}

.path {
  margin-top: 6px !important;
  font-size: 12px;
  color: #9aa6ab;
}

.notfound button {
  margin-top: 18px;
  border: 1px solid #ccd5d8;
  background: white;
  border-radius: 3px;
  padding: 6px 12px;
  font-size: 13px;
  color: #4a5860;
  cursor: pointer;
}

.notfound button:hover {
  border-color: #1e2f33;
  color: #1e2f33;
}
</style>
