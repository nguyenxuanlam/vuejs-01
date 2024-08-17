<script setup lang="ts">
/* ----- Import Type ----- */
import type { Keyword } from '@/types'

/* ----- Import Variables ----- */
import useDataTable from '../composables/useDataTable'

/* ----- Import Components ----- */

/* ----- Global variables ----- */
defineProps<{
  data: Pagination<Keyword.Item> | undefined
  isFetching: boolean
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
//#endregion ----- State -----

//#region ----- Composables -----
const { columns } = useDataTable()
//#endregion ----- Composables -----

//#region ----- Variables -----
//#endregion ----- Variables -----

//#region ----- Functions -----
//#endregion ----- Functions -----

//#region ----- Hooks -----
//#endregion ----- Hooks -----
</script>

<template>
  <div>
    <NDataTable
      :bordered="false"
      :columns="columns"
      :data="$props.data?.data"
      :loading="$props.isFetching"
      :scroll-x="1400"
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
  </div>
</template>
