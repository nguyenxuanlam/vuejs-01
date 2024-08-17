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
const { ensureHttp } = useEnsureHttp()
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
        formData.link = ensureHttp(formData.link)
        const res = await apiDomains.update(props.id, formData)
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
    const res = await apiDomains.getDetail(props.id)
    const resData = res.data.data
    // formData.name = resData.name
    formData.link = resData.link
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
        label-width="120"
        label-align="left"
        require-mark-placement="left"
        :model="formData"
        :rules="rules"
        :disabled="state.isFetching"
        @submit.prevent="onSubmit"
      >
        <!-- <NFormItem path="name" label="Tên miền">
          <NInput v-model:value="formData.name" />
        </NFormItem> -->
        <NFormItem path="link" label="Tên đường dẫn">
          <NInput v-model:value="formData.link" />
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
