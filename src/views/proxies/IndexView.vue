<script setup lang="ts">
/* ----- Import Type ----- */

/* ----- Import Variables ----- */
import { useProxyStore } from './stores/proxyStore'

/* ----- Import Components ----- */
import DataTable from './components/DataTable.vue'
import CreateModal from './components/CreateModal.vue'
import UpdateModal from './components/UpdateModal.vue'
import { User } from '@/types'

/* ----- Global variables ----- */

//#region ----- Element Ref -----
//#endregion ----- Element Ref -----

//#region ----- Stores -----
//#endregion ----- Stores -----

//#region ----- State -----
//#endregion ----- State -----

//#region ----- Composables -----
const proxyStore = useProxyStore()
proxyStore.resetUrlParams()
//#endregion ----- Composables -----

//#region ----- Variables -----
//#endregion ----- Variables -----

//#region ----- Functions -----
const onChangeFilter = useDebounceFn(() => {
  proxyStore.onChangePage(1)
}, 500)
//#endregion ----- Functions -----

//#region ----- Hooks -----
onBeforeMount(() => {
  Promise.all([proxyStore.fetchData(), proxyStore.fetchProviders({ per_page: 100 })])
})
onUnmounted(() => {
  proxyStore.$reset()
})
//#endregion ----- Hooks -----
</script>

<template>
  <div>
    <PageHeader title="Quản lý proxy" tooltip="Tạo và quản lý Proxy" />

    <div class="mt-5">
      <div class="flex items-center justify-between mb-3">
        <div class="text-xl font-semibold">Danh sách Proxy</div>
        <NButton
          v-if="useCheckRoles([User.Role.Admin, User.Role.Editor])"
          type="primary"
          @click="proxyStore.stateModal.isShowCreateModal = true"
        >
          <Icon icon="ic:round-plus" />
          {{ $t('buttons.create') }}
        </NButton>
      </div>

      <!-- Filter -->
      <div class="mb-2 flex items-center gap-x-4">
        <div class="font-semibold">Lọc theo</div>
        <div class="w-[280]">
          <NInput
            v-model:value="proxyStore.urlParams.proxy_name"
            placeholder="Tên proxy"
            clearable
            size="small"
            @input="onChangeFilter"
          />
        </div>
        <div class="w-[280px]">
          <NSelect
            v-model:value="proxyStore.urlParams.provider_id"
            :options="proxyStore.listProviders"
            :loading="proxyStore.state.isFetchingProviders"
            :disabled="proxyStore.state.isFetchingProviders"
            clearable
            placeholder="Nhà cung cấp"
            size="small"
            @update:value="onChangeFilter"
          />
        </div>
        <div class="w-[150px]">
          <NSelect
            v-model:value="proxyStore.urlParams.is_active"
            :options="proxyStore.statusOptions"
            clearable
            placeholder="Trạng thái"
            size="small"
            @update:value="onChangeFilter"
          />
        </div>
      </div>
      <PageBlock>
        <DataTable
          :is-fetching="proxyStore.state.isFetching"
          :data="proxyStore.listData"
          @change-page="proxyStore.onChangePage"
          @change-page-size="proxyStore.onChangePageSize"
        />
      </PageBlock>
    </div>

    <!-- Modals -->
    <NModal v-model:show="proxyStore.stateModal.isShowCreateModal">
      <CreateModal
        v-model:show="proxyStore.stateModal.isShowCreateModal"
        @success="proxyStore.fetchData"
      />
    </NModal>

    <NModal v-model:show="proxyStore.stateModal.isShowUpdateModal">
      <UpdateModal
        :id="proxyStore.editId"
        v-model:show="proxyStore.stateModal.isShowUpdateModal"
        @success="proxyStore.fetchData"
      />
    </NModal>
  </div>
</template>
