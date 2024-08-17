<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const { copy, copied } = useClipboard()

const listIcon = [
  'icon-add',
  'icon-arrow-down',
  'icon-arrow-left',
  'icon-arrow-right',
  'icon-arrow-up',
  'icon-auto-check',
  'icon-calendar',
  'icon-check',
  'icon-check-circle',
  'icon-close',
  'icon-close-circle',
  'icon-copy',
  'icon-detail',
  'icon-domain',
  'icon-download',
  'icon-drag',
  'icon-edit',
  'icon-img',
  'icon-keyword',
  'icon-keyword-management',
  'icon-log-out',
  'icon-manual-check',
  'icon-refresh',
  'icon-Search',
  'icon-search-time',
  'icon-send',
  'icon-setting',
  'icon-time',
  'icon-tooltips',
  'icon-trash',
  'icon-upload',
  'icon-upload-cloud',
  'icon-user-check',
  'icon-video'
]

function handleCopy(icon: string) {
  copy(`<CIcon icon="${icon}" />`)
}
</script>

<template>
  <div class="w-4/5 bg-white shadow-2 py-6 px-8">
    <div class="flex items-center flex-wrap gap-6">
      <div v-for="(item, index) in listIcon" :key="index" class="w-[400px]">
        <NTooltip trigger="hover">
          <template #trigger>
            <div
              class="flex items-center gap-x-4 text-2xl w-fit cursor-pointer"
              @click="handleCopy(item)"
            >
              <CIcon :icon="item" />
              <span>{{ item }}</span>
            </div>
          </template>
          {{ copied ? 'Copied!' : 'Click to copy' }}
        </NTooltip>
      </div>
    </div>
  </div>
</template>
