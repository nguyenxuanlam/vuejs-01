import { User, HistoryDomain } from '@/types'
import { NButton, NSpin, NDropdown, NTag, NTooltip, type DataTableColumns } from 'naive-ui'
import { useCheckDomainStore } from '../stores/checkDomainStore'
import type { VNode } from 'vue'

export default function useDataTable() {
  const checkDomainStore = useCheckDomainStore()
  const { renderIndex } = useRender()
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
        renderIndex(checkDomainStore.urlParams.page, checkDomainStore.urlParams.per_page, index)
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
    if (!checkDomainStore.listProviders || !checkDomainStore.listProviders.length) {
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

  const { renderTooltipThumbnail } = useRender()

  function renderTooltip(text: string, node: VNode) {
    return h(
      NTooltip,
      { trigger: 'hover', keepAliveOnHover: true, class: 'outline-none' },
      { default: () => text, trigger: () => node }
    )
  }

  function handleOpenCheckedModal(domainId: number) {
    if (String(domainId) !== checkDomainStore.historyCheckedParams.domain_id) {
      checkDomainStore.listHistoryChecked = undefined
      checkDomainStore.historyCheckedParams = {
        domain_id: String(domainId),
        page: 1,
        per_page: 20
      }
      checkDomainStore.fetchHistoryCheckedData()
    }
    checkDomainStore.stateModal.isShowHistoryCheckedModal = true
  }

  function renderProviderColumns() {
    if (checkDomainStore.listProviders) {
      checkDomainStore.listProviders.forEach((provider) => {
        columns.push({
          title: provider.name,
          key: provider.id,
          align: 'center',
          render: (row) => {
            if (!row.is_check) {
              return h('span', null, { default: () => '' })
            }
            const result = getReuslt(provider.id, row.proxies)
            const imagePath = result?.history?.image_cloud_path
              ? `${result?.history?.image_cloud_path}?${row.checked_at ? new Date(row.checked_at).getTime() : new Date().getTime()}`
              : null

            switch (Number(result?.history?.status)) {
              case HistoryDomain.StatusCode.Blocked:
                return renderBtnShowImage(imagePath, () =>
                  renderTooltipThumbnail(
                    imagePath,
                    h(Icon, {
                      icon: 'carbon:close-filled',
                      class: `text-2xl mx-auto outline-none text-danger`
                    })
                  )
                )
              case HistoryDomain.StatusCode.Ok:
                return renderBtnShowImage(imagePath, () =>
                  renderTooltipThumbnail(
                    imagePath,
                    h(Icon, {
                      icon: 'lets-icons:check-fill',
                      class: `text-2xl mx-auto outline-none text-success`
                    })
                  )
                )
              case HistoryDomain.StatusCode.Unknown:
                return renderBtnShowImage(imagePath, () =>
                  renderTooltipThumbnail(
                    imagePath,
                    h(Icon, {
                      icon: 'carbon:help-filled',
                      class: `text-2xl mx-auto outline-none text-warning`
                    })
                  )
                )
              case HistoryDomain.StatusCode.VerifyCaptcha:
                return renderBtnShowImage(imagePath, () =>
                  renderTooltipThumbnail(
                    imagePath,
                    h(Icon, {
                      icon: 'logos:recaptcha',
                      class: `text-2xl mx-auto outline-none`
                    })
                  )
                )
              case HistoryDomain.StatusCode.Timeout:
                return renderBtnShowImage(imagePath, () =>
                  renderTooltipThumbnail(
                    imagePath,
                    h(Icon, {
                      icon: 'mdi:timer-minus-outline',
                      class: `text-2xl mx-auto outline-none text-gray-500`
                    })
                  )
                )
              case HistoryDomain.StatusCode.ProxyError:
                return renderTooltip(
                  'Không thể kết nối proxy',
                  h(Icon, {
                    icon: 'mdi:network-strength-2-alert',
                    class: `text-2xl mx-auto outline-none text-[#e06cd9]`
                  })
                )
              case HistoryDomain.StatusCode.Error:
                return renderTooltip(
                  result?.history.error || 'Lỗi không xác định',
                  h(Icon, {
                    icon: 'icon-park-outline:error-computer',
                    class: `text-2xl text-red-800 mx-auto outline-none`
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
      columns.push(
        {
          title: 'Số lượng nhà mạng vào được',
          key: 'quantity_proxy_pass',
          width: 100,
          align: 'center',
          ellipsis: {
            tooltip: true
          },
          render: (row) => {
            const quantity = row.proxies.filter(
              (proxy) => proxy.history.status == HistoryDomain.StatusCode.Ok
            ).length
            return h(
              NTag,
              { type: quantity >= 6 ? 'success' : 'default' },
              { default: () => quantity }
            )
          }
        },
        {
          title: 'Ngày check',
          key: 'recorded_at',
          width: 194,
          render: (row) => {
            if (row.is_check) {
              // processing
              if (!row.checked_at) {
                return h(NSpin, { size: 'small' })
              } else {
                // done
                return h(
                  'span',
                  { class: 'cursor-pointer', onClick: () => handleOpenCheckedModal(row.domain.id) },
                  {
                    default: () => [
                      row.checked_at ? $d(new Date(row.checked_at), 'dateTime') : '',
                      h(
                        'span',
                        { class: 'text-info' },
                        { default: () => ` (${row.domain_check_total})` }
                      )
                    ]
                  }
                )
              }
            }
            return ''
          }
        }
      )
      if (useCheckRoles([User.Role.Admin, User.Role.Editor])) {
        columns.push({
          title: '',
          key: 'actions',
          width: 60,
          render: (row) => {
            const options = [
              {
                label: 'Retry',
                key: 'retry',
                icon: () => h(Icon, { icon: 'mdi:play' }),
                props: {
                  onClick: () => onRetryRow(row)
                }
              }
            ]

            return h(
              NDropdown,
              { trigger: 'click', options: options, placement: 'bottom-end' },
              {
                default: () =>
                  h(
                    NButton,
                    { size: 'small', tertiary: true },
                    { icon: () => h(Icon, { icon: 'mdi:dots-vertical' }) }
                  )
              }
            )
          }
        })
      }
    }
  }

  function onRetryRow(row: HistoryDomain.Check.Item) {
    const dialog = window.$dialog.warning({
      title: 'Xác nhận chạy lại',
      content: `Bạn có chắc chắn muốn chạy lại ${row.domain.link}?`,
      positiveText: 'Run',
      negativeText: 'Hủy',
      onPositiveClick: async () => {
        dialog.loading = true
        await checkDomainStore.runRetry({ history_domain_ids: [row.id] })
        await checkDomainStore.fetchData()
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
