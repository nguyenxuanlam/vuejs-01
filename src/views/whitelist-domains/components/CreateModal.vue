<script setup lang="ts">
/* ----- Import Type ----- */
import type { FormInst } from 'naive-ui'

/* ----- Import Variables ----- */

/* ----- Import Components ----- */
import useFormData from '../composables/useFormData'
import { useWhitelistStore } from '@/views/whitelist-domains/stores/whitelistStore'

/* ----- Global variables ----- */

const emit = defineEmits<{
  (e: 'success'): void
}>()

const isShow = defineModel<boolean>('show', {
  required: true
})

//#region ----- Element Ref -----
const formRef = ref<FormInst | null>(null)
const names = ref<string>('')
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
const whitelistStore = useWhitelistStore()
//#endregion ----- Composables -----

//#region ----- Variables -----

//#endregion ----- Variables -----

//#region ----- Functions -----
async function onSubmit() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      state.isPending = true
      try {
        const res = await apiWhitelist.create({
          ...formData,
          tags: formData.tag ? [formData.tag] : []
        })
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

function onInputNames(value: string) {
  formData.names = value.split('\n').filter((name) => name.trim() !== '')
  names.value = value
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
        <NFormItem path="names" label="Tên miền">
          <NInput
            :value="names"
            type="textarea"
            placeholder="Mỗi dòng là 1 từ tên miền"
            :rows="4"
            @input="onInputNames"
          />
        </NFormItem>
        <NFormItem path="tag" :label="$t('pages.keywords.table.tags')">
          <NSelect
            v-model:value="formData.tag"
            :options="whitelistStore.tagsOptions"
            :loading="whitelistStore.state.isFetchingTags"
            value-field="label"
            label-field="label"
            @scroll="whitelistStore.onFetchMoreTags"
          />
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
