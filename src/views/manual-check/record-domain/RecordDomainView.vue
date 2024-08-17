<script setup lang="ts">
/* ----- Import Type ----- */
import { NSpin, type FormInst } from 'naive-ui'

/* ----- Import Variables ----- */
import { useDomainRecordStore } from './stores/domainRecordStore'
import useFormData from './composables/useFormData'
import useTableResult from './composables/useTableResult'
import { useClipboard } from '@vueuse/core'

/* ----- Import Components ----- */
import DataTable from './components/DataTable.vue'
import { Session } from '@/types'

/* ----- Global variables ----- */

//#region ----- Element Ref -----
const inputKeywordFileRef = ref<HTMLInputElement>()
const inputDomainFileRef = ref<HTMLInputElement>()
const formRef = ref<FormInst | null>(null)
//#endregion ----- Element Ref -----

//#region ----- Stores -----
const domainRecordStore = useDomainRecordStore()
domainRecordStore.resetUrlParams()
//#endregion ----- Stores -----

//#region ----- State -----
const state = reactive({
  isPendingFetchData: false,
  isPending: false
})
//#endregion ----- State -----

//#region ----- Composables -----
const { formData, rules } = useFormData()
const { showMessageError } = useHelper()
const { ensureHttp } = useEnsureHttp()
const $dialog = useDialog()
const $message = useMessage()
const { copy } = useClipboard()

const tableFound = useTableResult(domainRecordStore.urlParams, Session.StatusProcess.FinishFound)
const tableNotFound = useTableResult(
  domainRecordStore.urlParams,
  Session.StatusProcess.FinishNotFound
)
const tableUnknown = useTableResult(
  domainRecordStore.urlParams,
  Session.StatusProcess.FinishUnknown
)
//#endregion ----- Composables -----

//#region ----- Variables -----
let fetchDataInterval: number | null = null
let fetchProgressInterval: number | null = null
const keywords = ref<string>('')
const domains = ref<string>('')

const listData = computed(() => [
  {
    label: 'Tên miền chứa từ khóa',
    tooltip: 'Kết quả kiểm tra các tên miền có chứa từ khóa',
    statusProcess: Session.StatusProcess.FinishFound,
    data: tableFound
  },
  {
    label: 'Đánh giá tên miền thủ công',
    tooltip: 'Danh sách các tên miền cần kiểm tra thủ công',
    statusProcess: Session.StatusProcess.FinishUnknown,
    data: tableUnknown
  },
  {
    label: 'Tên miền không chứa từ khóa',
    tooltip: 'Kết quả kiểm tra các tên miền không chứa từ khóa',
    statusProcess: Session.StatusProcess.FinishNotFound,
    data: tableNotFound
  }
])
//#endregion ----- Variables -----

//#region ----- Functions -----
async function fetchData(isReload: boolean = false) {
  if (state.isPendingFetchData) return

  state.isPendingFetchData = true
  try {
    if (isReload) {
      tableFound.state.isFetching = true
      tableNotFound.state.isFetching = true
      tableUnknown.state.isFetching = true
      formData.domain = []
      formData.keywords = []
    }
    await Promise.all([
      tableFound.fetchData(),
      tableNotFound.fetchData(),
      tableUnknown.fetchData(),
      fetchDataDetailSession()
    ])
  } catch (error: any) {
    showMessageError(error)
  }
  state.isPendingFetchData = false
}

async function onSubmit() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      state.isPending = true
      try {
        await apiSessions.create(formData)

        domainRecordStore.urlParams.manual_sessions_id = undefined
        await domainRecordStore.fetchListSession()
        await Promise.all([fetchData(true), domainRecordStore.fetchProgress()])
        $message.success('Tạo phiên lọc và quay chụp thành công')
      } catch (error: any) {
        showMessageError(error)
      }
      state.isPending = false
    }
  })
}

async function onInputKeywords(value: string) {
  formData.keywords = value.split('\n').filter((item) => item.trim() !== '')
  keywords.value = value
}

async function onInputDomains(value: string) {
  formData.domain = value
    .split('\n')
    .filter((item) => item.trim() !== '')
    .map((item) => ensureHttp(item))
  domains.value = value
}

function onChangeFileKeyword(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      keywords.value = content
      onInputKeywords(content)
    }
    reader.readAsText(file)
  }
  target.value = ''
}

