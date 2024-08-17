import { User, type Provider } from '@/types'
import { useProviderStore } from '../stores/providerStore'
import { NButton, NDropdown, type DataTableColumns } from 'naive-ui'

export default function useDataTable() {
  const providerStore = useProviderStore()
  const { renderIndex } = useRender()
  const columns: DataTableColumns<Provider.Item> = reactive([
    {
      title: 'STT',
      key: 'id',
      align: 'center',
      width: 70,
      render: (_, index) =>
        renderIndex(providerStore.urlParams.page, providerStore.urlParams.per_page, index)
    },
    {
      title: 'Tên provider',
      key: 'name',
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: 'Trạng thái',
      key: 'is_active',
      width: 120,
      align: 'center',
      render: (row) =>
        h(Icon, {
          icon: 'lets-icons:check-fill',
          class: `${!row.is_active || row.is_active === 'N' ? 'hidden' : ''} text-2xl text-success mx-auto`
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
                providerStore.editId = row.id
                providerStore.stateModal.isShowUpdateModal = true
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

function onDeleteRow(row: Provider.Item) {
  const dialog = window.$dialog.warning({
    title: 'Xác nhận xóa provider',
    content: `Bạn có chắc chắn muốn xóa provider ${row.name}?`,
    positiveText: 'Xóa',
    negativeText: 'Hủy',
    onPositiveClick: async () => {
      dialog.loading = true

      try {
        const res = await apiProviders.delete(row.id)
        window.$message.success(res.data.message)
        await useProviderStore().fetchData()
      } catch (error: any) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }

      dialog.loading = false
    }
  })
}
