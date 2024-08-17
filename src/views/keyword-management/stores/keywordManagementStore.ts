import { apiBranches } from '@/services/api/branch'
import type { Group, Keyword, Tag } from '@/types'
import type { Branch } from '@/types/modules/branch'
import type { SelectOption } from 'naive-ui'
import { defineStore } from 'pinia'

type urlSearchSchema = {
  branch_id: number | null
  group_id: number | null
  page: number | null
  per_page: number | null
}

type GroupsParams = {
  page: number
  per_page: number | null
  branch_id: number | null
}

type TagsParams = {
  page: number
  per_page: number | null
  branch_id: number | null
  name: string | null
}

// Default value for urlSearchSchema
const defaultUrlSearchParams: urlSearchSchema = {
  branch_id: null,
  group_id: null,
  page: null,
  per_page: null
}

const defaultGroupsParams: GroupsParams = {
  page: 1,
  per_page: null,
  branch_id: null
}
const defaultTagsParams: TagsParams = {
  page: 1,
  per_page: null,
  branch_id: null,
  name: null
}

export const useKeywordManagementStore = defineStore('keywordManagementStore', {
  state: () => ({
    listData: undefined as Pagination<Branch.Item> | undefined,
    listDataFilter: undefined as Pagination<Branch.Item> | undefined,
    groups: [] as Array<Group.Item>,
    urlParams: useUrlSearchParams<urlSearchSchema>(),
    branchId: null as number | null,
    groupId: null as number | null,
    toTalBranch: 0,
    toTalGroup: 0,
    toTalKeyword: 0,
    state: {
      isFetching: true,
      pendingFetchData: false,
      isFetchingGroups: true,
      isLoadMoreGroups: false,
      isFetchingTags: true,
      isLoadMoreTags: false,
      isSearchingTags: false,
      isLoadMoreData: false,
      isFetchingTagsCreate: true,
      isLoadMoreTagsCreate: false,
      isFetchingGroupsCreate: true,
      isLoadMoreGroupsCreate: false
    },
    stateModal: {
      isShowCreateKeywordModal: false,
      isShowUpdateKeywordModal: false
    },
    tagsOptions: undefined as Array<SelectOption> | undefined,
    groupsOptions: undefined as Array<SelectOption> | undefined, // Added groupsOptions
    groupsParams: <GroupsParams>{
      page: 1,
      per_page: 10,
      branch_id: null
    },
    groupsParamsCreate: <GroupsParams>{
      page: 1,
      per_page: 10,
      branch_id: null
    },
    tagsParams: <TagsParams>{
      page: 1,
      per_page: 10,
      name: ''
    },
    tagsParamsCreate: <TagsParams>{
      page: 1,
      per_page: 10
    },
    availableTags: undefined as Array<SelectOption> | undefined, // Array for available tags
    availableGroups: undefined as Array<SelectOption> | undefined, // Array for available groups
    updateKeyWord: null as Keyword.Update | null,
    collapseDefault: {
      parent: [] as number[],
      childrend: [] as number[]
    }
  }),
  actions: {
    async fetchData() {
      this.state.isFetching = true

      try {
        const res = await apiBranches.getList({ with_group_keyword: 'Y', ...this.urlParams })
        const dataRes = res.data.data
        this.urlParams.page = dataRes.paginate.current_page
        this.state.isLoadMoreData = dataRes.paginate.current_page < dataRes.paginate.last_page
        this.collapseDefault.parent = dataRes.data.map((branch: Branch.Item) => {
          this.collapseDefault.childrend.push(...branch.groups.map((group: Group.Item) => group.id))
          return branch.id
        })
        if (!this.listData) {
          this.listData = dataRes
        } else {
          this.listData.data.push(...dataRes.data)
        }
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }

      this.state.isFetching = false
      this.state.pendingFetchData = false
    },
    async fetchTotalData() {
      this.state.isFetching = true

      try {
        const res = await apiBranches.getList({ per_page: 1 })
        const dataRes = res.data.data
        const res1 = await apiGroups.getList({ per_page: 1 })
        const dataRes1 = res1.data.data
        const res2 = await apiKeywords.getList({ per_page: 1 })
        const dataRes2 = res2.data.data
        this.toTalBranch = dataRes.paginate.total
        this.toTalGroup = dataRes1.paginate.total
        this.toTalKeyword = dataRes2.paginate.total
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }

      this.state.isFetching = false
      this.state.pendingFetchData = false
    },
    async fetchTagsOptions() {
      this.state.isFetchingTags = true
      const res = await apiBranches.getList({ ...this.tagsParams })
      const dataRes = res.data.data
      try {
        this.state.isLoadMoreTags = dataRes.paginate.current_page < dataRes.paginate.last_page
        if (!this.tagsOptions) {
          this.tagsOptions = []
        }
        const newTags = dataRes.data.flatMap((tag: Tag.Item) => ({
          value: tag.id,
          label: tag.name
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
        this.tagsParams.page++
        this.fetchTagsOptions()
      }
    },
    async fetchTagsOptionsCreate() {
      this.state.isFetchingTagsCreate = true
      const res = await apiBranches.getList({ ...this.tagsParamsCreate })
      const dataRes = res.data.data
      try {
        this.state.isLoadMoreTagsCreate = dataRes.paginate.current_page < dataRes.paginate.last_page
        if (!this.availableTags) {
          this.availableTags = []
        }
        const newTagsAvailableOptions = dataRes.data.flatMap((tag: Tag.Item) => ({
          value: tag.id,
          label: tag.name
        }))
        this.availableTags.push(...newTagsAvailableOptions)
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }
      this.state.isFetchingTagsCreate = false
    },
    onFetchMoreTagsCreate(e: Event) {
      const target = e.currentTarget as HTMLElement
      if (
        this.state.isLoadMoreTagsCreate &&
        !this.state.isFetchingTagsCreate &&
        target.scrollTop + target.offsetHeight + 50 >= target.scrollHeight
      ) {
        this.tagsParamsCreate.page++
        this.fetchTagsOptionsCreate()
      }
    },

    async fetchGroupsOptions() {
      this.state.isFetchingGroups = true
      try {
        const res = await apiGroups.getList({ ...this.groupsParams })
        const dataRes = res.data.data
        this.state.isLoadMoreGroups = dataRes.paginate.current_page < dataRes.paginate.last_page
        if (!this.groupsOptions) {
          this.groupsOptions = []
        }

        const newGroupsOptions = dataRes.data.map((user: Group.Item) => ({
          label: user.name,
          value: user.id
        }))

        this.groupsOptions.push(...newGroupsOptions)
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }
      this.state.isFetchingGroups = false
    },
    onFetchMoreGroups(e: Event) {
      const target = e.currentTarget as HTMLElement
      if (
        this.state.isLoadMoreGroups &&
        !this.state.isFetchingGroups &&
        target.scrollTop + target.offsetHeight + 50 >= target.scrollHeight
      ) {
        this.groupsParams.page++
        this.fetchGroupsOptions()
      }
    },
    async fetchGroupsOptionsCreate() {
      this.state.isFetchingGroupsCreate = true
      try {
        const res = await apiGroups.getList({ ...this.groupsParamsCreate })
        const dataRes = res.data.data
        this.state.isLoadMoreGroupsCreate =
          dataRes.paginate.current_page < dataRes.paginate.last_page
        if (!this.availableGroups) {
          this.availableGroups = []
        }
        const newGroupsAvailableOptions = dataRes.data.map((user: Group.Item) => ({
          label: user.name,
          value: user.id
        }))
        this.availableGroups.push(...newGroupsAvailableOptions)
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }
      this.state.isFetchingGroupsCreate = false
    },
    onFetchMoreGroupsCreate(e: Event) {
      const target = e.currentTarget as HTMLElement
      if (
        this.state.isLoadMoreGroupsCreate &&
        !this.state.isFetchingGroupsCreate &&
        target.scrollTop + target.offsetHeight + 50 >= target.scrollHeight
      ) {
        this.groupsParamsCreate.page++
        this.fetchGroupsOptionsCreate()
      }
    },
    loadMoreData() {
      this.urlParams.page = this.urlParams.page ? this.urlParams.page + 1 : 1
      this.fetchData()
    },
    onSearchTags(searchQuery: string) {
      if (!searchQuery.length) {
        this.tagsOptions = []
        return
      }
      this.state.isFetchingTags = true
      window.setTimeout(() => {
        this.state.isSearchingTags = true
        this.tagsParams.name = searchQuery
        this.tagsParams.page = 1 // Reset to first page for new search
        this.fetchTagsOptions() // Fetch tags based on new search query
        this.state.isFetchingTags = false
      }, 1000)
    },
    onChangeFilter() {
      this.urlParams.page = 1
      this.listData = undefined
      this.fetchData()
    },
    onChangeFilterGroups() {
      this.groupsOptions = []
      this.fetchGroupsOptions()
    },
    onChangeBranchId(branchId: number) {
      this.groupsParamsCreate.branch_id = branchId
      this.availableGroups = []
      this.fetchGroupsOptionsCreate()
    },
    resetUrlParams() {
      this.$patch({
        urlParams: { ...defaultUrlSearchParams },
        groupsParams: { ...defaultGroupsParams },
        tagsParams: { ...defaultTagsParams }
      })
    }
  }
})
