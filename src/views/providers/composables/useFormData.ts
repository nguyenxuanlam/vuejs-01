import type { FormRules } from 'naive-ui'
import type { Provider } from '@/types'

export default function useFormData() {
  const formData = shallowReactive<Provider.Create>({
    name: '',
    is_active: 'Y'
  })

  const formEditData = shallowReactive<Provider.Update>({
    name: '',
    is_active: 'Y'
  })

  const rules: FormRules = {
    name: [
      {
        required: true,
        message: 'Tên nhà cung cấp không được để trống',
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
