<script setup lang="ts">
import { NProgress } from 'naive-ui'
defineProps<{
  percent: number
}>()
</script>

<template>
  <NProgress
    class="progress-custom"
    type="line"
    indicator-placement="inside"
    rail-color="#EDE9F3"
    color="#2C1362"
    :show-indicator="false"
    :percentage="$props.percent"
    :processing="$props.percent < 100"
    :height="7"
    :status="$props.percent < 100 ? 'default' : 'success'"
  >
    <div
      class="absolute -translate-y-1/2 top-1/2 z-10 bg-white py-[7px] px-3.5 text-[#241143] border border-[#241143] rounded-2xl"
      :class="{
        'right-0': $props.percent === 100,
        'translate-x-1/2 right-0': $props.percent < 100 && $props.percent > 0,
        'left-0': $props.percent === 0
      }"
    >
      {{ $props.percent }}%
    </div>
  </NProgress>
</template>
