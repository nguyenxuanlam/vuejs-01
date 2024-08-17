import { User, type Group, type Tag } from '@/types'
import { useGroupStore } from '../stores/useGroupStore'
import { NButton, NDropdown, type DataTableColumns } from 'naive-ui'

export default function useDataTable() {
  const groupStore = useGroupStore()
  const { renderIndex } = useRender()

  const onEditRow = (id: number, branch_id: number) => {
    groupStore.editId = id
    groupStore.branchId = branch_id
    groupStore.stateModal.isShowUpdateModal = true
  }

  const onDeleteRow = (row: Group.Item) => {
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
          await groupStore.fetchData()
        } catch (error: any) {
          const { showMessageError } = useHelper()
          showMessageError(error)
        }

        dialog.loading = false
      }
    })
  }
  const columns: DataTableColumns<Group.Item> = reactive([
    {
      title: 'STT',
      key: 'id',
      align: 'center',
      width: 70,
      render: (_, index) =>
        renderIndex(groupStore.urlParams.page, groupStore.urlParams.per_page, index)
    },
    {
      title: () => 'Thương hiệu',
      key: 'name',
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: () => 'Ngành',
      key: 'branch_name',
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
              onClick: () => onEditRow(row.id, row.branch_id)
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
