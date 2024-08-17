import { format } from 'date-fns'
import type { HistoryDomain, Provider } from '@/types'
import type { FormattedValue } from 'naive-ui/es/date-picker/src/interface'
import type { SelectOption } from 'naive-ui'
import { apiHistoryDomain } from '@api/historyDomain'
import { useAutoCheckStore } from '@/views/auto-check/stores/autoCheckStore'

type UrlSearchParams = {
  page: number
  per_page: number
  server_id?: number
  search?: string
  date?: FormattedValue
  status?: 0 | 1 | 2
  type: 'manual' | 'auto'
}

export interface Proxy {
  proxyId: number
  providerId: number
  statusCode: HistoryDomain.StatusCode
  error: string
  imageCloudPath: string
}

export type Pagination = {
  totalItem: number
  pageCount: number
}

export const useAutoCheckDomainStore = defineStore('autoCheckDomainStore_proxy', {
  state: () => ({
    listData: [] as HistoryDomain.Check.Item[],
    listProviders: [] as Provider.Item[],
    urlParams: <UrlSearchParams>{
      page: 1,
      per_page: 20,
      type: 'auto'
    },
    pagination: <Pagination>{
      totalItem: 0,
      pageCount: 1
    },

    state: {
      pendingTaskStatistic: false,
      isFetching: true,
      isFetchingProviders: true,
      isFetchingCopy: false
    },
    stateModal: {
      isShowCreateModal: false
    },
    typeOptions: <SelectOption[]>[
      { label: 'Thủ công', value: 'manual' },
      { label: 'Tự động', value: 'auto' }
    ]
  }),
  getters: {
    getProgressWebsite() {
      const autoCheckStore = useAutoCheckStore()
      return Number(autoCheckStore.progress?.check.processingChecked.toFixed(0)) || 0
    },
    isDoneAll: (state) => {
      const totalDone = state.listData.filter((item) => item.is_check && item.checked_at).length
      return totalDone == state.pagination.totalItem && state.pagination.totalItem > 0
    }
  },
  actions: {
    async fetchData() {
      try {
        const { urlParams } = useAutoCheckStore()
        const res = await apiHistoryDomain.getListCheck({
          ...this.urlParams,
          checked_at: urlParams.date
        })
        const dataRes = res.data.data

        this.listData = dataRes.data
        this.pagination.totalItem = dataRes.paginate.total
        this.pagination.pageCount = dataRes.paginate.last_page
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
          type: 'auto'
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
        .default(10)
        .catch(10)
        .parse(Number(this.urlParams.per_page))
      this.urlParams.date = zod
        .string()
        .default(format(new Date(), 'yyyy-MM-dd'))
        .parse(this.urlParams.date)
      this.urlParams.type = zod
        .enum(['manual', 'auto'])
        .default('manual')
        .catch('manual')
        .parse(this.urlParams.type)
    },
    async fetchProviders() {
      this.state.isFetchingProviders = true

      try {
        const res = await apiProviders.getList()
        const dataRes = res.data.data
        this.listProviders = dataRes.data
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }

      this.state.isFetchingProviders = false
    }
  }
})
