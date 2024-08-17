import type { Flow } from '@/types'
import { format } from 'date-fns'

export type UrlSearchParams = {
  date: string
}

export const useAutoCheckStore = defineStore('auto-check-store', {
  state: () => ({
    urlParams: useUrlSearchParams<UrlSearchParams>(),
    progress: null as Flow.Metric | null,
    progressChange: {
      keyword: false,
      redirect5days: false,
      redirect15days: false,
      check: false,
      record: false
    },
    state: {
      isFetching: false
    }
  }),
  getters: {
    progressTotal: (state) => {
      const progress = state.progress
      if (!progress) return 0

      const total =
        progress.processingKeyword +
        progress.check.processingChecked +
        progress.record.processingRecorded +
        progress.processing5days +
        progress.processing15days
      const avg = total / 5
      return Number(avg.toFixed(0))
    }
  },
  actions: {
    async fetchProgress() {
      this.state.isFetching = true
      try {
        const res = await apiFlow.getMetric(this.urlParams)
        // Kiểm tra progress có thay đổi không
        if (this.progress) {
          this.progressChange.keyword =
            res.data.processingKeyword - this.progress.processingKeyword !== 0
          this.progressChange.redirect5days =
            res.data.processing5days - this.progress.processing5days !== 0
          this.progressChange.redirect15days =
            res.data.processing15days - this.progress.processing15days !== 0
          this.progressChange.check =
            res.data.check.processingChecked - this.progress.check.processingChecked !== 0
          this.progressChange.record =
            res.data.record.processingRecorded - this.progress.record.processingRecorded !== 0
        }
        this.progress = res.data
      } catch (error) {
        console.error(error)
      }
      this.state.isFetching = false
    },
    resetUrlParams() {
      this.$patch({
        urlParams: useUrlSearchParams<UrlSearchParams>()
      })

      if (!this.urlParams.date) {
        this.urlParams.date = format(new Date(), 'yyyy-MM-dd')
      }
    }
  }
})
