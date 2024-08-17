import { type Provider, Session } from '@/types'
import { apiSessions } from '@api/sessions'
import { format as formatDate } from 'date-fns'

const urlSearchSchema = zod.object({
  page: zod.preprocess(Number, zod.number().min(1).default(1).catch(1)),
  per_page: zod.preprocess(Number, zod.number().min(1).default(20).catch(20)),
  manual_sessions_id: zod.preprocess(Number, zod.number()).optional(),
  status_process: zod.preprocess(Number, zod.number()).optional(),
  status_domain: zod.preprocess(Number, zod.number()).optional(),
  search: zod.string().optional()
})

type UrlSearchParams = Zod.infer<typeof urlSearchSchema>

export interface TaskStatistic {
  pending: number
  running: number
  done: number
  total: number
  processLimit: number
}

export enum StatusCode {
  Unknown = -1,
  Fail = 0,
  Success = 1,
  ProxyError = 100, // Lỗi proxy
  Timeout = 101, // Timeout
  VerifyCaptcha = 102 // Bị google, cloudflare chặn verify captcha
}

export const useManualCheckDomainStore = defineStore('manual-check-domain-store', {
  state: () => ({
    listData: [] as Session.HistoryDomain[],
    listCopySession: [] as Session.Copy.Check[],
    progress: {
      total: 0,
      done: 0
    } as Session.Progress,
    pagination: {
      totalItem: 0,
      pageCount: 0
    },
    listSession: [] as { label: string; value: number }[],
    listProviders: [] as Provider.Item[],
    urlParams: useUrlSearchParams<UrlSearchParams>(),
    state: {
      pendingFetchData: false,
      pendingFetchProgress: false,
      isFetching: true,
      isFetchingProviders: true,
      isFetchingSession: true,
      isFetchingCopySession: false
    }
  }),
  getters: {
    getProgressPercent(state): number {
      if (state.progress.total === 0) return 0
      const percent = (state.progress.done / state.progress.total) * 100
      return Number(percent.toFixed(1)) || 0
    }
  },
  actions: {
    async fetchProgress() {
      this.state.pendingFetchProgress = true
      try {
        const sessionId = this.urlParams.manual_sessions_id
        if (!this.urlParams.manual_sessions_id) {
          this.progress = {
            total: 0,
            done: 0
          }
          return
        }
        const res = await apiSessions.getProgress(this.urlParams.manual_sessions_id)
        if (sessionId === this.urlParams.manual_sessions_id) {
          this.progress = res.data.data
        }
      } catch (error) {
        console.log(error)
      }
      this.state.pendingFetchProgress = false
    },
    async fetchData() {
      this.state.pendingFetchData = true
      try {
        const res = await apiSessions.getHistory({ ...this.urlParams, type: 'CHECK' })
        this.pagination.pageCount = res.data.data.paginate.last_page
        this.pagination.totalItem = res.data.data.paginate.total
        this.listData = res.data.data.data
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }

      this.state.isFetching = false
      this.state.pendingFetchData = false
    },
    async fetchDetail(id: number) {
      this.state.isFetching = true
      try {
        this.urlParams.manual_sessions_id = id
        this.urlParams.page = 1
        this.urlParams.status_domain = undefined
        this.urlParams.status_process = undefined
        this.fetchData()
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }
      this.state.isFetching = false
    },
    onChangePage(page: number) {
      this.urlParams.page = page
      this.state.isFetching = true
      this.fetchData()
    },
    onChangePageSize(pageSize: number) {
      this.urlParams.per_page = pageSize
      this.onChangePage(1)
    },
    resetUrlParams() {
      this.$patch({
        urlParams: useUrlSearchParams<UrlSearchParams>()
      })
      const parsed = urlSearchSchema.parse(this.urlParams)
      for (const key in parsed) {
        if (Object.prototype.hasOwnProperty.call(parsed, key)) {
          ;(this.urlParams as any)[key] = parsed[key as keyof UrlSearchParams]
        }
      }
    },
    async fetchListSession(manual_sessions_id?: number) {
      this.state.isFetchingSession = true
      try {
        const res = await apiSessions.getList({
          page: 1,
          per_page: 100,
          type: 'CHECK'
        })
        this.listSession = res.data.data.data.map((item) => ({
          label: formatDate(new Date(item.created_at), 'HH:mm dd/MM/yyyy'),
          value: item.id,
          total: item.total
        }))
        if (this.listSession.length) {
          if (manual_sessions_id) {
            this.urlParams.manual_sessions_id = manual_sessions_id
          } else this.urlParams.manual_sessions_id = this.listSession[0].value
        }
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }
      this.state.isFetchingSession = false
    },
    async fetchProviders() {
      this.state.isFetchingProviders = true

      try {
        const res = await apiProviders.getList({})
        const dataRes = res.data.data
        this.listProviders = dataRes.data.sort((a, b) => a.sort - b.sort)
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }

      this.state.isFetchingProviders = false
    }
  }
})