function onChangeFileDomain(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      domains.value = content
      onInputDomains(content)
    }
    reader.readAsText(file)
  }
  target.value = ''
}

const onChangeFilter = useDebounceFn(() => {
  fetchData(true)
  domainRecordStore.fetchProgress()
}, 100)

const onSearch = useDebounceFn(() => {
  fetchData(true)
  domainRecordStore.fetchProgress()
}, 500)

async function onExport(statusProcess: Session.StatusProcess) {
  const dialog = $dialog.warning({
    title: 'Đang xuất dữ liệu',
    content: () =>
      h('div', { class: 'flex items-center justify-center' }, h(NSpin, { class: 'w-10 h-10' })),
    closable: false,
    closeOnEsc: false,
    maskClosable: false
  })

  try {
    const res = await apiExport.manualSession({
      manual_sessions_id: domainRecordStore.urlParams.manual_sessions_id,
      type: 'RECORD',
      status_process: statusProcess,
      search: domainRecordStore.urlParams.search
    })
    if (res?.data) {
      switch (statusProcess) {
        case Session.StatusProcess.FinishFound:
          useDownload(res.data, 'Record domain - Chứa từ khóa.xlsx')
          break
        case Session.StatusProcess.FinishUnknown:
          useDownload(res.data, 'Record domain - Đánh giá thủ công.xlsx')
          break
        case Session.StatusProcess.FinishNotFound:
          useDownload(res.data, 'Record domain - Không chứa từ khóa.xlsx')
          break
      }
    }
  } catch (error) {
    const { showMessageError } = useHelper()
    showMessageError(error)
  }
  dialog.destroy()
}

function onDeleteSession() {
  const manualSessionsId = domainRecordStore.urlParams.manual_sessions_id
  if (typeof manualSessionsId !== 'number') return
  const dialog = window.$dialog.warning({
    title: 'Xác nhận xóa session',
    content: `Bạn có chắc chắn muốn xóa session ID ${manualSessionsId}?`,
    positiveText: 'Xóa',
    negativeText: 'Hủy',
    onPositiveClick: async () => {
      dialog.loading = true

      try {
        await apiSessions.delete(manualSessionsId)
        window.$message.success(`Xóa session ID ${manualSessionsId} thành công`)
        fetchData(true)
        domainRecordStore.fetchListSession()
      } catch (error: any) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }

      dialog.loading = false
    }
  })
}

async function copyToClipboard(data: any) {
  domainRecordStore.state.isFetchingCopySession = true
  if (data[0]) {
    let formattedText = ''
    const title = 'Domain name\tTrạng thái\tChuyển hướng\tẢnh\tVideo\tThời gian'
    try {
      const res = await apiSessions.copySessionHistory({
        type: 'RECORD',
        manual_sessions_id: data[0].manual_sessions_id,
        status_process: data[0].status_process,
        search: domainRecordStore.urlParams.search
      })
      if (res?.data?.data) {
        res.data.data.map((item: any) => {
          formattedText += `${item.domain}\t${getStatus(item.status_domain)}\t${item.domainRedirect ?? '-'}\t${item.imagePath ?? '-'}\t${item.videoPath ?? ''}\t${item.finished_at}\n`
        })
        const finalText = `${title}\n${formattedText}`
        $message.success('Copy thành công')
        copy(finalText)
      }
    } catch (error) {
      console.log(error)
      $message.warning('Không có dữ liệu để copy')
    }
  }
  domainRecordStore.state.isFetchingCopySession = false
}

function getStatus(status: number) {
  switch (status) {
    case Session.StatusDomain.X:
      return 'Tên miền X'
    case Session.StatusDomain.YBlock:
      return 'Tên miền Y'
    case Session.StatusDomain.Whitelist:
      return 'Whitelist'
    default:
      return '-'
  }
}

const renderLabel = (option: any) => {
  return [
    h(
      'span',
      {
        class: 'font-medium text-[13px]',
        style: { display: 'inline-block' }
      },
      {
        default: () => option.label
      }
    ),
    h(
      'span',
      {
        class: 'text-[#956809] text-[13px] font-semibold'
      },
      {
        default: () => ` [${option.total}]`
      }
    )
  ]
}

