import type { Provider } from '@/types'
import { apiProviders } from '@api/provider'

type UrlSearchParams = {
  page: number
  per_page: number
  name?: string
  is_active?: 'Y' | 'N'
}

export const useProviderStore = defineStore('providerStore', {
  state: () => ({
    listData: undefined as Pagination<Provider.Item> | undefined,
    editId: null as number | null,
    urlParams: useUrlSearchParams<UrlSearchParams>(),
    state: {
      isFetching: true
    },
    stateModal: {
      isShowCreateModal: false,
      isShowUpdateModal: false,
      isShowChangeSortModal: false
    },
    statusOptions: [
      { label: 'Hoạt động', value: 'Y' },
      { label: 'Tạm dừng', value: 'N' }
    ]
  }),
  getters: {
    getSortData(state): Provider.SortItem[] | undefined {
      return state.listData?.data
        ? state.listData?.data.map((item) => ({
            id: item.id,
            name: item.name,
            sort: item.sort
          }))
        : undefined
    }
  },
  actions: {
    async fetchData() {
      this.state.isFetching = true

      try {
        const res = await apiProviders.getList(this.urlParams)
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
    onChangePage(page: number) {
      this.urlParams.page = page
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
