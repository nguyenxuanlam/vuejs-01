<script setup lang="ts">
/* ----- Import Type ----- */

/* ----- Import Variables ----- */
import { useReportGroupStore } from './stores/reportGroupStore'
import { msToTime } from './composables/useDataTable'

/* ----- Import Components ----- */
import DataTable from './components/DataTable.vue'

/* ----- Global variables ----- */

//#region ----- Element Ref -----
//#endregion ----- Element Ref -----

//#region ----- Stores -----
//#endregion ----- Stores -----

//#region ----- State -----
//#endregion ----- State -----

//#region ----- Composables -----
const reportGroupStore = useReportGroupStore()
reportGroupStore.resetUrlParams()
const dialog = useDialog()
//#endregion ----- Composables -----

//#region ----- Variables -----
const totalDomains = computed(() =>
  reportGroupStore.listData.reduce((acc, cur) => acc + cur.taskTotal, 0)
)
const totalExcutionTime = computed(() =>
  reportGroupStore.listData.reduce((acc, cur) => acc + cur.excutionTotal, 0)
)
const excutionTimeAvg = computed(() => totalExcutionTime.value / totalDomains.value)

const summary = computed(() => [
  {
    title: 'Tổng domain',
    icon: 'gridicons:domains',
    value: $n(totalDomains.value, 'number')
  },
  {
    title: 'Thời gian chạy trung bình',
    icon: 'material-symbols-light:avg-time-outline-rounded',
    value: msToTime(excutionTimeAvg.value, true)
  },
  {
    title: 'Tổng thời gian chạy',
    icon: 'ic:outline-timer',
    value: msToTime(totalExcutionTime.value)
  }
])
//#endregion ----- Variables -----

//#region ----- Functions -----
const onChangeFilter = useDebounceFn(() => {
  reportGroupStore.fetchData()
}, 500)
//#endregion ----- Functions -----

//#region ----- Hooks -----
onBeforeMount(async () => {
  await reportGroupStore.fetchServers()
  if (reportGroupStore.listServers.length === 0) {
    dialog.error({
      title: 'Không có server',
      content: 'Vui lòng tạo server'
    })
    return
  }

  if (!reportGroupStore.urlParams.server_id) {
    await reportGroupStore.handleSelectServer(reportGroupStore.listServers[0].id)
  } else {
    await reportGroupStore.handleSelectServer(reportGroupStore.urlParams.server_id)
  }
})
// fetchData()
onUnmounted(() => {
  reportGroupStore.$reset()
})
//#endregion ----- Hooks -----
</script>

<template>
  <div>
    <PageHeader title="Báo cáo nhóm" tooltip="Báo cáo theo lần chạy" />

    <div class="mt-5">
      <div class="flex items-center justify-between">
        <div class="text-xl font-semibold">Danh sách báo cáo</div>
        <div class="flex items-center gap-x-2">
          <NButton
            type="primary"
            :disabled="reportGroupStore.state.isFetching"
            :loading="reportGroupStore.state.isFetching"
            @click="reportGroupStore.fetchData"
          >
            <template v-if="!reportGroupStore.state.isFetching" #icon>
              <Icon icon="ion:reload" />
            </template>
            {{ $t('buttons.reload') }}
          </NButton>
        </div>
      </div>

      <PageBlock class="mt-5">
        <div class="flex justify-between mb-2">
          <!-- Left -->
          <div class="flex gap-x-4">
            <div class="w-[250px]">
              <div class="font-medium">Thời gian</div>
              <NDatePicker
                v-model:formatted-value="reportGroupStore.urlParams.date"
                value-format="yyyy-MM-dd"
                type="date"
                update-value-on-close
                @update:value="onChangeFilter"
              />
            </div>
          </div>
          <!-- Right -->
          <div class="w-[230px] flex flex-col gap-x-2">
            <div class="font-medium">Server</div>
            <NSelect
              :value="reportGroupStore.urlParams.server_id"
              :options="reportGroupStore.listServers"
              :disabled="reportGroupStore.state.isFetching"
              value-field="id"
              label-field="name"
              @update:value="reportGroupStore.handleSelectServer"
            />
          </div>
        </div>

        <div class="my-4 flex items-center justify-center gap-x-5">
          <div
            v-for="(item, index) in summary"
            :key="index"
            class="flex flex-1 items-center gap-x-3 py-2 px-4 rounded bg-gray-100 dark:bg-gray-800"
          >
            <Icon :icon="item.icon" class="text-2xl" />
            <div>
              <div>{{ item.title }}</div>
              <div class="font-semibold text-lg">{{ item.value }}</div>
            </div>
          </div>
        </div>

        <DataTable
          :is-fetching="reportGroupStore.state.isFetching"
          :data="reportGroupStore.listData"
        />
      </PageBlock>
    </div>
  </div>
</template>
