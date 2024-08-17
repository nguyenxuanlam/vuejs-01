import type { Provider, Proxy } from '@/types'
import { type SelectOption } from 'naive-ui'

type UrlSearchParams = {
  page: number
  per_page: number
  proxy_name?: string
  provider_id?: number
  is_active?: 'Y' | 'N' | 'F'
}

export const useProxyStore = defineStore('proxyStore', {
  state: () => ({
    listData: undefined as Pagination<Proxy.Item> | undefined,
    editId: null as number | null,
    urlParams: useUrlSearchParams<UrlSearchParams>(),
    listProviders: undefined as Array<SelectOption> | undefined,
    state: {
      isFetching: true,
      isFetchingProviders: true
    },
    stateModal: {
      isShowCreateModal: false,
      isShowUpdateModal: false
    },
    statusOptions: [
      { label: 'Hoạt động', value: 'Y' },
      { label: 'Tạm dừng', value: 'N' },
      { label: 'Khóa', value: 'F' }
    ]
  }),
  actions: {
    async fetchData() {
      this.state.isFetching = true

      try {
        const res = await apiProxies.getList(this.urlParams)
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
      this.urlParams.provider_id = zod.number().safeParse(Number(this.urlParams.provider_id)).data
    },
    async fetchProviders(params: {}) {
      this.state.isFetchingProviders = true

      try {
        const res = await apiProviders.getList(params)
        const dataRes = res.data.data

        this.listProviders = dataRes.data?.map((provider: Provider.Item) => ({
          label: provider.name,
          value: provider.id
        }))
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }

      this.state.isFetchingProviders = false
    }
  }
})
