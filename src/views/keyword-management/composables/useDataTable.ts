import { type Keyword } from '@/types'
import { useKeywordManagementStore } from '../stores/keywordManagementStore'
import { NButton, type DataTableColumns, NTag, NCheckbox } from 'naive-ui'
import CIcon from '@/components/icon/CIcon.vue'
import { h, reactive, ref } from 'vue'

export default function useDataTable() {
  const keywordMangagementStore = useKeywordManagementStore()
  const state = reactive({ isPending: false })

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
          await handleDeleteRow(row)
        } catch (error: any) {
          const { showMessageError } = useHelper()
          showMessageError(error)
        }

        dialog.loading = false
      }
    })
  }

  const handleDeleteRow = (row: Keyword.Item) => {
    const data = keywordMangagementStore?.listData?.data
    if (data) {
      const branchIndex = data?.findIndex((item) => item.id === row.branch_id)
      if (branchIndex !== undefined) {
        const groupIndex = data[branchIndex]?.groups.findIndex((item) => item.id === row.group_id)
        if (groupIndex !== undefined) {
          const keywordIndex = data[branchIndex]?.groups[groupIndex]?.keywords.findIndex(
            (item) => item.id === row.id
          )
          if (keywordIndex !== undefined) {
            return data[branchIndex]?.groups[groupIndex]?.keywords.splice(keywordIndex, 1)
          }
        }
      }
    }
    return keywordMangagementStore.fetchData()
  }

  const handleCheckboxClick = async (row: Keyword.Item, value: boolean) => {
    state.isPending = true
    const oppositeValue = row.is_run_daily === 'Y' ? 'N' : 'Y'
    row.is_run_daily = oppositeValue
    try {
      const res = await apiKeywords.updateRunDaily(row.id, {
        is_run_daily: oppositeValue,
        name: row.name
      })
      keywordMangagementStore.fetchData()
      window.$message.success('Cập nhật chạy hằng ngày thành công')
    } catch (error: any) {
      const { showMessageError } = useHelper()
      showMessageError(error)
    }
    state.isPending = false
  }

  const columns: DataTableColumns<Keyword.Item> = reactive([
    {
      title: 'STT',
      key: 'id',
      align: 'center',
      width: 70,
      fixed: 'left',
      render: (_, index) => index + 1
    },
    {
      title: () => $t('pages.keywords.table.keyword'),
      key: 'name',
      titleAlign: 'center',
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: () => $t('pages.keywords.table.created_user'),
      key: 'user.name',
      align: 'center'
    },
    {
      title: () => $t('pages.keywords.table.created_at'),
      key: 'created_at',
      align: 'center',
      width: 170,
      fixed: 'right',
      render: (row) => $d(new Date(row.created_at), 'dateTime')
    },
    {
      title: () => $t('pages.keywords.table.run_daily'),
      key: 'is_run_daily',
      width: 140,
      align: 'center',
      render: (row) => {
        return h(NCheckbox, {
          checked: row.is_run_daily,
          checkedValue: 'Y',
          uncheckedValue: 'N',
          'onUpdate:checked': (value) => handleCheckboxClick(row, value)
        })
      }
    },
    {
      title: () => $t('pages.keywords.table.custom'),
      key: 'actions',
      align: 'center',
      width: 115,
      fixed: 'right',
      render: (row) => {
        return h('div', { class: 'flex justify-center gap-2' }, [
          h(
            NButton,
            {
              size: 'small',
              quaternary: true,
              onClick: () => onEditRow(row)
            },
            { icon: () => h(CIcon, { icon: 'icon-edit' }) }
          ),
          h(
            NButton,
            {
              size: 'small',
              quaternary: true,
              onClick: () => onDeleteRow(row)
            },
            { icon: () => h(CIcon, { icon: 'icon-trash' }) }
          )
        ])
      }
    }
  ])

  const onEditRow = (row: Keyword.Item) => {
    keywordMangagementStore.stateModal.isShowUpdateKeywordModal = true
    keywordMangagementStore.updateKeyWord = {
      ...row,
      is_run_daily: row.is_run_daily,
      branch_id: row.branch_id ?? null,
      group_id: row.group_id ?? null
    }
  }

  return {
    columns,
    state
  }
}
