import type { Server } from '@/types'
import type { FormRules } from 'naive-ui'

export default function useFormData() {
  const formData = shallowReactive<Server.Create>({
    name: '',
    domain_name: '',
    ip_address: '',
    limit_process: 4,
    processing: 0,
    is_active: 'Y',
    type: 'record-domain'
  })

  const formEditData = shallowReactive<Server.Update>({
    name: '',
    domain_name: '',
    ip_address: '',
    limit_process: 4,
    processing: 0,
    is_active: 'Y',
    type: 'record-domain'
  })

  const rules: FormRules = {
    name: [
      {
        required: true,
        message: 'Tên server không được để trống',
        trigger: ['blur', 'input']
      }
    ],
    domain_name: [
      {
        required: true,
        message: 'Tên miền không được để trống',
        trigger: ['blur', 'input']
      }
    ],
    ip_address: [
      {
        required: true,
        message: 'Địa chỉ IP không được để trống',
        trigger: ['blur', 'input']
      },
      {
        pattern: /^([0-9]{1,3}\.){3}[0-9]{1,3}$/,
        message: 'Địa chỉ IP không đúng định dạng',
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
