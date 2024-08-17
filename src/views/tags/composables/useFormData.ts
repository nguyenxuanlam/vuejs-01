import type { Tag } from '@/types'
import type { FormRules } from 'naive-ui'

export default function useFormData() {
  const formData = shallowReactive<Tag.Create>({
    name: ''
  })

  const formEditData = shallowReactive<Tag.Update>({
    name: ''
  })

  const rules: FormRules = {
    name: [
      {
        required: true,
        renderMessage: () => $t('rules.required', { field: 'Tag' }),
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
