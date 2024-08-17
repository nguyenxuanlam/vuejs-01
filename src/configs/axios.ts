import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'
import Axios from 'axios'

const baseURL = (useEnv('VITE_API_SERVER') ?? '') + '/api'

const defaultConfig: AxiosRequestConfig = {
  baseURL,
  // request timeout
  timeout: 90000
}

class AxiosHttp {
  public axiosInstance = Axios.create(defaultConfig)

  constructor() {}

  // Gọi hàm này trong main.ts để khởi tạo và kích hoạt pinia store
  public init(): void {
    // console.log color red
    this.httpInterceptorsRequest()
    this.httpInterceptorsResponse()
  }

  /** After the token expires, temporarily store pending requests */
  private requests: ((token: string) => void)[] = []

  /** Prevent repeated token refresh */
  private isRefreshing = false

  /** Reconnect the original request */
  private retryOriginalRequest(
    config: InternalAxiosRequestConfig<any>
  ): Promise<InternalAxiosRequestConfig<any>> {
    return new Promise((resolve) => {
      this.requests.push((token: string) => {
        if (config.headers) config.headers['Authorization'] = `Bearer ${token}`
        resolve(config)
      })
    })
  }

  private httpInterceptorsRequest(): void {
    const authStore = useAuthStore()
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        // window.$loadingBar.start()
        const whiteList = ['/auth/login', '/auth/refresh']
        const isWhiteList = whiteList.some((v) => config.url && config.url.indexOf(v) > -1)
        if (isWhiteList || config.url === '/') {
          // TODO: API required xà lơ nên phải cấu hình lại header
          if (authStore.authToken)
            config.headers['Authorization'] = `Bearer ${authStore.authToken.access_token}`
          return config
        }

        return new Promise((resolve) => {
          if (!authStore.authToken) {
            return resolve(config)
          }

          const now = new Date().getTime()
          const expired = authStore.authToken.expires_in - now <= 0
          // Chưa hết hạn
          if (!expired) {
            if (config.headers)
              config.headers['Authorization'] = `Bearer ${authStore.authToken.access_token}`
            return resolve(config)
          }

          // Nếu đã hết hạn
          if (!this.isRefreshing) {
            this.isRefreshing = true

            // Gọi API refresh token
            authStore
              .refreshToken()
              .then((res) => {
                const authToken = res.data
                // Sau khi nhận được token mới thì cấu hình lại config
                if (config.headers)
                  config.headers['Authorization'] = `Bearer ${authToken.data.access_token}`
                // Sau khi cấu hình lại accessToken mới thì gọi lại các request đợi có accessToken mới
                this.requests.forEach((cb: any) => cb(authToken.data.access_token))
                this.requests = []
              })
              .catch((error) => {
                console.log(error)
                // if (error.response.status === 401) {
                //   authStore.logout()
                // }
                authStore.logout()
              })
              .finally(() => {
                this.isRefreshing = false
              })
          }

          // Nếu refreshToken đang được xử lý thì đẩy request vào hàng đợi
          resolve(this.retryOriginalRequest(config))
        })
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.axiosInstance.interceptors.response
  }

  private httpInterceptorsResponse(): void {
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // window.$loadingBar.finish()
        return response
      },
      (error: AxiosError) => {
        // window.$loadingBar.error()
        return Promise.reject(error)
      }
    )
  }

  public get<T = any, R = AxiosResponse<APIResponseSuccess<T>>, D = any>(
    url: string,
    config?: AxiosRequestConfig
  ) {
    return this.axiosInstance.get<T, R, D>(url, config)
  }

  public post<T = any, R = AxiosResponse<APIResponseSuccess<T>>, D = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ) {
    return this.axiosInstance.post<T, R, D>(url, data, config)
  }

  public put<T = any, R = AxiosResponse<APIResponseSuccess<T>>, D = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ) {
    return this.axiosInstance.put<T, R, D>(url, data, config)
  }

  public delete<T = any, R = AxiosResponse<APIResponseSuccess<T>>, D = any>(
    url: string,
    config?: AxiosRequestConfig
  ) {
    return this.axiosInstance.delete<T, R, D>(url, config)
  }
}

const axios = new AxiosHttp()

export default axios
