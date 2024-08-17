<script setup lang="ts">
/* ----- Import Type ----- */
import { useReportStore, type DataReport } from '../stores/reportStore'

/* ----- Import Variables ----- */
import useDataTable from '../composables/useDataTable'
import type { DataTableRowKey } from 'naive-ui'

/* ----- Import Components ----- */

/* ----- Global variables ----- */
defineProps<{
  data: Array<DataReport> | undefined
  isFetching: boolean
}>()

//#region ----- Element Ref -----
//#endregion ----- Element Ref -----

//#region ----- Stores -----
const reportStore = useReportStore()
//#endregion ----- Stores -----

//#region ----- State -----
//#endregion ----- State -----

//#region ----- Composables -----
const { columns, summaryRow } = useDataTable()
//#endregion ----- Composables -----

//#region ----- Variables -----
//#endregion ----- Variables -----

//#region ----- Functions -----
function handleChecked(rowKeys: DataTableRowKey[]) {
  reportStore.checkedRowIds = rowKeys as number[]
}
//#endregion ----- Functions -----

//#region ----- Hooks -----
//#endregion ----- Hooks -----
</script>

<template>
  <div>
    <NDataTable
      :bordered="false"
      :columns="columns"
      :summary="summaryRow"
      summary-placement="top"
      :data="$props.data"
      :loading="$props.isFetching"
      :scroll-x="1000"
      :max-height="420"
      :row-key="(row: DataReport) => row.server.id"
      :checked-row-keys="reportStore.checkedRowIds"
      @update:checked-row-keys="handleChecked"
    />
  </div>
</template>
