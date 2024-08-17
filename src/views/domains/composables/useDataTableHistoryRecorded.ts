import type { HistoryDomain } from '@/types'
import { NButton, type DataTableColumns } from 'naive-ui'
import { useDomainStore } from '../stores/domainStore'

export default function useDataTable() {
  const domainStore = useDomainStore()
  const { renderIndex, renderTooltipThumbnail } = useRender()
  const imageModal = reactive({
    visible: false,
    imagePath: ''
  })
  const videoModal = reactive({
    visible: false,
    videoPath: ''
  })
  const columns: DataTableColumns<HistoryDomain.Record.Item> = reactive([
    {
      title: 'STT',
      key: 'id',
      align: 'center',
      width: 70,
      render: (_, index) =>
        renderIndex(
          domainStore.historyRecordedParams.page,
          domainStore.historyRecordedParams.per_page,
          index
        )
    },
    {
      title: 'Domain',
      key: 'domain.link',
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
    },
    {
      title: 'Redirect',
      key: 'domain_redirect',
      ellipsis: {
        tooltip: true
      },
      render: (row) =>
        h(
          'a',
          {
            href: row.domain_redirect,
            target: '_blank',
            class: 'hover:text-blue-500 transition-colors duration-300'
          },
          { default: () => row.domain_redirect ?? '' }
        )
    },
    // {
    //   title: 'Keyword',
    //   key: 'keyword.name',
    //   ellipsis: {
    //     tooltip: true
    //   }
    // },
    {
      title: 'Image',
      key: 'image',
      width: 80,
      align: 'center',
      render: (row) =>
        row.image_cloud_path
          ? renderTooltipThumbnail(
              row.image_cloud_path,
              h(
                NButton,
                { type: 'error', text: true, onClick: () => handleOpenImage(row.image_cloud_path) },
                {
                  default: () =>
                    h(Icon, { icon: 'ph:image', class: 'text-2xl mx-auto text-success' })
                }
              )
            )
          : ''
    },
    {
      title: 'Video',
      key: 'video',
      width: 80,
      align: 'center',
      render: (row) =>
        row.video_cloud_path
          ? renderTooltipThumbnail(
              row.image_cloud_path,
              h(
                NButton,
                { type: 'error', text: true, onClick: () => handleOpenVideo(row.video_cloud_path) },
                { default: () => h(Icon, { icon: 'ph:video', class: 'text-2xl mx-auto' }) }
              )
            )
          : ''
    },
    {
      title: 'Ngày check',
      key: 'recorded_at',
      width: 180,
      render: (row) =>
        h(
          'span',
          { class: 'cursor-pointer', onClick: () => handleOpenCheckedModal(row.domain.id) },
          {
            default: () => (row.recorded_at ? $d(new Date(row.recorded_at), 'dateTime') : '')
          }
        )
    }
  ])

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

  function handleOpenCheckedModal(domainId: number) {
    if (String(domainId) !== domainStore.historyRecordedParams.domain_id) {
      domainStore.listHistoryRecorded = undefined
      domainStore.historyRecordedParams.domain_id = String(domainId)
      domainStore.fetchHistoryRecordedData()
    }
    domainStore.stateModal.isShowHistoryRecordedModal = true
  }

  return {
    videoModal,
    imageModal,
    columns
  }
}
