import type { Proxy } from '@/types'
import type { FormRules } from 'naive-ui'

export default function useFormData() {
  const formData = shallowReactive<Proxy.Create>({
    proxy_name: '',
    provider_id: null,
    host: '',
    port: '',
    is_active: 'Y'
  })

  const formEditData = shallowReactive<Proxy.Update>({
    proxy_name: '',
    provider_id: null,
    host: '',
    port: '',
    is_active: 'Y'
  })

  const rules: FormRules = {
    proxy_name: [
      {
        required: true,
        message: 'Tên proxy không được để trống',
        trigger: ['blur', 'input']
      }
    ],
    provider_id: [
      {
        required: true,
        type: 'number',
        message: 'Provider không được để trống',
        trigger: ['blur', 'input']
      }
    ],
    host: [
      {
        required: true,
        message: 'Host không được để trống',
        trigger: ['blur', 'input']
      }
    ],
    port: [
      {
        required: true,
        message: 'Port không được để trống',
        trigger: ['blur', 'input']
      },
      {
        pattern: /^\d+$/,
        message: 'Port phải là số',
        trigger: ['blur', 'input']
      }
    ],
    is_active: [
      {
        required: true,
        message: 'Status không được để trống',
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
