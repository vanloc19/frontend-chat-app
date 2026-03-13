import { getCookie } from '@/services/http.js'

export function useAuth() {
  const token = getCookie('access_token')
  return { isAuthenticated: !!token }
}
