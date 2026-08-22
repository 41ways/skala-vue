export const weatherList = [
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', humidity: 62, wind: 2.4, x: 31, y: 21 },
  { id: 'city_02', name: '수원', temp: 23, status: '비', humidity: 88, wind: 3.1, x: 32, y: 26 },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', humidity: 74, wind: 4.7, x: 87, y: 64 },
  { id: 'city_04', name: '광주', temp: 30, status: '맑음', humidity: 55, wind: 1.8, x: 28, y: 64 },
  { id: 'city_05', name: '강릉', temp: 19, status: '흐림', humidity: 70, wind: 5.2, x: 82, y: 17 },
  { id: 'city_06', name: '제주', temp: 24, status: '바람', humidity: 81, wind: 7.3, x: 19, y: 94 },
  { id: 'city_07', name: '인천', temp: 27, status: '구름', humidity: 70, wind: 3.6, x: 24, y: 22 },
  { id: 'city_08', name: '대전', temp: 29, status: '맑음', humidity: 58, wind: 1.9, x: 40, y: 46 },
  { id: 'city_09', name: '대구', temp: 31, status: '맑음', humidity: 50, wind: 2.2, x: 66, y: 54 },
  { id: 'city_10', name: '춘천', temp: 26, status: '흐림', humidity: 72, wind: 1.4, x: 44, y: 14 },
  // 남극 세종과학기지 — 국내 화폭의 마지막 폭 (눈은 늘 내린다)
  { id: 'city_11', name: '세종기지', temp: -8, status: '눈', humidity: 85, wind: 9.5, x: 50, y: 99, snowAlways: true },
]

// 해외 도시 — 세계화폭(스크롤텔링) 챕터. genre = 배정된 풍속화 장면
export const worldList = [
  // prettier-ignore
  { id: 'w_tokyo', name: '도쿄', hanja: '東京', country: '일본', lat: 35.68, lon: 139.69, temp: 27, status: '맑음', humidity: 66, wind: 3.2, genre: 'mudong', line: '동경 앞바다의 큰 파도가 오늘의 하늘을 떠받칩니다' },
  // 시연용 — 실황 대신 고정값: 뇌우·비바람 (demo: true 이면 API를 건너뛴다)
  { id: 'w_skala', name: '스칼라', hanja: 'SKALA', country: '시연', lat: 37.5, lon: 127.04, temp: 21, status: '뇌우', humidity: 93, wind: 11.4, genre: 'inwang', demo: true, line: '하늘을 배우는 이들의 캠퍼스 — 오늘은 시연을 위해 비바람을 불러왔습니다' },
  // prettier-ignore
  { id: 'w_beijing', name: '베이징', hanja: '北京', country: '중국', lat: 39.9, lon: 116.4, temp: 29, status: '구름', humidity: 48, wind: 2.1, genre: 'tiger', line: '천 리의 강산이 연경의 하늘 아래 펼쳐집니다' },
  // prettier-ignore
  { id: 'w_paris', name: '파리', hanja: '巴里', country: '프랑스', lat: 48.85, lon: 2.35, temp: 21, status: '비', humidity: 82, wind: 4.4, genre: 'seodang', line: '센 강의 안개 사이로 해가 번져 오릅니다' },
  // prettier-ignore
  { id: 'w_london', name: '런던', hanja: '倫敦', country: '영국', lat: 51.51, lon: -0.13, temp: 18, status: '흐림', humidity: 78, wind: 5.6, genre: 'ssireum', line: '비와 증기와 속도 — 런던의 하늘이 내달립니다' },
  // prettier-ignore
  { id: 'w_newyork', name: '뉴욕', hanja: '紐約', country: '미국', lat: 40.71, lon: -74.01, temp: 25, status: '구름', humidity: 60, wind: 4.9, genre: 'mudong', line: '폭풍이 걷히는 산맥처럼 뉴욕의 하늘이 열립니다' },
  // prettier-ignore
  { id: 'w_sydney', name: '시드니', hanja: '雪梨', country: '호주', lat: -33.87, lon: 151.21, temp: 16, status: '맑음', humidity: 58, wind: 6.1, genre: 'ssireum', line: '남반구의 바람이 항구의 물빛을 고르게 폅니다' },
  { id: 'w_rome', name: '로마', hanja: '羅馬', country: '이탈리아', lat: 41.9, lon: 12.5, temp: 30, status: '맑음', humidity: 45, wind: 2.8, genre: 'seodang', line: '천 년 폐허 위로 오늘의 볕이 고르게 내립니다' },
  { id: 'w_istanbul', name: '이스탄불', hanja: '伊斯坦堡', country: '튀르키예', lat: 41.01, lon: 28.98, temp: 27, status: '구름', humidity: 60, wind: 4.2, genre: 'mudong', line: '보스포루스의 물결 위로 두 대륙의 하늘이 만납니다' },
  { id: 'w_cairo', name: '카이로', hanja: '開羅', country: '이집트', lat: 30.04, lon: 31.24, temp: 35, status: '맑음', humidity: 30, wind: 3.5, genre: 'tiger', line: '사막의 바람이 첨탑 사이로 마른 볕을 실어 옵니다' },
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
