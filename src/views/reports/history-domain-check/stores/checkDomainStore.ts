import type { Provider, HistoryDomain } from '@/types'
import type { FormattedValue } from 'naive-ui/es/date-picker/src/interface'
import { format } from 'date-fns'
import type { SelectOption } from 'naive-ui'

type UrlSearchParams = {
  domain_name?: string
  page: number
  per_page: number
  checked_at?: FormattedValue
  type: 'manual' | 'auto'
  created_at?: FormattedValue
}

type HistoryCheckedParams = {
  page: number
  per_page: number
  domain_id?: string
}

export const useCheckDomainStore = defineStore('history-domain-check', {
  state: () => ({
    listData: undefined as Pagination<HistoryDomain.Check.Item> | undefined,
    listProviders: undefined as Provider.Item[] | undefined,
    listHistoryChecked: undefined as Pagination<HistoryDomain.Check.Item> | undefined,
    urlParams: useUrlSearchParams<UrlSearchParams>(),
    historyCheckedParams: <HistoryCheckedParams>{
      page: 1,
      per_page: 20,
      domain_id: ''
    },
    state: {
      isFetching: true,
      isFetchingProviders: true,
      isFetchingHistoryChecked: true
    },
    stateModal: {
      isShowHistoryCheckedModal: false
    },
    typeOptions: <SelectOption[]>[
      { label: 'Thủ công', value: 'manual' },
      { label: 'Tự động', value: 'auto' }
    ]
  }),
  actions: {
    async fetchData() {
      // this.state.isFetching = true

      try {
        const res = await apiHistoryDomain.getListCheck(this.urlParams)
        const dataRes = res.data.data
        if (dataRes.paginate.current_page > 1 && !dataRes.data.length) {
          this.onChangePage(dataRes.paginate.current_page - 1)
        }

        this.listData = dataRes
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }

      this.state.isFetching = false
    },
    async fetchHistoryCheckedData() {
      this.state.isFetchingHistoryChecked = true

      try {
        const res = await apiHistoryDomain.getListCheck(this.historyCheckedParams)
        const dataRes = res.data.data
        if (dataRes.paginate.current_page > 1 && !dataRes.data.length) {
          this.onChangeHistoryCheckedPage(dataRes.paginate.current_page - 1)
        }
        this.listHistoryChecked = dataRes
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }

      this.state.isFetchingHistoryChecked = false
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
    onChangeHistoryCheckedPage(page: number) {
      this.historyCheckedParams.page = page
      this.fetchHistoryCheckedData()
    },
    onChangeHistoryCheckedPageSize(pageSize: number) {
      this.historyCheckedParams.per_page = pageSize
      this.onChangeHistoryCheckedPage(1)
    },
    resetUrlParams() {
      this.$patch({
        urlParams: useUrlSearchParams<UrlSearchParams>()
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
      this.urlParams.checked_at = zod
        .string()
        .default(format(new Date(), 'yyyy-MM-dd'))
        .parse(this.urlParams.checked_at)
      this.urlParams.type = zod
        .enum(['manual', 'auto'])
        .default('auto')
        .catch('auto')
        .parse(this.urlParams.type)
    },
    async fetchProviders() {
      this.state.isFetchingProviders = true

      try {
        const res = await apiProviders.getList({
          is_active: 'Y'
        })
        const dataRes = res.data.data
        this.listProviders = dataRes.data
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }

      this.state.isFetchingProviders = false
    },
    async runRetry(data: HistoryDomain.RunRetry) {
      try {
        await apiHistoryDomain.runRetryCheck(data)
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }
    }
  }
})
