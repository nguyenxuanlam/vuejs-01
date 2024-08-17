<script setup lang="ts">
/* ----- Import Type ----- */

/* ----- Import Variables ----- */
import { useDomainStore } from './stores/domainStore'

/* ----- Import Components ----- */
import DataTable from './components/DataTable.vue'
import CreateModal from './components/CreateModal.vue'
import UpdateModal from './components/UpdateModal.vue'
import HistoryCheckedModal from './components/HistoryCheckedModal.vue'
import HistoryRecordedModal from './components/HistoryRecordedModal.vue'
import { User } from '@/types'

/* ----- Global variables ----- */

//#region ----- Element Ref -----
//#endregion ----- Element Ref -----

//#region ----- Stores -----
//#endregion ----- Stores -----

//#region ----- State -----
//#endregion ----- State -----

//#region ----- Composables -----
const domainStore = useDomainStore()
domainStore.resetUrlParams()
//#endregion ----- Composables -----

//#region ----- Variables -----
//#endregion ----- Variables -----

//#region ----- Functions -----
const onChangeFilter = useDebounceFn(() => {
  domainStore.onChangePage(1)
}, 500)

//#endregion ----- Functions -----

//#region ----- Hooks -----
onBeforeMount(() => {
  domainStore.fetchData()
  if (domainStore.state.isUserWhiteListed) {
    domainStore.fetchKeywords()
  }
})
onUnmounted(() => {
  domainStore.$reset()
})
//#endregion ----- Hooks -----
</script>

<template>
  <div>
    <PageHeader title="Quản lý tên miền" tooltip="Tạo và quản lý tên miền" />

    <div class="mt-5">
      <div class="flex items-center justify-between">
        <div class="text-xl font-semibold">Danh sách tên miền</div>
        <!-- TODO: API lỗi nên tạm ẩn -->
        <NButton
          v-if="useCheckRoles([User.Role.Admin, User.Role.Editor])"
          type="primary"
          @click="domainStore.stateModal.isShowCreateModal = true"
        >
          <Icon icon="ic:round-plus" />
          {{ $t('buttons.create') }}
        </NButton>
      </div>

      <PageBlock class="mt-5">
        <!-- Filter -->
        <div class="mb-5 flex items-center gap-x-4">
          <div class="w-[280]">
            <div class="font-medium">Tên miền</div>
            <NInput
              v-model:value="domainStore.urlParams.name"
              placeholder="Tìm kiếm..."
              clearable
              @input="onChangeFilter"
            />
          </div>
          <div v-show="domainStore.state.isUserWhiteListed" class="w-[240px]">
            <div class="font-medium whitespace-nowrap">Từ khóa</div>
            <NSelect
              v-model:value="domainStore.urlParams.keywords"
              multiple
              :options="domainStore.keywordOptions"
              :loading="domainStore.state.isFetchingKeywords"
              clearable
              :max-tag-count="1"
              @update:value="onChangeFilter"
              @scroll="domainStore.onFetchMoreKeywords"
            />
          </div>
          <div>
            <div class="font-medium whitespace-nowrap">Ngày kiểm tra từ ngày đến ngày</div>
            <div class="w-[300px]" :style="{ alignItems: 'center' }">
              <NDatePicker
                v-model:formatted-value="domainStore.urlParams.checked_at"
                value-format="yyyy-MM-dd"
                type="daterange"
                update-value-on-close
                clearable
                @update:value="onChangeFilter"
              />
            </div>
          </div>
          <div>
            <div class="font-medium whitespace-nowrap">Ngày quay chụp từ ngày đến ngày</div>
            <div class="w-[300px]" :style="{ alignItems: 'center' }">
              <NDatePicker
                v-model:formatted-value="domainStore.urlParams.recorded_at"
                value-format="yyyy-MM-dd"
                type="daterange"
                update-value-on-close
                clearable
                @update:value="onChangeFilter"
              />
            </div>
          </div>
        </div>
        <DataTable
          :is-fetching="domainStore.state.isFetching"
          :data="domainStore.listData"
          @change-page="domainStore.onChangePage"
          @change-page-size="domainStore.onChangePageSize"
        />
      </PageBlock>
    </div>

    <!-- Modals -->
    <NModal v-model:show="domainStore.stateModal.isShowCreateModal">
      <CreateModal
        v-model:show="domainStore.stateModal.isShowCreateModal"
        @success="domainStore.fetchData"
      />
    </NModal>

    <NModal v-model:show="domainStore.stateModal.isShowUpdateModal">
      <UpdateModal
        :id="domainStore.editId"
        v-model:show="domainStore.stateModal.isShowUpdateModal"
        @success="domainStore.fetchData"
      />
    </NModal>

    <NModal
      v-model:show="domainStore.stateModal.isShowHistoryCheckedModal"
      :style="{ width: '85%' }"
    >
      <HistoryCheckedModal
        v-model:show="domainStore.stateModal.isShowHistoryCheckedModal"
        :data="domainStore.listHistoryChecked"
        :is-fetching="domainStore.state.isFetchingHistoryChecked"
        @change-page="domainStore.onChangeHistoryCheckedPage"
        @change-page-size="domainStore.onChangeHistoryCheckedPageSize"
      />
    </NModal>

    <NModal
      v-model:show="domainStore.stateModal.isShowHistoryRecordedModal"
      :style="{ width: '85%' }"
    >
      <HistoryRecordedModal
        v-model:show="domainStore.stateModal.isShowHistoryRecordedModal"
        :data="domainStore.listHistoryRecorded"
        :is-fetching="domainStore.state.isFetchingHistoryRecorded"
        @change-page="domainStore.onChangeHistoryRecordedPage"
        @change-page-size="domainStore.onChangeHistoryRecordedPageSize"
      />
    </NModal>
  </div>
</template>
