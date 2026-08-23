// Open-Meteo 전용 axios 인스턴스. 주소·타임아웃·에러 문구를 한 곳에 둔다
import axios from 'axios'

export const openMeteo = axios.create({
  baseURL: 'https://api.open-meteo.com/v1',
  timeout: 8000,
})

// 사용자에게 보여 줄 한국어 메시지로 바꿔서 던진다
export const ERROR_TEXT = Object.freeze({
  429: '날씨 서버에 요청이 너무 잦습니다. 잠시 뒤 다시 시도해 주세요.',
  timeout: '날씨 서버가 응답하지 않습니다.',
  network: '인터넷 연결을 확인해 주세요.',
  default: '날씨를 받아오지 못했습니다.',
})

openMeteo.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status
    const text =
      ERROR_TEXT[status] ??
      (err.code === 'ECONNABORTED' ? ERROR_TEXT.timeout : !err.response ? ERROR_TEXT.network : ERROR_TEXT.default)
    err.userMessage = text
    return Promise.reject(err)
  },
)
