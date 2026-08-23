<script setup>
defineProps({
  query: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update-query'])

// el-input은 값(문자열)을 그대로 넘겨준다
const onInput = (value) => {
  emit('update-query', value)
}
</script>

<template>
  <div class="search">
    <el-input
      :model-value="query"
      placeholder="도시 이름을 입력하세요"
      clearable
      size="large"
      @update:model-value="onInput"
    />
    <span class="typing">{{ query }}</span>
  </div>
</template>

<style scoped>
.search {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.search :deep(.el-input) {
  flex: 1;
}
/* Element Plus 기본 흰 박스를 한지 톤으로 */
.search :deep(.el-input__wrapper) {
  background: transparent;
  box-shadow: none;
  border-bottom: 1px solid var(--line);
  border-radius: 0;
  padding-left: 0;
}
.search :deep(.el-input__wrapper.is-focus) {
  box-shadow: none;
  border-bottom-color: var(--ink);
}
.search :deep(.el-input__inner) {
  color: var(--ink);
  font-family: var(--font-body);
}

.typing {
  font-size: 12px;
  color: var(--ink-soft);
  min-width: 40px;
  text-align: right;
}
</style>
