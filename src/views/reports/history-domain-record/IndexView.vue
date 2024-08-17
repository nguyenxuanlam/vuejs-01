<script setup lang="ts">
/* ----- Import Type ----- */
import { HistoryDomain, User } from '@/types'
/* ----- Import Variables ----- */
import { useDomainRecordStore } from './stores/domainRecordStore'

/* ----- Import Components ----- */
import DataTable from './components/DataTable.vue'
import HistoryRecordedModal from './components/HistoryRecordedModal.vue'
import { NSpin } from 'naive-ui'
import { useDownload } from '@/composables/utils'

/* ----- Global variables ----- */

//#region ----- Element Ref -----
//#endregion ----- Element Ref -----

//#region ----- Stores -----
//#endregion ----- Stores -----

//#region ----- State -----
//#endregion ----- State -----

//#region ----- Composables -----
const domainRecordStore = useDomainRecordStore()
domainRecordStore.resetUrlParams()
const dialog = useDialog()
//#endregion ----- Composables -----

//#region ----- Variables -----
const isFetching = ref(false)
//#endregion ----- Variables -----

//#region ----- Functions -----
async function fetchData() {
  isFetching.value = true
  await domainRecordStore.fetchData()
  isFetching.value = false
}
const onChangeFilter = useDebounceFn(() => {
  domainRecordStore.onChangePage(1)
}, 500)

const onRetryAll = () => {
  const dialog = window.$dialog.warning({
    title: 'Xác nhận chạy lại',
    content: `Bạn có chắc chắn muốn chạy lại tất cả?`,
    positiveText: 'Run',
    negativeText: 'Hủy',
    onPositiveClick: async () => {
      dialog.loading = true
      await domainRecordStore.runRetry({ checked_at: domainRecordStore.urlParams.checked_at })
      await domainRecordStore.fetchData()
      dialog.loading = false
    }
  })
}

async function onExport() {
  dialog.warning({
    title: 'Đang xuất dữ liệu',
    content: () =>
      h('div', { class: 'flex items-center justify-center' }, h(NSpin, { class: 'w-10 h-10' })),
    negativeText: 'Hủy'
  })

  try {
    const res = await apiHistoryDomain.export.record({
      checked_at: domainRecordStore.urlParams.checked_at
    })
    if (res.data) {
      useDownload(res.data, 'History domain record.xlsx')
    }
  } catch (error) {
    const { showMessageError } = useHelper()
    showMessageError(error)
  } finally {
    dialog.destroyAll()
  }
}
//#endregion ----- Functions -----

//#region ----- Hooks -----
var fetchDataInterval: number | null = null
onBeforeMount(() => {
  domainRecordStore.fetchData()
  fetchDataInterval = setInterval(() => {
    if (isFetching.value) return
    const totalDone =
      domainRecordStore.listData?.data?.filter((item) => item.is_record && item.recorded_at)
        .length ?? 0
    if (totalDone === (domainRecordStore.listData?.data.length ?? 0)) {
      return
    }
    fetchData()
  }, 10000)
})
onUnmounted(() => {
  domainRecordStore.$reset()
  if (fetchDataInterval) {
    clearInterval(fetchDataInterval)
  }
})
//#endregion ----- Hooks -----
</script>

<template>
  <div>
    <PageHeader title="Lịch sử quay chụp" tooltip="Quản lý domain record" />

    <div class="mt-5">
      <div class="flex items-center justify-between">
        <div class="text-xl font-semibold">Danh sách domain record</div>

        <div
          v-if="useCheckRoles([User.Role.Admin, User.Role.Editor])"
          class="flex items-center gap-x-2"
        >
          <NButton type="primary" @click="onRetryAll()">
            <Icon icon="mdi:play" />Retry all
          </NButton>
          <NButton type="info" @click="onExport">
            <Icon icon="teenyicons:csv-solid" class="mr-2" />
            Export
          </NButton>
        </div>
      </div>

      <PageBlock class="mt-5">
        <!-- Filter -->
        <div class="mb-5 flex items-center gap-x-4">
          <div class="w-[280]">
            <div class="font-medium">Tên miền</div>
            <NInput
              v-model:value="domainRecordStore.urlParams.domain_name"
              placeholder="Tìm kiếm..."
              clearable
              @input="onChangeFilter"
            />
          </div>
          <div class="w-[250px]">
            <div class="font-medium">Ngày check</div>
            <NDatePicker
              v-model:formatted-value="domainRecordStore.urlParams.checked_at"
              value-format="yyyy-MM-dd"
              type="date"
              update-value-on-close
              @update:value="onChangeFilter"
            />
          </div>
          <div class="w-[220px]">
            <div class="font-medium whitespace-nowrap">Loại</div>
            <NSelect
              v-model:value="domainRecordStore.urlParams.type"
              :options="domainRecordStore.typeOptions"
              @update:value="onChangeFilter"
            />
          </div>
          <div class="w-[250px]">
            <div class="font-medium">Ngày tạo</div>
            <NDatePicker
              v-model:formatted-value="domainRecordStore.urlParams.created_at"
              value-format="yyyy-MM-dd"
              type="date"
              clearable
              update-value-on-close
              @update:value="onChangeFilter"
            />
          </div>
        </div>
        <DataTable
          :is-fetching="domainRecordStore.state.isFetching"
          :data="domainRecordStore.listData"
          @change-page="domainRecordStore.onChangePage"
          @change-page-size="domainRecordStore.onChangePageSize"
        />
      </PageBlock>
    </div>
    <NModal
      v-model:show="domainRecordStore.stateModal.isShowHistoryRecordedModal"
      :style="{ width: '85%' }"
    >
      <HistoryRecordedModal
        v-model:show="domainRecordStore.stateModal.isShowHistoryRecordedModal"
        :data="domainRecordStore.listHistoryRecorded"
        :is-fetching="domainRecordStore.state.isFetchingHistoryRecorded"
        @change-page="domainRecordStore.onChangeHistoryRecordedPage"
        @change-page-size="domainRecordStore.onChangeHistoryRecordedPageSize"
      />
    </NModal>
  </div>
</template>
