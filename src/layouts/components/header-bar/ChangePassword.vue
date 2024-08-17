<script setup lang="ts">
/* ----- Import Type ----- */
import type { FormInst, FormRules, FormItemRule } from 'naive-ui'
import type { Auth } from '@/types'

/* ----- Import Variables ----- */

/* ----- Import Components ----- */

/* ----- Global variables ----- */
const isShow = defineModel<boolean>('show', {
  required: true
})

//#region ----- Element Ref -----
const isLoading = ref<boolean>(false)
const formRef = ref<FormInst | null>(null)
//#endregion ----- Element Ref -----

//#region ----- Stores -----
//#endregion ----- Stores -----

//#region ----- State -----
//#endregion ----- State -----

//#region ----- Composables -----
const $message = useMessage()
const { showMessageError } = useHelper()

//#endregion ----- Composables -----

//#region ----- Variables -----
const formData = reactive<Auth.ChangePassword>({
  current_password: '',
  new_password: '',
  confirm_password: ''
})

const rules: FormRules = {
  current_password: [
    {
      required: true,
      renderMessage: () => $t('rules.required', { field: $t('auth.current_password') }),
      trigger: ['blur', 'input']
    }
  ],
  new_password: [
    {
      required: true,
      renderMessage: () => $t('rules.required', { field: $t('auth.new_password') }),
      trigger: ['blur', 'input']
    }
  ],
  confirm_password: [
    {
      required: true,
      renderMessage: () => $t('rules.required', { field: $t('auth.confirm_password') }),
      trigger: ['input', 'blur']
    },
    {
      validator: validatePasswordSame,
      message: $t('auth.confirm_password_not_same'),
      trigger: ['input', 'blur']
    }
  ]
}
//#endregion ----- Variables -----

//#region ----- Functions -----
function onSubmit() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      useToggleState(async () => {
        try {
          const res = await apiAuth.changePassword(formData)
          $message.success(res.data.message)
          isShow.value = false
        } catch (error: any) {
          showMessageError(error)
        }
      }, isLoading)
    }
  })
}

function validatePasswordSame(rule: FormItemRule, value: string): boolean {
  return value === formData.new_password
}
//#endregion ----- Functions -----

//#region ----- Hooks -----
//#endregion ----- Hooks -----
</script>

<template>
  <NSpace item-style="width: 450px;">
    <NCard title="Thay đổi mật khẩu" closable @close="isShow = false">
      <NForm
        ref="formRef"
        label-placement="left"
        label-width="90"
        label-align="left"
        require-mark-placement="left"
        :model="formData"
        :rules="rules"
        @submit.prevent="onSubmit"
      >
        <NFormItem path="current_password" label-width="120" :label="$t('auth.current_password')">
          <NInput
            v-model:value="formData.current_password"
            type="password"
            show-password-on="click"
          />
        </NFormItem>
        <NFormItem path="new_password" label-width="120" :label="$t('auth.new_password')">
          <NInput v-model:value="formData.new_password" type="password" show-password-on="click" />
        </NFormItem>
        <NFormItem path="confirm_password" label-width="120" :label="$t('auth.confirm_password')">
          <NInput
            v-model:value="formData.confirm_password"
            type="password"
            show-password-on="click"
          />
        </NFormItem>

        <div class="flex justify-end">
          <NButton :loading="isLoading" :disabled="isLoading" type="primary" attr-type="submit">
            {{ $t('buttons.save') }}
          </NButton>
        </div>
      </NForm>
    </NCard>
  </NSpace>
</template>
