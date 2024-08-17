import type { User } from '@/types'

type UrlSearchParams = {
  page: number
  per_page: number
  name?: string
  email?: string
  username?: string
  is_active?: 'Y' | 'N'
}

export const useUserStore = defineStore('userStore', {
  state: () => ({
    listData: undefined as Pagination<User.Item> | undefined,
    editId: null as number | null,
    urlParams: useUrlSearchParams<UrlSearchParams>(),
    state: {
      isFetching: true
    },
    stateModal: {
      isShowCreateModal: false,
      isShowUpdateModal: false,
      isShowChangePasswordModal: false
    },
    statusOptions: [
      { label: 'Mở khóa', value: 'Y' },
      { label: 'Khóa', value: 'N' }
    ]
  }),
  actions: {
    async fetchData() {
      this.state.isFetching = true

      try {
        const res = await apiUsers.getList(this.urlParams)
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
