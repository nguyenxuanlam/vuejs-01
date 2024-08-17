import type { Branch, Group } from '@/types'

type UrlSearchParams = {
  page: number
  per_page: number
  name?: string
  branch_id?: number | null
}

export const useGroupStore = defineStore('groupStore', {
  state: () => ({
    listData: undefined as Pagination<Group.Item> | undefined,
    listSelectBranch: [] as Array<Branch.Item>,
    editId: null as number | null,
    branchId: null as number | null,
    urlParams: useUrlSearchParams<UrlSearchParams>(),
    state: {
      isFetching: true
    },
    stateModal: {
      isShowCreateModal: false,
      isShowUpdateModal: false
    }
  }),
  actions: {
    async fetchData() {
      this.state.isFetching = true

      try {
        const res = await apiGroups.getList(this.urlParams)
        const res1 = await apiBranches.getList({})
        const dataRes = res.data.data
        const dataRes1 = res1.data.data
        if (dataRes.paginate.current_page > 1 && !dataRes.data.length) {
          this.onChangePage(dataRes.paginate.current_page - 1)
        }

        this.listData = dataRes
        const newTags = dataRes1.data.map((branch: Branch.Item) => ({
          id: branch.id,
          name: branch.name,
          groups: branch.groups,
          created_at: branch.created_at,
          updated_at: branch.updated_at
        }))

        // Filter out duplicates
        const existingIds = new Set(this.listSelectBranch.map((branch) => branch.id))
        const uniqueNewTags = newTags.filter((tag) => !existingIds.has(tag.id))

        this.listSelectBranch.push(...uniqueNewTags)
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
