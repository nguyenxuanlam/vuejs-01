<script setup lang="ts">
/* ----- Import Type ----- */
import { User } from '@/types'

/* ----- Import Variables ----- */
import { useAutoCheckStore } from '../stores/autoCheckStore'
import { format } from 'date-fns'

/* ----- Import Components ----- */

/* ----- Global variables ----- */
defineProps<{
  isFetching: boolean
}>()

const emit = defineEmits<{
  stopFlow: []
}>()

//#region ----- Element Ref -----
//#endregion ----- Element Ref -----

//#region ----- Stores -----
const { progress, progressTotal, urlParams } = storeToRefs(useAutoCheckStore())
//#endregion ----- Stores -----

//#region ----- State -----
const state = reactive({
  isPending: false,
  isStarted: false
})
//#endregion ----- State -----

//#region ----- Composables -----
const { getCatchMsg, showMessageError } = useHelper()
const $message = useMessage()
//#endregion ----- Composables -----

//#region ----- Variables -----
const currentDate = format(new Date(), 'yyyy-MM-dd')
const dataSummaries = computed(() => [
  {
    title: 'Kiểm tra từ khóa',
    time: 'Đang xử lý',
    percent: progress.value?.processingKeyword.toFixed(0),
    status: progress.value?.processingKeyword === 100
  },
  {
    title: 'Kiểm tra Redirect 5 ngày',
    time: 'Đang xử lý',
    percent: progress.value?.processing5days.toFixed(0),
    status: progress.value?.processing5days === 100
  },
  {
    title: 'Kiểm tra Redirect 15 ngày',
    time: 'Đang xử lý',
    percent: progress.value?.processing15days.toFixed(0),
    status: progress.value?.processing15days === 100
  },
  {
    title: 'Kiểm tra Website',
    time: progress.value?.check.timeCheck ?? '0 giờ 0 phút 0 giây',
    percent: progress.value?.check.processingChecked.toFixed(0),
    status: progress.value?.check.processingChecked === 100
  },
  {
    title: 'Kiểm tra Quay chụp',
    time: progress.value?.record.timeRecord ?? '0 giờ 0 phút 0 giây',
    percent: progress.value?.record.processingRecorded.toFixed(0),
    status: progress.value?.record.processingRecorded === 100
  }
])
//#endregion ----- Variables -----

//#region ----- Functions -----
async function stopFlow() {
  state.isPending = true

  try {
    await apiFlow.stop()
    // $message.success('Đã dừng toàn bộ tiến trình!')
    emit('stopFlow')
  } catch (error) {
    showMessageError(getCatchMsg(error))
  }

  state.isPending = false
  state.isStarted = false
}

async function startFlow() {
  state.isPending = true

  try {
    await apiFlow.start()
    // $message.success('Đã bắt đầu toàn bộ tiến trình!')
  } catch (error) {
    showMessageError(getCatchMsg(error))
  }

  state.isPending = false
  state.isStarted = true
}

function handleStopFlow() {
  const dialog = window.$dialog.warning({
    title: 'Xác nhận dừng tiến trình',
    content: `Dừng tiến trình sẽ chạy toàn bộ lại từ đầu. Bạn có chắc chắn muốn dừng không?`,
    positiveText: 'Dừng tiến trình',
    negativeText: 'Hủy',
    onPositiveClick: async () => {
      dialog.loading = true
      dialog.closable = false
      dialog.closeOnEsc = false
      dialog.maskClosable = false

      await stopFlow()

      dialog.loading = false
    }
  })
}

function handleRestart() {
  const dialog = window.$dialog.warning({
    title: 'Xác nhận chạy lại tiến trình',
    content: `Chạy lại tiến trình sẽ xóa toàn bộ và chạy lại từ đầu. Bạn có chắc chắn muốn chạy lại không?`,
    positiveText: 'Chạy lại tiến trình',
    negativeText: 'Hủy',
    onPositiveClick: async () => {
      dialog.loading = true
      dialog.closable = false
      dialog.closeOnEsc = false
      dialog.maskClosable = false

      await stopFlow()
      await startFlow()
      $message.success('Chạy lại tiến trình thành công!')

      dialog.loading = false
    }
  })
}

//#endregion ----- Functions -----

//#region ----- Hooks -----
//#endregion ----- Hooks -----
</script>

<template>
  <div class="mt-[17px]">
    <div class="text-body-medium font-semibold text-[#4B4B4B]">
      Tổng tiến trình:
      <!-- <span class="italic">19 giờ 34 phút 25 giây</span> -->
    </div>

    <div class="flex gap-4 items-center justify-between">
      <CProgress :percent="progressTotal" />

      <div
        v-if="useCheckRoles([User.Role.Admin, User.Role.Editor])"
        class="flex items-center gap-x-2"
      >
        <NButton
          class="!px-5 py-2"
          type="primary"
          :disabled="state.isPending || currentDate != urlParams.date"
          :loading="state.isPending"
          @click="handleRestart"
        >
          <template #icon>
            <Icon icon="fluent:replay-16-regular" />
          </template>
          Chạy lại
        </NButton>
        <!-- <NButton
          v-else
          class="!px-5 py-2"
          type="primary"
          :disabled="state.isPending || $props.isFetching || progressTotal === 100"
          :loading="state.isPending"
          @click="handleStopFlow"
        >
          <template #icon>
            <Icon icon="carbon:close-outline" />
          </template>
          Dừng tất cả
        </NButton> -->
      </div>
    </div>

    <PageBlock class="mt-5 bg-[#FAF8FF] shadow-[0_0_4px_0_#00000026]">
      <div class="xl:pl-8 lg:pl-0 py-8 grid lg:grid-cols-5 grid-cols-1">
        <div v-for="(item, index) in dataSummaries" :key="index" class="flex flex-col gap-3 group">
          <div class="flex items-center">
            <div class="w-10 h-10">
              <CIcon v-if="item.status" icon="icon-check-circle" class="text-[40px] text-success" />
              <div
                v-else
                class="w-[40px] h-[40px] border border-gray-700 rounded-full flex justify-center"
              >
                <div
                  class="w-full m-[2px] bg-[#797979] rounded-full flex justify-center items-center text-white"
                >
                  <span class="text-xs">{{ item.percent }}%</span>
                </div>
              </div>
            </div>

            <div class="w-full h-1">
              <div
                class="border-success border-t-2 mx-8 group-last:border-0"
                :class="{
                  '!border-gray-700 border-dashed': !item.status
                }"
              ></div>
            </div>
          </div>
          <p>Bước {{ index + 1 }}</p>
          <h4 class="text-body leading-[100%] font-bold">{{ item.title }}</h4>
          <div class="mt-auto">
            <NTag
              v-if="item.status"
              type="success"
              :bordered="false"
              class="!text-xs font-semibold !px-3"
            >
              Hoàn thành!
            </NTag>
            <NTag v-else :bordered="false" class="!text-xs !px-3">{{ item.time }}</NTag>
          </div>
        </div>
      </div>
    </PageBlock>
  </div>
</template>
