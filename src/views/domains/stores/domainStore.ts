import type { Domain, HistoryDomain, Keyword, Provider } from '@/types'
import { apiDomains } from '@api/domains'
import type { SelectOption } from 'naive-ui'

type UrlSearchParams = {
  page: number
  per_page: number
  name?: string
  keywords?: string
  checked_at?: [string, string]
  recorded_at?: [string, string]
}

type KeywordParams = {
  page: number
  per_page: number
}

const { isUserWhiteListed } = useValidUser()

export const useDomainStore = defineStore('domainStore', {
  state: () => ({
    listData: undefined as Pagination<Domain.Item> | undefined,
    listProviders: undefined as Provider.Item[] | undefined,
    listHistoryChecked: undefined as Pagination<HistoryDomain.Check.Item> | undefined,
    listHistoryRecorded: undefined as Pagination<HistoryDomain.Record.Item> | undefined,
    editId: null as number | null,
    urlParams: useUrlSearchParams<UrlSearchParams>(),
    historyCheckedParams: {
      page: 1,
      per_page: 20,
      domain_id: ''
    },
    historyRecordedParams: {
      page: 1,
      per_page: 20,
      domain_id: ''
    },
    state: {
      isFetching: true,
      isFetchingProviders: true,
      isFetchingHistoryChecked: true,
      isFetchingHistoryRecorded: true,
      isFetchingKeywords: true,
      isLoadMoreKeywords: false,
      isUserWhiteListed: isUserWhiteListed()
    },
    stateModal: {
      isShowCreateModal: false,
      isShowUpdateModal: false,
      isShowHistoryCheckedModal: false,
      isShowHistoryRecordedModal: false
    },
    keywordOptions: undefined as Array<SelectOption> | undefined,
    keywordParams: <KeywordParams>{
      page: 1,
      per_page: 20
    }
  }),
  actions: {
    async fetchData() {
      this.state.isFetching = true

      try {
        const res = await apiDomains.getList({
          ...this.urlParams,
          checked_at: undefined,
          recorded_at: undefined,
          checked_at_from: this.urlParams.checked_at?.[0],
          checked_at_to: this.urlParams.checked_at?.[1],
          recorded_at_from: this.urlParams.recorded_at?.[0],
          recorded_at_to: this.urlParams.recorded_at?.[1]
        })
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
    async fetchKeywords() {
      this.state.isFetchingKeywords = true

      try {
        const res = await apiKeywords.getList(this.keywordParams)
        const dataRes = res.data.data

        this.state.isLoadMoreKeywords = dataRes.paginate.current_page < dataRes.paginate.last_page

        if (!this.keywordOptions) {
          this.keywordOptions = []
        }

        const newKeywords = dataRes.data.map((keyword: Keyword.Item) => ({
          label: keyword.name,
          value: keyword.name
        }))

        this.keywordOptions.push(...newKeywords)
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }

      this.state.isFetchingKeywords = false
    },
    onChangePage(page: number) {
      this.urlParams.page = page
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
    onChangeHistoryRecordedPage(page: number) {
      this.historyRecordedParams.page = page
      this.fetchHistoryRecordedData()
    },
    onChangeHistoryRecordedPageSize(pageSize: number) {
      this.historyRecordedParams.per_page = pageSize
      this.onChangeHistoryRecordedPage(1)
    },
    onFetchMoreKeywords(e: Event) {
      const target = e.currentTarget as HTMLElement
      if (
        this.state.isLoadMoreKeywords &&
        !this.state.isFetchingKeywords &&
        target.scrollTop + target.offsetHeight + 50 >= target.scrollHeight
      ) {
        this.keywordParams.page++
        this.fetchKeywords()
      }
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
    }
  }
})
