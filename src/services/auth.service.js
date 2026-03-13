import { http } from '@/services/http.js'

const PREFIX = '/auth/api/auth'

export const authService = {
  login: (data) => http.post(`${PREFIX}/login`, data),
  register: (data) => http.post(`${PREFIX}/register`, data),
  sendOtp: (data) => http.post(`${PREFIX}/send-otp`, data),
  verifyOtp: (data) => http.post(`${PREFIX}/verify-otp`, data),
  logout: (refreshToken) => http.delete(`${PREFIX}/logout`, { data: { refreshToken } }),
}
