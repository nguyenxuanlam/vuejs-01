<script setup lang="ts">
/* ----- Import Type ----- */

/* ----- Import Variables ----- */
import { useUserStore } from './stores/userStore'

/* ----- Import Components ----- */
import DataTable from './components/DataTable.vue'
import CreateModal from './components/CreateModal.vue'
import UpdateModal from './components/UpdateModal.vue'
import ChangePasswordModal from '@/views/users/components/ChangePasswordModal.vue'

/* ----- Global variables ----- */

//#region ----- Element Ref -----
//#endregion ----- Element Ref -----

//#region ----- Stores -----
//#endregion ----- Stores -----

//#region ----- State -----
//#endregion ----- State -----

//#region ----- Composables -----
const userStore = useUserStore()
userStore.resetUrlParams()
//#endregion ----- Composables -----

//#region ----- Variables -----
//#endregion ----- Variables -----

//#region ----- Functions -----
const onChangeFilter = useDebounceFn(() => {
  userStore.onChangePage(1)
}, 500)
//#endregion ----- Functions -----

//#region ----- Hooks -----
onBeforeMount(() => {
  userStore.fetchData()
})
onUnmounted(() => {
  userStore.$reset()
})
//#endregion ----- Hooks -----
</script>

<template>
  <div>
    <PageHeader
      :title="$t('pages.users.title.root')"
      tooltip="Tạo và quản lý tài khoản người dùng"
    />

    <div class="mt-5">
      <div class="flex items-center justify-between mb-3">
        <div class="text-xl font-semibold">{{ $t('pages.users.title.list') }}</div>
        <NButton type="primary" @click="userStore.stateModal.isShowCreateModal = true">
          <Icon icon="ic:round-plus" />
          {{ $t('buttons.create') }}
        </NButton>
      </div>

      <!-- Filter -->
      <div class="mb-2 flex items-center gap-x-4">
        <div class="font-semibold">Lọc theo</div>
        <div class="w-[280]">
          <NInput
            v-model:value="userStore.urlParams.name"
            placeholder="Tên"
            clearable
            size="small"
            @input="onChangeFilter"
          />
        </div>
        <div class="w-[280]">
          <NInput
            v-model:value="userStore.urlParams.email"
            placeholder="Email"
            clearable
            size="small"
            @input="onChangeFilter"
          />
        </div>
        <div class="w-[280]">
          <NInput
            v-model:value="userStore.urlParams.username"
            placeholder="Tên tài khoản"
            clearable
            size="small"
            @input="onChangeFilter"
          />
        </div>
        <div class="w-[150px]">
          <NSelect
            v-model:value="userStore.urlParams.is_active"
            :options="userStore.statusOptions"
            placeholder="Trạng thái"
            clearable
            size="small"
            @update:value="onChangeFilter"
          />
        </div>
      </div>
      <PageBlock>
        <DataTable
          :is-fetching="userStore.state.isFetching"
          :data="userStore.listData"
          @change-page="userStore.onChangePage"
          @change-page-size="userStore.onChangePageSize"
        />
      </PageBlock>
    </div>

    <!-- Modals -->
    <NModal v-model:show="userStore.stateModal.isShowCreateModal">
      <CreateModal
        v-model:show="userStore.stateModal.isShowCreateModal"
        @success="userStore.fetchData"
      />
    </NModal>

    <NModal v-model:show="userStore.stateModal.isShowUpdateModal">
      <UpdateModal
        :id="userStore.editId"
        v-model:show="userStore.stateModal.isShowUpdateModal"
        @success="userStore.fetchData"
      />
    </NModal>

    <NModal v-model:show="userStore.stateModal.isShowChangePasswordModal">
      <ChangePasswordModal
        :id="userStore.editId"
        v-model:show="userStore.stateModal.isShowChangePasswordModal"
        @success="userStore.fetchData"
      />
    </NModal>
  </div>
</template>
