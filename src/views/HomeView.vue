<script setup lang="ts">
/* ----- Import Type ----- */
import type { Summary } from '@/types'

/* ----- Import Variables ----- */
import { format } from 'date-fns'

/* ----- Import Components ----- */

/* ----- Global variables ----- */
const urlParams = useUrlSearchParams<{
  date: string
}>()
urlParams.date = urlParams.date || format(new Date(), 'yyyy-MM-dd')
//#region ----- Element Ref -----
//#endregion ----- Element Ref -----

//#region ----- Stores -----
//#endregion ----- Stores -----

//#region ----- State -----
const state = reactive({
  isPending: false
})

//#endregion ----- State -----

//#region ----- Composables -----
const { showMessageError } = useHelper()
//#endregion ----- Composables -----

//#region ----- Variables -----
const dataSummaries = ref<Summary.Item>()
//#endregion ----- Variables -----

//#region ----- Functions -----
const getSummaries = async () => {
  state.isPending = true
  try {
    const res = await apiSummaries.getData(urlParams)
    dataSummaries.value = res.data.data
  } catch (error: any) {
    showMessageError(error)
  }
  state.isPending = false
}

const onChangeDate = useDebounceFn(() => {
  getSummaries()
}, 500)
//#endregion ----- Functions -----

//#region ----- Hooks -----
onMounted(() => {
  getSummaries()
})
//#endregion ----- Hooks -----
</script>

<template>
  <div class="hidden">
    <PageHeader title="Báo cáo thống kê" tooltip="Xem thống kê theo ngày" />

    <div class="mt-5">
      <!-- Filter -->
      <div class="mb-5 flex items-center gap-x-4">
        <div class="w-[280px]">
          <div class="font-medium">Chọn ngày</div>
          <NDatePicker
            v-model:formatted-value="urlParams.date"
            value-format="yyyy-MM-dd"
            type="date"
            update-value-on-close
            @update:value="onChangeDate"
          />
        </div>
      </div>

      <div v-if="state.isPending" class="grid place-content-center">
        <NSpin class="p-5" />
      </div>
      <div v-else class="flex flex-col gap-y-10">
        <div>
          <div class="text-xl font-semibold">Từ khóa</div>
          <div class="grid grid-cols-5 gap-2 mt-3">
            <NAlert type="success" title="Tổng từ khóa">
              <template #icon>
                <Icon icon="fluent:keyboard-16-regular" />
              </template>
              <span class="font-bold text-lg">{{ dataSummaries?.total_keyword }}</span>
            </NAlert>
            <NAlert type="success" title="Tổng tên miền">
              <template #icon>
                <Icon icon="icon-park-solid:web-page" />
              </template>
              <span class="font-bold text-lg">{{ dataSummaries?.total_domain }}</span>
            </NAlert>
            <NAlert type="success" title="Thời gian tìm kiếm">
              <template #icon>
                <Icon icon="mdi:home-search-outline" />
              </template>
              <span class="font-bold text-lg">{{ dataSummaries?.total_time_search }}</span>
            </NAlert>
            <NAlert type="success" title="Thời gian bắt đầu">
              <template #icon>
                <Icon icon="mdi:stopwatch-play-outline" />
              </template>
              <span class="font-bold text-lg">{{
                dataSummaries?.start_search_keyword
                  ? $d(dataSummaries?.start_search_keyword, 'fullDate')
                  : ''
              }}</span>
            </NAlert>
            <NAlert type="success" title="Thời gian lần cuối">
              <template #icon>
                <Icon icon="mdi:stopwatch-stop-outline" />
              </template>
              <span class="font-bold text-lg">{{
                dataSummaries?.last_search_keyword
                  ? $d(dataSummaries?.last_search_keyword, 'fullDate')
                  : ''
              }}</span>
            </NAlert>
          </div>
        </div>

        <div>
          <div class="text-xl font-semibold">Kiểm tra website</div>
          <div class="grid grid-cols-5 gap-2 mt-3">
            <NAlert type="info" title="Tổng tên miền">
              <template #icon>
                <Icon icon="icon-park-solid:web-page" />
              </template>
              <span class="font-bold text-lg">
                {{ dataSummaries?.total_domain_check }}
              </span>
            </NAlert>
            <NAlert type="info" title="Tổng máy chủ">
              <template #icon>
                <Icon icon="flowbite:server-outline" />
              </template>
              <span class="font-bold text-lg">{{ dataSummaries?.total_server_check }}</span>
            </NAlert>
            <NAlert type="info" title="Thời gian kiểm tra">
              <template #icon>
                <Icon icon="material-symbols-light:fact-check-outline" />
              </template>
              <span class="font-bold text-lg">{{ dataSummaries?.total_time_check_domain }}</span>
            </NAlert>
            <NAlert type="info" title="Thời gian bắt đầu">
              <template #icon>
                <Icon icon="mdi:stopwatch-play-outline" />
              </template>
              <span class="font-bold text-lg">{{
                dataSummaries?.start_check_domain
                  ? $d(dataSummaries?.start_check_domain, 'fullDate')
                  : ''
              }}</span>
            </NAlert>
            <NAlert type="info" title="Thời gian lần cuối">
              <template #icon>
                <Icon icon="mdi:stopwatch-stop-outline" />
              </template>
              <span class="font-bold text-lg">{{
                dataSummaries?.last_check_domain
                  ? $d(dataSummaries?.last_check_domain, 'fullDate')
                  : ''
              }}</span>
            </NAlert>
          </div>
        </div>

        <div>
          <div class="text-xl font-semibold">Quay chụp website</div>
          <div class="grid grid-cols-5 mt-2 gap-2">
            <NAlert type="warning" title="Tổng tên miền">
              <template #icon>
                <Icon icon="icon-park-solid:web-page" />
              </template>
              <span class="font-bold text-lg">{{ dataSummaries?.total_domain_record }}</span>
            </NAlert>
            <NAlert type="warning" title="Tổng máy chủ">
              <template #icon>
                <Icon icon="flowbite:server-outline" />
              </template>
              <span class="font-bold text-lg">{{ dataSummaries?.total_server_record }}</span>
            </NAlert>
            <NAlert type="warning" title="Thời gian quay chup">
              <template #icon>
                <Icon icon="tabler:capture-filled" />
              </template>
              <span class="font-bold text-lg">{{ dataSummaries?.total_time_record_domain }}</span>
            </NAlert>
            <NAlert type="warning" title="Thời gian bắt đầu">
              <template #icon>
                <Icon icon="mdi:stopwatch-play-outline" />
              </template>
              <span class="font-bold text-lg">{{
                dataSummaries?.start_record_domain
                  ? $d(dataSummaries?.start_record_domain, 'fullDate')
                  : ''
              }}</span>
            </NAlert>
            <NAlert type="warning" title="Thời gian lần cuối">
              <template #icon>
                <Icon icon="mdi:stopwatch-stop-outline" />
              </template>
              <span class="font-bold text-lg">{{
                dataSummaries?.last_record_domain
                  ? $d(dataSummaries?.last_record_domain, 'fullDate')
                  : ''
              }}</span>
            </NAlert>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
