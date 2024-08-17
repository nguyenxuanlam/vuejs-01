<script setup lang="ts">
/* ----- Import Type ----- */

/* ----- Import Variables ----- */
import { useActivityStore } from './stores/activityStore'

/* ----- Import Components ----- */
import DataTable from './components/DataTable.vue'

/* ----- Global variables ----- */

//#region ----- Element Ref -----
//#endregion ----- Element Ref -----

//#region ----- Stores -----
//#endregion ----- Stores -----

//#region ----- State -----
//#endregion ----- State -----

//#region ----- Composables -----
const activityStore = useActivityStore()
activityStore.resetUrlParams()
//#endregion ----- Composables -----

//#region ----- Variables -----
//#endregion ----- Variables -----

//#region ----- Functions -----
const onChangeFilter = useDebounceFn(() => {
  activityStore.onChangePage(1)
}, 500)
//#endregion ----- Functions -----

//#region ----- Hooks -----
onBeforeMount(async () => {
  await Promise.all([activityStore.fetchOptionUsers(), activityStore.fetchData()])
})
onUnmounted(() => {
  activityStore.$reset()
})
//#endregion ----- Hooks -----
</script>

<template>
  <div>
    <PageHeader title="Quản lý hoạt động" tooltip="Xem và quản lý hoạt động" />

    <div class="mt-5">
      <div class="flex items-center justify-between mb-3">
        <div class="text-xl font-semibold">Danh sách hoạt động</div>
      </div>

      <!-- Filter -->
      <div class="mb-2 flex items-center gap-x-4">
        <div class="font-semibold">Lọc theo</div>
        <div class="w-[280px]">
          <NInput
            v-model:value="activityStore.urlParams.description"
            placeholder="Mô tả"
            clearable
            size="small"
            @input="onChangeFilter"
          />
        </div>
        <div class="w-[280px]">
          <NSelect
            v-model:value="activityStore.urlParams.user_id"
            :options="activityStore.userOptions"
            :loading="activityStore.state.isFetchingUsers"
            placeholder="Người thao tác"
            clearable
            size="small"
            @update:value="onChangeFilter"
            @scroll="activityStore.onFetchMoreUsers"
          />
        </div>
        <div class="w-[280px]">
          <NDatePicker
            v-model:formatted-value="activityStore.urlParams.from"
            placeholder="Từ ngày"
            value-format="yyyy-MM-dd"
            type="date"
            clearable
            size="small"
            update-value-on-close
            @update:value="onChangeFilter"
          />
        </div>
        <div class="w-[280px]">
          <NDatePicker
            v-model:formatted-value="activityStore.urlParams.to"
            placeholder="Đến ngày"
            value-format="yyyy-MM-dd"
            type="date"
            clearable
            size="small"
            update-value-on-close
            @update:value="onChangeFilter"
          />
        </div>
      </div>
      <PageBlock>
        <DataTable
          :is-fetching="activityStore.state.isFetching"
          :data="activityStore.listData"
          @change-page="activityStore.onChangePage"
          @change-page-size="activityStore.onChangePageSize"
        />
      </PageBlock>
    </div>
  </div>
</template>
