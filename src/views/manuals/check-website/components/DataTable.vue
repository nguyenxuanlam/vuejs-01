<script setup lang="ts">
/* ----- Import Type ----- */
import { useCheckDomainStore, type CheckDomain } from '../stores/checkDomainStore'

/* ----- Import Variables ----- */
import useDataTable from '../composables/useDataTable'

/* ----- Import Components ----- */

/* ----- Global variables ----- */
defineProps<{
  data: CheckDomain[] | undefined
  isFetching: boolean
}>()

defineEmits<{
  changePage: [page: number]
  changePageSize: [pageSize: number]
}>()

//#region ----- Element Ref -----
//#endregion ----- Element Ref -----

//#region ----- Stores -----
const { urlParams, pagination } = storeToRefs(useCheckDomainStore())
const { fetchProviders } = useCheckDomainStore()
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
  <div>
    <NDataTable
      :bordered="false"
      :row-key="(row: CheckDomain) => row.id"
      :columns="columns"
      :data="$props.data"
      :loading="$props.isFetching"
      :scroll-x="1000"
      :max-height="620"
    />

    <NPagination
      class="mt-4 justify-end"
      :disabled="$props.isFetching"
      :page="urlParams.page"
      :page-count="pagination.pageCount"
      show-size-picker
      :page-size="urlParams.per_page"
      :page-sizes="[10, 20, 50, 100]"
      @update:page="$emit('changePage', $event)"
      @update:page-size="$emit('changePageSize', $event)"
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
