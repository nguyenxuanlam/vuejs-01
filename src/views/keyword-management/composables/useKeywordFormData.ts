import type { Keyword } from '@/types'
import type { FormRules } from 'naive-ui'
import { useKeywordManagementStore } from '../stores/keywordManagementStore'

const keywordManagementStore = useKeywordManagementStore()

export default function useFormData() {
  const formData = shallowReactive<Keyword.Create>({
    names: [],
    is_run_daily: 'Y',
    branch_id: null,
    group_id: null
  })
  const formDataUpdate = shallowReactive<Keyword.Update>({
    name: keywordManagementStore.updateKeyWord?.name ?? '',
    is_run_daily: keywordManagementStore.updateKeyWord?.is_run_daily ?? 'Y',
    branch_id: keywordManagementStore.updateKeyWord?.branch_id ?? null,
    group_id: keywordManagementStore.updateKeyWord?.group_id ?? null,
    id: keywordManagementStore.updateKeyWord?.id ?? null
  })

  const rules: FormRules = {
    names: [
      {
        required: true,
        type: 'array',
        min: 1,
        renderMessage: () => $t('rules.required', { field: $t('pages.keywords.table.keyword') }),
        trigger: ['blur', 'input']
      }
    ],
    branch_id: [
      {
        required: true,
        type: 'number',
        renderMessage: () => $t('rules.required', { field: $t('pages.keywords.table.branch') }),
        trigger: ['blur', 'input']
      }
    ],
    group_id: [
      {
        required: true,
        type: 'number',
        renderMessage: () => $t('rules.required', { field: $t('pages.keywords.table.group') }),
        trigger: ['blur', 'input']
      }
    ]
  }

  return {
    formData,
    rules,
    formDataUpdate
  }
}
