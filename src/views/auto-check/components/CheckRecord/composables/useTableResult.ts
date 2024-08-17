import { HistoryDomain } from '@/types'
import type { UrlSearchParams } from '../../../stores/autoCheckStore'

export type Pagination = {
  totalItem: number
  pageCount: number
  pageSize: number
  currentPage: number
}

export default function useTableResult(
  urlParams: UrlSearchParams,
  type: HistoryDomain.CheckKeywordStatus
) {
  const listData = shallowRef<HistoryDomain.Record.Item[]>([])
  const pagination = shallowReactive<Pagination>({
    totalItem: 0,
    pageCount: 1,
    pageSize: 10,
    currentPage: 1
  })
  const state = shallowReactive({
    isFetching: true,
    isPendingFetching: false,
    isFetchingFoundCopy: false,
    isFetchingUnknownCopy: false,
    isFetchingNotFoundCopy: false
  })

  async function fetchData() {
    state.isPendingFetching = true

    try {
      const res = await apiHistoryDomain.getListRecord({
        page: pagination.currentPage,
        per_page: pagination.pageSize,
        check_keyword_status: type,
        recorded_at: urlParams.date
      })
      const dataRes = res.data.data
      if (dataRes.paginate.current_page > 1 && !dataRes.data.length) {
        await onChangePage(dataRes.paginate.current_page - 1)
        return
      }
      pagination.totalItem = dataRes.paginate.total
      pagination.pageCount = dataRes.paginate.last_page

      listData.value = dataRes.data
    } catch (error) {
      const { showMessageError } = useHelper()
      showMessageError(error)
    }

    state.isFetching = false
    state.isPendingFetching = false
  }

  async function onChangePage(page: number) {
    pagination.currentPage = page
    state.isFetching = true
    await fetchData()
  }

  function onChangePageSize(pageSize: number) {
    pagination.pageSize = pageSize
    onChangePage(1)
  }

  return {
    listData,
    pagination,
    state,
    fetchData,
    onChangePage,
    onChangePageSize
  }
}
