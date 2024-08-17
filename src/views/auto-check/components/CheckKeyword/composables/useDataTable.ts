import { type CheckKeyword, User } from '@/types'
import { type DataTableColumns, NButton } from 'naive-ui'
import { useHistoryKeywordStore } from '../stores/historyKeywordStore'
import CIcon from '@/components/icon/CIcon.vue'

export default function useDataTable() {
  const store = useHistoryKeywordStore()
  const { renderIndex } = useRender()

  const onViewDomain = (data: CheckKeyword.Item['domains']) => {
    store.viewDomainData = data
    store.state.isShowDomainModal = true
  }

  const columns: DataTableColumns<CheckKeyword.Item> = reactive([
    {
      title: 'STT',
      key: 'id',
      align: 'center',
      width: 50,
      render: (_, index) => renderIndex(store.urlParams.page, store.urlParams.per_page, index)
    },
    {
      title: 'Từ Khóa',
      key: 'name',
      titleAlign: 'center',
      ellipsis: {
        tooltip: true
      }
    },
    // {
    //   title: 'Trạng Thái',
    //   key: 'status',
    //   align: 'center',
    //   width: 170,
    //   render: (row) => {
    //     return row.is_run_daily
    //       ? h(
    //           NTag,
    //           {
    //             type: 'success',
    //             class: '!text-[10px] font-semibold px-3',
    //             bordered: false,
    //             size: 'small'
    //           },
    //           { default: () => 'Hoàn thành!' }
    //         )
    //       : h(Icon, {
    //           icon: 'svg-spinners:3-dots-fade',
    //           class: 'text-3xl leading-3 text-primary mx-auto'
    //         })
    //   }
    // },
    {
      title: 'Tổng Tên Miền',
      key: 'total_domains',
      width: 150,
      align: 'center',
      render: (row) => row.domains.length || 0 // TODO: check
    },
    {
      title: 'Tên Miền X',
      key: 'total_domains',
      width: 150,
      align: 'center',
      render: (row) => {
        if (!row.keyword_run_histories.length) return 0
        const last = row.keyword_run_histories[row.keyword_run_histories.length - 1]
        return last.total_x
      }
    },
    {
      title: 'Tên Miền Y',
      key: 'total_domains',
      width: 150,
      align: 'center',
      render: (row) => {
        if (!row.keyword_run_histories.length) return 0
        const last = row.keyword_run_histories[row.keyword_run_histories.length - 1]
        return last.total_y
      }
    },
    {
      title: 'Tên Miền Whitelist',
      key: 'total_domains',
      width: 150,
      align: 'center',
      render: (row) => {
        if (!row.keyword_run_histories.length) return 0
        const last = row.keyword_run_histories[row.keyword_run_histories.length - 1]
        return last.total_whitelist
      }
    }
  ])

  if (useCheckRoles([User.Role.Admin, User.Role.Editor])) {
    columns.push({
      title: 'Thông tin',
      key: 'actions',
      width: 85,
      align: 'center',
      render: (row) => {
        return h(
          NButton,
          {
            size: 'small',
            quaternary: true,
            class: 'flex items-center justify-center',
            onClick: () => onViewDomain(row.domains)
          },
          {
            icon: () => h(CIcon, { icon: 'icon-detail', class: 'mx-auto text-sm text-[#23B7E5]' })
          }
        )
      }
    })
  }

  return {
    columns
  }
}
