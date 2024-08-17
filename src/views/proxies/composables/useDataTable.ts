import { User, type Proxy } from '@/types'
import { useProxyStore } from '../stores/proxyStore'
import { NButton, NDropdown, type DataTableColumns, NTag } from 'naive-ui'

export default function useDataTable() {
  const proxyStore = useProxyStore()
  const { renderIndex } = useRender()

  const columns: DataTableColumns<Proxy.Item> = reactive([
    {
      title: 'STT',
      key: 'id',
      align: 'center',
      width: 70,
      render: (_, index) =>
        renderIndex(proxyStore.urlParams.page, proxyStore.urlParams.per_page, index)
    },
    {
      title: 'Tên proxy',
      key: 'proxy_name',
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: 'Nhà cung cấp',
      key: 'provider_id',
      render: (row) => {
        const provider = proxyStore.listProviders?.find((v: any) => v.value === row.provider_id)
        return provider ? h(NTag, { type: 'success' }, { default: () => provider.label }) : ''
      }
    },
    {
      title: 'Host',
      key: 'host'
    },
    {
      title: 'Port',
      key: 'port'
    },
    {
      title: 'Trạng thái',
      key: 'is_active',
      width: 140,
      align: 'center',
      render: (row) => proxyStore.statusOptions.find((v) => v.value === row.is_active)?.label
    }
    // {
    //   title: () => $t('pages.users.table.created_at'),
    //   key: 'created_at',
    //   width: 210,
    //   render: (row) => $d(new Date(row.created_at), 'dateTime')
    // }
    // {
    //   title: () => $t('pages.users.table.updated_at'),
    //   key: 'updated_at',
    //   width: 210,
    //   render: (row) => $d(new Date(row.updated_at), 'dateTime')
    // }
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
                proxyStore.editId = row.id
                proxyStore.stateModal.isShowUpdateModal = true
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

function onDeleteRow(row: Proxy.Item) {
  const dialog = window.$dialog.warning({
    title: 'Xác nhận xóa proxy',
    content: `Bạn có chắc chắn muốn xóa proxy ${row.proxy_name}?`,
    positiveText: 'Xóa',
    negativeText: 'Hủy',
    onPositiveClick: async () => {
      dialog.loading = true

      try {
        const res = await apiProxies.delete(row.id)
        window.$message.success(res.data.message)
        const { fetchData } = useProxyStore()
        await fetchData()
      } catch (error: any) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }

      dialog.loading = false
    }
  })
}
