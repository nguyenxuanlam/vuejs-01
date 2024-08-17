<script setup lang="ts">
/* ----- Import Type ----- */
import type { Provider } from '@/types'

/* ----- Import Variables ----- */

/* ----- Import Components ----- */

/* ----- Global variables ----- */

//#region ----- Element Ref -----
//#endregion ----- Element Ref -----

//#region ----- Stores -----
//#endregion ----- Stores -----

//#region ----- State -----
//#endregion ----- State -----

//#region ----- Composables -----
//#endregion ----- Composables -----

//#region ----- Variables -----

const providers = ref<Provider.Item[]>([])
//#endregion ----- Variables -----

//#region ----- Functions -----
async function fetchListProvider() {
  const res = await apiProviders.getList()
  const dataRes = res.data.data
  providers.value = dataRes.data
}

//#endregion ----- Functions -----

//#region ----- Hooks -----
onBeforeMount(() => {
  fetchListProvider()
})
//#endregion ----- Hooks -----
</script>

<template>
  <div class="flex flex-wrap py-2">
    <div
      v-for="provider in providers"
      :key="provider.id"
      class="flex gap-1 min-w-[63px] border-r border-gray-200 last:border-none px-3 first:pl-0"
    >
      <CIcon
        :icon="provider.is_active === 'Y' ? 'icon-check-circle' : 'icon-close-circle'"
        class="text-xl"
        :class="provider.is_active === 'Y' ? 'text-success' : 'text-danger'"
      />

      <div class="min-w-12">
        <p class="text-sm font-semibold text-primary-600 capitalize min-w-full">
          {{ provider.name }}
        </p>
        <div v-if="provider.is_4g === 'Y'" class="text-[10px]">
          {{ provider.used_data }} GB /
          <span class="text-gray-400">{{ provider.total_data }} GB</span>
        </div>
        <div v-else class="text-[10px] text-gray-400">
          <!-- ADSL -->
          <span :class="provider.is_active === 'Y' ? 'text-success' : 'text-danger'">
            {{ provider.is_active === 'Y' ? 'ON' : 'OFF' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
