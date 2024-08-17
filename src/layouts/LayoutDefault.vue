<script setup lang="ts">
/* ----- Import Type ----- */
import type { LayoutInst } from 'naive-ui'

/* ----- Import Variables ----- */

/* ----- Import Components ----- */
import SideBar from './components/SidebarMenu.vue'
import HeaderBar from './components/HeaderBar.vue'

/* ----- Global variables ----- */
const route = useRoute()

watch(
  () => route.path,
  () => {
    layoutContentRef?.value?.scrollTo(0, 0)
  }
)

//#region ----- Element Ref -----
const layoutContentRef = ref<LayoutInst | null>(null)
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
onMounted(() => {
  nextTick(() => {
    appStore.isLoadingWebsite = false
  })
})

onBeforeUnmount(() => {
  appStore.isLoadingWebsite = true
})
//#endregion ----- Hooks -----
</script>

<template>
  <NLayout has-sider class="h-screen">
    <!-- Side bar -->
    <SideBar />

    <NLayout>
      <!-- navbar -->
      <HeaderBar class="sticky top-0 z-10" />

      <NLayoutContent
        ref="layoutContentRef"
        position="absolute"
        :native-scrollbar="false"
        :scrollbar-props="{}"
      >
        <div class="max-w-[1450px] mx-auto p-5">
          <RouterView v-slot="{ Component }">
            <Transition name="fade-transform" mode="out-in" appear>
              <component :is="Component" class="flex-1" />
            </Transition>
          </RouterView>
        </div>
      </NLayoutContent>
    </NLayout>
  </NLayout>
</template>

<style lang="scss">
:root {
  --header-height: 60px;
}

@media (max-width: 1360px) {
  :root {
    --header-height: 100px;
  }
}

.n-layout-header {
  height: var(--header-height);
}

.n-layout-content {
  top: var(--header-height) !important;
}

body {
  overflow: hidden;
}
</style>
