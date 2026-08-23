<script setup>
import { ref } from 'vue'

const productQuantity = ref(1)
const productRate = ref(4)
</script>

<template>
  <div class="practice-section">
    <h2>Element Plus 데이터 컴포넌트</h2>

    <el-card shadow="never">
      <template #header>주문 수량과 만족도</template>

      <div class="row">
        <span class="label">구매 수량</span>
        <el-input-number v-model="productQuantity" :min="1" :max="20" />
      </div>

      <div class="row">
        <span class="label">별점</span>
        <el-rate v-model="productRate" />
      </div>

      <p class="sum">선택한 수량 {{ productQuantity }}개, 별점 {{ productRate }}점</p>
    </el-card>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.label {
  width: 64px;
  font-size: 13px;
  color: #6b7a80;
}

.sum {
  margin: 0;
  font-size: 13px;
  color: #4a5860;
}
</style>
