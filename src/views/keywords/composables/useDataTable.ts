import { User, type Keyword } from '@/types'
import { useKeywordStore } from '../stores/useKeywords'
import { NButton, NDropdown, type DataTableColumns, NTag } from 'naive-ui'

export default function useDataTable() {
  const keywordStore = useKeywordStore()
  const { renderIndex } = useRender()
  const onEditRow = (id: number) => {
    keywordStore.editId = id
    keywordStore.stateModal.isShowUpdateModal = true
  }

  const onDeleteRow = (row: Keyword.Item) => {
    const dialog = window.$dialog.warning({
      title: 'Xác nhận xóa keyword',
      content: `Bạn có chắc chắn muốn xóa keyword ${row.name}?`,
      positiveText: $t('buttons.delete'),
      negativeText: $t('buttons.cancel'),
      onPositiveClick: async () => {
        dialog.loading = true

        try {
          const res = await apiKeywords.delete(row.id)
          window.$message.success(res.data.message)
          await keywordStore.fetchData()
        } catch (error: any) {
          const { showMessageError } = useHelper()
          showMessageError(error)
        }

        dialog.loading = false
      }
    })
  }

  const handleOpenDomainModal = (domains: Keyword.Domain[]) => {
    keywordStore.stateModal.isShowDomainModal = true
    keywordStore.listDomain = domains
  }

  const columns: DataTableColumns<Keyword.Item> = reactive([
    {
      title: 'STT',
      key: 'id',
      align: 'center',
      width: 70,
      fixed: 'left',
      render: (_, index) =>
        renderIndex(keywordStore.urlParams.page, keywordStore.urlParams.per_page, index)
    },
    {
      title: () => $t('pages.keywords.table.name'),
      key: 'name',
      width: 160,
      fixed: 'left',
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: () => $t('pages.keywords.table.run_daily'),
      key: 'is_run_daily',
      width: 160,
      align: 'center',
      render: (row) =>
        h(Icon, {
          icon: 'lets-icons:check-fill',
          class: `${!row.is_run_daily ? 'hidden' : ''} text-2xl text-success mx-auto`
        })
    },
    {
      title: () => $t('pages.keywords.table.tags'),
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
      title: () => $t('pages.keywords.table.domain_total'),
      key: 'domains',
      width: 150,
      align: 'center',
      render: (row) =>
        h(
          NButton,
          { onClick: () => handleOpenDomainModal(row.domains) },
          { default: () => row.domains.length }
        )
    },
    {
      title: () => $t('pages.keywords.table.created_user'),
      key: 'user.name',
      width: 210
    },
    {
      title: () => $t('pages.keywords.table.created_at'),
      key: 'created_at',
      width: 180,
      fixed: 'right',
      render: (row) => $d(new Date(row.created_at), 'dateTime')
    },
    {
      title: () => $t('pages.keywords.table.updated_at'),
      key: 'updated_at',
      width: 180,
      fixed: 'right',
      render: (row) => $d(new Date(row.updated_at), 'dateTime')
    }
  ])

  if (useCheckRoles([User.Role.Admin, User.Role.Editor])) {
    columns.push({
      title: '',
      key: 'actions',
      width: 60,
      fixed: 'right',
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
