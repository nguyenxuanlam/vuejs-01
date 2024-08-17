<script setup lang="ts">
/* ----- Import Type ----- */
import type { FormInst } from 'naive-ui'

/* ----- Import Variables ----- */

/* ----- Import Components ----- */
import { useProviderStore } from '@/views/providers/stores/providerStore'
import type { Provider } from '@/types'

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
const store = useProviderStore()
const formData = ref<Provider.SortItem[] | undefined>(store.getSortData)
//#endregion ----- State -----

//#region ----- Composables -----
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

      if (!formData.value) {
        $message.error('Dữ liệu không hợp lệ')
        return
      }

      try {
        await apiProviders.updateSort(formData.value)
        $message.success('Thay đổi vị trí thành công')
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
    <NCard :title="$t('buttons.edit')" closable @close="isShow = false">
      <NForm
        ref="formRef"
        label-placement="left"
        label-width="110"
        label-align="left"
        require-mark-placement="left"
        :model="formData"
        :disabled="state.isPending"
        @submit.prevent="onSubmit"
      >
        <div v-for="(item, index) in formData" :key="index" class="mb-2">
          <div class="flex justify-between items-center gap-2">
            <span class="w-[200px]">
              {{ item.name }}
            </span>
            <NInputNumber v-model:value="item.sort" min="0" />
          </div>
        </div>

        <div class="flex justify-end">
          <NButton
            :loading="state.isPending"
            :disabled="state.isPending"
            type="primary"
            attr-type="submit"
          >
            {{ $t('buttons.edit') }}
          </NButton>
        </div>
      </NForm>
    </NCard>
  </NSpace>
</template>
