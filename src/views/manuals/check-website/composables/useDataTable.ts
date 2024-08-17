import type { CheckDomain } from '../stores/checkDomainStore'
import { NButton, NSpin, NDropdown, type DataTableColumns, NTooltip } from 'naive-ui'
import { useCheckDomainStore } from '../stores/checkDomainStore'
import { HistoryDomain, User } from '@/types'
import type { VNode } from 'vue'

export default function useDataTable() {
  const checkDomainStore = useCheckDomainStore()
  const { renderIndex } = useRender()
  const imageModal = reactive({
    visible: false,
    imagePath: ''
  })
  const columns: DataTableColumns<CheckDomain> = reactive([
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
            href: row.domain,
            target: '_blank',
            class: 'hover:text-blue-500 transition-colors duration-300'
          },
          { default: () => row.domain }
        )
    }
  ])

  // status: 0: failed, 1: success, -1: proxy error
  function getReuslt(providerId: number, proxies: CheckDomain['proxies']) {
    if (!checkDomainStore.listProviders || !checkDomainStore.listProviders.length) {
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

  function renderTooltip(text: string, node: VNode) {
    return h(
      NTooltip,
      { trigger: 'hover', keepAliveOnHover: false },
      { default: () => text, trigger: () => node }
    )
  }

  const { renderTooltipThumbnail } = useRender()

  function renderProviderColumns() {
    if (checkDomainStore.listProviders) {
      checkDomainStore.listProviders.forEach((provider) => {
        columns.push({
          title: provider.name,
          key: provider.id,
          align: 'center',
          render: (row) => {
            if (row.status !== 2) {
              return h('span', null, { default: () => '' })
            }
            const result = getReuslt(provider.id, row.proxies)
            const imagePath = result?.imageCloudPath
              ? `${result?.imageCloudPath}?${new Date(row.updateAt).getTime()}`
              : null
            switch (Number(result?.statusCode)) {
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
                  result?.error || 'Lỗi không xác định',
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
      columns.push({
        title: 'Thời gian',
        key: 'updateAt',
        render: (row) => {
          if (row.status === 1) return h(NSpin, { size: 'small' })
          else if (row.status === 2) {
            return h('span', null, { default: () => $d(new Date(row.updateAt), 'dateTime') })
          } else {
            return h('span', null, { default: () => '' })
          }
        }
      })
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
                icon: () => h(Icon, { icon: 'mdi:refresh' }),
                props: {
                  onClick: () => onRetryRow(row)
                }
              },
              {
                label: $t('buttons.delete'),
                key: 'delete',
                icon: () => h(Icon, { icon: 'mdi:delete' }),
                disabled: !checkDomainStore.isTypeManual,
                props: {
                  onClick: () => (checkDomainStore.isTypeManual ? onDeleteRow(row) : null)
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

  function onDeleteRow(row: CheckDomain) {
    const dialog = window.$dialog.warning({
      title: 'Xác nhận xóa website',
      content: `Bạn có chắc chắn muốn xóa website ${row.domain}?`,
      positiveText: 'Xóa',
      negativeText: 'Hủy',
      onPositiveClick: async () => {
        dialog.loading = true
        try {
          await checkDomainStore.clearById(row.id)
        } catch (error: any) {
          const { showMessageError } = useHelper()
          showMessageError(error)
        }
        dialog.loading = false
      }
    })
  }

  function onRetryRow(row: CheckDomain) {
    const dialog = window.$dialog.warning({
      title: 'Xác nhận Retry',
      content: `Bạn có chắc chắn muốn Retry website ${row.domain}?`,
      positiveText: 'Retry',
      negativeText: 'Hủy',
      onPositiveClick: async () => {
        dialog.loading = true
        try {
          await checkDomainStore.retryById(row.id)
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
