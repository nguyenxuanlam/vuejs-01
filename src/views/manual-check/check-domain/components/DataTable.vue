<script setup lang="ts">
/* ----- Import Type ----- */
import { useManualCheckDomainStore } from '../stores/manualCheckDomainStore'

/* ----- Import Variables ----- */
import useDataTable from '../composables/useDataTable'
import { Session } from '@/types'

/* ----- Import Components ----- */

/* ----- Global variables ----- */
defineProps<{
  data: Session.HistoryDomain[] | undefined
  isFetching: boolean
}>()
//#region ----- Element Ref -----
//#endregion ----- Element Ref -----

//#region ----- Stores -----
const { urlParams, pagination } = storeToRefs(useManualCheckDomainStore())
const { fetchProviders, onChangePage, onChangePageSize } = useManualCheckDomainStore()
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
onBeforeMount(() => {
  fetchProviders().then(() => {
    renderProviderColumns()
  })
})
//#endregion ----- Hooks -----
</script>

<template>
  <div class="bg-[#f3f3f3] pb-4">
    <NDataTable
      :bordered="false"
      :columns="columns"
      :data="$props.data"
      :loading="$props.isFetching"
      :scroll-x="1000"
      :max-height="620"
      size="small"
    />

    <CPagination
      class="pt-4 pr-4 justify-end"
      :is-fetching="$props.isFetching"
      :current-page="urlParams.page"
      :page-count="pagination.pageCount"
      :per-page="urlParams.per_page"
      size="small"
      @update:page="onChangePage"
      @update:page-size="onChangePageSize"
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
