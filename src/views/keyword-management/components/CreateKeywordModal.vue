<script setup lang="ts">
/* ----- Import Type ----- */
import { NCheckbox, type FormInst } from 'naive-ui'

/* ----- Import Variables ----- */

/* ----- Import Components ----- */
import useFormData from '../composables/useKeywordFormData'
import { useKeywordManagementStore } from '../stores/keywordManagementStore'
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
const keywordManagementStore = useKeywordManagementStore()
//#endregion ----- Stores -----

//#region ----- State -----
const state = reactive({
  isPending: false,
  isModalVisible: false
})
//#endregion ----- State -----

//#region ----- Composables -----
const { formData, rules } = useFormData()
const { showMessageError } = useHelper()
const $message = useMessage()
//#endregion ----- Composables -----

//#region ----- Variables -----
const names = ref<string>('')
//#endregion ----- Variables -----

//#region ----- Functions -----
async function onSubmit() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      state.isPending = true
      try {
        names.value = formData.names.join('\n')
        await apiKeywords.create({
          ...formData
        })
        emit('success')
        state.isModalVisible = true
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

function onTypeChangeBranch() {
  if (formData.branch_id !== null) {
    formData.group_id = null
    keywordManagementStore.onChangeBranchId(formData.branch_id)
  }
}

function resetFormData() {
  formData.names = []
  formData.branch_id = null
  formData.group_id = null
  formData.is_run_daily = 'Y'
  names.value = ''
}
//#endregion ----- Functions -----

//#region ----- Hooks -----
onBeforeMount(async () => {
  keywordManagementStore.groupsParamsCreate.branch_id = null
  keywordManagementStore.availableTags = []
  keywordManagementStore.availableGroups = []
  keywordManagementStore.tagsParamsCreate.page = 1
  keywordManagementStore.groupsParamsCreate.page = 1
  await keywordManagementStore.fetchTagsOptionsCreate()
  await keywordManagementStore.fetchGroupsOptionsCreate()
})
//#endregion ----- Hooks -----
</script>
<template>
  <NSpace item-style="width: 362px;">
    <NCard v-if="!state.isModalVisible" :title="$t('title.create_modal')">
      <CIcon
        class="icon-close text-2xl text-[#797979]"
        icon="icon-close"
        @click="
          () => {
            isShow = false
            resetFormData()
          }
        "
      />
      <NForm ref="formRef" :model="formData" :rules="rules" @submit.prevent="onSubmit">
        <NFormItem class="label" path="names" :label="$t('pages.keywords.table.keyword')">
          <NInput
            :value="names"
            type="textarea"
            placeholder="Mỗi dòng là 1 từ khóa"
            :rows="2"
            :resizable="false"
            @input="onInputNames"
          />
        </NFormItem>

        <NFormItem path="branch_id" :label="$t('pages.keywords.table.branch')">
          <NSelect
            v-model:value="formData.branch_id"
            :loading="keywordManagementStore.state.isFetchingTagsCreate"
            value-field="value"
            label-field="label"
            :options="keywordManagementStore.availableTags"
            :reset-menu-on-options-change="false"
            placeholder="Nhóm thương hiệu"
            @update:value="onTypeChangeBranch"
            @scroll="keywordManagementStore.onFetchMoreTagsCreate"
          />
        </NFormItem>

        <NFormItem path="group_id" :label="$t('pages.keywords.table.groups')">
          <NSelect
            v-model:value="formData.group_id"
            :loading="keywordManagementStore.state.isFetchingGroupsCreate"
            value-field="value"
            label-field="label"
            :options="keywordManagementStore.availableGroups"
            :reset-menu-on-options-change="false"
            placeholder="Nhóm ngành"
            @scroll="keywordManagementStore.onFetchMoreGroupsCreate"
          />
        </NFormItem>

        <div class="flex justify-between items-center">
          <NCheckbox v-model:checked="formData.is_run_daily" checked-value="Y" unchecked-value="N">
            Chạy hằng ngày
          </NCheckbox>
          <NButton
            :loading="state.isPending"
            :disabled="state.isPending"
            type="primary"
            attr-type="submit"
          >
            {{ $t('buttons.create_modal') }}
          </NButton>
        </div>
      </NForm>
    </NCard>
    <NCard v-if="state.isModalVisible" title="" size="medium">
      <div class="flex justify-center items-center">
        <img src="../../../assets/images/popup_success.svg" alt="Medium Card" />
      </div>
      <div class="w-full">
        <p class="text-center text-2xl font-semibold">Tạo thành công</p>
        <p class="text-center text-sm mt-2 mb-4">
          Từ khóa đã được cập nhật vào danh sách. Để bổ sung thêm, vui lòng chọn
          <strong>"Thêm mới"</strong>
        </p>
      </div>
      <div class="flex items-center justify-center gap-16">
        <NButton
          class="pr-5 pl-5"
          type="primary"
          size="medium"
          ghost
          strong
          @click="
            () => {
              resetFormData()
              isShow = false
            }
          "
        >
          Xác nhận
        </NButton>
        <NButton
          class="px-5"
          type="primary"
          size="medium"
          @click="resetFormData(), (state.isModalVisible = false)"
        >
          Thêm mới
        </NButton>
      </div>
    </NCard>
  </NSpace>
</template>
<style scoped>
.icon-close {
  position: absolute;
  top: 18px;
  right: 10px;
  cursor: pointer;
}
</style>
