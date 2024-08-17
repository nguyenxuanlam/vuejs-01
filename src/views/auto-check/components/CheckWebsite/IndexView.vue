<script setup lang="ts">
/* ----- Import Type ----- */

/* ----- Import Variables ----- */
import DataTable from './components/DataTable.vue'
import { useAutoCheckDomainStore } from './stores/autoCheckDomainStore'
import { useAutoCheckStore } from '../../stores/autoCheckStore'
import { NSpin } from 'naive-ui'
import { useClipboard } from '@vueuse/core'
import { apiCopy } from '@api/copy'

/* ----- Import Components ----- */

/* ----- Global variables ----- */

//#region ----- Element Ref -----
//#endregion ----- Element Ref -----

//#region ----- Stores -----
const store = useAutoCheckDomainStore()
const autoCheckStore = useAutoCheckStore()
//#endregion ----- Stores -----

//#region ----- State -----
//#endregion ----- State -----

//#region ----- Composables -----
const $dialog = useDialog()
const { copy } = useClipboard({
  copiedDuring: 1000
})
const $message = useMessage()
//#endregion ----- Composables -----

//#region ----- Variables -----
//#endregion ----- Variables -----

//#region ----- Functions -----
async function fetchData(isReload = false) {
  try {
    if (store.isDoneAll) return
    if (isReload) {
      store.state.isFetching = true
    }
    await store.fetchData()
  } catch (error) {
    console.error(error)
  }
}

async function onCopyToClipboard() {
  store.state.isFetchingCopy = true

  try {
    const res = await apiCopy.getDataCheck({
      checked_at: autoCheckStore.urlParams.date,
      type: 'auto'
    })
    if (res?.data?.data) {
      await copy(res?.data?.data)
      $message.success('Copy thành công')
    }
  } catch (error) {
    $message.error('Không có dữ liệu để copy')
  }

  store.state.isFetchingCopy = false
}

async function onExport() {
  const dialog = $dialog.warning({
    title: 'Đang xuất dữ liệu',
    content: () =>
      h('div', { class: 'flex items-center justify-center' }, h(NSpin, { class: 'w-10 h-10' })),
    closable: false,
    closeOnEsc: false,
    maskClosable: false
  })

  try {
    const res = await apiExport.autoCheckHistoryDomainCheck({
      checked_at: autoCheckStore.urlParams.date,
      type: 'auto'
    })
    if (res?.data) {
      useDownload(res.data, 'Check website.xlsx')
    }
  } catch (error) {
    const { showMessageError } = useHelper()
    showMessageError(error)
  }
  dialog.destroy()
}
//#endregion ----- Functions -----

//#region ----- Hooks -----
onUnmounted(() => {
  store.$reset()
})

defineExpose({
  fetchData
})
//#endregion ----- Hooks -----
</script>

<template>
  <div class="mt-5">
    <div class="flex items-center gap-x-2">
      <h2 class="font-semibold text-body-medium text-primary-dark capitalize">
        Kết quả kiểm tra Website
      </h2>
      <NTooltip trigger="hover" :keep-alive-on-hover="false">
        <template #trigger>
          <Icon icon="healthicons:info" size="16" class="text-xl text-warning outline-none" />
        </template>
        Trạng thái tiến trình và kết quả kiểm tra website
      </NTooltip>
    </div>

    <div class="flex gap-4 items-center justify-between mt-4">
      <CProgress class="my-3" :percent="store.getProgressWebsite" />
    </div>

    <div class="mt-5">
      <div class="flex gap-2 justify-end mb-3">
        <div class="flex gap-x-2">
          <NTooltip trigger="hover" :keep-alive-on-hover="false">
            <template #trigger>
              <NButton
                v-if="!store.state.isFetchingCopy"
                secondary
                type="primary"
                size="small"
                :disabled="!store.listData.length"
                @click="onCopyToClipboard"
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
                :disabled="!store.listData.length"
                @click="onExport"
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
        :is-fetching="store.state.isFetching"
        :data="store.listData"
        @change-page="store.onChangePage"
        @change-page-size="store.onChangePageSize"
      />
    </div>
  </div>
</template>
