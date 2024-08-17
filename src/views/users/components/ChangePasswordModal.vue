<script setup lang="ts">
/* ----- Import Type ----- */
import type { FormInst, FormRules } from 'naive-ui'
import type { User } from '@/types'
import { merge as _merge, pick as _pick } from 'lodash'
import useFormData from '@/views/users/composables/useFormData'

/* ----- Import Variables ----- */

/* ----- Import Components ----- */

/* ----- Global variables ----- */
const props = defineProps<{
  id: number | null
}>()

const emit = defineEmits<{
  (e: 'success'): void
}>()

const isShow = defineModel<boolean>('show', {
  required: true
})

//#region ----- Element Ref -----
const formRef = ref<FormInst | null>(null)
//#endregion ----- Element Ref -----

//#region ----- Stores -----
//#endregion ----- Stores -----

//#region ----- State -----
const state = reactive({
  isFetching: true,
  isPending: false
})
//#endregion ----- State -----

//#region ----- Composables -----
const { formChangePasswordData: formData } = useFormData()
const $message = useMessage()
const { showMessageError } = useHelper()

//#endregion ----- Composables -----

//#region ----- Variables -----
const dataDetail = ref<User.Item | null>(null)

const rules: FormRules = {
  password: [
    {
      required: true,
      renderMessage: () => $t('rules.required', { field: $t('auth.new_password') }),
      trigger: ['blur', 'input']
    }
  ]
}
//#endregion ----- Variables -----

//#region ----- Functions -----
function onSubmit() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      if (!props.id) return

      state.isPending = true
      try {
        const res = await apiUsers.changePassword(props.id, formData)
        $message.success(res.data.message)
        isShow.value = false
        emit('success')
      } catch (error: any) {
        showMessageError(error)
      }
      state.isPending = false
    }
  })
}

async function fetchDataDetail() {
  if (!props.id) {
    isShow.value = false
    return
  }

  state.isFetching = true
  try {
    const res = await apiUsers.getDetail(props.id)
    dataDetail.value = res.data.data
    _merge(formData, _pick(dataDetail.value, ['name', 'email', 'username']))
    formData.role = dataDetail.value?.role[0]
  } catch (error: any) {
    showMessageError(error)
  }
  state.isFetching = false
}

//#endregion ----- Functions -----

//#region ----- Hooks -----
onBeforeMount(() => {
  fetchDataDetail()
})
//#endregion ----- Hooks -----
</script>

<template>
  <NSpace item-style="width: 450px;">
    <NCard title="Thay đổi mật khẩu" closable @close="isShow = false">
      <NForm
        ref="formRef"
        label-placement="left"
        label-width="120"
        label-align="left"
        require-mark-placement="left"
        :model="formData"
        :rules="rules"
        @submit.prevent="onSubmit"
      >
        <NFormItem path="password" :label="$t('auth.new_password')">
          <NInput v-model:value="formData.password" type="password" show-password-on="click" />
        </NFormItem>

        <div class="flex justify-end">
          <NButton
            :loading="state.isPending"
            :disabled="state.isPending"
            type="primary"
            attr-type="submit"
          >
            {{ $t('buttons.save') }}
          </NButton>
        </div>
      </NForm>
    </NCard>
  </NSpace>
</template>
