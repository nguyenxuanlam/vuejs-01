<script setup lang="ts">
/* ----- Import Type ----- */

/* ----- Import Variables ----- */
import { useWhitelistStore } from './stores/whitelistStore'

/* ----- Import Components ----- */
import DataTable from './components/DataTable.vue'
import CreateModal from './components/CreateModal.vue'
import UpdateModal from './components/UpdateModal.vue'
import { User } from '@/types'
import DeleteModal from '@/views/whitelist-domains/components/DeleteModal.vue'

/* ----- Global variables ----- */

//#region ----- Element Ref -----
//#endregion ----- Element Ref -----

//#region ----- Stores -----
//#endregion ----- Stores -----

//#region ----- State -----
//#endregion ----- State -----

//#region ----- Composables -----
const store = useWhitelistStore()
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
  store.fetchTags().then(() => store.fetchData())
})
onUnmounted(() => {
  store.$reset()
})
//#endregion ----- Hooks -----
</script>

<template>
  <div>
    <PageHeader title="Quản lý Whitelist Domain" tooltip="Tạo và quản lý Whitelist Domain" />

    <div class="mt-5">
      <div class="flex items-center justify-between mb-3">
        <div class="text-xl font-semibold">Danh sách Whitelist Domain</div>
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
            type="error"
            @click="store.stateModal.isShowDeleteModal = true"
          >
            <Icon icon="mdi:tag-outline" class="mr-1" />
            Xóa bởi Tag
          </NButton>
        </div>
      </div>

      <!-- Filter -->
      <div class="mb-2 flex items-center gap-x-4">
        <div class="font-semibold">Lọc theo</div>
        <div class="w-[280px]">
          <NInput
            v-model:value="store.urlParams.name"
            placeholder="Tên miền"
            clearable
            size="small"
            @input="onChangeFilter"
          />
        </div>
        <div class="w-[240px]">
          <NSelect
            v-model:value="store.urlParams.tag_name"
            placeholder="Thẻ"
            clearable
            value-field="label"
            label-field="label"
            size="small"
            :options="store.tagsOptions"
            :loading="store.state.isFetchingTags"
            @update:value="onChangeFilter"
            @scroll="store.onFetchMoreTags"
          />
        </div>
        <div class="w-[240px]">
          <NDatePicker
            v-model:formatted-value="store.urlParams.created_at"
            value-format="yyyy-MM-dd"
            placeholder="Thời gian tạo"
            type="date"
            clearable
            size="small"
            update-value-on-close
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

    <NModal v-model:show="store.stateModal.isShowDeleteModal">
      <DeleteModal v-model:show="store.stateModal.isShowDeleteModal" @success="store.fetchData" />
    </NModal>
  </div>
</template>
