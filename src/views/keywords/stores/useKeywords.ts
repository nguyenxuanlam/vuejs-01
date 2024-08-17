import type { Keyword, Tag } from '@/types'
import type { SelectOption } from 'naive-ui'
import type { FormattedValue } from 'naive-ui/es/date-picker/src/interface'
import { format } from 'date-fns'

type UrlSearchParams = {
  page: number
  per_page: number
  name?: string
  created_at?: FormattedValue
  is_run_daily?: 'Y' | 'N'
  tag: string[]
}

type TagParams = {
  page: number
  per_page: number
}

export const useKeywordStore = defineStore('keywordStore', {
  state: () => ({
    listData: undefined as Pagination<Keyword.Item> | undefined,
    listDomain: [] as Array<Keyword.Domain>,
    editId: null as number | null,
    urlParams: useUrlSearchParams<UrlSearchParams>(),
    state: {
      isFetching: true,
      pendingFetchData: false,
      isFetchingTags: true,
      isLoadMoreTags: false
    },
    stateModal: {
      isShowCreateModal: false,
      isShowUpdateModal: false,
      isShowDomainModal: false,
      isShowDeleteModal: false
    },
    statusOptions: <SelectOption[]>[
      { label: 'Chạy hàng ngày', value: 'Y' },
      { label: 'Không chạy hàng ngày', value: 'N' }
    ],
    tagsOptions: undefined as Array<SelectOption> | undefined,
    tagParams: <TagParams>{
      page: 1,
      per_page: 20
    }
  }),
  actions: {
    async fetchData() {
      this.state.pendingFetchData = true

      try {
        const res = await apiKeywords.getList(this.urlParams)
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
      this.state.pendingFetchData = false
    },
    async fetchTags() {
      this.state.isFetchingTags = true

      try {
        const res = await apiTags.getList(this.tagParams)
        const dataRes = res.data.data

        this.state.isLoadMoreTags = dataRes.paginate.current_page < dataRes.paginate.last_page

        if (!this.tagsOptions) {
          this.tagsOptions = []
        }

        const newTags = dataRes.data.map((tag: Tag.Item) => ({
          label: tag.name,
          value: tag.id
        }))

        this.tagsOptions.push(...newTags)
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }

      this.state.isFetchingTags = false
    },
    onFetchMoreTags(e: Event) {
      const target = e.currentTarget as HTMLElement
      if (
        this.state.isLoadMoreTags &&
        !this.state.isFetchingTags &&
        target.scrollTop + target.offsetHeight + 50 >= target.scrollHeight
      ) {
        this.tagParams.page++
        this.fetchTags()
      }
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

      if (typeof this.urlParams.tag === 'string') {
        this.urlParams.tag = [this.urlParams.tag]
      }
    }
  }
})
