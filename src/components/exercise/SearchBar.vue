<script setup>
defineProps({
  query: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update-query'])

const onInput = (e) => {
  emit('update-query', e.target.value)
}
</script>

<template>
  <div class="search">
    <input :value="query" @input="onInput" placeholder="도시 이름을 입력하세요" />
    <span class="typing">{{ query }}</span>
  </div>
</template>

<style scoped>
.search {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.search input {
  flex: 1;
  border: none;
  outline: none;
  background: none;
  border-bottom: 1px solid #ccd5da;
  font-size: 16px;
  padding: 4px 0;
  color: inherit;
}

.search input:focus {
  border-bottom-color: #22303a;
}

.typing {
  font-size: 12px;
  color: #9aa6ad;
  min-width: 40px;
  text-align: right;
}
</style>
