import type { Session } from '@/types'
import { format as formatDate } from 'date-fns'

const urlSearchSchema = zod.object({
  manual_sessions_id: zod.preprocess(Number, zod.number()).optional(),
  search: zod.string().optional()
})
export type UrlSearchParams = Zod.infer<typeof urlSearchSchema>

export const useDomainRecordStore = defineStore('manual-record-domain-store', {
  state: () => ({
    urlParams: useUrlSearchParams<UrlSearchParams>(),
    listSession: [] as { label: string; value: number; total: number }[],
    progress: {
      total: 0,
      done: 0
    } as Session.Progress,
    state: {
      isFetchingSession: true,
      pendingFetchProgress: false,
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
    async fetchListSession(manual_sessions_id?: number) {
      this.state.isFetchingSession = true
      try {
        const res = await apiSessions.getList({
          page: 1,
          per_page: 100,
          type: 'RECORD'
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
    }
  }
})
