import { NButton, NDropdown, NSpin, type DataTableColumns } from 'naive-ui'
import { Status, useRecordDomainStore, type RecordDomain } from '../stores/recordDomainStore'
import { User } from '@/types'

export default function useDataTable() {
  const recordDomainStore = useRecordDomainStore()
  const { renderIndex } = useRender()
  const videoModal = reactive({
    visible: false,
    videoPath: ''
  })
  const imageModal = reactive({
    visible: false,
    imagePath: ''
  })
  const columns: DataTableColumns<RecordDomain> = reactive([
    {
      title: 'STT',
      key: 'id',
      align: 'center',
      width: 70,
      render: (_, index) =>
        renderIndex(recordDomainStore.urlParams.page, recordDomainStore.urlParams.per_page, index)
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
    },
    {
      title: 'Redirect',
      key: 'domainRedirect',
      ellipsis: {
        tooltip: true
      },
      render: (row) =>
        h(
          'a',
          {
            href: row.domainRedirect,
            target: '_blank',
            class: 'hover:text-blue-500 transition-colors duration-300'
          },
          { default: () => row.domainRedirect ?? '' }
        )
    },
    {
      title: 'Image',
      key: 'imageCloudPath',
      width: 80,
      align: 'center',
      render: (row) => {
        if (row.imageCloudPath) {
          const imagePath = `${row.imageCloudPath}?${new Date(row.updateAt).getTime()}`
          return renderTooltipThumbnail(
            imagePath,
            h(
              NButton,
              { type: 'error', text: true, onClick: () => handleOpenImage(imagePath) },
              {
                default: () => h(Icon, { icon: 'ph:image', class: 'text-2xl mx-auto text-success' })
              }
            )
          )
        }
        return ''
      }
    },
    {
      title: 'Video',
      key: 'videoCloudPath',
      width: 80,
      align: 'center',
      render: (row) => {
        if (row.videoCloudPath) {
          const imagePath = row.imageCloudPath
            ? `${row.imageCloudPath}?${new Date(row.updateAt).getTime()}`
            : null
          return renderTooltipThumbnail(
            imagePath,
            h(
              NButton,
              { type: 'error', text: true, onClick: () => handleOpenVideo(row.videoCloudPath) },
              { default: () => h(Icon, { icon: 'ph:video', class: 'text-2xl mx-auto' }) }
            )
          )
        }
        return ''
      }
    },
    {
      title: 'Ngày check',
      key: 'updateAt',
      width: 180,
      render: (row) => {
        if (row.status === Status.Running) return h(NSpin, { size: 'small' })
        else if (row.status === Status.Done) {
          return h('span', null, { default: () => $d(new Date(row.updateAt), 'dateTime') })
        } else {
          return h('span', null, { default: () => '' })
        }
      }
    }
  ])

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
            disabled: !recordDomainStore.isTypeManual,
            props: {
              onClick: () => (recordDomainStore.isTypeManual ? onDeleteRow(row) : null)
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

  const { renderTooltipThumbnail } = useRender()

  function handleOpenImage(imagePath: string | null) {
    if (!imagePath) return
    imageModal.imagePath = imagePath
    imageModal.visible = true
  }

  function handleOpenVideo(videoPath: string | null) {
    if (!videoPath) return
    videoModal.videoPath = videoPath
    videoModal.visible = true
  }

  function onDeleteRow(row: RecordDomain) {
    const dialog = window.$dialog.warning({
      title: 'Xác nhận xóa website',
      content: `Bạn có chắc chắn muốn xóa website ${row.domain}?`,
      positiveText: 'Xóa',
      negativeText: 'Hủy',
      onPositiveClick: async () => {
        dialog.loading = true
        await recordDomainStore.clearById(row.id)
        dialog.loading = false
      }
    })
  }

  function onRetryRow(row: RecordDomain) {
    const dialog = window.$dialog.warning({
      title: 'Xác nhận Retry',
      content: `Bạn có chắc chắn muốn Retry website ${row.domain}?`,
      positiveText: 'Retry',
      negativeText: 'Hủy',
      onPositiveClick: async () => {
        dialog.loading = true
        await recordDomainStore.retryById(row.id)
        dialog.loading = false
      }
    })
  }

  return {
    imageModal,
    videoModal,
    columns
  }
}
