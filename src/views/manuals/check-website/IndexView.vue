<script setup lang="ts">
/* ----- Import Type ----- */
import { User } from '@/types'
/* ----- Import Variables ----- */
import { useCheckDomainStore } from './stores/checkDomainStore'

/* ----- Import Components ----- */
import DataTable from './components/DataTable.vue'
import CreateModal from './components/CreateModal.vue'
import { useDownload } from '@/composables/utils'
import { NSpin } from 'naive-ui'

/* ----- Global variables ----- */

//#region ----- Element Ref -----
//#endregion ----- Element Ref -----

//#region ----- Stores -----
//#endregion ----- Stores -----

//#region ----- State -----
//#endregion ----- State -----

//#region ----- Composables -----
const checkDomainStore = useCheckDomainStore()
checkDomainStore.resetUrlParams()
const dialog = useDialog()
//#endregion ----- Composables -----

//#region ----- Variables -----
let fetchDataInterval: number | null = null
let fetchTaskStatisticInterval: number | null = null
const listBtnAction = computed(() => [
  {
    label: 'Export',
    key: 'export',
    icon: () => h(Icon, { icon: 'mingcute:file-export-line' }),
    props: {
      onClick: () => onExportAll()
    }
  },
  {
    label: 'Clear data',
    key: 'clear-data',
    icon: () => h(Icon, { icon: 'ph:trash' }),
    disabled: !checkDomainStore.isTypeManual,
    props: {
      onClick: () => (checkDomainStore.isTypeManual ? handleClearData() : null)
    }
  },
  {
    label: 'Retry all',
    key: 'retry-all',
    icon: () => h(Icon, { icon: 'ic:refresh' }),
    props: {
      onClick: () => handleRetryAll()
    }
  }
])
//#endregion ----- Variables -----

//#region ----- Functions -----
const onChangeFilter = useDebounceFn(() => {
  checkDomainStore.onChangePage(1)
  checkDomainStore.fetchTaskStatistic()
}, 500)

function handleClearData() {
  const _dialog = dialog.warning({
    title: 'Xác nhận xóa dữ liệu',
    content: `Bạn có chắc chắn muốn xóa toàn bộ dữ liệu?`,
    positiveText: 'Xóa',
    negativeText: 'Hủy',
    onPositiveClick: async () => {
      _dialog.loading = true

      await checkDomainStore.clearAllData()

      _dialog.loading = false
    }
  })
}

function handleRetryAll() {
  const _dialog = dialog.warning({
    title: 'Xác nhận Retry all',
    content: `Bạn có chắc chắn muốn Retry all website?`,
    positiveText: 'Retry',
    negativeText: 'Hủy',
    onPositiveClick: async () => {
      _dialog.loading = true

      await checkDomainStore.retryAll()

      _dialog.loading = false
    }
  })
}

async function onExportAll() {
  dialog.warning({
    title: 'Đang xuất dữ liệu',
    content: () =>
      h('div', { class: 'flex items-center justify-center' }, h(NSpin, { class: 'w-10 h-10' })),
    negativeText: 'Hủy'
  })

  // TODO: params
  try {
    const res = await checkDomainStore.exportAll({
      id: '668fe9e6656d69ea366654e3'
    })
    if (res?.data) {
      useDownload(res.data, 'Check website manual.xlsx')
    }
  } catch (error) {
    const { showMessageError } = useHelper()
    showMessageError(error)
  } finally {
    dialog.destroyAll()
  }
}

function onCreated() {
  checkDomainStore.fetchData()
  checkDomainStore.fetchTaskStatistic()
}
//#endregion ----- Functions -----

//#region ----- Hooks -----
onBeforeMount(async () => {
  await checkDomainStore.fetchServers()
  if (checkDomainStore.listServers.length === 0) {
    dialog.error({
      title: 'Không có server',
      content: 'Vui lòng tạo server'
    })
    return
  }

  if (!checkDomainStore.urlParams.server_id) {
    await checkDomainStore.handleSelectServer(checkDomainStore.listServers[0].id)
  } else {
    await checkDomainStore.handleSelectServer(checkDomainStore.urlParams.server_id)
  }

  // fetch data
  fetchDataInterval = setInterval(() => {
    if (checkDomainStore.state.pendingFetchData) return
    const totalDone = checkDomainStore.listData.filter((item) => item.status === 2).length
    if (totalDone === checkDomainStore.listData.length) {
      return
    }
    checkDomainStore.fetchData()
  }, 10000)
  // fetch progress
  fetchTaskStatisticInterval = setInterval(() => {
    if (checkDomainStore.state.pendingTaskStatistic) return
    if (checkDomainStore.getProgressPercent >= 100) {
      return
    }
    checkDomainStore.fetchTaskStatistic()
  }, 10000)
})
// fetchData()
onUnmounted(() => {
  checkDomainStore.$reset()
  fetchDataInterval && clearInterval(fetchDataInterval)
  fetchTaskStatisticInterval && clearInterval(fetchTaskStatisticInterval)
})
//#endregion ----- Hooks -----
</script>

