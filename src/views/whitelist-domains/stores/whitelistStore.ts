import type { Tag, WhitelistDomain } from '@/types'
import { apiWhitelist } from '@api/whitelistDomain'
import type { SelectOption } from 'naive-ui'
import type { FormattedValue } from 'naive-ui/es/date-picker/src/interface'

type UrlSearchParams = {
  page: number
  per_page: number
  name?: string
  tag_name?: string | number
  created_at?: FormattedValue
}

type TagParams = {
  page: number
  per_page: number
}

export const useWhitelistStore = defineStore('whiteListStore', {
  state: () => ({
    listData: undefined as Pagination<WhitelistDomain.Item> | undefined,
    editId: null as number | null,
    urlParams: useUrlSearchParams<UrlSearchParams>(),
    state: {
      isFetching: true,
      isFetchingTags: true,
      isLoadMoreTags: false
    },
    stateModal: {
      isShowCreateModal: false,
      isShowUpdateModal: false,
      isShowDeleteModal: false
    },
    tagsOptions: undefined as Array<SelectOption> | undefined,
    tagParams: <TagParams>{
      page: 1,
      per_page: 100
    }
  }),
  actions: {
    async fetchData() {
      this.state.isFetching = true

      try {
        const newParams = {
          ...this.urlParams,
          tag_id: this.tagsOptions?.find((tag) => tag.label === this.urlParams.tag_name)?.value
        }
        const res = await apiWhitelist.getList(newParams)
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
