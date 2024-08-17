<script setup lang="ts">
/* ----- Import Type ----- */

/* ----- Import Variables ----- */
import DataTable from './components/DataTable.vue'
import ViewDomainModal from './components/ViewDomainModal.vue'
import { useHistoryKeywordStore } from './stores/historyKeywordStore'
import { apiCopy } from '@api/copy'
import { useClipboard } from '@vueuse/core'
import { useAutoCheckStore } from '@/views/auto-check/stores/autoCheckStore'

/* ----- Import Components ----- */

/* ----- Global variables ----- */
//#region ----- Element Ref -----
//#endregion ----- Element Ref -----

//#region ----- Stores -----
const store = useHistoryKeywordStore()
const { urlParams } = useAutoCheckStore()
//#endregion ----- Stores -----

//#region ----- State -----
//#endregion ----- State -----

//#region ----- Composables -----
const { groups, branchs } = storeToRefs(store)
const $message = useMessage()
const { copy, copied } = useClipboard({
  copiedDuring: 1000
})
//#endregion ----- Composables -----

//#region ----- Variables -----
//#endregion ----- Variables -----

//#region ----- Functions -----
function fetchData(isReload = false) {
  try {
    if (isReload) {
      store.state.isFetching = true
    }
    store.fetchData()
  } catch (error) {
    console.error(error)
  }
}

async function onCopyToClipboard() {
  store.state.isFetchingCopy = true

  try {
    const res = await apiCopy.getDataKeyword({
      group_id: store.urlParams.group_id,
      branch_id: store.urlParams.branch_id,
      run_at: urlParams.date
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
//#endregion ----- Functions -----

//#region ----- Hooks -----
onMounted(() => {
  Promise.all([store.fetchGroups(), store.fetchBrands()])
})

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
      <h1 class="font-semibold text-body-medium text-primary-dark capitalize">
        Kết quả kiểm tra từ khoá
      </h1>
      <NTooltip trigger="hover" :keep-alive-on-hover="false">
        <template #trigger>
          <Icon icon="healthicons:info" size="16" class="text-xl text-warning outline-none" />
        </template>
        Quản lý kiểm tra từ khoá
      </NTooltip>
    </div>

    <div class="flex gap-4 items-center justify-between mt-4">
      <CProgress class="my-3" :percent="store.getProgressKeyword" />
    </div>

    <div class="mt-4">
      <NScrollbar x-scrollable>
        <div class="flex items-start gap-3 pb-2">
          <NButton
            size="small"
            secondary
            class="!px-5 text-[#241143] bg-[#EDE9F3]"
            :class="{
              '!bg-[#2C1362] !text-white !font-semibold': !store.urlParams.branch_id
            }"
            @click="store.onChangeBranchId()"
          >
            Tất cả
          </NButton>

          <NButton
            v-for="branch in branchs"
            :key="branch.id"
            size="small"
            secondary
            class="!px-5 text-[#241143] bg-[#EDE9F3]"
            :class="{
              '!bg-[#2C1362] !text-white !font-semibold': store.urlParams.branch_id === branch.id
            }"
            @click="store.onChangeBranchId(branch.id)"
          >
            {{ branch.name }}
          </NButton>
        </div>
      </NScrollbar>
      <div class="flex gap-2 items-center justify-between">
        <NScrollbar x-scrollable :size="1">
          <div class="flex gap-3 py-3">
            <NButton
              v-for="group in groups"
              :key="group.id"
              size="small"
              text
              :type="store.urlParams.group_id === group.id ? 'primary' : 'default'"
              class="!px-1 text-[#241143]"
              :class="{
                '!underline underline-offset-2 !font-semibold':
                  store.urlParams.group_id === group.id
              }"
              @click="store.onChangeGroupId(group.id)"
            >
              {{ group.name }}
            </NButton>
          </div>
        </NScrollbar>
        <div class="flex gap-x-2">
          <NTooltip trigger="hover" :keep-alive-on-hover="false">
            <template #trigger>
              <NButton
                v-if="!store.state.isFetchingCopy"
                secondary
                type="primary"
                size="small"
                :disabled="!store.listData?.data.length"
                @click="onCopyToClipboard"
              >
                <template #icon>
                  <CIcon icon="icon-copy" />
                </template>
              </NButton>
              <NSpin v-else size="small" />
            </template>
            {{ copied ? 'Copy thành công!' : 'Copy kết quả' }}
          </NTooltip>

          <NTooltip trigger="hover" :keep-alive-on-hover="false">
            <template #trigger>
              <NButton
                type="primary"
                size="small"
                :disabled="!store.listData?.data.length"
                @click="store.onExport"
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

    <NModal v-model:show="store.state.isShowDomainModal" :style="{ width: '500px' }">
      <ViewDomainModal :data="store.viewDomainData" :is-fetching="store.state.isFetching" />
    </NModal>
  </div>
</template>
