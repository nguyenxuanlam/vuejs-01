<script setup lang="ts">
/* ----- Import Type ----- */

/* ----- Import Variables ----- */
import { useReportStore } from './stores/reportStore'

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
const reportStore = useReportStore()
reportStore.resetUrlParams()
//#endregion ----- Composables -----

//#region ----- Variables -----

//#endregion ----- Variables -----

//#region ----- Functions -----
const onChangeFilter = useDebounceFn(() => {
  reportStore.onChangeFilter()
}, 500)

function handleResetMultiple() {
  const dialog = window.$dialog.warning({
    title: 'Xác nhận reset dữ liệu',
    content: `Dữ liệu sẽ được đếm lại từ đầu, bạn chắc chắn muốn reset ${reportStore.checkedRowIds.length} dữ liệu đã chọn?`,
    positiveText: 'Reset',
    negativeText: 'Hủy',
    onPositiveClick: async () => {
      dialog.loading = true
      dialog.closable = false
      dialog.closeOnEsc = false
      await reportStore.resetMultipleReports()
      dialog.loading = false
    }
  })
}
//#endregion ----- Functions -----

//#region ----- Hooks -----
onBeforeMount(async () => {
  await reportStore.fetchServers()
})
// fetchData()
onUnmounted(() => {
  reportStore.$reset()
})
//#endregion ----- Hooks -----
</script>

<template>
  <div>
    <PageHeader title="Report" tooltip="Quản lý report" />

    <div class="mt-5">
      <div class="flex items-center justify-between">
        <div class="text-xl font-semibold">Danh sách report</div>
        <div class="flex gap-2">
          <NButton type="primary" @click="reportStore.fetchData()">
            <template #icon>
              <Icon icon="ic:refresh" />
            </template>
            Tải lại dữ liệu
          </NButton>
          <NButton
            :disabled="!reportStore.checkedRowIds.length"
            :loading="reportStore.state.isFetching && reportStore.checkedRowIds.length > 0"
            type="warning"
            @click="handleResetMultiple"
          >
            <template #icon>
              <Icon icon="system-uicons:reset-hard" />
            </template>
            Reset data
          </NButton>
        </div>
      </div>
      <PageBlock class="mt-5">
        <div class="flex justify-between mb-2">
          <!-- Left -->
          <div class="flex gap-x-4">
            <div class="w-[250px]">
              <div class="font-medium">Thời gian</div>
              <NDatePicker
                v-model:formatted-value="reportStore.urlParams.date"
                value-format="yyyy-MM-dd"
                type="date"
                update-value-on-close
                @update:value="onChangeFilter"
              />
            </div>
            <div class="w-[220px]">
              <div class="font-medium whitespace-nowrap">Loại</div>
              <NSelect
                v-model:value="reportStore.urlParams.type"
                :options="reportStore.typeOptions"
                @update:value="onChangeFilter"
              />
            </div>
          </div>
          <!-- Right -->
          <div class="w-[230px] flex flex-col gap-x-2">
            <div class="font-medium">Loại Server</div>
            <NSelect
              v-model:value="reportStore.urlParams.server_type"
              :options="reportStore.serverTypeOptions"
              :disabled="reportStore.state.isFetching"
              @update:value="reportStore.fetchServers"
            />
          </div>
        </div>

        <DataTable :is-fetching="reportStore.state.isFetching" :data="reportStore.listData" />
      </PageBlock>

      <!-- Modals -->
    </div>
  </div>
</template>
