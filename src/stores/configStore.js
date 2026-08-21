import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  const unit = ref('celsius')
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
