// 한자 숫자 — 二十五 식. 0은 空으로 적는다 (두루마리·도시소개 공용)
const DIG = ['空', '一', '二', '三', '四', '五', '六', '七', '八', '九']

export function toHanja(n) {
  n = Math.round(Math.abs(Number(n) || 0))
  if (n < 10) return DIG[n]
  if (n < 100) {
    const t = Math.floor(n / 10)
    const o = n % 10
    return (t > 1 ? DIG[t] : '') + '十' + (o ? DIG[o] : '')
  }
  return String(n)
}

// 날씨 상태 → 한 글자 한자
export const STATUS_HANJA = { 맑음: '晴', 구름: '雲', 흐림: '陰', 비: '雨', 눈: '雪', 바람: '風', 뇌우: '雷', 안개: '霧' }

// 온도 — 영하는 零下
export function tempHanja(t) {
  return (t < 0 ? '零下' : '') + toHanja(t) + '度'
}
