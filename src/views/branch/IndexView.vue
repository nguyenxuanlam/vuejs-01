<script setup lang="ts">
/* ----- Import Type ----- */
import { User } from '@/types'

/* ----- Import Variables ----- */
import { useBranchStore } from './stores/useTagStore'

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
const branchStore = useBranchStore()
branchStore.resetUrlParams()
//#endregion ----- Composables -----

//#region ----- Variables -----
//#endregion ----- Variables -----

//#region ----- Functions -----
const onChangeFilter = useDebounceFn(() => {
  branchStore.onChangePage(1)
}, 500)
//#endregion ----- Functions -----

//#region ----- Hooks -----
onBeforeMount(() => {
  branchStore.fetchData()
})
onUnmounted(() => {
  branchStore.$reset()
})
//#endregion ----- Hooks -----
</script>

<template>
  <div>
    <PageHeader :title="'Quản lý ngành'" :tooltip="'Danh sách ngành'" />

    <div class="mt-5">
      <div class="flex items-center justify-between mb-3">
        <div class="text-xl font-semibold">Danh sách ngành</div>
        <NButton
          v-if="useCheckRoles([User.Role.Admin, User.Role.Editor])"
          type="primary"
          @click="branchStore.stateModal.isShowCreateModal = true"
        >
          <Icon icon="ic:round-plus" />
          {{ $t('buttons.create') }}
        </NButton>
      </div>

      <div class="mb-2 flex items-center gap-x-4">
        <div class="font-semibold">Lọc theo</div>
        <div class="w-[280px]">
          <NInput
            v-model:value="branchStore.urlParams.name"
            placeholder="Ngành"
            clearable
            size="small"
            @input="onChangeFilter"
          />
        </div>
      </div>
      <PageBlock>
        <DataTable
          :is-fetching="branchStore.state.isFetching"
          :data="branchStore.listData"
          @change-page="branchStore.onChangePage"
          @change-page-size="branchStore.onChangePageSize"
        />
      </PageBlock>
    </div>

    <!-- Modals -->
    <NModal v-model:show="branchStore.stateModal.isShowCreateModal">
      <CreateModal
        v-model:show="branchStore.stateModal.isShowCreateModal"
        @success="branchStore.fetchData"
      />
    </NModal>

    <NModal v-model:show="branchStore.stateModal.isShowUpdateModal">
      <UpdateModal
        :id="branchStore.editId"
        v-model:show="branchStore.stateModal.isShowUpdateModal"
        @success="branchStore.fetchData"
      />
    </NModal>
  </div>
</template>
