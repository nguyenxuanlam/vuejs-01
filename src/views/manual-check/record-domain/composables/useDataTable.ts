import { type Pagination } from './useTableResult'
import { Session, User } from '@/types'
import { NButton, NTag, type DataTableColumns } from 'naive-ui'
import CIcon from '@/components/icon/CIcon.vue'

export default function useDataTable(
  pagination: Pagination,
  onRetryRow: (row: Session.HistoryDomain) => void,
  onDeleteRow: (row: Session.HistoryDomain) => void
) {
  const { renderIndex, renderTooltip, renderTooltipThumbnail } = useRender()
  const imageModal = reactive({
    visible: false,
    imagePath: ''
  })
  const videoModal = reactive({
    visible: false,
    videoPath: ''
  })

  const columns: DataTableColumns<Session.HistoryDomain> = reactive([
    {
      title: 'STT',
      key: 'id',
      align: 'center',
      width: 70,
      render: (_, index) => renderIndex(pagination.currentPage, pagination.pageSize, index)
    },
    {
      title: 'Tên Miền Gốc',
      key: 'domain',
      titleAlign: 'center',
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
    },
    {
      title: 'Chuyển Hướng URL',
      key: 'domain_redirect',
      titleAlign: 'center',
      ellipsis: {
        tooltip: true
      },
      render: (row) =>
        h(
          'a',
          {
            href: row.result?.domainRedirect,
            target: '_blank',
            class: 'hover:text-blue-500 transition-colors duration-300'
          },
          { default: () => row.result?.domainRedirect ?? '-' }
        )
    },
    {
      title: 'Ảnh',
      key: 'image',
      width: 80,
      align: 'center',
      render: (row) => {
        if (row.result?.imageCloudPath) {
          const imagePath = `${row.result?.imageCloudPath}?${row.result?.createdAt ? new Date(row.result?.createdAt).getTime() : new Date().getTime()}`
          return renderTooltipThumbnail(
            imagePath,
            h(
              NButton,
              { type: 'error', text: true, onClick: () => handleOpenImage(imagePath) },
              {
                default: () => h(CIcon, { icon: 'icon-img', class: 'text-base text-[#0F61C2]' })
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
      width: 80,
      align: 'center',
      render: (row) => {
        if (row.result?.videoCloudPath) {
          const imagePath = row.result?.imageCloudPath
            ? `${row.result?.imageCloudPath}?${row.result?.createdAt ? new Date(row.result?.createdAt).getTime() : new Date().getTime()}`
            : null
          return renderTooltipThumbnail(
            imagePath,
            h(
              NButton,
              {
                type: 'error',
                text: true,
                onClick: () => handleOpenVideo(row.result?.videoCloudPath)
              },
              { default: () => h(CIcon, { icon: 'icon-video', class: 'text-base' }) }
            )
          )
        }
        return '-'
      }
    },
    {
      title: 'Thời Gian',
      key: 'updated_at',
      titleAlign: 'center',
      width: 164,
      render: (row) => (row.updated_at ? $d(new Date(row.updated_at), 'dateTime') : '-')
    }
  ])

  if (useCheckRoles([User.Role.Admin, User.Role.Editor])) {
    columns.push({
      title: 'Tùy chọn',
      key: 'actions',
      width: 80,
      fixed: 'right',
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

  function handleOpenImage(imagePath: string | null) {
    if (!imagePath) return
    imageModal.imagePath = imagePath
    imageModal.visible = true
  }

  function handleOpenVideo(videoPath: string | null | undefined) {
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
