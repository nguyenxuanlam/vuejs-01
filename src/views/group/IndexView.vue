<script setup lang="ts">
/* ----- Import Type ----- */
import { User } from '@/types'

/* ----- Import Variables ----- */
import { useGroupStore } from './stores/useGroupStore'

/* ----- Import Components ----- */
import DataTable from './components/DataTable.vue'
import CreateModal from './components/CreateModal.vue'
import UpdateModal from './components/UpdateModal.vue'

/* ----- Global variables ----- */

//#region ----- Element Ref -----
//#endregion ----- Element Ref -----

//#region ----- Stores -----
//#endregion ----- Stores -----

//#region ----- State -----
//#endregion ----- State -----

//#region ----- Composables -----
const groupStore = useGroupStore()
groupStore.resetUrlParams()
//#endregion ----- Composables -----

//#region ----- Variables -----
//#endregion ----- Variables -----

//#region ----- Functions -----
const onChangeFilter = useDebounceFn(() => {
  groupStore.onChangePage(1)
}, 500)
//#endregion ----- Functions -----

//#region ----- Hooks -----
onBeforeMount(() => {
  groupStore.fetchData()
})
onUnmounted(() => {
  groupStore.$reset()
})
//#endregion ----- Hooks -----
</script>

<template>
  <div>
    <PageHeader :title="'Quản lý thương hiệu'" :tooltip="'Danh sách thương hiệu'" />

    <div class="mt-5">
      <div class="flex items-center justify-between mb-3">
        <div class="text-xl font-semibold">Danh sách thương hiệu</div>
        <NButton
          v-if="useCheckRoles([User.Role.Admin, User.Role.Editor])"
          type="primary"
          @click="groupStore.stateModal.isShowCreateModal = true"
        >
          <Icon icon="ic:round-plus" />
          {{ $t('buttons.create') }}
        </NButton>
      </div>

      <div class="mb-2 flex items-center gap-x-4">
        <div class="font-semibold">Lọc theo</div>
        <div class="w-[280px]">
          <NInput
            v-model:value="groupStore.urlParams.name"
            placeholder="Thương hiệu"
            clearable
            size="small"
            @input="onChangeFilter"
          />
        </div>
        <div class="w-[280px]">
          <NSelect
            v-model:value="groupStore.urlParams.branch_id"
            class="select-filter"
            value-field="id"
            label-field="name"
            clearable
            size="small"
            placeholder="Nhóm ngành"
            :options="groupStore.listSelectBranch"
            @update:value="onChangeFilter"
          />
        </div>
      </div>
      <PageBlock>
        <DataTable
          :is-fetching="groupStore.state.isFetching"
          :data="groupStore.listData"
          @change-page="groupStore.onChangePage"
          @change-page-size="groupStore.onChangePageSize"
        />
      </PageBlock>
    </div>

    <!-- Modals -->
    <NModal v-model:show="groupStore.stateModal.isShowCreateModal">
      <CreateModal
        v-model:show="groupStore.stateModal.isShowCreateModal"
        @success="groupStore.fetchData"
      />
    </NModal>

    <NModal v-model:show="groupStore.stateModal.isShowUpdateModal">
      <UpdateModal
        :id="groupStore.editId"
        v-model:show="groupStore.stateModal.isShowUpdateModal"
        @success="groupStore.fetchData"
      />
    </NModal>
  </div>
</template>
