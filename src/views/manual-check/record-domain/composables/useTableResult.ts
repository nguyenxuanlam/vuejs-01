import { Session } from '@/types'
import { useDomainRecordStore, type UrlSearchParams } from '../stores/domainRecordStore'

export type Pagination = {
  totalItem: number
  pageCount: number
  pageSize: number
  currentPage: number
}

const { fetchProgress, fetchListSession } = useDomainRecordStore()

export default function useTableResult(urlParams: UrlSearchParams, type: Session.StatusProcess) {
  const listData = shallowRef<Session.HistoryDomain[]>([])
  const pagination = shallowReactive<Pagination>({
    totalItem: 0,
    pageCount: 1,
    pageSize: 20,
    currentPage: 1
  })
  const state = shallowReactive({
    isFetching: true,
    isPendingFetching: false
  })

  async function fetchData() {
    state.isPendingFetching = true

    try {
      const res = await apiSessions.getHistory({
        ...urlParams,
        type: 'RECORD',
        page: pagination.currentPage,
        per_page: pagination.pageSize,
        status_process: type
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
  function onResetData() {
    state.isPendingFetching = true

    pagination.currentPage = 1
    pagination.totalItem = 0
    pagination.pageCount = 1
    listData.value = []

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

  function onRetry(item: Session.HistoryDomain) {
    const dialog = window.$dialog.warning({
      title: 'Xác nhận kiểm tra lại',
      content: `Bạn có chắc chắn muốn kiểm tra lại tên miền ${item.domain} ?`,
      positiveText: 'Retry',
      negativeText: 'Hủy',
      onPositiveClick: async () => {
        dialog.loading = true
        try {
          await apiSessions.updateHistoryDomain(item.id, {
            status_process: 0
          })
          fetchProgress()
          fetchData()
        } catch (error: any) {
          const { showMessageError } = useHelper()
          showMessageError(error)
        }
        dialog.loading = false
      }
    })
  }

  function onDelete(item: Session.HistoryDomain) {
    const dialog = window.$dialog.warning({
      title: 'Xác nhận xóa lịch sử',
      content: `Bạn có chắc chắn muốn xóa lịch sử của domain ${item.domain}?`,
      positiveText: 'Xóa',
      negativeText: 'Hủy',
      onPositiveClick: async () => {
        dialog.loading = true
        try {
          await apiSessions.deleteHistory(item.id)
          window.$message.success(`Xóa lịch sử domain ${item.domain} thành công`)
          fetchProgress()
          fetchListSession(item.manual_sessions_id)
          fetchData()
        } catch (error: any) {
          const { showMessageError } = useHelper()
          showMessageError(error)
        }
        dialog.loading = false
      }
    })
  }

  return {
    listData,
    pagination,
    state,
    onResetData,
    fetchData,
    onRetry,
    onDelete,
    onChangePage,
    onChangePageSize
  }
}
