import type { FormRules } from 'naive-ui'
import type { WhitelistDomain } from '@/types'

export default function useFormData() {
  const formData = shallowReactive<WhitelistDomain.Create>({
    names: [],
    tag: undefined
  })

  const formEditData = shallowReactive<WhitelistDomain.Update>({
    name: '',
    tag: undefined
  })

  const formDeleteData = shallowReactive<WhitelistDomain.Delete>({
    tag_id: undefined
  })

  const rules: FormRules = {
    name: [
      {
        required: true,
        message: 'Tên miền không được để trống',
        trigger: ['blur', 'input']
      }
    ],
    names: [
      {
        required: true,
        type: 'array',
        min: 1,
        renderMessage: () => $t('rules.required', { field: 'Tên miền' }),
        trigger: ['blur', 'input']
      }
    ],
    tag: [
      {
        required: true,
        message: 'Thẻ không được để trống',
        trigger: ['blur', 'input']
      }
    ],
    tag_id: [
      {
        required: true,
        type: 'number',
        message: 'Thẻ không được để trống',
        trigger: ['blur', 'input']
      }
    ]
  }

  return {
    formData,
    formEditData,
    formDeleteData,
    rules
  }
}
