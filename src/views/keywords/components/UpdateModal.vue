<script setup lang="ts">
/* ----- Import Type ----- */
import type { FormInst } from 'naive-ui'

/* ----- Import Variables ----- */

/* ----- Import Components ----- */
import useFormData from '../composables/useFormData'

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
//#endregion ----- Composables -----

//#region ----- Variables -----
//#endregion ----- Variables -----

//#region ----- Functions -----
async function onSubmit() {
  formRef.value?.validate(async (errors) => {
    if (!props.id) return

    if (!errors) {
      state.isFetching = true
      try {
        const res = await apiKeywords.update(props.id, {
          ...formData
          // tags: formData.tag ? [formData.tag] : []
        })
        $message.success(res.data.message)
        emit('success')
        isShow.value = false
      } catch (error) {
        showMessageError(error)
      }
      state.isFetching = false
    }
  })
}

async function fetchDataDetail() {
  if (!props.id) {
    isShow.value = false
    return
  }
  state.isFetching = true
  const res = await apiKeywords.getDetail(props.id)
  const dataRes = res.data.data
  formData.name = dataRes.name
  formData.is_run_daily = dataRes.is_run_daily ? 'Y' : 'N'
  // formData.tag = dataRes.tags[0]?.name

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
        label-width="124"
        label-align="left"
        require-mark-placement="left"
        :model="formData"
        :rules="rules"
        :disabled="state.isFetching"
        @submit.prevent="onSubmit"
      >
        <NFormItem path="name" :label="$t('pages.keywords.table.name')">
          <NInput v-model:value="formData.name" />
        </NFormItem>

        <NFormItem path="is_run_daily" :label="$t('pages.keywords.table.run_daily')">
          <NSwitch v-model:value="formData.is_run_daily" checked-value="Y" unchecked-value="N" />
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
