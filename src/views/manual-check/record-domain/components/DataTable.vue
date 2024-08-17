<script setup lang="ts">
/* ----- Import Type ----- */
import { type Session } from '@/types'
import type { Pagination } from '../composables/useTableResult'

/* ----- Import Variables ----- */
import useDataTable from '../composables/useDataTable'

/* ----- Import Components ----- */

/* ----- Global variables ----- */
const props = defineProps<{
  data: Session.HistoryDomain[] | undefined
  isFetching: boolean
  pagination: Pagination
  onRetry: (item: Session.HistoryDomain) => void
  onDelete: (item: Session.HistoryDomain) => void
}>()

defineEmits<{
  changePage: [page: number]
  changePageSize: [pageSize: number]
}>()

//#region ----- Element Ref -----
//#endregion ----- Element Ref -----

//#region ----- Stores -----
//#endregion ----- Stores -----

//#region ----- State -----
const state = reactive({
  isLoadingImage: true,
  isLoadingVideo: true
})
//#endregion ----- State -----

//#region ----- Composables -----
const { videoModal, imageModal, columns } = useDataTable(
  props.pagination,
  props.onRetry,
  props.onDelete
)
//#endregion ----- Composables -----

//#region ----- Variables -----
//#endregion ----- Variables -----

//#region ----- Functions -----
//#endregion ----- Functions -----

//#region ----- Hooks -----
//#endregion ----- Hooks -----
</script>

<template>
  <div class="bg-[#f3f3f3]">
    <NDataTable
      :columns="columns"
      :data="$props.data"
      :loading="$props.isFetching"
      scroll-x="100%"
      :max-height="450"
      :bordered="false"
      size="small"
    />

    <CPagination
      class="py-4 pr-4 justify-end"
      size="small"
      :is-fetching="$props.isFetching"
      :current-page="$props.pagination.currentPage"
      :page-count="$props.pagination.pageCount"
      :per-page="$props.pagination.pageSize"
      @update:page="$emit('changePage', $event)"
      @update:page-size="$emit('changePageSize', $event)"
    />

    <!-- Modals -->
    <NModal v-model:show="imageModal.visible" @update-show="state.isLoadingImage = true">
      <div>
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
    <NModal v-model:show="videoModal.visible" @update-show="state.isLoadingVideo = true">
      <div>
        <NSpin v-if="state.isLoadingVideo" class="p-5" />
        <video
          v-show="!state.isLoadingVideo"
          :src="videoModal.videoPath"
          class="h-[70vh]"
          controls
          autoplay
          @loadeddata="state.isLoadingVideo = false"
        />
      </div>
    </NModal>
  </div>
</template>
