import axios from '@/configs/axios'
import type { Auth } from '@/types'

const prefix = '/auth'

export const apiAuth = {
  login: (data: { email: string; password: string }) =>
    axios.post<Auth.AuthToken>(`${prefix}/login`, data),
  getMe: () => axios.get<Auth.UserProfile>(`/me`),
  refreshToken(data: { refreshToken: string }) {
    return axios.post<Auth.AuthToken>(`${prefix}/refresh`, {
      refresh_token: data.refreshToken
    })
  },
  changePassword: (data: Auth.ChangePassword) =>
    axios.put<Auth.UserProfile>(`/change-password`, data)
}
