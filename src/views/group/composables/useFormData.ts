import type { Group } from '@/types'
import type { FormRules } from 'naive-ui'
import { number } from 'zod'

export default function useFormData() {
  const formData = shallowReactive<Group.Create>({
    name: '',
    branch_id: null
  })

  const formEditData = shallowReactive<Group.Update>({
    name: '',
    branch_id: null
  })

  const rules: FormRules = {
    name: [
      {
        required: true,
        renderMessage: () => $t('rules.required', { field: 'Thương hiệu' }),
        trigger: ['blur', 'input']
      }
    ]
  }
  const rulesCreate: FormRules = {
    name: [
      {
        required: true,
        renderMessage: () => $t('rules.required', { field: 'Thương hiệu' }),
        trigger: ['blur', 'input']
      }
    ],
    branch_id: [
      {
        required: true,
        type: 'number',
        renderMessage: () => $t('rules.required', { field: 'Ngành' }),
        trigger: ['blur', 'input']
      }
    ]
  }

  return {
    formData,
    formEditData,
    rules,
    rulesCreate
  }
}
