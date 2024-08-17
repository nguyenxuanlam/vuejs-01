import { type CheckKeyword } from '@/types'
import { type DataTableColumns } from 'naive-ui'

export default function useDataTable() {
  const { renderIndex } = useRender()

  const columns: DataTableColumns<CheckKeyword.Domain> = reactive([
    {
      title: 'STT',
      key: 'id',
      align: 'center',
      width: 70,
      render: (ro_, index) => renderIndex(0, 0, index)
    },
    {
      title: 'Tên miền',
      key: 'name',
      titleAlign: 'center'
    },
    {
      title: 'Trạng thái',
      key: 'domain_status',
      titleAlign: 'center',
      width: 120,
      render: (row) =>
        h(
          'span',
          { class: 'font-medium text-success' },
          {
            default: () => {
              if (row.is_x === 'Y') return 'Tên miền X'
              if (row.is_y === 'Y') return 'Tên miền Y'
              if (row.is_whitelist === 'Y') return 'Whitelist'
              return '-'
            }
          }
        )
    }
  ])

  return {
    columns
  }
}
