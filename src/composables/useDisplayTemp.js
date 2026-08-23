// 섭씨 원본 → 설정된 단위로 표시 문자열. 카드/상세에서 같은 변환을 되풀이하던 것을 한 곳으로
// (교재 Pinia 단원 "메인/상세에 유사 코드가 중복됨 → Composable로 해결 가능" 항목)
import { computed, toValue } from 'vue'
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/stores/configStore.js'

export function useDisplayTemp(celsius) {
  const store = useConfigStore()
  const { unitSymbol } = storeToRefs(store)
  // celsius 는 숫자·ref·getter 무엇이든 된다 (toValue)
  const value = computed(() => store.toTemp(toValue(celsius)))
  const text = computed(() => `${value.value}${unitSymbol.value}`)
  return { value, text, unitSymbol }
}
