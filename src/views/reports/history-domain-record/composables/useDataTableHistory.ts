import { HistoryDomain } from '@/types'
import { NButton, NSpin, type DataTableColumns } from 'naive-ui'
import { useDomainRecordStore } from '../stores/domainRecordStore'

// "https://s3.ap-southeast-1.amazonaws.com/system-check-domain-tools-dev/public/share/2024-07-05/video/laravel.com.mp4"

export default function useDataTable() {
  const domainRecordStore = useDomainRecordStore()
  const { renderIndex } = useRender()
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
          domainRecordStore.historyRecordedParams.page,
          domainRecordStore.historyRecordedParams.per_page,
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
      render: (row) => {
        if (row.image_cloud_path) {
          const imagePath = `${row.image_cloud_path}?${row.recorded_at ? new Date(row.recorded_at).getTime() : new Date().getTime()}`
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
      key: 'video',
      width: 80,
      align: 'center',
      render: (row) => {
        if (row.video_cloud_path) {
          const imagePath = row.image_cloud_path
            ? `${row.image_cloud_path}?${row.recorded_at ? new Date(row.recorded_at).getTime() : new Date().getTime()}`
            : null
          return renderTooltipThumbnail(
            imagePath,
            h(
              NButton,
              { type: 'error', text: true, onClick: () => handleOpenVideo(row.video_cloud_path) },
              { default: () => h(Icon, { icon: 'ph:video', class: 'text-2xl mx-auto' }) }
            )
          )
        }
        return ''
      }
    },
    {
      title: 'Ngày check',
      key: 'recorded_at',
      width: 180,
      render: (row) => {
        if (row.is_record) {
          // processing
          if (!row.recorded_at) {
            return h(NSpin, { size: 'small' })
          } else {
            // done
            return row.recorded_at ? $d(new Date(row.recorded_at), 'dateTime') : ''
          }
        }
        return ''
      }
    }
  ])

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

  function handleOpenCheckedModal(domainId: number) {
    if (String(domainId) !== domainRecordStore.historyRecordedParams.domain_id) {
      domainRecordStore.listHistoryRecorded = undefined
      domainRecordStore.historyRecordedParams.domain_id = String(domainId)
      domainRecordStore.fetchHistoryRecordedData()
    }
    domainRecordStore.stateModal.isShowHistoryRecordedModal = true
  }

  return {
    videoModal,
    imageModal,
    columns
  }
}