const onResetData = async () => {
  await onInputKeywords('')
  await onInputDomains('')
  fetchDataInterval && clearInterval(fetchDataInterval)
  fetchProgressInterval && clearInterval(fetchProgressInterval)

  state.isPendingFetchData = true
  try {
    tableFound.onResetData()
    tableNotFound.onResetData()
    tableUnknown.onResetData()

    domainRecordStore.progress = {
      total: 0,
      done: 0
    }
  } catch (error: any) {
    showMessageError(error)
  }
  state.isPendingFetchData = false
}

async function fetchDataDetailSession() {
  try {
    if (domainRecordStore.urlParams.manual_sessions_id) {
      const res = await apiSessions.getDetail(domainRecordStore.urlParams.manual_sessions_id)
      const resData = res.data.data
      formData.domain = resData.domain
      formData.keywords = resData.keywords
    }
  } catch (error: any) {
    showMessageError(error)
  }
}
//#endregion ----- Functions -----

//#region ----- Hooks -----
onMounted(async () => {
  await domainRecordStore.fetchListSession()
  await Promise.all([fetchData(), domainRecordStore.fetchProgress()])

  fetchDataInterval = setInterval(() => {
    if (state.isPendingFetchData) return
    if (domainRecordStore.progress.done === domainRecordStore.progress.total) {
      return
    }
    fetchData()
  }, 10000)

  fetchProgressInterval = setInterval(() => {
    if (domainRecordStore.state.pendingFetchProgress) return
    if (domainRecordStore.progress.done === domainRecordStore.progress.total) {
      return
    }
    domainRecordStore.fetchProgress()
  }, 10000)
})

onBeforeUnmount(() => {
  domainRecordStore.resetUrlParams()
  fetchDataInterval && clearInterval(fetchDataInterval)
  fetchProgressInterval && clearInterval(fetchProgressInterval)
})
//#endregion ----- Hooks -----
</script>

