export const weatherList = [
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', humidity: 62, wind: 2.4, x: 31, y: 21 },
  { id: 'city_02', name: '수원', temp: 23, status: '비', humidity: 88, wind: 3.1, x: 32, y: 26 },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', humidity: 74, wind: 4.7, x: 87, y: 64 },
  { id: 'city_04', name: '광주', temp: 30, status: '맑음', humidity: 55, wind: 1.8, x: 28, y: 64 },
  { id: 'city_05', name: '강릉', temp: 19, status: '흐림', humidity: 70, wind: 5.2, x: 82, y: 17 },
  { id: 'city_06', name: '제주', temp: 24, status: '바람', humidity: 81, wind: 7.3, x: 19, y: 94 },
]

export const starCount = (city) => {
  if (city.status === '비' || city.status === '눈') return 8
  let n = 220
  n -= (city.humidity - 40) * 2.2
  if (city.status === '흐림') n -= 70
  if (city.status === '구름') n -= 40
  if (city.status === '맑음') n += 30
  return Math.max(10, Math.min(240, Math.round(n)))
}

export const skyGrade = (n) => {
  if (n >= 180) return '은하수까지 보여요'
  if (n >= 120) return '별자리가 또렷해요'
  if (n >= 60) return '밝은 별만 겨우'
  return '오늘은 하늘이 닫혔어요'
}

export const findCity = (id) => weatherList.find((c) => c.id === id)

export const laundryScore = (city) => {
  if (city.status === '비' || city.status === '눈') return 0

  let score = 100
  score -= (city.humidity - 40) * 1.8
  score += Math.min(city.wind, 6) * 6
  if (city.status === '맑음') score += 8
  if (city.temp >= 20) score += 4

  return Math.max(0, Math.min(100, Math.round(score)))
}

export const laundryGrade = (score) => {
  if (score === 0) return { key: 'none', label: '널 수 없음' }
  if (score >= 90) return { key: 'best', label: '아주 잘 마름' }
  if (score >= 70) return { key: 'good', label: '잘 마름' }
  return { key: 'fair', label: '더디게 마름' }
}

export const humidityText = (h) => {
  if (h >= 80) return '매우 습함'
  if (h >= 70) return '습함'
  if (h >= 60) return '적당함'
  return '쾌적'
}

export const windText = (w) => {
  if (w >= 7) return '매우 강한 바람'
  if (w >= 4.5) return '강한 바람'
  if (w >= 3) return '약한 바람'
  return '아주 약한 바람'
}
