import { type DomainRedirect } from '@/types'
import { apiRedirects } from '@api/redirects'
import { useAutoCheckStore } from '@/views/auto-check/stores/autoCheckStore'

type UrlSearchParams = {
  page: number
  per_page: number
  day: DomainRedirect.Type
}

export const useRedirectFiveDayStore = defineStore('redirectFiveDay', {
  state: () => ({
    listData: undefined as Pagination<DomainRedirect.Item> | undefined,
    urlParams: <UrlSearchParams>{
      page: 1,
      per_page: 20,
      day: 5
    },
    state: {
      isFetching: true,
      isFetchingCopy: false
    }
  }),
  getters: {
    getProgressRedirect() {
      const autoCheckStore = useAutoCheckStore()
      return Number(autoCheckStore.progress?.processing5days.toFixed(0)) || 0
    }
  },
  actions: {
    async fetchData() {
      try {
        const { urlParams } = useAutoCheckStore()
        const res = await apiRedirects.getList({
          ...this.urlParams,
          last_check: urlParams.date
        })
        this.listData = res.data.data
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
        urlParams: <UrlSearchParams>{
          page: 1,
          per_page: 20,
          day: 5
        }
      })
      this.urlParams.page = zod
        .number()
        .min(1)
        .default(1)
        .catch(1)
        .parse(Number(this.urlParams.page))
      this.urlParams.per_page = zod
        .number()
        .min(1)
        .default(20)
        .catch(20)
        .parse(Number(this.urlParams.per_page))
    }
  }
})
