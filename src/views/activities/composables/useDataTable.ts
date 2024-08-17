import { type Activity } from '@/types'
import { type DataTableColumns, NCode, NLog } from 'naive-ui'
import { useActivityStore } from '@/views/activities/stores/activityStore'

export default function useDataTable() {
  const store = useActivityStore()
  const { renderIndex } = useRender()
  const columns: DataTableColumns<Activity.Item> = reactive([
    {
      title: 'STT',
      key: 'id',
      align: 'center',
      width: 70,
      render: (_, index) => renderIndex(store.urlParams.page, store.urlParams.per_page, index)
    },
    {
      title: 'Mô tả',
      key: 'description',
      width: 250,
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: 'Dữ liệu',
      key: 'properties',
      // render: (row) => h(NLog, { log: `${JSON.stringify(row.properties)}`, rows: 5 })
      render: (row) => h(NCode, { code: JSON.stringify(row.properties, null, 2), language: 'json' })
    },
    {
      title: 'Người thao tác',
      key: 'causer',
      width: 180
    },
    {
      title: () => $t('pages.keywords.table.created_at'),
      key: 'created_at',
      width: 210,
      render: (row) => $d(new Date(row.created_at), 'dateTime')
    }
  ])

  return {
    columns
  }
}
