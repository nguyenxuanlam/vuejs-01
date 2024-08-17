import { User, HistoryDomain, type Domain } from '@/types'
import { useDomainStore } from '../stores/domainStore'
import { NButton, NDropdown, NTag, NTooltip, type DataTableColumns } from 'naive-ui'
import { apiDomains } from '@api/domains'

export default function useDataTable() {
  const domainStore = useDomainStore()
  const { renderIndex } = useRender()
  const imageModal = reactive({
    visible: false,
    imagePath: ''
  })
  const videoModal = reactive({
    visible: false,
    videoPath: ''
  })
  const columns: DataTableColumns<Domain.Item> = reactive([
    {
      title: 'STT',
      key: 'id',
      align: 'center',
      width: 70,
      fixed: 'left',
      render: (_, index) =>
        renderIndex(domainStore.urlParams.page, domainStore.urlParams.per_page, index)
    },
    {
      title: 'Tên miền',
      key: 'link',
      width: 200,
      ellipsis: {
        tooltip: true
      },
      fixed: 'left',
      render: (row) =>
        h(
          'a',
          {
            href: row.link,
            target: '_blank',
            class: 'hover:text-blue-500 transition-colors duration-300'
          },
          { default: () => row.link }
        )
    }
  ])

  function renderProviderColumns() {
    if (domainStore.state.isUserWhiteListed) {
      columns.push({
        title: 'Từ khóa',
        key: 'keywords',
        width: 160,
        ellipsis: {
          tooltip: true
        },
        render: (row) => {
          return h(
            'div',
            { class: 'flex flex-wrap gap-2' },
            {
              default: () =>
                row.keywords.map((keyword) =>
                  h(NTag, { type: 'success', size: 'small' }, { default: () => keyword.name })
                )
            }
          )
        }
      })
    }
    columns.push({
      title: 'Trạng thái',
      key: 'note',
      width: 150,
      render: (row) => {
        const notes: VNode[] = []
        if (row.is_x === 'Y') {
          notes.push(h(NTag, { type: 'primary', size: 'small' }, { default: () => 'X' }))
        }
        if (row.is_y === 'Y' && row.is_block === 'Y') {
          notes.push(h(NTag, { type: 'warning', size: 'small' }, { default: () => 'Y Block' }))
        }
        if (row.is_whitelist === 'Y' || row.is_whitelist === 'U') {
          notes.push(h(NTag, { type: 'success', size: 'small' }, { default: () => 'Whitelist' }))
        }
        if (row.is_whitelist === 'N' && row.is_x === 'U' && row.is_y === 'U') {
          notes.push(h(NTag, { type: 'error', size: 'small' }, { default: () => 'Error' }))
        }
        return h(
          'div',
          { class: 'flex flex-wrap gap-2' },
          {
            default: () => notes.map((note) => note)
          }
        )
      }
    })
    if (domainStore.listProviders) {
      domainStore.listProviders.forEach((provider) => {
        columns.push({
          title: provider.name,
          key: provider.id,
          align: 'center',
          render: (row) => {
            if (!row?.last_check?.is_check) {
              return h('span', null, { default: () => '' })
            }
            const result = getReuslt(provider.id, row.last_check.proxies)
            switch (Number(result?.history?.status)) {
              case HistoryDomain.StatusCode.Blocked:
                return renderBtnShowImage(result?.history?.image_cloud_path, () =>
                  renderTooltipThumbnail(
                    result?.history?.image_cloud_path,
                    h(Icon, {
                      icon: 'carbon:close-filled',
                      class: `text-2xl mx-auto outline-none text-danger`
                    })
                  )
                )
              case HistoryDomain.StatusCode.Ok:
                return renderBtnShowImage(result?.history?.image_cloud_path, () =>
                  renderTooltipThumbnail(
                    result?.history?.image_cloud_path,
                    h(Icon, {
                      icon: 'lets-icons:check-fill',
                      class: `text-2xl mx-auto outline-none text-success`
                    })
                  )
                )
              case HistoryDomain.StatusCode.Unknown:
                return renderBtnShowImage(result?.history?.image_cloud_path, () =>
                  renderTooltipThumbnail(
                    result?.history?.image_cloud_path,
                    h(Icon, {
                      icon: 'carbon:help-filled',
                      class: `text-2xl mx-auto outline-none text-warning`
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
              case HistoryDomain.StatusCode.Timeout:
                return renderBtnShowImage(result?.history?.image_cloud_path, () =>
                  renderTooltipThumbnail(
                    result?.history?.image_cloud_path,
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
                  result?.history?.error || 'Lỗi không xác định',
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
    }
    columns.push(
      {
        title: 'Image',
        key: 'image',
        width: 80,
        align: 'center',
        render: (row) => {
          return row?.last_check?.image_cloud_path
            ? renderBtnShowImage(row?.last_check?.image_cloud_path, () =>
                renderTooltipThumbnail(
                  row?.last_check?.image_cloud_path,
                  h(
                    NButton,
                    { type: 'error', text: true },
                    {
                      default: () =>
                        h(Icon, { icon: 'ph:image', class: 'text-2xl mx-auto text-success' })
                    }
                  )
                )
              )
            : ''
        }
      },
      {
        title: 'Video',
        key: 'video',
        width: 80,
        align: 'center',
        render: (row) =>
          row?.last_check?.video_cloud_path
            ? renderTooltipThumbnail(
                row?.last_check?.image_cloud_path,
                h(
                  NButton,
                  {
                    type: 'error',
                    text: true,
                    onClick: () => handleOpenVideo(row?.last_check?.video_cloud_path)
                  },
                  { default: () => h(Icon, { icon: 'ph:video', class: 'text-2xl mx-auto' }) }
                )
              )
            : ''
      },
      {
        title: 'Kiểm tra gần nhất',
        key: 'last_check.checked_at',
        width: 160,
        fixed: 'right',
        render: (row) =>
          h(
            'span',
            { class: 'cursor-pointer', onClick: () => handleOpenCheckedModal(row.id) },
            {
              default: () =>
                row?.last_check?.checked_at
                  ? $d(new Date(row.last_check.checked_at), 'dateTime')
                  : ''
            }
          )
      },
      {
        title: 'Quay chụp gần nhất',
        key: 'last_check.recorded_at',
        width: 160,
        fixed: 'right',
        render: (row) =>
          h(
            'span',
            { class: 'cursor-pointer', onClick: () => handleOpenRecordedModal(row.id) },
            {
              default: () =>
                row?.last_check?.recorded_at
                  ? $d(new Date(row.last_check.recorded_at), 'dateTime')
                  : ''
            }
          )
      }
    )
    // TODO: API lỗi nên tạm ẩn
    // if (useCheckRoles([User.Role.Admin, User.Role.Editor])) {
    //   columns.push({
    //     title: '',
    //     key: 'actions',
    //     width: 60,
    //     render: (row) => {
    //       const options = [
    //         {
    //           label: $t('buttons.edit'),
    //           key: 'edit',
    //           icon: () => h(Icon, { icon: 'mdi:pencil' }),
    //           props: {
    //             onClick: () => {
    //               domainStore.editId = row.id
    //               domainStore.stateModal.isShowUpdateModal = true
    //             }
    //           }
    //         },
    //         {
    //           label: $t('buttons.delete'),
    //           key: 'delete',
    //           icon: () => h(Icon, { icon: 'mdi:delete' }),
    //           props: {
    //             onClick: () => onDeleteRow(row)
    //           }
    //         }
    //       ]

    //       return h(
    //         NDropdown,
    //         { trigger: 'click', options: options, placement: 'bottom-end' },
    //         {
    //           default: () =>
    //             h(
    //               NButton,
    //               { size: 'small', tertiary: true },
    //               { icon: () => h(Icon, { icon: 'mdi:dots-vertical' }) }
    //             )
    //         }
    //       )
    //     }
    //   })
    // }
  }

  // status: 0: failed, 1: success, -1: proxy error
  function getReuslt(providerId: number, proxies: Domain.LastCheck['proxies']) {
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

  const { renderTooltipThumbnail } = useRender()

  function renderTooltip(text: string, node: VNode) {
    return h(
      NTooltip,
      { trigger: 'hover', keepAliveOnHover: true, class: 'outline-none' },
      { default: () => text, trigger: () => node }
    )
  }

  function handleOpenCheckedModal(domainId: number) {
    if (String(domainId) !== domainStore.historyCheckedParams.domain_id) {
      domainStore.listHistoryChecked = undefined
      domainStore.historyCheckedParams = {
        domain_id: String(domainId),
        page: 1,
        per_page: 20
      }
      domainStore.fetchHistoryCheckedData()
    }
    domainStore.stateModal.isShowHistoryCheckedModal = true
  }

  function handleOpenRecordedModal(domainId: number) {
    if (String(domainId) !== domainStore.historyRecordedParams.domain_id) {
      domainStore.listHistoryRecorded = undefined
      domainStore.historyRecordedParams = {
        domain_id: String(domainId),
        page: 1,
        per_page: 20
      }
      domainStore.fetchHistoryRecordedData()
    }
    domainStore.stateModal.isShowHistoryRecordedModal = true
  }

  function handleOpenVideo(videoPath: string | null) {
    if (!videoPath) return
    videoModal.videoPath = videoPath
    videoModal.visible = true
  }

  return {
    imageModal,
    videoModal,
    columns,
    renderProviderColumns
  }
}

function onDeleteRow(row: Domain.Item) {
  const dialog = window.$dialog.warning({
    title: 'Xác nhận xóa tên miền',
    content: `Bạn có chắc chắn muốn xóa tên miền ${row.name}?`,
    positiveText: 'Xóa',
    negativeText: 'Hủy',
    onPositiveClick: async () => {
      dialog.loading = true

      try {
        const res = await apiDomains.delete(row.id)
        window.$message.success(res.data.message)
        const { fetchData } = useDomainStore()
        await fetchData()
      } catch (error: any) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }

      dialog.loading = false
    }
  })
}
