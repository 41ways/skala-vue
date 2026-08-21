<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const downloadProgress = ref(0)
const isDownloading = ref(false)

const confirmDelete = () => {
  ElMessageBox.confirm('서버에서 해당 파일을 영구히 삭제하시겠습니까?', '최종 경고', {
    confirmButtonText: '네, 삭제합니다',
    cancelButtonText: '취소',
    type: 'warning',
  })
    .then(() => {
      ElMessage.success('파일이 삭제되었습니다.')
    })
    .catch(() => {
      ElMessage.info('삭제 작업이 취소되었습니다.')
    })
}

const startDownload = () => {
  if (isDownloading.value) return

  isDownloading.value = true
  downloadProgress.value = 0

  const timer = setInterval(() => {
    downloadProgress.value += 20
    if (downloadProgress.value >= 100) {
      clearInterval(timer)
      isDownloading.value = false
      ElMessage.success('대용량 데이터 로드가 완료되었습니다.')
    }
  }, 400)
}
</script>

<template>
  <div class="practice-section">
    <h2>Element Plus 피드백 컴포넌트</h2>

    <el-card shadow="never">
      <template #header>확인창과 진행률</template>

      <div class="row">
        <el-button type="danger" plain @click="confirmDelete">삭제 테스트</el-button>
        <el-button type="primary" plain :disabled="isDownloading" @click="startDownload">
          동기화 시작
        </el-button>
      </div>

      <el-progress :percentage="downloadProgress" :stroke-width="14" />
    </el-card>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}
</style>
