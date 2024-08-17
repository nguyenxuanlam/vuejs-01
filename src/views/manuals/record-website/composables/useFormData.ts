import type { FormRules } from 'naive-ui'

type CreateData = {
  domains: string[]
  type: string
}

export default function useFormData() {
  const formData = shallowReactive<CreateData>({
    domains: [],
    type: 'manual'
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
    rules
  }
}
