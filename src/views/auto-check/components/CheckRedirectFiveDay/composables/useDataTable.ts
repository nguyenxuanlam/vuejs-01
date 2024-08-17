import type { DomainRedirect } from '@/types'
import { type DataTableColumns } from 'naive-ui'
import { useRedirectFiveDayStore } from '../stores/redirectFiveDayStore'

export default function useDataTable() {
  const store = useRedirectFiveDayStore()
  const { renderIndex } = useRender()
  const columns: DataTableColumns<DomainRedirect.Item> = reactive([
    {
      title: 'STT',
      key: 'id',
      align: 'center',
      width: 50,
      render: (_, index) => renderIndex(store.urlParams.page, store.urlParams.per_page, index)
    },
    {
      title: 'Tên Miền',
      key: 'domain_name',
      titleAlign: 'center',
      ellipsis: {
        tooltip: true
      },
      render: (row) =>
        h(
          'a',
          {
            href: row.domain_name,
            target: '_blank',
            class: 'hover:text-blue-500 transition-colors duration-300'
          },
          { default: () => row.domain_name }
        )
    },
    {
      title: 'Ngày 1',
      key: 'history_domain_check_rdr_1',
      align: 'center',
      width: 140,
      render: (row) => row.history_domain_check_rdr[0].rdr_link || '-'
    },
    {
      title: 'Ngày 2',
      key: 'history_domain_check_rdr_2',
      align: 'center',
      width: 140,
      render: (row) => row.history_domain_check_rdr[1].rdr_link || '-'
    },
    {
      title: 'Ngày 3',
      key: 'history_domain_check_rdr_3',
      align: 'center',
      width: 140,
      render: (row) => row.history_domain_check_rdr[2].rdr_link || '-'
    },
    {
      title: 'Ngày 4',
      key: 'history_domain_check_rdr_4',
      align: 'center',
      width: 140,
      render: (row) => row.history_domain_check_rdr[3].rdr_link || '-'
    },
    {
      title: 'Ngày 5',
      key: 'history_domain_check_rdr_5',
      align: 'center',
      width: 140,
      ellipsis: {
        tooltip: true
      },
      render: (row) => row.history_domain_check_rdr[4].rdr_link || '-'
    },
    {
      title: 'Thời Gian Kiểm Tra',
      key: 'last_check',
      align: 'center',
      width: 150,
      render: (row) =>
        row.last_check
          ? h('span', null, { default: () => $d(new Date(row.last_check), 'dateTime') })
          : '-'
    }
  ])

  return {
    columns
  }
}
