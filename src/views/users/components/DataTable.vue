<script setup lang="ts">
/* ----- Import Type ----- */
import type { User } from '@/types'

/* ----- Import Variables ----- */
import useDataTable from '../composables/useDataTable'

/* ----- Import Components ----- */

/* ----- Global variables ----- */
defineProps<{
  data: Pagination<User.Item> | undefined
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
      :scroll-x="1000"
      :max-height="620"
    />
    <CPagination
      class="mt-5 mr-5 justify-end"
      :is-fetching="$props.isFetching"
      :current-page="$props.data?.paginate.current_page"
      :page-count="$props.data?.paginate.last_page"
      :per-page="$props.data?.paginate.per_page"
      @change-page="$emit('changePage', $event)"
      @change-page-size="$emit('changePageSize', $event)"
    />
  </div>
</template>
