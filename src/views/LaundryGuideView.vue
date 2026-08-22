<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const rules = [
  { item: '기본 점수', detail: '100점에서 시작' },
  { item: '습도', detail: '40%를 넘는 만큼 1.8배로 감점' },
  { item: '바람', detail: '1m/s당 6점 가점, 6m/s까지만 반영' },
  { item: '하늘', detail: '맑음이면 8점 가점' },
  { item: '기온', detail: '20도 이상이면 4점 가점' },
  { item: '비, 눈', detail: '다른 조건과 무관하게 0점' },
]

const grades = [
  { range: '90점 이상', label: '아주 잘 마름' },
  { range: '70 ~ 89점', label: '잘 마름' },
  { range: '1 ~ 69점', label: '더디게 마름' },
  { range: '0점', label: '널 수 없음' },
]
</script>

<template>
  <div class="guide">
    <h3>빨래 지수는 이렇게 계산합니다</h3>

    <h4>점수 규칙</h4>
    <table>
      <tbody>
        <tr v-for="rule in rules" :key="rule.item">
          <th>{{ rule.item }}</th>
          <td>{{ rule.detail }}</td>
        </tr>
      </tbody>
    </table>

    <h4>등급</h4>
    <table>
      <tbody>
        <tr v-for="grade in grades" :key="grade.range">
          <th>{{ grade.range }}</th>
          <td>{{ grade.label }}</td>
        </tr>
      </tbody>
    </table>

    <p class="note">
      바람은 다른 지표와 달리 강할수록 점수가 오릅니다. 빨래가 마르는 데는 습기를 걷어가는 공기의
      흐름이 필요하기 때문입니다.
    </p>

    <button @click="router.push('/')">국내 화폭으로 돌아가기</button>
  </div>
</template>

<style scoped>
.guide {
  color: #1e2f33;
  max-width: 460px;
}

.guide h3 {
  margin: 0 0 16px;
  font-size: 18px;
}

.guide h4 {
  margin: 18px 0 8px;
  font-size: 13px;
  color: #6b7a80;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th,
td {
  padding: 7px 10px;
  border-bottom: 1px solid #edf1f2;
  text-align: left;
}

th {
  width: 90px;
  font-weight: 600;
  color: #4a5860;
}

td {
  color: #6b7a80;
}

.note {
  margin: 18px 0 0;
  padding: 12px 14px;
  background-color: #f2f8f8;
  border-radius: 4px;
  font-size: 13px;
  line-height: 1.7;
  color: #4a5860;
}

.guide button {
  margin-top: 16px;
  border: 1px solid #ccd5d8;
  background: white;
  border-radius: 3px;
  padding: 6px 12px;
  font-size: 13px;
  color: #4a5860;
  cursor: pointer;
}

.guide button:hover {
  border-color: #1e2f33;
  color: #1e2f33;
}
</style>
