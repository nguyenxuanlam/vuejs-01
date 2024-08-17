import { User } from '@/types'
import type { FormRules } from 'naive-ui'

export default function useFormData() {
  const formData = shallowReactive<User.Create>({
    name: '',
    email: '',
    username: '',
    password: '',
    role: User.Role.Viewer,
    is_active: 'Y'
  })

  const formEditData = shallowReactive<User.Update>({
    name: '',
    email: '',
    username: '',
    role: <User.Role>''
  })

  const formChangePasswordData = shallowReactive<User.UpdatePassword>({
    name: '',
    email: '',
    username: '',
    password: '',
    role: User.Role.Viewer
  })

  const roleOptions = []
  for (const key in User.Role) {
    roleOptions.push({ value: User.Role[key as keyof typeof User.Role], label: key })
  }

  const rules: FormRules = {
    name: [
      {
        required: true,
        renderMessage: () => $t('rules.required', { field: $t('pages.users.table.name') }),
        trigger: ['blur', 'input']
      }
    ],
    email: [
      {
        required: true,
        renderMessage: () => $t('rules.required', { field: $t('auth.email') }),
        trigger: ['blur', 'input']
      },
      {
        type: 'email',
        renderMessage: () => $t('rules.email'),
        trigger: ['blur', 'input']
      }
    ],
    username: [
      {
        required: true,
        renderMessage: () => $t('rules.required', { field: $t('pages.users.table.username') }),
        trigger: ['blur', 'input']
      }
    ],
    password: [
      {
        required: true,
        renderMessage: () => $t('rules.required', { field: $t('auth.password') }),
        trigger: ['blur', 'input']
      }
    ]
  }

  return {
    formData,
    formEditData,
    formChangePasswordData,
    rules,
    roleOptions
  }
}
