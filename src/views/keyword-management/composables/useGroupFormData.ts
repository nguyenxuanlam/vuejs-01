import type { Group } from '@/types'
import type { FormRules } from 'naive-ui'
import { useKeywordManagementStore } from '../stores/keywordManagementStore'

const keywordManagementStore = useKeywordManagementStore()

export default function useFormData() {
  const formData = shallowReactive<Group.Create>({
    name: '',
    branch_id: keywordManagementStore.branchId ?? null
  })

  const rules: FormRules = {
    names: [
      {
        required: true,
        renderMessage: () => $t('rules.required', { field: 'Group' }),
        trigger: ['blur', 'input']
      }
    ]
  }

  return {
    formData,
    rules
  }
}
