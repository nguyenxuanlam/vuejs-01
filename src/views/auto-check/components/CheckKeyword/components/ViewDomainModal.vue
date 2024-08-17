<script setup lang="ts">
/* ----- Import Type ----- */
import type { CheckKeyword } from '@/types'

/* ----- Import Variables ----- */
import useDomainDataTable from '../composables/useDomainDataTable'

/* ----- Import Components ----- */

/* ----- Global variables ----- */
defineProps<{
  data: CheckKeyword.Item['domains'] | undefined
  isFetching: boolean
}>()
//#region ----- Element Ref -----
//#endregion ----- Element Ref -----

//#region ----- Stores -----
//#endregion ----- Stores -----

//#region ----- State -----
//#endregion ----- State -----

//#region ----- Composables -----
const { columns } = useDomainDataTable()
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
      :data="$props.data"
      :loading="$props.isFetching"
      :scroll-x="500"
      :min-height="200"
      :max-height="620"
    />
  </div>
</template>
