import { DomainRedirect } from '@/types'
import { type DataTableColumns } from 'naive-ui'
import { useRedirectFifteenDayStore } from '../stores/redirectFifteenDayStore'
import CIcon from '@/components/icon/CIcon.vue'

export default function useDataTable() {
  const store = useRedirectFifteenDayStore()
  const { renderIndex } = useRender()
  const columns: DataTableColumns<DomainRedirect.Item> = reactive([
    {
      title: 'STT',
      key: 'id',
      align: 'center',
      width: 70,
      render: (_, index) => renderIndex(store.urlParams.page, store.urlParams.per_page, index)
    },
    {
      title: 'Tên Miền Gốc',
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
      title: 'Tên Miền Đích',
      key: 'rdr_link',
      titleAlign: 'center',
      ellipsis: {
        tooltip: true
      },
      render: (row) =>
        row.history_domain_check_rdr[0]?.rdr_link
          ? h(
              'a',
              {
                href: row.history_domain_check_rdr[0]?.rdr_link,
                target: '_blank',
                class: 'hover:text-blue-500 transition-colors duration-300'
              },
              { default: () => row.history_domain_check_rdr[0]?.rdr_link }
            )
          : '-'
    },
    {
      title: 'Kết Quả',
      key: 'result',
      align: 'center',
      width: 140,
      render: (row) =>
        row.status === DomainRedirect.Status.Done
          ? h(CIcon, {
              icon: 'icon-check-circle',
              class: `text-2xl text-success`
            })
          : h(CIcon, {
              icon: 'icon-close-circle',
              class: `text-2xl text-danger`
            })
    },
    {
      title: 'Loại Chuyển Hướng',
      key: 'type_redirect',
      align: 'center',
      width: 140,
      render: (row) => {
        const rdrContent = row.history_domain_check_rdr[0]?.rdr_content
        const match = rdrContent?.match(/HTTP\/\d\s(\d{3})/)
        return match?.[1] ?? '-'
      } // TODO: type redirect
    },
    {
      title: 'Thời Gian Kiểm Tra',
      key: 'last_check',
      align: 'center',
      width: 150,
      render: (row) =>
        row.last_check
          ? h('span', null, { default: () => $d(new Date(row.last_check), 'dateTime') })
          : ''
    }
  ])

  return {
    columns
  }
}
