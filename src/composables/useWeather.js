// 날씨 컴포저블. Open-Meteo 조회, 실패하면 weatherData.js 표본으로 폴백
// TODO: 예보(daily)도 여기서 같이 받으면 두루마리에서 따로 안 불러도 됨
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
  city_11: { lat: -62.22, lon: -58.79 }, // 세종기지(남극)
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

// 같은 요청은 10분 동안 sessionStorage에 두고 재사용 (새로고침 연타해도 429가 안 나게)
const TTL = 10 * 60 * 1000
export async function cachedGet(params) {
  const key = 'om:' + JSON.stringify(params)
  try {
    const hit = JSON.parse(sessionStorage.getItem(key) || 'null')
    if (hit && Date.now() - hit.t < TTL) return hit.data
  } catch {
    /* 저장소 못 읽으면 그냥 요청 */
  }
  const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', { params })
  try {
    sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), data }))
  } catch {
    /* 용량 초과 등은 무시 */
  }
  return data
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
      // 도시 전부를 한 번의 요청으로 - latitude/longitude에 쉼표로 여러 좌표를 넘기면 배열로 온다
      const list = cities.value
      const data = await cachedGet({
        latitude: list.map((c) => cityCoords[c.id].lat).join(','),
        longitude: list.map((c) => cityCoords[c.id].lon).join(','),
        current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day',
        wind_speed_unit: 'ms', // 기본값은 km/h라 m/s로 받아야 표기와 맞는다
        timezone: 'Asia/Seoul',
      })
      const rows = Array.isArray(data) ? data : [data]
      cities.value = list.map((c, i) => {
        const cur = rows[i]?.current
        if (!cur) return c
        return {
          ...c,
          temp: Math.round(cur.temperature_2m),
          humidity: cur.relative_humidity_2m,
          wind: Math.round(cur.wind_speed_10m * 10) / 10,
          status: codeToStatus(cur.weather_code),
          isDay: cur.is_day === 1,
          live: true,
        }
      })
    } catch (e) {
      // 폴백: 목데이터 유지 - 오프라인/차단 환경에서도 데모 가능
      error.value = e
    } finally {
      loading.value = false
    }
  }

  return { cities, loading, error, fetchLive }
}

// 세계화폭 - 해외 도시. timezone=auto로 현지 밤낮(is_day)을 그대로 받는다
export function useWorldWeather() {
  const cities = ref(worldList.map((c) => ({ ...c, isDay: true, live: false })))
  const loading = ref(false)
  const error = ref(null)

  async function fetchLive() {
    loading.value = true
    error.value = null
    try {
      const live = cities.value.filter((c) => !c.demo) // 시연 도시는 고정값
      const data = await cachedGet({
        latitude: live.map((c) => c.lat).join(','),
        longitude: live.map((c) => c.lon).join(','),
        current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day',
        wind_speed_unit: 'ms', // 기본값은 km/h라 m/s로 받아야 표기와 맞는다
        timezone: 'auto',
      })
      const rows = Array.isArray(data) ? data : [data]
      const byId = {}
      live.forEach((c, i) => {
        const cur = rows[i]?.current
        if (cur) byId[c.id] = cur
      })
      cities.value = cities.value.map((c) => {
        if (c.demo) return { ...c, live: false, localTime: '' }
        const cur = byId[c.id]
        if (!cur) return c
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
      })
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  return { cities, loading, error, fetchLive }
}
