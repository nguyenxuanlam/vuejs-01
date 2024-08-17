<script setup lang="ts">
/* ----- Import Type ----- */

/* ----- Import Variables ----- */
import { useServerStore } from './stores/serverStore'

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
const serverStore = useServerStore()
serverStore.resetUrlParams()
//#endregion ----- Composables -----

//#region ----- Variables -----
//#endregion ----- Variables -----

//#region ----- Functions -----
const onChangeFilter = useDebounceFn(() => {
  serverStore.onChangePage(1)
}, 500)
//#endregion ----- Functions -----

//#region ----- Hooks -----
onBeforeMount(() => {
  serverStore.fetchData()
})
onUnmounted(() => {
  serverStore.$reset()
})
//#endregion ----- Hooks -----
</script>

<template>
  <div>
    <PageHeader title="Quản lý cụm Server" tooltip="Tạo và quản lý cụm Server" />

    <div class="mt-5">
      <div class="flex items-center justify-between mb-3">
        <div class="text-xl font-semibold">Danh sách cụm Server</div>
        <NButton
          v-if="useCheckRoles([User.Role.Admin, User.Role.Editor])"
          type="primary"
          @click="serverStore.stateModal.isShowCreateModal = true"
        >
          <Icon icon="ic:round-plus" />
          {{ $t('buttons.create') }}
        </NButton>
      </div>

      <!-- Filter -->
      <div class="mb-2 flex items-center gap-x-4">
        <div class="font-semibold">Lọc theo</div>
        <div class="w-[280px]">
          <NInput
            v-model:value="serverStore.urlParams.name"
            placeholder="Tên"
            clearable
            size="small"
            @input="onChangeFilter"
          />
        </div>
        <div class="w-[280px]">
          <NInput
            v-model:value="serverStore.urlParams.domain_name"
            placeholder="Tên miền"
            clearable
            size="small"
            @input="onChangeFilter"
          />
        </div>
        <div class="w-[280px]">
          <NInput
            v-model:value="serverStore.urlParams.ip_address"
            placeholder="Địa chỉ IP"
            clearable
            size="small"
            @input="onChangeFilter"
          />
        </div>
        <div class="w-[150px]">
          <NSelect
            v-model:value="serverStore.urlParams.type"
            :options="serverStore.typeOptions"
            placeholder="Loại"
            clearable
            size="small"
            @update:value="onChangeFilter"
          />
        </div>
        <div class="w-[150px]">
          <NSelect
            v-model:value="serverStore.urlParams.is_active"
            :options="serverStore.statusOptions"
            placeholder="Trạng thái"
            clearable
            size="small"
            @update:value="onChangeFilter"
          />
        </div>
      </div>
      <PageBlock>
        <DataTable
          :is-fetching="serverStore.state.isFetching"
          :data="serverStore.listData"
          @change-page="serverStore.onChangePage"
          @change-page-size="serverStore.onChangePageSize"
        />
      </PageBlock>
    </div>

    <!-- Modals -->
    <NModal v-model:show="serverStore.stateModal.isShowCreateModal">
      <CreateModal
        v-model:show="serverStore.stateModal.isShowCreateModal"
        @success="serverStore.fetchData"
      />
    </NModal>

    <NModal v-model:show="serverStore.stateModal.isShowUpdateModal">
      <UpdateModal
        :id="serverStore.editId"
        v-model:show="serverStore.stateModal.isShowUpdateModal"
        @success="serverStore.fetchData"
      />
    </NModal>
  </div>
</template>
