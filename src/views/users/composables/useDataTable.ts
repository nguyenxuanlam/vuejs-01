import { User } from '@/types'
import { useUserStore } from '../stores/userStore'
import { NButton, NDropdown, type DataTableColumns, NTag } from 'naive-ui'
import Button from 'naive-ui/es/button/src/Button'

export default function useDataTable() {
  const authStore = useAuthStore()
  const userStore = useUserStore()
  const { renderIndex } = useRender()

  function getTagRoleType(role: User.Role) {
    switch (role) {
      case User.Role.Admin:
        return 'primary'
        break
      case User.Role.Editor:
        return 'info'
        break
      case User.Role.Viewer:
        return 'default'
        break
      default:
        return 'default'
        break
    }
  }

  const columns: DataTableColumns<User.Item> = [
    {
      title: 'STT',
      key: 'id',
      align: 'center',
      width: 70,
      render: (_, index) =>
        renderIndex(userStore.urlParams.page, userStore.urlParams.per_page, index)
    },
    {
      title: () => $t('pages.users.table.name'),
      key: 'name',
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: () => $t('pages.users.table.email'),
      key: 'email',
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: () => $t('pages.users.table.username'),
      key: 'username',
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: () => $t('pages.users.table.role'),
      key: 'role',
      width: 120,
      render: (row) =>
        h(
          NTag,
          {
            type: getTagRoleType(row.role[0])
          },
          {
            default: () =>
              h(
                'div',
                { class: 'min-w-[70px] text-center' },
                { default: () => User.RoleStr[row.role[0]] }
              )
          }
        )
    },
    {
      title: () => $t('pages.users.table.is_active'),
      key: 'is_active',
      width: 110,
      align: 'center',
      render: (row) =>
        h(
          Button,
          { text: true, onClick: () => onToggleStatus(row) },
          {
            default: () =>
              h(Icon, {
                icon: `${row.is_active === 'Y' ? 'mdi:lock-open' : 'mdi:lock'}`,
                class: `${row.is_active === 'Y' ? 'text-success' : 'text-danger'} text-2xl mx-auto`
              })
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
      title: () => $t('pages.users.table.last_login'),
      key: 'last_login',
      width: 210,
      render: (row) => (row.last_login ? $d(new Date(row.last_login), 'dateTime') : '')
    },
    {
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
                userStore.editId = row.id
                userStore.stateModal.isShowUpdateModal = true
              }
            }
          },
          {
            label: $t('auth.change_password'),
            key: 'change_password',
            icon: () => h(Icon, { icon: 'material-symbols:vpn-key' }),
            props: {
              onClick: () => {
                userStore.editId = row.id
                userStore.stateModal.isShowChangePasswordModal = true
              }
            }
          }
        ]

        if (authStore.profile?.id !== row.id && useCheckRoles([User.Role.Admin])) {
          options.push({
            label: $t('buttons.delete'),
            key: 'delete',
            icon: () => h(Icon, { icon: 'mdi:delete' }),
            props: {
              onClick: () => onDeleteRow(row)
            }
          })
        }

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
    }
  ]

  return {
    columns
  }
}

function onDeleteRow(row: User.Item) {
  const dialog = window.$dialog.warning({
    title: 'Xác nhận xóa người dùng',
    content: `Bạn có chắc chắn muốn xóa người dùng ${row.name}?`,
    positiveText: 'Xóa',
    negativeText: 'Hủy',
    onPositiveClick: async () => {
      dialog.loading = true

      try {
        const res = await apiUsers.delete(row.id)
        window.$message.success(res.data.message)
        const { fetchData } = useUserStore()
        fetchData()
      } catch (error: any) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }

      dialog.loading = false
    }
  })
}

function onToggleStatus(row: User.Item) {
  const btnContent = row.is_active === 'Y' ? 'Khóa' : 'Mở khóa'
  const dialog = window.$dialog.warning({
    title: 'Xác nhận thay đổi trạng thái',
    content: `Bạn có chắc chắn muốn ${btnContent} người dùng ${row.name}?`,
    positiveText: btnContent,
    negativeText: 'Hủy',
    onPositiveClick: async () => {
      dialog.loading = true

      const newStatus = row.is_active === 'Y' ? 'N' : 'Y'
      try {
        const res = await apiUsers.updateActive(row.id, newStatus)
        window.$message.success(res.data.message)
        row.is_active = newStatus
      } catch (error: any) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }

      dialog.loading = false
    }
  })
}
