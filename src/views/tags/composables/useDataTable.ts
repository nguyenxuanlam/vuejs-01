import { User, type Tag } from '@/types'
import { useTagStore } from '../stores/useTagStore'
import { NButton, NDropdown, type DataTableColumns } from 'naive-ui'

export default function useDataTable() {
  const tagStore = useTagStore()
  const { renderIndex } = useRender()

  const onEditRow = (id: number) => {
    tagStore.editId = id
    tagStore.stateModal.isShowUpdateModal = true
  }

  const onDeleteRow = (row: Tag.Item) => {
    const dialog = window.$dialog.warning({
      title: 'Xác nhận xóa tag',
      content: `Bạn có chắc chắn muốn xóa tag ${row.name}?`,
      positiveText: $t('buttons.delete'),
      negativeText: $t('buttons.cancel'),
      onPositiveClick: async () => {
        dialog.loading = true

        try {
          const res = await apiTags.delete(row.id)
          window.$message.success(res.data.message)
          await tagStore.fetchData()
        } catch (error: any) {
          const { showMessageError } = useHelper()
          showMessageError(error)
        }

        dialog.loading = false
      }
    })
  }
  const columns: DataTableColumns<Tag.Item> = reactive([
    {
      title: 'STT',
      key: 'id',
      align: 'center',
      width: 70,
      render: (_, index) => renderIndex(tagStore.urlParams.page, tagStore.urlParams.per_page, index)
    },
    {
      title: () => 'Tag',
      key: 'name',
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: () => 'Ngày tạo',
      key: 'created_at',
      width: 210,
      render: (row) => $d(new Date(row.created_at), 'dateTime')
    },
    {
      title: () => 'Ngày cập nhật',
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
              onClick: () => onEditRow(row.id)
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
