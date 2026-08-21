<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const BASE_URL = 'https://jsonplaceholder.typicode.com/posts'

const items = ref([])
const textInput = ref('')
const log = ref('대기 중')

const handleRead = async () => {
  try {
    const response = await axios.get(BASE_URL, { params: { _limit: 3 } })
    items.value = response.data
    log.value = `GET 성공: ${response.data.length}건`
    console.log('GET 성공:', response.data)
  } catch (error) {
    log.value = 'GET 실패'
    console.error('GET 실패:', error)
  }
}

const handleCreate = async () => {
  try {
    const response = await axios.post(BASE_URL, {
      title: textInput.value,
      body: '날씨현황',
      userId: 1,
    })
    items.value.unshift(response.data)
    log.value = `POST 성공: id ${response.data.id} 생성`
    console.log('POST 성공:', response.data)
    textInput.value = ''
  } catch (error) {
    log.value = 'POST 실패'
    console.error('POST 실패:', error)
  }
}

const handleUpdate = async (id) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, {
      title: '수정도시',
      body: '수정현황',
    })
    const target = items.value.find((item) => item.id === id)
    if (target) target.title = response.data.title
    log.value = `PUT 성공: id ${id} 수정`
    console.log('PUT 성공:', response.data)
  } catch (error) {
    log.value = 'PUT 실패'
    console.error('PUT 실패:', error)
  }
}

const handleDelete = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`)
    items.value = items.value.filter((item) => item.id !== id)
    log.value = `DELETE 성공: id ${id} 삭제`
    console.log('DELETE 성공:', id)
  } catch (error) {
    log.value = 'DELETE 실패'
    console.error('DELETE 실패:', error)
  }
}

onMounted(handleRead)
</script>

<template>
  <div class="practice-section">
    <h2>Axios REST API CRUD</h2>

    <div class="row">
      <input v-model="textInput" placeholder="등록할 제목 입력" />
      <button @click="handleCreate" :disabled="!textInput">등록 (POST)</button>
      <button @click="handleRead">다시 조회 (GET)</button>
    </div>

    <p class="log">{{ log }}</p>

    <ul>
      <li v-for="item in items" :key="item.id">
        <span class="id">{{ item.id }}</span>
        <span class="title">{{ item.title }}</span>
        <button @click="handleUpdate(item.id)">수정</button>
        <button @click="handleDelete(item.id)">삭제</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
}

.row input {
  flex: 1;
  padding: 5px 8px;
  border: 1px solid #ccd5d8;
  border-radius: 3px;
}

.log {
  margin: 0 0 10px;
  font-size: 12px;
  color: #6b7a80;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 0;
  border-bottom: 1px solid #eef2f3;
  font-size: 13px;
}

.id {
  min-width: 34px;
  color: #9aa6ab;
}

.title {
  flex: 1;
}

button {
  border: 1px solid #ccd5d8;
  background: white;
  border-radius: 3px;
  padding: 3px 9px;
  font-size: 12px;
  color: #4a5860;
  cursor: pointer;
}

button:disabled {
  color: #b4c0c4;
  cursor: default;
}
</style>
