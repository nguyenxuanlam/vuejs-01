import { HistoryDomain } from '@/types'
import { NButton, NTooltip, type DataTableColumns } from 'naive-ui'
import { useDomainStore } from '../stores/domainStore'
import type { VNode } from 'vue'

export default function useDataTableHistory() {
  const domainStore = useDomainStore()
  const { renderIndex, renderTooltipThumbnail } = useRender()
  const imageModal = reactive({
    visible: false,
    imagePath: ''
  })
  const columns: DataTableColumns<HistoryDomain.Check.Item> = reactive([
    {
      title: 'STT',
      key: 'id',
      align: 'center',
      width: 70,
      render: (_, index) =>
        renderIndex(
          domainStore.historyCheckedParams.page,
          domainStore.historyCheckedParams.per_page,
          index
        )
    },
    {
      title: 'Domain',
      key: 'domain',
      ellipsis: {
        tooltip: true
      },
      render: (row) =>
        h(
          'a',
          {
            href: row.domain.link,
            target: '_blank',
            class: 'hover:text-blue-500 transition-colors duration-300'
          },
          { default: () => row.domain.link }
        )
    }
  ])

  // status: 0: failed, 1: success, -1: proxy error
  function getReuslt(providerId: number, proxies: HistoryDomain.Check.Item['proxies']) {
    if (!domainStore.listProviders || !domainStore.listProviders.length) {
      return null
    }
    return proxies?.find((proxy) => proxy.provider_id === providerId)
  }

  function renderBtnShowImage(
    imagePath: string | null | undefined,
    iconRender: () => globalThis.VNode
  ) {
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
            imageModal.imagePath = imagePath
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
      { trigger: 'hover', keepAliveOnHover: false, class: 'outline-none' },
      { default: () => text, trigger: () => node }
    )
  }

  function renderProviderColumns() {
    if (domainStore.listProviders) {
      domainStore.listProviders.forEach((provider) => {
        columns.push({
          title: provider.name,
          key: provider.id,
          align: 'center',
          render: (row) => {
            if (!row.is_check) {
              return h('span', null, { default: () => '' })
            }
            const result = getReuslt(provider.id, row.proxies)
            switch (Number(result?.history?.status)) {
              case HistoryDomain.StatusCode.Blocked:
                return renderBtnShowImage(result?.history?.image_cloud_path, () =>
                  renderTooltipThumbnail(
                    result?.history?.image_cloud_path,
                    h(Icon, {
                      icon: 'carbon:close-filled',
                      class: `text-2xl text-danger mx-auto outline-none`
                    })
                  )
                )
              case HistoryDomain.StatusCode.Ok:
                return renderBtnShowImage(result?.history?.image_cloud_path, () =>
                  renderTooltipThumbnail(
                    result?.history?.image_cloud_path,
                    h(Icon, {
                      icon: 'lets-icons:check-fill',
                      class: `text-2xl text-success mx-auto outline-none`
                    })
                  )
                )
              case HistoryDomain.StatusCode.Unknown:
                return renderBtnShowImage(result?.history?.image_cloud_path, () =>
                  renderTooltipThumbnail(
                    result?.history?.image_cloud_path,
                    h(Icon, {
                      icon: 'carbon:help-filled',
                      class: `text-2xl text-gray-600 mx-auto outline-none`
                    })
                  )
                )
              case HistoryDomain.StatusCode.VerifyCaptcha:
                return renderBtnShowImage(result?.history?.image_cloud_path, () =>
                  renderTooltipThumbnail(
                    result?.history?.image_cloud_path,
                    h(Icon, {
                      icon: 'logos:recaptcha',
                      class: `text-2xl mx-auto outline-none`
                    })
                  )
                )
              case HistoryDomain.StatusCode.ProxyError:
                return renderTooltip(
                  'Không thể kết nối proxy',
                  h(Icon, {
                    icon: 'mdi:network-strength-2-alert',
                    class: `text-2xl text-warning mx-auto outline-none`
                  })
                )
              default:
                return renderTooltip(
                  'Không có proxy',
                  h(Icon, {
                    icon: 'ooui:network-off',
                    class: `text-2xl text-red-700 mx-auto outline-none`
                  })
                )
            }
          }
        })
      })
      columns.push({
        title: 'Thời gian',
        key: 'checked_at',
        width: 180,
        render: (row) => (row.checked_at ? $d(new Date(row.checked_at), 'dateTime') : '')
      })
    }
  }

  return {
    imageModal,
    columns,
    renderProviderColumns
  }
}
