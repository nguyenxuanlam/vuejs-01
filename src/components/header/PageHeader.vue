<script setup lang="ts">
/* ----- Import Type ----- */

/* ----- Import Variables ----- */

/* ----- Import Components ----- */

/* ----- Global variables ----- */
defineProps<{
  title?: string
  tooltip?: string
  tooltipDescription?: string
  size?: 'default' | 'small'
  description?: string
  placement?: any
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
//#endregion ----- Variables -----

//#region ----- Functions -----
//#endregion ----- Functions -----

//#region ----- Hooks -----
//#endregion ----- Hooks -----
</script>

<template>
  <div class="flex items-center justify-between">
    <div v-if="!$slots.title" class="flex items-center flex-wrap gap-x-2">
      <div class="flex items-center gap-x-2">
        <h1
          class="text-primary-700 dark:text-white capitalize"
          :class="{
            'font-bold text-h3': $props.size === 'default' || !$props.size,
            'font-semibold text-h6': $props.size === 'small'
          }"
        >
          {{ $props.title }}
        </h1>
        <NTooltip
          v-if="$props.tooltip"
          trigger="hover"
          :keep-alive-on-hover="false"
          :placement="$props.placement ?? 'top'"
        >
          <template #trigger>
            <CIcon
              icon="icon-tooltips"
              class="text-[#DBB97B] outline-none"
              :class="{
                'text-base': $props.size === 'default' || !$props.size,
                'text-xs': $props.size === 'small'
              }"
            />
          </template>
          {{ $props.tooltip }} <br />
          <span class="text-[#DFDFDF]">{{ $props.tooltipDescription }}</span>
        </NTooltip>
      </div>
      <span v-if="$props.description" class="text-[#828282] text-xs">{{ $props.description }}</span>
    </div>
    <slot name="title" />

    <div class="flex items-center gap-x-2">
      <slot />
    </div>
  </div>
</template>
