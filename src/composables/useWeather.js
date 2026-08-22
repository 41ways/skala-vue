// 날씨 컴포저블 — Open-Meteo(무료·키 불필요) 실시간 조회 + 실습 목데이터 폴백
import { ref } from 'vue'
import axios from 'axios'
import { weatherList, worldList } from '@/data/weatherData.js'

// 실습 데이터의 6개 도시에 좌표만 부여 (기존 파일은 건드리지 않음)
export const cityCoords = {
  city_01: { lat: 37.57, lon: 126.98 }, // 서울
  city_02: { lat: 37.26, lon: 127.03 }, // 수원
  city_03: { lat: 35.18, lon: 129.08 }, // 부산
  city_04: { lat: 35.16, lon: 126.85 }, // 광주
  city_05: { lat: 37.75, lon: 128.88 }, // 강릉
  city_06: { lat: 33.5, lon: 126.53 }, // 제주
  city_07: { lat: 37.46, lon: 126.71 }, // 인천
  city_08: { lat: 36.35, lon: 127.38 }, // 대전
  city_09: { lat: 35.87, lon: 128.6 }, // 대구
  city_10: { lat: 37.88, lon: 127.73 }, // 춘천
}

// Open-Meteo weathercode → 민화 장면 상태
// https://open-meteo.com/en/docs (WMO Weather interpretation codes)
export function codeToStatus(code) {
  if (code === 0) return '맑음'
  if (code <= 2) return '구름'
  if (code === 3 || code === 45 || code === 48) return '흐림'
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return '비'
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return '눈'
  if (code >= 95) return '뇌우'
  return '흐림'
}

export function useWeather() {
  const cities = ref(
    // 시작 상태 = 실습 목데이터 (API 실패 시에도 화면은 성립)
    weatherList.map((c) => ({ ...c, isDay: true, live: false })),
  )
  const loading = ref(false)
  const error = ref(null)

  async function fetchLive() {
    loading.value = true
    error.value = null
    try {
      const results = await Promise.all(
        cities.value.map(async (c) => {
          const { lat, lon } = cityCoords[c.id]
          const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', {
            params: {
              latitude: lat,
              longitude: lon,
              current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day',
              timezone: 'Asia/Seoul',
            },
          })
          const cur = data.current
          return {
            ...c,
            temp: Math.round(cur.temperature_2m),
            humidity: cur.relative_humidity_2m,
            wind: Math.round(cur.wind_speed_10m * 10) / 10,
            status: codeToStatus(cur.weather_code),
            isDay: cur.is_day === 1,
            live: true,
          }
        }),
      )
      cities.value = results
    } catch (e) {
      // 폴백: 목데이터 유지 — 오프라인/차단 환경에서도 데모 가능
      error.value = e
    } finally {
      loading.value = false
    }
  }

  return { cities, loading, error, fetchLive }
}

// 세계화폭 — 해외 도시. timezone=auto로 현지 밤낮(is_day)을 그대로 받는다
export function useWorldWeather() {
  const cities = ref(worldList.map((c) => ({ ...c, isDay: true, live: false })))
  const loading = ref(false)
  const error = ref(null)

  async function fetchLive() {
    loading.value = true
    error.value = null
    try {
      const results = await Promise.all(
        cities.value.map(async (c) => {
          if (c.demo) return { ...c, live: false, localTime: '' } // 시연 도시는 고정값 유지
          const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', {
            params: {
              latitude: c.lat,
              longitude: c.lon,
              current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day',
              timezone: 'auto',
            },
          })
          const cur = data.current
          return {
            ...c,
            temp: Math.round(cur.temperature_2m),
            humidity: cur.relative_humidity_2m,
            wind: Math.round(cur.wind_speed_10m * 10) / 10,
            status: codeToStatus(cur.weather_code),
            isDay: cur.is_day === 1,
            localTime: (cur.time || '').slice(11, 16), // 현지 시각 HH:MM
            live: true,
          }
        }),
      )
      cities.value = results
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  return { cities, loading, error, fetchLive }
}
