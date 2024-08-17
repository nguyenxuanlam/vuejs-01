<script setup lang="ts">
/* ----- Import Type ----- */

/* ----- Import Variables ----- */
import CloudComputing from './icons/CloudComputing.vue'
/* ----- Import Components ----- */

/* ----- Global variables ----- */
defineProps<{
  icon: string
}>()

//#region ----- Element Ref -----
//#endregion ----- Element Ref -----

//#region ----- Stores -----
//#endregion ----- Stores -----

//#region ----- State -----
//#endregion ----- State -----

//#region ----- Composables -----
//#endregion ----- Composables -----

//#region ----- Variables -----
const listIconPath: Record<string, number> = {
  'icon-domain': 2,
  'icon-keyword': 2,
  'icon-search-time': 14,
  'icon-time': 15
}
//#endregion ----- Variables -----

//#region ----- Functions -----
//#endregion ----- Functions -----

//#region ----- Hooks -----
//#endregion ----- Hooks -----
</script>

<template>
  <CloudComputing v-if="$props.icon === 'icon-cloud-computing'" />
  <span v-else :class="$props.icon" v-bind="$attrs">
    <template v-if="listIconPath[$props.icon]">
      <span
        v-for="(item, index) in listIconPath[$props.icon]"
        :key="index"
        :class="`path${index + 1}`"
      ></span>
    </template>
  </span>
</template>
