<script setup lang="ts">
/* ----- Import Type ----- */

/* ----- Import Variables ----- */
import { useAutoCheckStore } from './stores/autoCheckStore'
import { useIntervalFn } from '@vueuse/core'

/* ----- Import Components ----- */
import SummaryView from './components/SummaryView.vue'
import CheckKeyword from './components/CheckKeyword/IndexView.vue'
import CheckRedirectFiveDay from './components/CheckRedirectFiveDay/IndexView.vue'
import CheckRedirectFifteenDay from './components/CheckRedirectFifteenDay/IndexView.vue'
import CheckWebsite from './components/CheckWebsite/IndexView.vue'
import CheckRecord from './components/CheckRecord/IndexView.vue'

/* ----- Global variables ----- */

//#region ----- Element Ref -----
const checkKeywordRef = ref<InstanceType<typeof CheckKeyword>>()
const checkRedirectFiveDayRef = ref<InstanceType<typeof CheckRedirectFiveDay>>()
const checkRedirectFifteenDayRef = ref<InstanceType<typeof CheckRedirectFifteenDay>>()
const checkWebsiteRef = ref<InstanceType<typeof CheckWebsite>>()
const checkRecordRef = ref<InstanceType<typeof CheckRecord>>()
//#endregion ----- Element Ref -----

//#region ----- Stores -----
const store = useAutoCheckStore()
store.resetUrlParams()
//#endregion ----- Stores -----

//#region ----- State -----
const state = reactive({
  isFetching: false,
  isPendingFetchProgress: false
})
//#endregion ----- State -----

//#region ----- Composables -----
const { pause, resume, isActive } = useIntervalFn(
  async () => {
    if (state.isPendingFetchProgress) return
    if (store.progressTotal >= 100) {
      pause()
    }
    state.isPendingFetchProgress = true

    try {
      await store.fetchProgress()

      const fetchs: Promise<void>[] = []
      if (store.progressChange.keyword && checkRecordRef.value) {
        fetchs.push(checkRecordRef.value.fetchData())
      }
      if (store.progressChange.redirect5days && checkRedirectFiveDayRef.value) {
        fetchs.push(checkRedirectFiveDayRef.value.fetchData())
      }
      if (store.progressChange.redirect15days && checkRedirectFifteenDayRef.value) {
        fetchs.push(checkRedirectFifteenDayRef.value.fetchData())
      }
      if (store.progressChange.check && checkWebsiteRef.value) {
        fetchs.push(checkWebsiteRef.value.fetchData())
      }
      if (store.progressChange.record && checkRecordRef.value) {
        fetchs.push(checkRecordRef.value.fetchData())
      }
      await Promise.all(fetchs)
    } catch (error) {
      console.log(error)
    }

    state.isPendingFetchProgress = false
  },
  10000,
  { immediate: false }
)
//#endregion ----- Composables -----

//#region ----- Variables -----
//#endregion ----- Variables -----

//#region ----- Functions -----
async function fetchData(isReload = false) {
  state.isFetching = true
  try {
    await Promise.all([
      checkKeywordRef.value?.fetchData(isReload),
      checkRedirectFiveDayRef.value?.fetchData(isReload),
      checkRedirectFifteenDayRef.value?.fetchData(isReload),
      checkRecordRef.value?.fetchData(isReload),
      checkWebsiteRef.value?.fetchData(isReload)
    ])
  } catch (error) {
    console.error(error)
  }
  state.isFetching = false
}

const onChangeFilter = useDebounceFn(async () => {
  pause()
  await Promise.all([store.fetchProgress(), fetchData(true)])
  if (!isActive.value) resume()
}, 100)

async function onStopFlow() {
  pause()
  await Promise.all([store.fetchProgress(), fetchData()])
  resume()
}

function disablePreviousDate(ts: number) {
  return ts > Date.now()
}
//#endregion ----- Functions -----

//#region ----- Hooks -----
onMounted(async () => {
  await Promise.all([store.fetchProgress(), fetchData()])
  resume()
})
//#endregion ----- Hooks -----
</script>

<template>
  <div>
    <div class="flex justify-between items-center">
      <PageHeader title="Kiểm tra tự động" tooltip="Quản lý kiểm tra tự động" />

      <div class="flex items-center gap-2">
        <div class="text-body-medium text-black">Thời gian</div>
        <NDatePicker
          v-model:formatted-value="store.urlParams.date"
          :disabled="state.isFetching"
          value-format="yyyy-MM-dd"
          type="date"
          update-value-on-close
          :is-date-disabled="disablePreviousDate"
          @update:formatted-value="onChangeFilter"
        />
      </div>
    </div>

    <SummaryView :is-fetching="state.isFetching" @stop-flow="onStopFlow" />

    <CheckKeyword ref="checkKeywordRef" />

    <CheckRedirectFiveDay ref="checkRedirectFiveDayRef" />

    <CheckRedirectFifteenDay ref="checkRedirectFifteenDayRef" />

    <CheckWebsite ref="checkWebsiteRef" />

    <CheckRecord ref="checkRecordRef" />
  </div>
</template>
