<script setup lang="ts">
/* ----- Import Type ----- */

/* ----- Import Variables ----- */
import { useProviderStore } from './stores/providerStore'

/* ----- Import Components ----- */
import DataTable from './components/DataTable.vue'
import CreateModal from './components/CreateModal.vue'
import UpdateModal from './components/UpdateModal.vue'
import { User } from '@/types'
import ChangeSortModal from '@/views/providers/components/ChangeSortModal.vue'

/* ----- Global variables ----- */

//#region ----- Element Ref -----
//#endregion ----- Element Ref -----

//#region ----- Stores -----
//#endregion ----- Stores -----

//#region ----- State -----
//#endregion ----- State -----

//#region ----- Composables -----
const store = useProviderStore()
store.resetUrlParams()
//#endregion ----- Composables -----

//#region ----- Variables -----
//#endregion ----- Variables -----

//#region ----- Functions -----
const onChangeFilter = useDebounceFn(() => {
  store.onChangePage(1)
}, 500)
//#endregion ----- Functions -----

//#region ----- Hooks -----
onBeforeMount(() => {
  store.fetchData()
})
onUnmounted(() => {
  store.$reset()
})
//#endregion ----- Hooks -----
</script>

<template>
  <div>
    <PageHeader title="Quản lý Provider" tooltip="Tạo và quản lý Provider" />

    <div class="mt-5">
      <div class="flex items-center justify-between mb-3">
        <div class="text-xl font-semibold">Danh sách Provider</div>
        <div class="flex gap-2">
          <NButton
            v-if="useCheckRoles([User.Role.Admin, User.Role.Editor])"
            type="primary"
            @click="store.stateModal.isShowCreateModal = true"
          >
            <Icon icon="ic:round-plus" />
            {{ $t('buttons.create') }}
          </NButton>
          <NButton
            v-if="useCheckRoles([User.Role.Admin, User.Role.Editor])"
            type="info"
            :disabled="store.state.isFetching"
            @click="store.stateModal.isShowChangeSortModal = true"
          >
            Thay đổi
            <Icon class="ml-2" icon="mdi:sort" />
          </NButton>
        </div>
      </div>

      <!-- Filter -->
      <div class="mb-2 flex items-center gap-x-4">
        <div class="font-semibold">Lọc theo</div>
        <div class="w-[280px]">
          <NInput
            v-model:value="store.urlParams.name"
            placeholder="Tên nhà cung cấp"
            clearable
            size="small"
            @input="onChangeFilter"
          />
        </div>
        <div class="w-[150px]">
          <NSelect
            v-model:value="store.urlParams.is_active"
            :options="store.statusOptions"
            placeholder="Trạng thái"
            clearable
            size="small"
            @update:value="onChangeFilter"
          />
        </div>
      </div>
      <PageBlock>
        <DataTable
          :is-fetching="store.state.isFetching"
          :data="store.listData"
          @change-page="store.onChangePage"
          @change-page-size="store.onChangePageSize"
        />
      </PageBlock>
    </div>

    <!-- Modals -->
    <NModal v-model:show="store.stateModal.isShowCreateModal">
      <CreateModal v-model:show="store.stateModal.isShowCreateModal" @success="store.fetchData" />
    </NModal>

    <NModal v-model:show="store.stateModal.isShowUpdateModal">
      <UpdateModal
        :id="store.editId"
        v-model:show="store.stateModal.isShowUpdateModal"
        @success="store.fetchData"
      />
    </NModal>

    <NModal v-model:show="store.stateModal.isShowChangeSortModal">
      <ChangeSortModal
        v-model:show="store.stateModal.isShowChangeSortModal"
        @success="store.fetchData"
      />
    </NModal>
  </div>
</template>