<template>
  <div>
    <div class="flex justify-start items-end gap-x-5">
      <NForm
        ref="formRef"
        class="flex flex-1 gap-x-5"
        :show-label="false"
        require-mark-placement="left"
        :model="formData"
        :rules="rules"
        :show-feedback="false"
        @submit.prevent="onSubmit"
      >
        <div class="flex-1">
          <div class="flex items-center justify-between">
            <div>
              <PageHeader
                title="Danh sách từ khóa"
                tooltip="Nhập danh sách tên miền cần kiểm tra"
                size="small"
                placement="right-end"
                tooltip-description="(Nhập từng từ khóa cần kiểm tra vào mỗi dòng)"
              />
            </div>
            <div>
              <CIcon
                icon="icon-upload-cloud"
                class="text-2xl text-primary-600 cursor-pointer"
                @click="inputKeywordFileRef?.click()"
              />
              <input
                ref="inputKeywordFileRef"
                type="file"
                class="hidden"
                @change="onChangeFileKeyword"
              />
            </div>
          </div>

          <NFormItem path="keywords">
            <NInput
              :value="formData.keywords?.join('\n')"
              class="mt-2 h-[98px]"
              placeholder="Mỗi dòng một từ khóa"
              type="textarea"
              :autosize="{
                minRows: 3,
                maxRows: 3
              }"
              clearable
              @input="onInputKeywords"
            >
              <template #clear-icon>
                <NButton
                  secondary
                  size="small"
                  class="right-[10px] top-[24px] absolute hover:!text-[#E5540C]"
                >
                  <template #icon>
                    <CIcon icon="icon-trash" />
                  </template>
                </NButton>
              </template>
            </NInput>
          </NFormItem>
        </div>

        <div class="flex-1">
          <div>
            <div class="flex items-center justify-between">
              <div>
                <PageHeader
                  title="Danh sách tên miền"
                  tooltip="Nhập danh sách tên miền cần kiểm tra"
                  size="small"
                  placement="right-end"
                  tooltip-description="(Nhập từng tên miền cần kiểm tra vào mỗi dòng)"
                />
              </div>
              <div>
                <CIcon
                  icon="icon-upload-cloud"
                  class="text-2xl text-primary-600 cursor-pointer"
                  @click="inputDomainFileRef?.click()"
                />
                <input
                  ref="inputDomainFileRef"
                  type="file"
                  class="hidden"
                  @change="onChangeFileDomain"
                />
              </div>
            </div>

            <NFormItem path="domain">
              <NInput
                class="mt-2 h-[98px]"
                :value="formData.domain?.join('\n')"
                placeholder="Mỗi dòng một tên miền"
                type="textarea"
                :autosize="{
                  minRows: 3,
                  maxRows: 3
                }"
                clearable
                @input="onInputDomains"
              >
                <template #clear-icon>
                  <NButton
                    secondary
                    size="small"
                    class="right-[10px] top-[24px] absolute hover:!text-[#E5540C]"
                  >
                    <template #icon>
                      <CIcon icon="icon-trash" />
                    </template>
                  </NButton>
                </template>
              </NInput>
            </NFormItem>
          </div>
        </div>
      </NForm>

      <div class="flex-1 max-w-[160px]">
        <div class="flex flex-col gap-[6px]">
          <NButton
            type="primary"
            :loading="state.isPending"
            :disabled="state.isPending"
            strong
            class="!h-[46px]"
            @click="onSubmit"
          >
            <template #icon>
              <CIcon icon="icon-check" class="text-base" />
            </template>
            Kiểm tra
          </NButton>

          <NButton type="primary" ghost strong class="!h-[46px]" @click="onResetData">
            <template #icon>
              <CIcon icon="icon-refresh" class="text-base" />
            </template>
            Làm mới
          </NButton>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-5 my-5">
      <CProgress class="my-[26px] flex-1" :percent="domainRecordStore.getProgressPercent" />
      <div class="flex items-center">
        <div class="w-[220px] h-[30px] mr-[20px]">
          <NInput
            v-model:value="domainRecordStore.urlParams.search"
            placeholder="Tìm từ khóa/tên miền ..."
            size="small"
            class="text-[13px] font-medium"
            @input="onSearch"
          >
            <template #suffix>
              <CIcon icon="icon-Search" />
            </template>
          </NInput>
        </div>
        <div class="w-[220px] h-[30px] mr-[8px]">
          <NSelect
            v-model:value="domainRecordStore.urlParams.manual_sessions_id"
            :options="domainRecordStore.listSession"
            :render-label="renderLabel"
            :loading="domainRecordStore.state.isFetchingSession"
            placeholder="Chọn lịch sử kiểm tra"
            size="small"
            @update:value="onChangeFilter"
          />
        </div>
        <NButton
          secondary
          size="small"
          :disabled="!domainRecordStore.urlParams.manual_sessions_id"
          class="!bg-[#F5F3F3] !text-[#6C757D] hover:!text-[#E5540C]"
          @click="onDeleteSession()"
        >
          <template #icon>
            <CIcon icon="icon-trash" />
          </template>
        </NButton>
      </div>
    </div>

    <div class="flex flex-col gap-y-5">
      <div v-for="(item, index) in listData" :key="index">
        <div class="flex justify-between mb-3">
          <PageHeader :title="item.label" :tooltip="item.tooltip" size="small" />

          <div class="flex items-center gap-x-2">
            <NTooltip trigger="hover" :keep-alive-on-hover="false">
              <template #trigger>
                <NButton
                  v-if="!domainRecordStore.state.isFetchingCopySession"
                  secondary
                  type="primary"
                  size="small"
                  :disabled="!item?.data?.listData?.value.length"
                  @click.stop="copyToClipboard(item.data.listData.value)"
                >
                  <template #icon>
                    <CIcon icon="icon-copy" />
                  </template>
                </NButton>
                <NSpin v-if="domainRecordStore.state.isFetchingCopySession" size="small" />
              </template>
              Copy kết quả
            </NTooltip>
            <NTooltip trigger="hover" :keep-alive-on-hover="false">
              <template #trigger>
                <NButton
                  type="primary"
                  size="small"
                  :disabled="!item?.data?.listData?.value.length"
                  @click="onExport(item.statusProcess)"
                >
                  <template #icon>
                    <CIcon icon="icon-download" />
                  </template>
                </NButton>
              </template>
              Xuất file kết quả
            </NTooltip>
          </div>
        </div>

        <DataTable
          :is-fetching="item.data.state.isFetching"
          :data="item.data.listData.value"
          :pagination="item.data.pagination"
          :on-retry="item.data.onRetry"
          :on-delete="item.data.onDelete"
          @change-page="item.data.onChangePage"
          @change-page-size="item.data.onChangePageSize"
        />
      </div>
    </div>
  </div>
</template>
