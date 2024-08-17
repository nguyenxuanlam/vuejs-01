<script setup lang="ts">
/* ----- Import Type ----- */
import type { FormInst } from 'naive-ui'

/* ----- Import Variables ----- */

/* ----- Import Components ----- */
import useFormData from '../composables/useFormData'
import { useServerStore } from '@/views/servers/stores/serverStore'

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
const serverStore = useServerStore()
const { formData, rules } = useFormData()
const $message = useMessage()
const { showMessageError } = useHelper()
//#endregion ----- Composables -----

//#region ----- Variables -----

//#endregion ----- Variables -----

//#region ----- Functions -----
async function onSubmit() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      state.isPending = true
      try {
        const res = await apiServers.create(formData)
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
        label-width="110"
        label-align="left"
        require-mark-placement="left"
        :model="formData"
        :rules="rules"
        @submit.prevent="onSubmit"
      >
        <NFormItem path="name" label="Tên">
          <NInput v-model:value="formData.name" />
        </NFormItem>
        <NFormItem path="domain_name" label="Tên miền">
          <NInput v-model:value="formData.domain_name" />
        </NFormItem>
        <NFormItem path="ip_address" label="IP">
          <NInput v-model:value="formData.ip_address" />
        </NFormItem>
        <NFormItem path="type" label="Loại">
          <NSelect v-model:value="formData.type" :options="serverStore.typeOptions" />
        </NFormItem>
        <NFormItem path="limit_process" label="Giới hạn xử lý">
          <NInputNumber v-model:value="formData.limit_process" min="0" />
        </NFormItem>
        <NFormItem path="processing" label="Đang xử lý">
          <NInputNumber v-model:value="formData.processing" min="0" />
        </NFormItem>
        <NFormItem path="is_active" label="Active">
          <NSwitch v-model:value="formData.is_active" checked-value="Y" unchecked-value="N" />
        </NFormItem>

        <div class="flex justify-end">
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
