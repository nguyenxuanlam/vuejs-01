import type { Keyword } from '@/types'
import type { FormRules } from 'naive-ui'
import { useKeywordManagementStore } from '@/views/keyword-management/stores/keywordManagementStore'

const keywordManagementStore = useKeywordManagementStore()

export default function useFormData() {
  const formData = shallowReactive<Keyword.Create>({
    names: [],
    is_run_daily: 'Y',
    // tag: undefined,
    branch_id: keywordManagementStore.branchId || null,
    group_id: keywordManagementStore.groupId || null
  })

  const formEditData = shallowReactive<Keyword.Update>({
    name: '',
    is_run_daily: 'Y',
    branch_id: null,
    group_id: null,
    id: null
  })

  const formDeleteData = shallowReactive<Keyword.Delete>({
    tag_id: undefined
  })

  const rules: FormRules = {
    name: [
      {
        required: true,
        renderMessage: () => $t('rules.required', { field: $t('pages.keywords.table.name') }),
        trigger: ['blur', 'input']
      }
    ],
    names: [
      {
        required: true,
        type: 'array',
        min: 1,
        renderMessage: () => $t('rules.required', { field: $t('pages.keywords.table.name') }),
        trigger: ['blur', 'input']
      }
    ],
    tag: [
      {
        required: true,
        renderMessage: () => $t('rules.required', { field: $t('pages.keywords.table.tags') }),
        trigger: ['blur', 'input']
      }
    ],
    tag_id: [
      {
        required: true,
        type: 'number',
        message: 'Thẻ không được để trống',
        trigger: ['blur', 'input']
      }
    ]
  }

  return {
    formData,
    formEditData,
    formDeleteData,
    rules
  }
}
