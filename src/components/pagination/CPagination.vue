<script setup lang="ts">
import type { PaginationSizeOption } from 'naive-ui'

defineProps<{
  isFetching: boolean
  currentPage: number | undefined
  pageCount: number | undefined
  perPage: number | undefined
  size?: 'small' | 'medium' | 'large'
}>()

defineEmits<{
  changePage: [page: number]
  changePageSize: [pageSize: number]
}>()

const pageSizes = [
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '50', value: 50 },
  { label: '100', value: 100 }
] as PaginationSizeOption[]
</script>

<template>
  <NPagination
    :disabled="$props.isFetching"
    :page="$props.currentPage"
    :page-count="$props.pageCount"
    show-size-picker
    :page-size="$props.perPage"
    :page-sizes="pageSizes"
    :size="$props.size"
    :display-order="['size-picker', 'pages', 'quick-jumper']"
    class="pagination-custom"
    :page-slot="6"
    @update:page="$emit('changePage', $event)"
    @update:page-size="$emit('changePageSize', $event)"
  >
    <template #prefix>Hiển thị:</template>
  </NPagination>
</template>
