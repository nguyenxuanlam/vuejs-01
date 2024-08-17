<script setup lang="ts">
/* ----- Import Type ----- */

/* ----- Import Variables ----- */

/* ----- Import Components ----- */

/* ----- Global variables ----- */

//#region ----- Element Ref -----
//#endregion ----- Element Ref -----

//#region ----- Stores -----
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
  <div>
    <PageHeader title="Kiểm tra thủ công" tooltip="Quản lý kiểm tra thủ công" />

    <div class="mx-auto w-fit bg-[#EDE9F3] rounded-[48px] p-1 my-[20px]">
      <div class="flex gap-x-[20px] mx-auto">
        <RouterLink
          :to="{ name: RouteName.manual_check.check_domain }"
          class="tab-item !pb-[1px]"
          active-class="active"
        >
          <div>Kiểm tra tên miền</div>
        </RouterLink>
        <RouterLink
          :to="{ name: RouteName.manual_check.record_domain }"
          class="tab-item !pb-[1px]"
          active-class="active"
        >
          <div>Lọc và quay chụp</div>
        </RouterLink>
      </div>
    </div>

    <div>
      <RouterView v-slot="{ Component, route }">
        <Transition name="fade-transform" mode="out-in" appear>
          <component :is="Component" :key="route.name" class="flex-1" />
        </Transition>
      </RouterView>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tab-item {
  background-color: transparent;
  color: black;
  border-radius: 15px;
  transition: all 0.3s;

  div {
    font-size: 14px;
    line-height: 13px;
    padding: 8px 16px;
  }

  &.active {
    background-color: #241143;
    text-shadow: #000 0 0 4px;
    color: white;
  }
}
</style>
