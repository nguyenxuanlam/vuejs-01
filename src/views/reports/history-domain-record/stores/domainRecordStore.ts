import type { HistoryDomain } from '@/types'
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

export const useDomainRecordStore = defineStore('history-domain-record', {
  state: () => ({
    listData: undefined as Pagination<HistoryDomain.Record.Item> | undefined,
    listHistoryRecorded: undefined as Pagination<HistoryDomain.Record.Item> | undefined,
    urlParams: useUrlSearchParams<UrlSearchParams>(),
    historyRecordedParams: {
      page: 1,
      per_page: 20,
      domain_id: ''
    },
    state: {
      isFetching: true,
      isFetchingHistoryRecorded: true
    },
    stateModal: {
      isShowHistoryRecordedModal: false
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
        const res = await apiHistoryDomain.getListRecord(this.urlParams)
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
    async fetchHistoryRecordedData() {
      this.state.isFetchingHistoryRecorded = true

      try {
        const res = await apiHistoryDomain.getListRecord(this.historyRecordedParams)
        const dataRes = res.data.data
        if (dataRes.paginate.current_page > 1 && !dataRes.data.length) {
          this.onChangeHistoryRecordedPage(dataRes.paginate.current_page - 1)
        }
        this.listHistoryRecorded = dataRes
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }

      this.state.isFetchingHistoryRecorded = false
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
    onChangeHistoryRecordedPage(page: number) {
      this.historyRecordedParams.page = page
      this.fetchHistoryRecordedData()
    },
    onChangeHistoryRecordedPageSize(pageSize: number) {
      this.historyRecordedParams.per_page = pageSize
      this.onChangeHistoryRecordedPage(1)
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
    async runRetry(data: HistoryDomain.RunRetry) {
      try {
        await apiHistoryDomain.runRetryRecord(data)
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }
    }
  }
})
