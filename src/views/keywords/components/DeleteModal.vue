<script setup lang="ts">
/* ----- Import Type ----- */
import type { FormInst } from 'naive-ui'

/* ----- Import Variables ----- */

/* ----- Import Components ----- */
import useFormData from '../composables/useFormData'
import { useKeywordStore } from '@/views/keywords/stores/useKeywords'

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
const { formDeleteData: formData, rules } = useFormData()
const $message = useMessage()
const { showMessageError } = useHelper()
const keywordStore = useKeywordStore()
//#endregion ----- Composables -----

//#region ----- Variables -----
//#endregion ----- Variables -----

//#region ----- Functions -----
async function onSubmit() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      state.isPending = true
      try {
        if (!formData.tag_id) {
          $message.error('Vui lòng chọn tag')
          return
        }

        const res = await apiKeywords.deleteByTag(formData.tag_id)
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
    <NCard title="Xóa bởi tag" closable @close="isShow = false">
      <NForm
        ref="formRef"
        label-placement="left"
        label-width="110"
        label-align="left"
        require-mark-placement="left"
        :model="formData"
        :rules="rules"
        :disabled="state.isPending"
        @submit.prevent="onSubmit"
      >
        <NFormItem path="tag_id" :label="$t('pages.keywords.table.tags')">
          <NSelect
            v-model:value="formData.tag_id"
            :options="keywordStore.tagsOptions"
            :loading="keywordStore.state.isFetchingTags"
            clearable
            @scroll="keywordStore.onFetchMoreTags"
          />
        </NFormItem>

        <div class="flex justify-end">
          <NButton
            :loading="state.isPending"
            :disabled="state.isPending"
            type="primary"
            attr-type="submit"
          >
            {{ $t('buttons.delete') }}
          </NButton>
        </div>
      </NForm>
    </NCard>
  </NSpace>
</template>
