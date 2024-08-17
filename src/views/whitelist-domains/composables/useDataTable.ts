import { User, type WhitelistDomain } from '@/types'
import { useWhitelistStore } from '../stores/whitelistStore'
import { NButton, NDropdown, type DataTableColumns, NTag } from 'naive-ui'

export default function useDataTable() {
  const store = useWhitelistStore()
  const { renderIndex } = useRender()

  const columns: DataTableColumns<WhitelistDomain.Item> = reactive([
    {
      title: 'STT',
      key: 'id',
      align: 'center',
      width: 70,
      render: (_, index) => renderIndex(store.urlParams.page, store.urlParams.per_page, index)
    },
    {
      title: 'Tên miền',
      key: 'name',
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: 'Thẻ',
      key: 'tags',
      width: 160,
      render: (row) =>
        h(
          'div',
          { class: 'flex flex-wrap gap-1' },
          {
            default: () =>
              row.tags.map((tag) => h(NTag, { type: 'success' }, { default: () => tag.name }))
          }
        )
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

function onDeleteRow(row: WhitelistDomain.Item) {
  const dialog = window.$dialog.warning({
    title: 'Xác nhận xóa whitelist domain',
    content: `Bạn có chắc chắn muốn xóa whitelist domain ${row.name}?`,
    positiveText: 'Xóa',
    negativeText: 'Hủy',
    onPositiveClick: async () => {
      dialog.loading = true

      try {
        const res = await apiWhitelist.delete(row.id)
        window.$message.success(res.data.message)
        await useWhitelistStore().fetchData()
      } catch (error: any) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }

      dialog.loading = false
    }
  })
}
