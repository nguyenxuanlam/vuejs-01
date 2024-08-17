<script setup lang="ts">
/* ----- Import Type ----- */
import type { FormInst } from 'naive-ui'

/* ----- Import Variables ----- */

/* ----- Import Components ----- */
import useFormData from '../composables/useFormData'
import { useWhitelistStore } from '@/views/whitelist-domains/stores/whitelistStore'

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
const { formEditData: formData, rules } = useFormData()
const $message = useMessage()
const { showMessageError } = useHelper()
const whitelistStore = useWhitelistStore()
//#endregion ----- Composables -----

//#region ----- Variables -----
//#endregion ----- Variables -----

//#region ----- Functions -----
async function onSubmit() {
  formRef.value?.validate(async (errors) => {
    if (!props.id) return

    if (!errors) {
      state.isPending = true
      try {
        const res = await apiWhitelist.update(props.id, {
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

async function fetchDataDetail() {
  if (!props.id) {
    isShow.value = false
    return
  }

  state.isFetching = true
  try {
    const res = await apiWhitelist.getDetail(props.id)
    const resData = res.data.data
    formData.name = resData.name
    formData.tag = resData.tags[0]?.name
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
    <NCard :title="$t('buttons.edit')" closable @close="isShow = false">
      <NForm
        ref="formRef"
        label-placement="left"
        label-width="110"
        label-align="left"
        require-mark-placement="left"
        :model="formData"
        :rules="rules"
        :disabled="state.isFetching"
        @submit.prevent="onSubmit"
      >
        <NFormItem path="name" label="Tên miền">
          <NInput v-model:value="formData.name" />
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
            {{ $t('buttons.edit') }}
          </NButton>
        </div>
      </NForm>
    </NCard>
  </NSpace>
</template>
