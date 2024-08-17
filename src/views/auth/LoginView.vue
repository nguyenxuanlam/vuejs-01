<script setup lang="ts">
/* ----- Import Type ----- */
import { useDark } from '@vueuse/core'
import type { FormInst, FormRules } from 'naive-ui'

/* ----- Import Variables ----- */

/* ----- Import Components ----- */

/* ----- Global variables ----- */
const router = useRouter()

//#region ----- Element Ref -----
const formRef = ref<FormInst | null>(null)
//#endregion ----- Element Ref -----

//#region ----- Stores -----
const authStore = useAuthStore()
const appStore = useAppStore()

// TODO: Tạm ẩn đa ngôn ngữ nên set cứng tiếng Việt
appStore.setLocale('vi-VN')
//#endregion ----- Stores -----

//#region ----- State -----
const state = reactive({
  isFetching: true,
  isPending: false,
  isError404: false
})

const isDark = useDark()
const _isDark = ref(isDark.value)
const toggleDarkMode = async () => {
  isDark.value = !isDark.value
  nextTick(() => {
    _isDark.value = isDark.value
  })
}
//#endregion ----- State -----

//#region ----- Composables -----
const { getCatchMsg } = useHelper()
//#endregion ----- Composables -----

//#region ----- Variables -----
const errorMessage = ref('')

const formData = reactive({
  email: '',
  password: ''
})

const rules: FormRules = {
  email: [
    {
      required: true,
      renderMessage: () => $t('rules.required', { field: 'Username/Email' }),
      trigger: ['blur', 'input']
    }
    // {
    //   type: 'email',
    //   renderMessage: () => $t('rules.email'),
    //   trigger: ['blur', 'input']
    // }
  ],
  password: [
    {
      required: true,
      renderMessage: () => $t('rules.required', { field: $t('auth.password') }),
      trigger: ['blur', 'input']
    }
  ]
}
//#endregion ----- Variables -----

//#region ----- Functions -----
async function onSubmit() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      state.isPending = true
      try {
        await authStore.login(formData)
        appStore.isLoadingWebsite = true
        router.push({
          name: RouteName.index
        })
      } catch (error: any) {
        errorMessage.value = getCatchMsg(error)
      }
      state.isPending = false
    }
  })
}
//#endregion ----- Functions -----

//#region ----- Hooks -----
onMounted(() => {
  nextTick(() => {
    appStore.isLoadingWebsite = false
  })
})
//#endregion ----- Hooks -----
</script>

<template>
  <div
    class="bg-gray-200 dark:bg-gray-950 w-screen h-screen flex justify-center items-center bg-no-repeat bg-cover bg-right-top"
  >
    <div class="fixed top-3 right-4">
      <NSwitch :value="_isDark" @update:value="toggleDarkMode">
        <template #unchecked-icon>
          <Icon icon="ic:outline-light-mode" />
        </template>
        <template #checked-icon>
          <Icon icon="ic:outline-dark-mode" />
        </template>
      </NSwitch>
    </div>
    <div class="w-[520px] p-[60px] rounded-tr-[30px] rounded-bl-[30px] bg-white dark:bg-gray-900">
      <div class="mb-10">
        <img class="mx-auto w-36" src="@/assets/images/logo.svg" alt="" />
      </div>
      <NForm
        ref="formRef"
        label-width="auto"
        label-placement="left"
        require-mark-placement="right-hanging"
        :model="formData"
        :rules="rules"
        @submit.prevent="onSubmit"
      >
        <NFormItem path="email">
          <NInput
            v-model:value="formData.email"
            placeholder="Username/Email"
            size="large"
            @input="errorMessage = ''"
          />
        </NFormItem>
        <NFormItem path="password">
          <NInput
            v-model:value="formData.password"
            :placeholder="$t('auth.password')"
            type="password"
            size="large"
            show-password-on="click"
            :input-props="{
              autocomplete: 'on'
            }"
            @input="errorMessage = ''"
          />
        </NFormItem>
        <div v-if="errorMessage" class="text-danger font-medium text-sm mb-2">
          {{ errorMessage }}
        </div>
        <NButton
          class="!mt-4"
          type="primary"
          attr-type="submit"
          :loading="state.isPending"
          :disabled="state.isPending"
          :block="true"
        >
          {{ $t('auth.signin') }}
        </NButton>
        <!-- TODO: Tạm ẩn đa ngôn ngữ -->
        <!-- <div class="text-end mt-4">
          <NDropdown :options="appStore.localeOptions" @select="appStore.setLocale">
            <NButton>
              <template #icon>
                <component :is="appStore.localeCurrent?.icon" />
              </template>
              {{ appStore.localeCurrent?.label }}
            </NButton>
          </NDropdown>
        </div> -->
      </NForm>
    </div>
  </div>
</template>
