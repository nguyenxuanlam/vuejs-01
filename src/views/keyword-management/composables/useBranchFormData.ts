import type { Branch } from '@/types'
import type { FormRules } from 'naive-ui'

export default function useFormData() {
  const formData = shallowReactive<Branch.Create>({
    name: ''
  })

  const rules: FormRules = {
    name: [
      {
        required: true,
        renderMessage: () => $t('rules.required', { field: 'Branch' }),
        trigger: ['blur', 'input']
      }
    ]
  }

  return {
    formData,
    rules
  }
}
