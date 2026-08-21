<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="about">
    <h3>서비스 소개</h3>

    <p>
      지역별 기상 정보를 모아 오늘 빨래를 널기 좋은 곳을 알려주는 서비스입니다. 기온, 습도, 바람,
      하늘 상태 네 가지를 합쳐 100점으로 환산합니다.
    </p>

    <p>
      데이터는 현재 화면 확인용 임시 데이터이며, 이후 공개 기상 API로 교체할 예정입니다.
    </p>

    <button @click="goHome">메인 대시보드로 돌아가기</button>
  </div>
</template>

<style scoped>
.about {
  color: #1e2f33;
  max-width: 460px;
}

.about h3 {
  margin: 0 0 12px;
  font-size: 18px;
}

.about p {
  margin: 0 0 12px;
  font-size: 14px;
  line-height: 1.7;
  color: #4a5860;
}

.about button {
  margin-top: 8px;
  border: 1px solid #ccd5d8;
  background: white;
  border-radius: 3px;
  padding: 6px 12px;
  font-size: 13px;
  color: #4a5860;
  cursor: pointer;
}

.about button:hover {
  border-color: #1e2f33;
  color: #1e2f33;
}
</style>
