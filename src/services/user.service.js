import { http } from '@/services/http.js'

const PREFIX = '/users/api/users'

export const userService = {
  getMe: () => http.get(`${PREFIX}/me`),
  getById: (id) => http.get(`${PREFIX}/${id}`),
  update: (data) => http.put(`${PREFIX}/me`, data),
}