<template>
  <div>
    <PageHeader title="Kiểm tra website" tooltip="Quản lý kiểm tra website" />

    <div class="mt-5">
      <div class="flex items-center justify-between">
        <div class="text-xl font-semibold">Danh sách kiểm tra website</div>
        <div class="flex items-center gap-x-2">
          <div class="flex items-center gap-x-2 mr-3">
            <NTooltip trigger="hover">
              <template #trigger>
                <div class="w-[150px]">
                  <NProgress
                    type="line"
                    :percentage="checkDomainStore.getProgressPercent"
                    indicator-placement="inside"
                    :processing="checkDomainStore.getProgressPercent < 100"
                    :status="checkDomainStore.getProgressPercent < 100 ? 'default' : 'success'"
                    rail-color="#d7d9da"
                  />
                </div>
              </template>
              {{ $n(checkDomainStore.taskStatistic?.done ?? 0) }}/{{
                $n(checkDomainStore.taskStatistic?.total ?? 0)
              }}
            </NTooltip>
          </div>
          <template v-if="useCheckRoles([User.Role.Admin, User.Role.Editor])">
            <NButton
              type="primary"
              :disabled="!checkDomainStore.isTypeManual"
              @click="checkDomainStore.stateModal.isShowCreateModal = true"
            >
              <Icon icon="ic:round-plus" />
              {{ $t('buttons.create') }}
            </NButton>
            <NDropdown trigger="click" placement="bottom-end" :options="listBtnAction">
              <NButton tertiary>
                <template #icon>
                  <Icon icon="mdi:dots-vertical" />
                </template>
              </NButton>
            </NDropdown>
          </template>
        </div>
      </div>

      <PageBlock class="mt-5">
        <div class="flex justify-between mb-2">
          <!-- Left -->
          <div class="flex gap-x-4">
            <div>
              <div class="font-medium">Tìm kiếm</div>
              <NInput
                v-model:value="checkDomainStore.urlParams.search"
                placeholder="Tìm kiếm..."
                @update:value="onChangeFilter"
              />
            </div>
            <div class="w-[250px]">
              <div class="font-medium">Thời gian</div>
              <NDatePicker
                v-model:formatted-value="checkDomainStore.urlParams.date"
                value-format="yyyy-MM-dd"
                type="date"
                clearable
                update-value-on-close
                @update:value="onChangeFilter"
              />
            </div>
            <div class="w-[220px]">
              <div class="font-medium whitespace-nowrap">Loại</div>
              <NSelect
                v-model:value="checkDomainStore.urlParams.type"
                :options="checkDomainStore.typeOptions"
                @update:value="onChangeFilter"
              />
            </div>
          </div>
          <!-- Right -->
          <div class="w-[230px] flex flex-col gap-x-2">
            <div class="font-medium">Server</div>
            <NSelect
              :value="checkDomainStore.urlParams.server_id"
              :options="checkDomainStore.listServers"
              :disabled="checkDomainStore.state.isFetching"
              value-field="id"
              label-field="name"
              @update:value="checkDomainStore.handleSelectServer"
            />
          </div>
        </div>

        <DataTable
          :is-fetching="checkDomainStore.state.isFetching"
          :data="checkDomainStore.listData"
          @change-page="checkDomainStore.onChangePage"
          @change-page-size="checkDomainStore.onChangePageSize"
        />
      </PageBlock>

      <!-- Modals -->
      <NModal v-model:show="checkDomainStore.stateModal.isShowCreateModal">
        <CreateModal
          v-model:show="checkDomainStore.stateModal.isShowCreateModal"
          @success="onCreated"
        />
      </NModal>
    </div>
  </div>
</template>
