import { NButton, type DataTableColumns, NTooltip } from 'naive-ui'
import { useAutoCheckDomainStore } from '../stores/autoCheckDomainStore'
import { HistoryDomain, Session } from '@/types'
import type { VNode } from 'vue'

export default function useDataTable() {
  const autoCheckDomainStore = useAutoCheckDomainStore()
  const { renderIndex, renderTooltipThumbnail, renderCheckProxyIcon } = useRender()

  const imageModal = reactive({
    visible: false,
    imagePath: ''
  })

  const columns: DataTableColumns<HistoryDomain.Check.Item> = reactive([
    {
      title: 'STT',
      key: 'id',
      align: 'center',
      width: 50,
      ellipsis: {
        tooltip: true
      },
      fixed: 'left',
      render: (_, index) =>
        renderIndex(
          autoCheckDomainStore.urlParams.page,
          autoCheckDomainStore.urlParams.per_page,
          index
        )
    },
    {
      title: 'Tên Miền',
      key: 'domain.link',
      titleAlign: 'center',
      ellipsis: {
        tooltip: true
      },
      width: 180,
      fixed: 'left',
      render: (row) =>
        row.domain.link
          ? h(
              'a',
              {
                href: row.domain.link,
                target: '_blank',
                class: 'hover:text-blue-500 transition-colors duration-300'
              },
              { default: () => row.domain.link }
            )
          : '-'
    },
    {
      title: 'Trạng thái',
      key: 'domain.status',
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
              switch (Number(row.domain.status)) {
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
  function getResult(providerId: number, proxies: HistoryDomain.Check.Item['proxies']) {
    if (!autoCheckDomainStore.listProviders || !autoCheckDomainStore.listProviders.length) {
      return null
    }

    return proxies?.find((proxy) => proxy.provider_id === providerId)
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

  function renderTooltip(text: string, node: VNode) {
    return h(
      NTooltip,
      { trigger: 'hover', keepAliveOnHover: false },
      { default: () => text, trigger: () => node }
    )
  }

  function renderProviderColumns() {
    if (autoCheckDomainStore.listProviders) {
      autoCheckDomainStore.listProviders.forEach((provider) => {
        columns.push({
          title: provider.name,
          key: provider.id,
          align: 'center',
          render: (row) => {
            const result = getResult(provider.id, row.proxies)
            const imagePath = result?.history.image_cloud_path
              ? `${result?.history.image_cloud_path}?${new Date(row.domain.updated_at).getTime()}`
              : null
            switch (Number(result?.history.status)) {
              case HistoryDomain.StatusCode.Blocked:
                return renderBtnShowImage(imagePath, () =>
                  renderTooltipThumbnail(
                    imagePath,
                    renderCheckProxyIcon(Number(result?.history.status)),
                    { width: 160 }
                  )
                )
              case HistoryDomain.StatusCode.Ok:
                return renderBtnShowImage(imagePath, () =>
                  renderTooltipThumbnail(
                    imagePath,
                    renderCheckProxyIcon(Number(result?.history.status)),
                    { width: 160 }
                  )
                )
              case HistoryDomain.StatusCode.Unknown:
                return renderBtnShowImage(imagePath, () =>
                  renderTooltipThumbnail(
                    imagePath,
                    renderCheckProxyIcon(Number(result?.history.status)),
                    { width: 160 }
                  )
                )
              case HistoryDomain.StatusCode.VerifyCaptcha:
                return renderBtnShowImage(imagePath, () =>
                  renderTooltipThumbnail(
                    imagePath,
                    renderCheckProxyIcon(Number(result?.history.status)),
                    { width: 160 }
                  )
                )
              case HistoryDomain.StatusCode.Timeout:
                return renderBtnShowImage(imagePath, () =>
                  renderTooltipThumbnail(
                    imagePath,
                    renderCheckProxyIcon(Number(result?.history.status)),
                    { width: 160 }
                  )
                )
              case HistoryDomain.StatusCode.ProxyError:
                return renderTooltip(
                  'Không thể kết nối proxy',
                  renderCheckProxyIcon(Number(result?.history.status))
                )
              case HistoryDomain.StatusCode.Error:
                return renderTooltip(
                  result?.history.error || 'Lỗi không xác định',
                  renderCheckProxyIcon(Number(result?.history.status))
                )
              default:
                return renderCheckProxyIcon(Number(result?.history.status))
            }
          }
        })
      })
      columns.push({
        title: 'Thời Gian Kiểm Tra',
        key: 'domain.updated_at',
        align: 'center',
        width: 150,
        render: (row) => {
          if (row.is_check) {
            return h('span', null, {
              default: () => (row.checked_at ? $d(new Date(row.checked_at), 'dateTime') : '-')
            })
          }
          return ''
        }
      })
    }
  }

  return {
    imageModal,
    columns,
    renderProviderColumns
  }
}
