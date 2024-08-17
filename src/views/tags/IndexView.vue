<script setup lang="ts">
/* ----- Import Type ----- */
import { User } from '@/types'

/* ----- Import Variables ----- */
import { useTagStore } from './stores/useTagStore'

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
const tagStore = useTagStore()
tagStore.resetUrlParams()
//#endregion ----- Composables -----

//#region ----- Variables -----
//#endregion ----- Variables -----

//#region ----- Functions -----
const onChangeFilter = useDebounceFn(() => {
  tagStore.onChangePage(1)
}, 500)
//#endregion ----- Functions -----

//#region ----- Hooks -----
onBeforeMount(() => {
  tagStore.fetchData()
})
onUnmounted(() => {
  tagStore.$reset()
})
//#endregion ----- Hooks -----
</script>

<template>
  <div>
    <PageHeader :title="'Quản lý tag'" :tooltip="'Danh sách tag'" />

    <div class="mt-5">
      <div class="flex items-center justify-between mb-3">
        <div class="text-xl font-semibold">Danh sách tag</div>
        <NButton
          v-if="useCheckRoles([User.Role.Admin, User.Role.Editor])"
          type="primary"
          @click="tagStore.stateModal.isShowCreateModal = true"
        >
          <Icon icon="ic:round-plus" />
          {{ $t('buttons.create') }}
        </NButton>
      </div>

      <div class="mb-2 flex items-center gap-x-4">
        <div class="font-semibold">Lọc theo</div>
        <div class="w-[280px]">
          <NInput
            v-model:value="tagStore.urlParams.name"
            placeholder="Tag"
            clearable
            size="small"
            @input="onChangeFilter"
          />
        </div>
      </div>
      <PageBlock>
        <DataTable
          :is-fetching="tagStore.state.isFetching"
          :data="tagStore.listData"
          @change-page="tagStore.onChangePage"
          @change-page-size="tagStore.onChangePageSize"
        />
      </PageBlock>
    </div>

    <!-- Modals -->
    <NModal v-model:show="tagStore.stateModal.isShowCreateModal">
      <CreateModal
        v-model:show="tagStore.stateModal.isShowCreateModal"
        @success="tagStore.fetchData"
      />
    </NModal>

    <NModal v-model:show="tagStore.stateModal.isShowUpdateModal">
      <UpdateModal
        :id="tagStore.editId"
        v-model:show="tagStore.stateModal.isShowUpdateModal"
        @success="tagStore.fetchData"
      />
    </NModal>
  </div>
</template>
