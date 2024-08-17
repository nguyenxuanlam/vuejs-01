<script setup lang="ts">
/* ----- Import Type ----- */
import type { ReportItem } from '../stores/reportGroupStore'

/* ----- Import Variables ----- */
import useDataTable from '../composables/useDataTable'

/* ----- Import Components ----- */

/* ----- Global variables ----- */
defineProps<{
  data: ReportItem[] | undefined
  isFetching: boolean
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
      :row-key="(row: ReportItem) => row.id"
      :columns="columns"
      :data="$props.data"
      :loading="$props.isFetching"
      :scroll-x="1000"
      :max-height="620"
    />
  </div>
</template>
