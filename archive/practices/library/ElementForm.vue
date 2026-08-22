<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const userForm = ref({
  email: '',
  agree: false,
})

const handleRegister = () => {
  if (!userForm.value.email.includes('@')) {
    ElMessage.error('올바른 이메일 형식이 아닙니다.')
    return
  }
  if (!userForm.value.agree) {
    ElMessage.warning('이용약관에 동의하셔야 합니다.')
    return
  }
  ElMessage.success('가입 신청이 정상적으로 완료되었습니다.')
}
</script>

<template>
  <div class="practice-section">
    <h2>Element Plus 폼 컴포넌트</h2>

    <el-card shadow="never">
      <template #header>회원가입</template>

      <el-input v-model="userForm.email" placeholder="이메일 주소를 입력하세요" clearable />

      <div class="agree">
        <el-switch v-model="userForm.agree" />
        <span>이용약관에 동의합니다</span>
      </div>

      <el-button type="primary" @click="handleRegister">가입하기</el-button>
    </el-card>
  </div>
</template>

<style scoped>
.agree {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0;
  font-size: 13px;
}
</style>
