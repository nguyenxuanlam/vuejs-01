<script setup lang="ts">
/* ----- Import Type ----- */

/* ----- Import Variables ----- */
import { menuOptions } from '@/data/sidebarMenu'

/* ----- Import Components ----- */

/* ----- Global variables ----- */
// const route = useRoute()

//#region ----- Element Ref -----
//#endregion ----- Element Ref -----

//#region ----- Stores -----
const appStore = useAppStore()
//#endregion ----- Stores -----

//#region ----- State -----
//#endregion ----- State -----

//#region ----- Composables -----
//#endregion ----- Composables -----

//#region ----- Variables -----
//#endregion ----- Variables -----

//#region ----- Functions -----
//#endregion ----- Functions -----

//#region ----- Hooks -----
//#endregion ----- Hooks -----
</script>

<template>
  <NLayoutSider
    bordered
    collapse-mode="width"
    :collapsed="appStore.sideBarCollapsed"
    :collapsed-width="64"
    :width="260"
  >
    <div
      class="h-[60px] flex items-center justify-center border-b border-[#ffffff4d] transition-all"
      :class="{
        'px-3': appStore.sideBarCollapsed
      }"
    >
      <RouterLink to="/">
        <img src="@/assets/images/logo.svg" alt="" />
      </RouterLink>
    </div>
    <NScrollbar style="height: calc(100% - 60px); padding-top: 8px">
      <NMenu
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
        :default-expand-all="false"
        :value="appStore.getBreadcrumbRoot?.routeName"
      />
    </NScrollbar>
  </NLayoutSider>
</template>
