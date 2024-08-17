import type { Auth } from '@/types'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    authToken: null as Auth.AuthToken | null,
    profile: null as Auth.UserProfile | null
  }),
  actions: {
    async login(data: { email: string; password: string }) {
      try {
        const timeNow = new Date().getTime()

        const res = await apiAuth.login(data)
        const dataRes = res.data.data

        dataRes.expires_in = timeNow + dataRes.expires_in * 1000
        this.authToken = dataRes
        return Promise.resolve(res)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async getMe() {
      try {
        if (!this.authToken) {
          return Promise.reject('Token is not found')
        }
        // Gọi API lấy thông tin user
        const res = await apiAuth.getMe()
        const dataRes = res.data.data

        this.profile = dataRes ?? null
        return Promise.resolve(res)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async logout() {
      this.authToken = null
      this.$router.push({ name: 'login' })
      this.profile = null
    },

    async refreshToken() {
      try {
        if (!this.authToken) throw new Error('Token is not found')

        const timeNow = new Date().getTime()

        const res = await apiAuth.refreshToken({
          refreshToken: this.authToken.refresh_token
        })
        const dataRes = res.data.data

        dataRes.expires_in = timeNow + dataRes.expires_in * 1000
        this.authToken = dataRes
        return Promise.resolve(res)
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },
  persist: {
    paths: ['authToken']
  }
})
