<script setup lang="ts">
/* ----- Import Type ----- */
import type { Domain } from '@/types'

/* ----- Import Variables ----- */
import useDataTable from '../composables/useDataTable'
import { useDomainStore } from '../stores/domainStore'

/* ----- Import Components ----- */

/* ----- Global variables ----- */
defineProps<{
  data: Pagination<Domain.Item> | undefined
  isFetching: boolean
}>()

defineEmits<{
  changePage: [page: number]
  changePageSize: [pageSize: number]
}>()

//#region ----- Element Ref -----
//#endregion ----- Element Ref -----

//#region ----- Stores -----
const { fetchProviders } = useDomainStore()
//#endregion ----- Stores -----

//#region ----- State -----
const state = reactive({
  isLoadingImage: true,
  isLoadingVideo: true
})

//#endregion ----- State -----

//#region ----- Composables -----
const { videoModal, imageModal, columns, renderProviderColumns } = useDataTable()
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
      :columns="columns"
      :data="$props.data?.data"
      :loading="$props.isFetching"
      :scroll-x="1600"
      :max-height="620"
    />
    <NPagination
      class="mt-4 justify-end"
      :disabled="$props.isFetching"
      :page="$props.data?.paginate.current_page"
      :page-count="$props.data?.paginate.last_page"
      show-size-picker
      :page-size="$props.data?.paginate.per_page"
      :page-sizes="[10, 20, 50, 100]"
      @update:page="$emit('changePage', $event)"
      @update:page-size="$emit('changePageSize', $event)"
    />

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
      <div class="bg-white">
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
