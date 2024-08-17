<script setup lang="ts">
/* ----- Import Type ----- */
import { useAutoCheckDomainStore } from '../stores/autoCheckDomainStore'
import type { HistoryDomain } from '@/types'

/* ----- Import Variables ----- */
import useDataTable from '../composables/useDataTable'

/* ----- Import Components ----- */

/* ----- Global variables ----- */
defineProps<{
  data: HistoryDomain.Check.Item[] | undefined
  isFetching: boolean
}>()

defineEmits<{
  changePage: [page: number]
  changePageSize: [pageSize: number]
}>()

//#region ----- Element Ref -----
//#endregion ----- Element Ref -----

//#region ----- Stores -----
const { urlParams, pagination } = storeToRefs(useAutoCheckDomainStore())
const { fetchProviders } = useAutoCheckDomainStore()
//#endregion ----- Stores -----

//#region ----- State -----
const state = reactive({
  isLoadingImage: true
})
//#endregion ----- State -----

//#region ----- Composables -----
const { imageModal, columns, renderProviderColumns } = useDataTable()
//#endregion ----- Composables -----

//#region ----- Variables -----
//#endregion ----- Variables -----

//#region ----- Functions -----
//#endregion ----- Functions -----

//#region ----- Hooks -----
onMounted(async () => {
  await fetchProviders()
  nextTick(() => {
    renderProviderColumns()
  })
})
//#endregion ----- Hooks -----
</script>

<template>
  <div class="bg-[#F3F3F3]">
    <NDataTable
      :bordered="false"
      :row-key="(row: HistoryDomain.Check.Item) => row.id"
      :columns="columns"
      :data="$props.data"
      :loading="$props.isFetching"
      :scroll-x="1100"
      size="small"
      :max-height="320"
      virtual-scroll
      remote
    />
    <CPagination
      class="py-4 pr-4 justify-end"
      size="small"
      :is-fetching="$props.isFetching"
      :current-page="urlParams.page"
      :page-count="pagination.pageCount"
      :per-page="urlParams.per_page"
      @change-page="$emit('changePage', $event)"
      @change-page-size="$emit('changePageSize', $event)"
    />

    <!-- Modals -->
    <NModal v-model:show="imageModal.visible" @update-show="state.isLoadingImage = true">
      <div class="bg-white dark:bg-dark">
        <NSpin v-if="state.isLoadingImage" class="p-5" />
        <NImage
          v-show="!state.isLoadingImage"
          :src="imageModal.imagePath"
          fallback-src="/no-image.svg"
          class="h-[70vh] object-scale-down"
          alt="image-result"
          preview-disabled
          @load="state.isLoadingImage = false"
        />
      </div>
    </NModal>
  </div>
</template>
