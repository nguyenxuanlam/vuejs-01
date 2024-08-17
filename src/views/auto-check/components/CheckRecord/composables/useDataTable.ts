import type { Pagination } from './useTableResult'
import { HistoryDomain } from '@/types'
import { NButton, type DataTableColumns } from 'naive-ui'
import CIcon from '@/components/icon/CIcon.vue'

export default function useDataTable(pagination: Pagination) {
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
      width: 50,
      render: (_, index) => renderIndex(pagination.currentPage, pagination.pageSize, index)
    },
    {
      title: 'Tên Miền',
      key: 'domain.link',
      titleAlign: 'center',
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
          { default: () => row.domain.link ?? '-' }
        )
    },
    {
      title: 'Chuyển Hướng URL',
      key: 'domain_redirect',
      titleAlign: 'center',
      width: 150,
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
          { default: () => row.domain_redirect ?? '-' }
        )
    },
    {
      title: 'Ảnh',
      key: 'image',
      width: 70,
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
                default: () => h(CIcon, { icon: 'icon-img', class: 'text-xl text-[#0F61C2]' })
              }
            )
          )
        }
        return '-'
      }
    },
    {
      title: 'Video',
      key: 'video',
      width: 70,
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
              { default: () => h(CIcon, { icon: 'icon-video', class: 'text-xl' }) }
            )
          )
        }
        return '-'
      }
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

  return {
    videoModal,
    imageModal,
    columns
  }
}
