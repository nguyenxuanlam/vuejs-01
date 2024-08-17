import { User, type Server } from '@/types'
import { useServerStore } from '../stores/serverStore'
import { NButton, NDropdown, type DataTableColumns } from 'naive-ui'

export default function useDataTable() {
  const serverStore = useServerStore()
  const { renderIndex } = useRender()

  const columns: DataTableColumns<Server.Item> = reactive([
    {
      title: 'STT',
      key: 'id',
      align: 'center',
      width: 70,
      render: (_, index) =>
        renderIndex(serverStore.urlParams.page, serverStore.urlParams.per_page, index)
    },
    {
      title: 'Tên',
      key: 'name',
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: 'Tên miền',
      key: 'domain_name',
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: 'IP',
      key: 'ip_address'
    },
    {
      title: 'Loại',
      key: 'type',
      render: (row) => toRaw(serverStore.typeOptions).find((type) => type.value === row.type)?.label
    },
    {
      title: 'Giới hạn xử lý',
      key: 'limit_process',
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: 'Đang xử lý',
      key: 'processing',
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: 'Active',
      key: 'is_active',
      width: 80,
      align: 'center',
      render: (row) =>
        h(Icon, {
          icon: 'lets-icons:check-fill',
          class: `${row.is_active === 'N' ? 'hidden' : ''} text-2xl text-success mx-auto`
        })
    },
    {
      title: () => $t('pages.users.table.created_at'),
      key: 'created_at',
      width: 210,
      render: (row) => $d(new Date(row.created_at), 'dateTime')
    },
    {
      title: () => $t('pages.users.table.updated_at'),
      key: 'updated_at',
      width: 210,
      render: (row) => $d(new Date(row.updated_at), 'dateTime')
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
            label: $t('buttons.edit'),
            key: 'edit',
            icon: () => h(Icon, { icon: 'mdi:pencil' }),
            props: {
              onClick: () => {
                const store = useServerStore()
                store.editId = row.id
                store.stateModal.isShowUpdateModal = true
              }
            }
          },
          {
            label: $t('buttons.delete'),
            key: 'delete',
            icon: () => h(Icon, { icon: 'mdi:delete' }),
            props: {
              onClick: () => onDeleteRow(row)
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

  return {
    columns
  }
}

function onDeleteRow(row: Server.Item) {
  const dialog = window.$dialog.warning({
    title: 'Xác nhận xóa cụm server',
    content: `Bạn có chắc chắn muốn xóa cụm server ${row.name}?`,
    positiveText: 'Xóa',
    negativeText: 'Hủy',
    onPositiveClick: async () => {
      dialog.loading = true

      try {
        const res = await apiServers.delete(row.id)
        window.$message.success(res.data.message)
        await useServerStore().fetchData()
      } catch (error: any) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }

      dialog.loading = false
    }
  })
}
