import axios from 'axios'
import { ROUTE_PATHS } from '@/routes/paths.js'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const http = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// ── Refresh queue (tránh gọi refresh song song) ─────────────────────────────
let isRefreshing = false
let failedQueue = []
const AUTH_PUBLIC_PATHS = [
  '/auth/api/auth/login',
  '/auth/api/auth/register',
  '/auth/api/auth/send-otp',
  '/auth/api/auth/verify-otp',
  '/auth/api/auth/refresh',
]

function processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token)))
  failedQueue = []
}

function isAuthPublicRequest(url = '') {
  return AUTH_PUBLIC_PATHS.some((path) => url.includes(path))
}

// ── Request interceptor ─────────────────────────────────────────────────────
http.interceptors.request.use((config) => {
  return config
})

// ── Response interceptor: bắt 401, tự refresh rồi retry ──────────────────
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config || {}

    if (
      error.response?.status !== 401 ||
      original?._retry ||
      isAuthPublicRequest(original?.url)
    ) {
      return Promise.reject(error)
    }

    // Nếu đang refresh → đẩy request vào queue, chờ xong mới retry
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then(() => {
        return http(original)
      })
    }

    original._retry = true
    isRefreshing = true

    try {
      await axios.post(
        `${BASE_URL}/auth/api/auth/refresh`,
        {},
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        },
      )

      processQueue(null, true)
      return http(original)
    } catch (err) {
      processQueue(err, null)
      window.location.hash = `#/${ROUTE_PATHS.AUTH.ROOT}/${ROUTE_PATHS.AUTH.LOGIN}`
      return Promise.reject(err)
    } finally {
      isRefreshing = false
    }
  },
)
