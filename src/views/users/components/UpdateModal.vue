<script setup lang="ts">
/* ----- Import Type ----- */
import type { User } from '@/types'
import type { FormInst } from 'naive-ui'

/* ----- Import Variables ----- */
import { merge as _merge, pick as _pick } from 'lodash'

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
const { formEditData: formData, rules, roleOptions } = useFormData()
const $message = useMessage()
const { showMessageError } = useHelper()
//#endregion ----- Composables -----

//#region ----- Variables -----
const dataDetail = ref<User.Item | null>(null)
//#endregion ----- Variables -----

//#region ----- Functions -----
async function onSubmit() {
  formRef.value?.validate(async (errors) => {
    if (!props.id) return

    if (!errors) {
      state.isPending = true
      try {
        const res = await apiUsers.update(props.id, formData)
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
    const res = await apiUsers.getDetail(props.id)
    dataDetail.value = res.data.data
    _merge(formData, _pick(dataDetail.value, ['name', 'email', 'username', 'is_active']))
    formData.role = dataDetail.value.role[0]
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
        <NFormItem path="name" :label="$t('pages.users.table.name')">
          <NInput v-model:value="formData.name" />
        </NFormItem>
        <NFormItem path="email" :label="$t('auth.email')">
          <NInput v-model:value="formData.email" />
        </NFormItem>
        <NFormItem path="username" :label="$t('pages.users.table.username')">
          <NInput v-model:value="formData.username" />
        </NFormItem>
        <NFormItem path="role" :label="$t('pages.users.table.role')">
          <NSelect v-model:value="formData.role" :options="roleOptions" />
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
