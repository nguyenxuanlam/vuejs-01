import type { CheckKeyword, Group, Branch } from '@/types'
import { apiHistoryKeywords } from '@api/historyKeyword'
import { useAutoCheckStore } from '@/views/auto-check/stores/autoCheckStore'
import { NSpin } from 'naive-ui'

type UrlSearchParams = {
  page: number
  per_page: number
  group_id?: number
  branch_id?: number
}

export const useHistoryKeywordStore = defineStore('historyKeywordStore', {
  state: () => ({
    listData: undefined as Pagination<CheckKeyword.Item> | undefined,
    urlParams: <UrlSearchParams>{
      page: 1,
      per_page: 20
    },
    groups: [] as Array<Group.Item>,
    branchs: [] as Array<Branch.Item>,
    state: {
      isFetching: true,
      isShowDomainModal: false,
      isFetchingCopy: false
    },
    viewDomainData: undefined as CheckKeyword.Item['domains'] | undefined
  }),
  getters: {
    getProgressKeyword() {
      const autoCheckStore = useAutoCheckStore()
      return Number(autoCheckStore.progress?.processingKeyword.toFixed(0)) || 0
    }
  },
  actions: {
    async fetchData() {
      try {
        const { urlParams } = useAutoCheckStore()
        const res = await apiHistoryKeywords.getList({
          ...this.urlParams,
          run_at: urlParams.date
        })
        const dataRes = res.data.data

        this.listData = dataRes
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }

      this.state.isFetching = false
    },
    async fetchGroups() {
      try {
        const res = await apiGroups.getList({ per_page: 9999, branch_id: this.urlParams.branch_id })
        const dataRes = res.data.data

        this.groups = dataRes.data
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }
    },
    async fetchBrands() {
      try {
        const res = await apiBranches.getList({
          per_page: 9999
        })
        const dataRes = res.data.data

        this.branchs = dataRes.data
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }
    },
    async onExport() {
      const dialog = window.$dialog.warning({
        title: 'Đang xuất dữ liệu',
        content: () =>
          h('div', { class: 'flex items-center justify-center' }, h(NSpin, { class: 'w-10 h-10' })),
        closable: false,
        closeOnEsc: false,
        maskClosable: false
      })

      try {
        const { urlParams } = useAutoCheckStore()
        const res = await apiExport.autoCheckKeywords({
          branch_id: this.urlParams.branch_id,
          group_id: this.urlParams.group_id,
          run_at: urlParams.date
        })
        if (res?.data) {
          useDownload(res.data, 'auto-check-keywords.xlsx')
        }
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }
      dialog.destroy()
    },
    async onChangeGroupId(groupId?: number) {
      if (this.urlParams.group_id !== groupId) {
        this.urlParams.group_id = groupId
      } else {
        this.urlParams.group_id = undefined
      }
      this.onChangePage(1)
    },
    async onChangeBranchId(branchId?: number) {
      this.urlParams.branch_id = branchId
      this.urlParams.group_id = undefined
      this.fetchGroups()
      this.onChangePage(1)
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
          group_id: undefined,
          branch_id: undefined
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
