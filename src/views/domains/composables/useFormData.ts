import type { Domain } from '@/types'
import type { FormRules } from 'naive-ui'

export default function useFormData() {
  const formData = shallowReactive<Domain.Create>({
    domains: []
  })

  const formEditData = shallowReactive<Domain.Update>({
    // name: '',
    link: ''
  })

  const rules: FormRules = {
    domains: [
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
    formEditData,
    rules
  }
}
