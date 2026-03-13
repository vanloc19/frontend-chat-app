import axios from 'axios'
import { ROUTE_PATHS } from '@/routes/paths.js'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const http = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // gửi kèm httpOnly refresh_token cookie tự động
  headers: { 'Content-Type': 'application/json' },
})

// ── Cookie helpers ──────────────────────────────────────────────────────────
export function getCookie(name) {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

export function setCookie(name, value, maxAgeSeconds) {
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAgeSeconds}; path=/; SameSite=Lax`
}

export function removeCookie(name) {
  document.cookie = `${name}=; max-age=0; path=/`
}

// ── Refresh queue (tránh gọi refresh song song) ─────────────────────────────
let isRefreshing = false
let failedQueue = []

function processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token)))
  failedQueue = []
}

// ── Request interceptor: đính access_token vào header ─────────────────────
http.interceptors.request.use((config) => {
  const token = getCookie('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Response interceptor: bắt 401, tự refresh rồi retry ──────────────────
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error)
    }

    // Nếu đang refresh → đẩy request vào queue, chờ xong mới retry
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`
        return http(original)
      })
    }

    original._retry = true
    isRefreshing = true

    try {
      const refreshToken = getCookie('refresh_token')
      const { data } = await axios.post(
        `${BASE_URL}/auth/api/auth/refresh`,
        { refreshToken },
      )

      const newAccessToken = data.accessToken
      setCookie('access_token', newAccessToken, 15 * 60)       // 15 phút
      setCookie('refresh_token', data.refreshToken, 7 * 24 * 3600) // 7 ngày

      http.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`
      processQueue(null, newAccessToken)

      original.headers.Authorization = `Bearer ${newAccessToken}`
      return http(original)
    } catch (err) {
      processQueue(err, null)
      removeCookie('access_token')
      removeCookie('refresh_token')
      window.location.hash = `#/${ROUTE_PATHS.AUTH.ROOT}/${ROUTE_PATHS.AUTH.LOGIN}`
      return Promise.reject(err)
    } finally {
      isRefreshing = false
    }
  },
)
