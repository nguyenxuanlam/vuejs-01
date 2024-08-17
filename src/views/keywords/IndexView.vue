<script setup lang="ts">
/* ----- Import Type ----- */
import { User } from '@/types'

/* ----- Import Variables ----- */
import { useKeywordStore } from './stores/useKeywords'

/* ----- Import Components ----- */
import DataTable from './components/DataTable.vue'
import CreateModal from './components/CreateModal.vue'
import UpdateModal from './components/UpdateModal.vue'
import DomainModal from './components/DomainModal.vue'
import DeleteModal from '@/views/keywords/components/DeleteModal.vue'

/* ----- Global variables ----- */

//#region ----- Element Ref -----
//#endregion ----- Element Ref -----

//#region ----- Stores -----
//#endregion ----- Stores -----

//#region ----- State -----
//#endregion ----- State -----

//#region ----- Composables -----
const keywordStore = useKeywordStore()
keywordStore.resetUrlParams()
//#endregion ----- Composables -----

//#region ----- Variables -----
let fetchDataInterval: number | null = null
//#endregion ----- Variables -----

//#region ----- Functions -----
const onChangeFilter = useDebounceFn(() => {
  keywordStore.onChangePage(1)
}, 500)

//#endregion ----- Functions -----

//#region ----- Hooks -----
onBeforeMount(async () => {
  await Promise.all([keywordStore.fetchTags(), keywordStore.fetchData()])
  // Set interval fetch data
  fetchDataInterval = setInterval(() => {
    if (keywordStore.state.pendingFetchData) return
    keywordStore.fetchData()
  }, 30000)
})
onUnmounted(() => {
  keywordStore.$reset()
  fetchDataInterval && clearInterval(fetchDataInterval)
})
//#endregion ----- Hooks -----
</script>

<template>
  <div>
    <PageHeader
      :title="$t('pages.keywords.title.root')"
      :tooltip="$t('pages.keywords.title.tooltip')"
    />

    <div class="mt-5">
      <div class="flex items-center justify-between">
        <div class="text-xl font-semibold">{{ $t('pages.keywords.title.list') }}</div>
        <div class="flex gap-2">
          <NButton
            v-if="useCheckRoles([User.Role.Admin, User.Role.Editor])"
            type="primary"
            @click="keywordStore.stateModal.isShowCreateModal = true"
          >
            <Icon icon="ic:round-plus" />
            {{ $t('buttons.create') }}
          </NButton>

          <NButton
            v-if="useCheckRoles([User.Role.Admin, User.Role.Editor])"
            type="error"
            @click="keywordStore.stateModal.isShowDeleteModal = true"
          >
            <Icon icon="mdi:tag-outline" class="mr-1" />
            Xóa bởi Tag
          </NButton>
        </div>
      </div>

      <PageBlock class="my-5">
        <!-- Filter -->
        <div class="mb-5 flex items-center gap-x-4">
          <div class="w-[320px]">
            <div class="font-medium whitespace-nowrap">{{ $t('pages.keywords.table.name') }}</div>
            <NInput
              v-model:value="keywordStore.urlParams.name"
              placeholder="Tìm kiếm..."
              clearable
              @input="onChangeFilter"
            />
          </div>
          <div class="w-[240px]">
            <div class="font-medium whitespace-nowrap">
              {{ $t('pages.keywords.table.tags') }}
            </div>
            <NSelect
              v-model:value="keywordStore.urlParams.tag"
              value-field="label"
              label-field="label"
              multiple
              :options="keywordStore.tagsOptions"
              :loading="keywordStore.state.isFetchingTags"
              clearable
              :max-tag-count="1"
              @update:value="onChangeFilter"
              @scroll="keywordStore.onFetchMoreTags"
            />
          </div>
          <div class="w-[220px]">
            <div class="font-medium whitespace-nowrap">
              {{ $t('pages.keywords.table.status') }}
            </div>
            <NSelect
              v-model:value="keywordStore.urlParams.is_run_daily"
              :options="keywordStore.statusOptions"
              clearable
              @update:value="onChangeFilter"
            />
          </div>

          <div class="w-[250px]">
            <div class="font-medium">Thời gian tạo</div>
            <NDatePicker
              v-model:formatted-value="keywordStore.urlParams.created_at"
              value-format="yyyy-MM-dd"
              type="date"
              clearable
              update-value-on-close
              @update:value="onChangeFilter"
            />
          </div>
        </div>
        <DataTable
          :is-fetching="keywordStore.state.isFetching"
          :data="keywordStore.listData"
          @change-page="keywordStore.onChangePage"
          @change-page-size="keywordStore.onChangePageSize"
        />
      </PageBlock>
    </div>

    <!-- Modals -->
    <NModal v-model:show="keywordStore.stateModal.isShowCreateModal">
      <CreateModal
        v-model:show="keywordStore.stateModal.isShowCreateModal"
        @success="keywordStore.fetchData"
      />
    </NModal>

    <NModal v-model:show="keywordStore.stateModal.isShowUpdateModal">
      <UpdateModal
        :id="keywordStore.editId"
        v-model:show="keywordStore.stateModal.isShowUpdateModal"
        @success="keywordStore.fetchData"
      />
    </NModal>

    <NModal v-model:show="keywordStore.stateModal.isShowDomainModal" class="w-1/2">
      <DomainModal
        v-model:show="keywordStore.stateModal.isShowDomainModal"
        :data="keywordStore.listDomain"
      />
    </NModal>

    <NModal v-model:show="keywordStore.stateModal.isShowDeleteModal">
      <DeleteModal
        v-model:show="keywordStore.stateModal.isShowDeleteModal"
        @success="keywordStore.fetchData"
      />
    </NModal>
  </div>
</template>
