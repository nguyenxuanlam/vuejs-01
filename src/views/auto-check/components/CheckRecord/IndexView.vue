<script setup lang="ts">
/* ----- Import Type ----- */
import { HistoryDomain } from '@/types'

/* ----- Import Variables ----- */
import { useClipboard } from '@vueuse/core'
import useTableResult from './composables/useTableResult'
import { useAutoCheckStore } from '../../stores/autoCheckStore'
import { apiCopy } from '@api/copy'

/* ----- Import Components ----- */
import DataTable from './components/DataTable.vue'
import { NSpin } from 'naive-ui'

/* ----- Global variables ----- */
//#region ----- Element Ref -----
//#endregion ----- Element Ref -----

//#region ----- Stores -----
const autoCheckStore = useAutoCheckStore()
//#endregion ----- Stores -----

//#region ----- State -----
const state = reactive({
  isFetchingFoundCopy: false,
  isFetchingNotFoundCopy: false,
  isFetchingUnknownCopy: false
})
//#endregion ----- State -----

//#region ----- Composables -----
const { urlParams } = useAutoCheckStore()
const { copy, copied } = useClipboard({
  copiedDuring: 1000
})
const $dialog = useDialog()
const $message = useMessage()
const { showMessageError } = useHelper()

const tableUnknown = useTableResult(
  autoCheckStore.urlParams,
  HistoryDomain.CheckKeywordStatus.Unknown
)
const tableNotFound = useTableResult(
  autoCheckStore.urlParams,
  HistoryDomain.CheckKeywordStatus.NotFound
)
const tableFound = useTableResult(autoCheckStore.urlParams, HistoryDomain.CheckKeywordStatus.Found)
//#endregion ----- Composables -----

//#region ----- Variables -----
const listData = computed(() => [
  {
    label: 'Chứa từ khóa',
    tooltip: 'Kết quả kiểm tra các tên miền có chứa từ khóa',
    statusProcess: HistoryDomain.CheckKeywordStatus.Found,
    data: tableFound
  },
  {
    label: 'Không chứa từ khóa',
    tooltip: 'Kết quả kiểm tra các tên miền không chứa từ khóa',
    statusProcess: HistoryDomain.CheckKeywordStatus.NotFound,
    data: tableNotFound
  },
  {
    label: 'Đánh giá thủ công',
    tooltip: 'Danh sách các tên miền cần kiểm tra thủ công',
    statusProcess: HistoryDomain.CheckKeywordStatus.Unknown,
    data: tableUnknown
  }
])

const getProgressingRecord = computed(
  () => Number(autoCheckStore.progress?.record.processingRecorded.toFixed(0)) || 0
)
//#endregion ----- Variables -----

//#region ----- Functions -----
async function fetchData(isReload: boolean = false) {
  try {
    if (isReload) {
      tableFound.state.isFetching = true
      tableNotFound.state.isFetching = true
      tableUnknown.state.isFetching = true
    }
    await Promise.all([tableFound.fetchData(), tableNotFound.fetchData(), tableUnknown.fetchData()])
  } catch (error: any) {
    showMessageError(error)
  }
}

async function onCopyToClipboard(status: HistoryDomain.CheckKeywordStatus) {
  if (status === HistoryDomain.CheckKeywordStatus.Found) {
    tableFound.state.isFetchingFoundCopy = true
  } else if (status === HistoryDomain.CheckKeywordStatus.NotFound) {
    tableNotFound.state.isFetchingNotFoundCopy = true
  } else {
    tableUnknown.state.isFetchingUnknownCopy = true
  }

  try {
    const res = await apiCopy.getDataRecord({
      check_keyword_status: status,
      recorded_at: urlParams.date
    })
    if (res?.data?.data) {
      await copy(res?.data?.data)
      $message.success('Copy thành công')
    }
  } catch (error) {
    $message.error('Không có dữ liệu để copy')
  }

  if (status === HistoryDomain.CheckKeywordStatus.Found) {
    tableFound.state.isFetchingFoundCopy = false
  } else if (status === HistoryDomain.CheckKeywordStatus.NotFound) {
    tableNotFound.state.isFetchingNotFoundCopy = false
  } else {
    tableUnknown.state.isFetchingUnknownCopy = false
  }
}

