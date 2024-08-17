<script setup lang="ts">
/* ----- Import Type ----- */
import type { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface'

/* ----- Import Variables ----- */

/* ----- Import Components ----- */
import { Icon } from '@iconify/vue'
import ProfileUser from '@/layouts/components/header-bar/ProfileUser.vue'
import ChangePassword from '@/layouts/components/header-bar/ChangePassword.vue'
import { useDark } from '@vueuse/core'
import ProviderList from '@/layouts/components/header-bar/ProviderList.vue'

/* ----- Global variables ----- */

//#region ----- Element Ref -----
const isShowModal = reactive({
  profile: false,
  change_password: false
})
//#endregion ----- Element Ref -----

//#region ----- Stores -----
const authStore = useAuthStore()
const appStore = useAppStore()

// TODO: Tạm ẩn đa ngôn ngữ nên set cứng tiếng Việt
appStore.setLocale('vi-VN')
//#endregion ----- Stores -----

//#region ----- State -----
const isDark = useDark()
isDark.value = false
// const _isDark = ref(isDark.value)
// const toggleDarkMode = async () => {
//   isDark.value = !isDark.value
//   nextTick(() => {
//     _isDark.value = isDark.value
//   })
// }
//#endregion ----- State -----

//#region ----- Composables -----
const render = useRender()
//#endregion ----- Composables -----

//#region ----- Variables -----
const accountOptions = computed<DropdownMixedOption[]>(() => [
  {
    label: $t('auth.profile'),
    icon: render.renderIcon({ icon: 'flowbite:profile-card-outline' }),
    props: {
      onClick: () => (isShowModal.profile = true)
    }
  },
  {
    label: $t('auth.change_password'),
    icon: render.renderIcon({ icon: 'material-symbols:vpn-key' }),
    props: {
      onClick: () => (isShowModal.change_password = true)
    }
  },
  {
    label: $t('auth.logout'),
    icon: render.renderIcon({ icon: 'material-symbols:logout' }),
    props: {
      onClick: () => {
        authStore.logout()
      }
    }
  }
])
//#endregion ----- Variables -----

//#region ----- Functions -----
//#endregion ----- Functions -----

//#region ----- Hooks -----
//#endregion ----- Hooks -----
</script>

<template>
  <NLayoutHeader bordered class="flex items-center justify-between px-6">
    <!-- Left -->
    <div class="flex items-center gap-x-2">
      <!-- TODO: ẩn breadcrumb -->
      <!-- <NButton
        quaternary
        size="small"
        @click="appStore.sideBarCollapsed = !appStore.sideBarCollapsed"
      >
        <template #icon>
          <Icon v-if="!appStore.sideBarCollapsed" icon="eva:menu-2-outline" />
          <Icon v-else icon="ic:round-close" />
        </template>
      </NButton>
      <BreadcrumbComp /> -->

      <ProviderList />
    </div>
    <!-- Right -->
    <div class="flex items-center gap-x-4">
      <!-- <NSwitch :value="_isDark" @update:value="toggleDarkMode">
        <template #unchecked-icon>
          <Icon icon="ic:outline-light-mode" />
        </template>
        <template #checked-icon>
          <Icon icon="ic:outline-dark-mode" />
        </template>
      </NSwitch> -->

      <!-- TODO: Tạm ẩn đa ngôn ngữ -->
      <!-- <NDropdown :options="appStore.localeOptions" @select="appStore.setLocale">
        <NButton text>
          <template #icon>
            <component :is="appStore.localeCurrent?.icon" />
          </template>
          {{ appStore.localeCurrent?.label }}
        </NButton>
      </NDropdown> -->

      <NDropdown trigger="click" :options="accountOptions" placement="bottom-end">
        <NButton text>
          <NAvatar round :size="32" :src="authStore.profile?.avatar ?? 'empty'" class="mr-2">
            <template #placeholder>
              <div class="flex items-center justify-center w-full h-full">
                <Icon icon="mdi:user" height="20px" />
              </div>
            </template>
            <template #fallback>
              <div class="flex items-center justify-center w-full h-full">
                <Icon icon="mdi:user" height="20px" />
              </div>
            </template>
          </NAvatar>
          <div class="text-start">
            <div class="font-semibold text-[13px] leading-4">{{ authStore.profile?.name }}</div>
            <div class="text-[11px] leading-4">{{ authStore.profile?.email }}</div>
          </div>
        </NButton>
      </NDropdown>

      <NModal v-model:show="isShowModal.profile">
        <ProfileUser v-model:show="isShowModal.profile" :profile="authStore.profile" />
      </NModal>

      <NModal v-model:show="isShowModal.change_password">
        <ChangePassword v-model:show="isShowModal.change_password" />
      </NModal>
    </div>
  </NLayoutHeader>
</template>
