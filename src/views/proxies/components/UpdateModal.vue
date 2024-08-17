<script setup lang="ts">
/* ----- Import Type ----- */
import type { FormInst } from 'naive-ui'

/* ----- Import Variables ----- */

/* ----- Import Components ----- */
import useFormData from '../composables/useFormData'
import { useProxyStore } from '@/views/proxies/stores/proxyStore'

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
const proxyStore = useProxyStore()
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
      state.isPending = true
      try {
        const res = await apiProxies.update(props.id, formData)
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
    const res = await apiProxies.getDetail(props.id)
    const resData = res.data.data
    formData.proxy_name = resData.proxy_name
    formData.provider_id = resData.provider_id
    formData.host = resData.host
    formData.port = resData.port
    formData.is_active = resData.is_active
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
        label-width="124"
        label-align="left"
        require-mark-placement="left"
        :model="formData"
        :rules="rules"
        :disabled="state.isFetching"
        @submit.prevent="onSubmit"
      >
        <NFormItem path="proxy_name" label="Tên Proxy">
          <NInput v-model:value="formData.proxy_name" />
        </NFormItem>
        <NFormItem path="provider_id" label="Nhà cung cấp">
          <NSelect
            v-model:value="formData.provider_id"
            :options="proxyStore.listProviders"
            clearable
          />
        </NFormItem>
        <NFormItem path="host" label="Host">
          <NInput v-model:value="formData.host" />
        </NFormItem>
        <NFormItem path="port" label="Port">
          <NInput v-model:value="formData.port" />
        </NFormItem>
        <NFormItem path="is_active" label="Trạng thái">
          <NSelect
            v-model:value="formData.is_active"
            :options="proxyStore.statusOptions"
            clearable
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
