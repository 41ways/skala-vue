import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

const KEY = 'cheongwoo:unit'

export const useConfigStore = defineStore('config', () => {
  // 마지막에 고른 단위를 기억한다 (새로고침해도 유지)
  const unit = ref(localStorage.getItem(KEY) === 'fahrenheit' ? 'fahrenheit' : 'celsius')
  watch(unit, (u) => localStorage.setItem(KEY, u))
  const sortOrder = ref('')

  const unitSymbol = computed(() => (unit.value === 'celsius' ? '℃' : '℉'))

  const toggleUnit = () => {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  const toTemp = (celsius) => {
    if (unit.value === 'fahrenheit') return Math.round((celsius * 9) / 5 + 32)
    return celsius
  }

  const changeSort = (order) => {
    sortOrder.value = sortOrder.value === order ? '' : order
  }

  return { unit, sortOrder, unitSymbol, toggleUnit, toTemp, changeSort }
})
