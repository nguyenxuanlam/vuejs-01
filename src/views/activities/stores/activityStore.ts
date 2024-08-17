import type { Activity, User } from '@/types'
import type { FormattedValue } from 'naive-ui/es/date-picker/src/interface'
import type { SelectOption } from 'naive-ui'

type UrlSearchParams = {
  page: number
  per_page: number
  description?: string
  user_id?: number
  from?: FormattedValue
  to?: FormattedValue
}

type UserParams = {
  page: number
  per_page: number
}

export const useActivityStore = defineStore('activityStore', {
  state: () => ({
    listData: undefined as Pagination<Activity.Item> | undefined,
    urlParams: useUrlSearchParams<UrlSearchParams>(),
    state: {
      isFetching: true,
      isFetchingUsers: true,
      isLoadMoreUsers: false
    },
    userOptions: undefined as Array<SelectOption> | undefined,
    userParams: <UserParams>{
      page: 1,
      per_page: 10
    }
  }),
  actions: {
    async fetchData() {
      this.state.isFetching = true

      try {
        const res = await apiActivities.getList(this.urlParams)

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
    async fetchOptionUsers() {
      this.state.isFetchingUsers = true

      try {
        const res = await apiUsers.getList(this.userParams)

        const dataRes = res.data.data

        this.state.isLoadMoreUsers = dataRes.paginate.current_page < dataRes.paginate.last_page

        if (!this.userOptions) {
          this.userOptions = []
        }

        const newUserOptions = dataRes.data.map((user: User.Item) => ({
          label: user.name,
          value: user.id
        }))

        this.userOptions.push(...newUserOptions)
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }

      this.state.isFetchingUsers = false
    },
    onFetchMoreUsers(e: Event) {
      const target = e.currentTarget as HTMLElement
      if (
        this.state.isLoadMoreUsers &&
        !this.state.isFetchingUsers &&
        target.scrollTop + target.offsetHeight + 50 >= target.scrollHeight
      ) {
        this.userParams.page++
        this.fetchOptionUsers()
      }
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
