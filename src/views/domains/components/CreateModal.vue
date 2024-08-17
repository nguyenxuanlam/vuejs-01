<script setup lang="ts">
/* ----- Import Type ----- */
import type { FormInst } from 'naive-ui'

/* ----- Import Variables ----- */

/* ----- Import Components ----- */
import useFormData from '../composables/useFormData'

/* ----- Global variables ----- */

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
  isPending: false
})
//#endregion ----- State -----

//#region ----- Composables -----
const { formData, rules } = useFormData()
const $message = useMessage()
const { showMessageError } = useHelper()
const { ensureHttp } = useEnsureHttp()
//#endregion ----- Composables -----

//#region ----- Variables -----
const domains = ref<string>('')
//#endregion ----- Variables -----

//#region ----- Functions -----
async function onSubmit() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      state.isPending = true
      try {
        const res = await apiDomains.create(formData)
        $message.success(res.data.message)
        emit('success')
        isShow.value = false
      } catch (error: any) {
        showMessageError(error)
      }
      state.isPending = false
    }
  })
}

async function onInputDomains(value: string) {
  formData.domains = value
    .split('\n')
    .filter((item) => item.trim() !== '')
    .map((item) => ensureHttp(item))
  domains.value = value
}
//#endregion ----- Functions -----

//#region ----- Hooks -----
//#endregion ----- Hooks -----
</script>

<template>
  <NSpace item-style="width: 450px;">
    <NCard :title="$t('buttons.create')" closable @close="isShow = false">
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
        <NFormItem path="domains" label="Tên miền">
          <NInput
            :value="domains"
            type="textarea"
            placeholder="Mỗi dòng là 1 tên miền"
            :rows="4"
            @input="onInputDomains"
          />
        </NFormItem>
        <div class="flex justify-end mt-2">
          <NButton
            :loading="state.isPending"
            :disabled="state.isPending"
            type="primary"
            attr-type="submit"
          >
            {{ $t('buttons.create') }}
          </NButton>
        </div>
      </NForm>
    </NCard>
  </NSpace>
</template>
