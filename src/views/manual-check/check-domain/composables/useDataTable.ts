import { NButton, NSpin, type DataTableColumns, NTag } from 'naive-ui'
import { useManualCheckDomainStore } from '../stores/manualCheckDomainStore'
import { HistoryDomain, Session, User } from '@/types'
import type { VNode } from 'vue'
import CIcon from '@/components/icon/CIcon.vue'

export default function useDataTable() {
  const manualCheckDomainStore = useManualCheckDomainStore()
  const { renderIndex, renderTooltip } = useRender()
  const imageModal = reactive({
    visible: false,
    imagePath: ''
  })
  const columns: DataTableColumns<Session.HistoryDomain> = reactive([
    {
      title: 'STT',
      key: 'id',
      align: 'center',
      width: 70,
      render: (_, index) =>
        renderIndex(
          manualCheckDomainStore.urlParams.page,
          manualCheckDomainStore.urlParams.per_page,
          index
        )
    },
    {
      title: 'Domain',
      key: 'domain',
      width: 178,
      ellipsis: {
        tooltip: true
      },
      render: (row) =>
        h(
          'a',
          {
            href: row.domain,
            target: '_blank',
            class: 'hover:text-blue-500 transition-colors duration-300'
          },
          { default: () => row.domain }
        )
    },
    {
      title: 'Trạng thái',
      key: 'domain_status',
      align: 'center',
      width: 126,
      ellipsis: {
        tooltip: true
      },
      render: (row) =>
        h(
          'span',
          { class: 'font-medium text-success' },
          {
            default: () => {
              switch (row.status_domain) {
                case Session.StatusDomain.X:
                  return 'Tên miền X'
                case Session.StatusDomain.YBlock:
                  return 'Tên miền Y'
                case Session.StatusDomain.Whitelist:
                  return 'Whitelist'
                default:
                  return '-'
              }
            }
          }
        )
    }
  ])

  // status: 0: failed, 1: success, -1: proxy error
  function getResult(providerId: number, proxies: Session.HistoryDomainResult['proxies']) {
    console.log(proxies)
    if (!manualCheckDomainStore.listProviders || !manualCheckDomainStore.listProviders.length) {
      return null
    }

    return proxies?.find((proxy) => proxy.providerId === providerId)
  }

  function renderBtnShowImage(imagePath: string | null | undefined, iconRender: () => VNode) {
    return h(
      NButton,
      {
        text: true,
        type: 'success',
        class: {
          'cursor-default': !imagePath
        },
        onClick: () => {
          if (imagePath) {
            imageModal.visible = true
            imageModal.imagePath = `${imagePath}`
          } else {
            window.$message.error('Không có ảnh')
          }
        }
      },
      {
        default: iconRender
      }
    )
  }

  const { renderTooltipThumbnail, renderCheckProxyIcon } = useRender()

  function renderProviderColumns() {
    if (manualCheckDomainStore.listProviders) {
      manualCheckDomainStore.listProviders.forEach((provider) => {
        columns.push({
          title: provider.name,
          key: provider.id,
          align: 'center',
          render: (row) => {
            if (row.result?.status !== 2) {
              return h('span', null, { default: () => '-' })
            }
            const result = getResult(provider.id, row.result?.proxies)
            const imagePath = row?.result?.imageCloudPath
              ? `${result?.imageCloudPath}?${new Date(row.updated_at).getTime()}`
              : null

            switch (Number(result?.statusCode)) {
              case HistoryDomain.StatusCode.Blocked:
                return renderBtnShowImage(imagePath, () =>
                  renderTooltipThumbnail(
                    imagePath,
                    renderCheckProxyIcon(Number(result?.statusCode)),
                    { width: 160 }
                  )
                )
              case HistoryDomain.StatusCode.Ok:
                return renderBtnShowImage(imagePath, () =>
                  renderTooltipThumbnail(
                    imagePath,
                    renderCheckProxyIcon(Number(result?.statusCode)),
                    { width: 160 }
                  )
                )
              case HistoryDomain.StatusCode.Unknown:
                return renderBtnShowImage(imagePath, () =>
                  renderTooltipThumbnail(
                    imagePath,
                    renderCheckProxyIcon(Number(result?.statusCode)),
                    { width: 160 }
                  )
                )
              case HistoryDomain.StatusCode.VerifyCaptcha:
                return renderBtnShowImage(imagePath, () =>
                  renderTooltipThumbnail(
                    imagePath,
                    renderCheckProxyIcon(Number(result?.statusCode)),
                    { width: 160 }
                  )
                )
              case HistoryDomain.StatusCode.Timeout:
                return renderBtnShowImage(imagePath, () =>
                  renderTooltipThumbnail(
                    imagePath,
                    renderCheckProxyIcon(Number(result?.statusCode)),
                    { width: 160 }
                  )
                )
              case HistoryDomain.StatusCode.ProxyError:
                return renderTooltip(
                  'Không thể kết nối proxy',
                  renderCheckProxyIcon(Number(result?.statusCode))
                )
              case HistoryDomain.StatusCode.Error:
                return renderTooltip(
                  result?.error || 'Lỗi không xác định',
                  renderCheckProxyIcon(Number(result?.statusCode))
                )
              default:
                return '-'
            }
          }
        })
      })
      columns.push({
        title: 'Thời gian Kiểm tra',
        key: 'updatedAt',
        width: 164,
        render: (row) => {
          if (
            row.status_process === Session.StatusProcess.Process ||
            row.status_process === Session.StatusProcess.Create
          )
            return h(NSpin, { size: 'small' })
          else if (row.status_process >= Session.StatusProcess.Finish) {
            return h('span', null, { default: () => $d(new Date(row.finished_at), 'dateTime') })
          } else {
            return h('span', null, { default: () => '-' })
          }
        }
      })
      if (useCheckRoles([User.Role.Admin, User.Role.Editor])) {
        columns.push({
          title: 'Tùy chọn',
          key: 'actions',
          width: 80,
          render: (row) =>
            h(
              'div',
              { class: 'flex items-center justify-center gap-x-2' },
              {
                default: () => [
                  renderTooltip(
                    'Kiểm tra lại',
                    h(
                      NButton,
                      {
                        color: '#23B7E5',
                        text: true,
                        onClick: () => onRetryRow(row)
                      },
                      { default: () => h(CIcon, { icon: 'icon-refresh' }) }
                    )
                  ),
                  renderTooltip(
                    'Xóa',
                    h(
                      NButton,
                      {
                        color: '#726587',
                        text: true,
                        class: 'hover:!text-[#E5540C]',
                        onClick: () => onDeleteRow(row)
                      },
                      { default: () => h(CIcon, { icon: 'icon-trash' }) }
                    )
                  )
                ]
              }
            )
        })
      }
    }
  }

  function onDeleteRow(row: Session.HistoryDomain) {
    const dialog = window.$dialog.warning({
      title: 'Xác nhận xóa lịch sử',
      content: `Bạn có chắc chắn muốn xóa lịch sử của domain ${row.domain}?`,
      positiveText: 'Xóa',
      negativeText: 'Hủy',
      onPositiveClick: async () => {
        dialog.loading = true

        try {
          await apiSessions.deleteHistory(row.id)
          window.$message.success(`Xóa lịch sử domain ${row.domain} thành công`)
          manualCheckDomainStore.fetchData()
          manualCheckDomainStore.fetchProgress()
          manualCheckDomainStore.fetchListSession(row.manual_sessions_id)
        } catch (error: any) {
          const { showMessageError } = useHelper()
          showMessageError(error)
        }

        dialog.loading = false
      }
    })
  }

  function onRetryRow(row: Session.HistoryDomain) {
    const dialog = window.$dialog.warning({
      title: 'Xác nhận kiểm tra lại',
      content: `Bạn có chắc chắn muốn kiểm tra lại domain ${row.domain} ?`,
      positiveText: 'Retry',
      negativeText: 'Hủy',
      onPositiveClick: async () => {
        dialog.loading = true
        try {
          const res = await apiSessions.updateHistoryDomain(row.id, {
            status_process: 0
          })
          row.status_process = Session.StatusProcess.Create
          manualCheckDomainStore.fetchData()
          manualCheckDomainStore.fetchProgress()
          window.$message.success(res?.data?.message)
        } catch (error: any) {
          const { showMessageError } = useHelper()
          showMessageError(error)
        }
        dialog.loading = false
      }
    })
  }

  return {
    imageModal,
    columns,
    renderProviderColumns
  }
}
