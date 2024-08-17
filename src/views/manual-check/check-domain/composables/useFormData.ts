import type { Session } from '@/types'
import type { FormRules } from 'naive-ui'

export default function useFormData() {
  const formData = shallowReactive<Session.Create>({
    type: 'CHECK',
    domain: []
  })

  const rules: FormRules = {
    domain: [
      {
        required: true,
        type: 'array',
        message: 'Tên miền không được để trống',
        trigger: ['blur', 'input']
      }
    ]
  }

  return {
    formData,
    rules
  }
}