async function onExport(type: HistoryDomain.CheckKeywordStatus) {
  const dialog = $dialog.warning({
    title: 'Đang xuất dữ liệu',
    content: () =>
      h('div', { class: 'flex items-center justify-center' }, h(NSpin, { class: 'w-10 h-10' })),
    closable: false,
    closeOnEsc: false,
    maskClosable: false
  })

  try {
    const res = await apiExport.autoCheckHistoryDomainRecord({
      recorded_at: urlParams.date,
      check_keyword_status: type
    })
    if (res?.data) {
      switch (type) {
        case HistoryDomain.CheckKeywordStatus.Found:
          useDownload(res.data, 'Record domain - Chứa từ khóa.xlsx')
          break
        case HistoryDomain.CheckKeywordStatus.NotFound:
          useDownload(res.data, 'Record domain - Không chứa từ khóa.xlsx')
          break
        case HistoryDomain.CheckKeywordStatus.Unknown:
          useDownload(res.data, 'Record domain - Đánh giá thủ công.xlsx')
          break
      }
    }
  } catch (error) {
    const { showMessageError } = useHelper()
    showMessageError(error)
  }
  dialog.destroy()
}
//#endregion ----- Functions -----

//#region ----- Hooks -----
defineExpose({
  fetchData
})
//#endregion ----- Hooks -----
</script>

<template>
  <div class="mt-5">
    <div class="flex items-center gap-x-2">
      <h1 class="font-semibold text-body-medium text-primary-dark capitalize">
        Kết quả kiểm tra quay chụp
      </h1>
      <NTooltip trigger="hover" :keep-alive-on-hover="false">
        <template #trigger>
          <Icon icon="healthicons:info" size="16" class="text-xl text-warning outline-none" />
        </template>
        Trạng thái tiến trình và kết quả kiểm tra quay chụp
      </NTooltip>
    </div>

    <div class="flex gap-4 items-center justify-between mt-4">
      <CProgress class="my-3" :percent="getProgressingRecord" />
    </div>

    <div class="grid lg:grid-cols-3 md:grid-cols-1 gap-5 mt-4">
      <div v-for="(item, index) in listData" :key="index">
        <div class="flex justify-between mb-3">
          <PageHeader :title="item.label" :tooltip="item.tooltip" size="small" />

          <div class="flex items-center gap-x-2">
            <NTooltip trigger="hover" :keep-alive-on-hover="false">
              <template #trigger>
                <NButton
                  v-if="
                    (item.statusProcess === HistoryDomain.CheckKeywordStatus.Found &&
                      !tableFound.state.isFetchingFoundCopy) ||
                    (item.statusProcess === HistoryDomain.CheckKeywordStatus.NotFound &&
                      !tableNotFound.state.isFetchingNotFoundCopy) ||
                    (item.statusProcess === HistoryDomain.CheckKeywordStatus.Unknown &&
                      !tableUnknown.state.isFetchingUnknownCopy)
                  "
                  secondary
                  type="primary"
                  size="small"
                  :disabled="!item.data.listData.value.length"
                  @click="onCopyToClipboard(item.statusProcess)"
                >
                  <template #icon>
                    <CIcon icon="icon-copy" />
                  </template>
                </NButton>
                <NSpin v-else size="small" />
              </template>
              Copy kết quả
            </NTooltip>
            <NTooltip trigger="hover" :keep-alive-on-hover="false">
              <template #trigger>
                <NButton
                  type="primary"
                  size="small"
                  :disabled="!item.data.listData.value.length"
                  @click="onExport(item.statusProcess)"
                >
                  <template #icon>
                    <CIcon icon="icon-download" />
                  </template>
                </NButton>
              </template>
              Xuất file kết quả
            </NTooltip>
          </div>
        </div>

        <DataTable
          :is-fetching="item.data.state.isFetching"
          :data="item.data.listData.value"
          :pagination="item.data.pagination"
          @change-page="item.data.onChangePage"
          @change-page-size="item.data.onChangePageSize"
        />
      </div>
    </div>
  </div>
</template>
