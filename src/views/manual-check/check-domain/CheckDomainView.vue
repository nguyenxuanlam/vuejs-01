<script setup lang="ts">
/* ----- Import Type ----- */
import { NSpin, type FormInst } from 'naive-ui'
import { Session } from '@/types'

/* ----- Import Variables ----- */
import { useManualCheckDomainStore, StatusCode } from './stores/manualCheckDomainStore'
import useFormData from '@/views/manual-check/check-domain/composables/useFormData'
import { useClipboard } from '@vueuse/core'
/* ----- Import Components ----- */
import DataTable from './components/DataTable.vue'

/* ----- Global variables ----- */

//#region ----- Element Ref -----
const inputFileRef = ref<HTMLInputElement>()
const formRef = ref<FormInst | null>(null)
//#endregion ----- Element Ref -----

//#region ----- Stores -----
const manualCheckDomainStore = useManualCheckDomainStore()
manualCheckDomainStore.resetUrlParams()
//#endregion ----- Stores -----

//#region ----- State -----
const state = reactive({
  isPending: false
})
//#endregion ----- State -----

//#region ----- Composables -----
const { formData, rules } = useFormData()
const $message = useMessage()
const { showMessageError } = useHelper()
const { ensureHttp } = useEnsureHttp()
const $dialog = useDialog()
const { copy } = useClipboard()
//#endregion ----- Composables -----

//#region ----- Variables -----
let fetchDataInterval: number | null = null
let fetchProgressInterval: number | null = null
const domains = ref<string>('')
//#endregion ----- Variables -----

//#region ----- Functions -----
async function onSubmit() {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      state.isPending = true
      try {
        await apiSessions.create(formData)

        await manualCheckDomainStore.fetchListSession()

        manualCheckDomainStore.state.isFetching = true
        await Promise.all([
          manualCheckDomainStore.fetchData(),
          manualCheckDomainStore.fetchProgress()
        ])
        $message.success('Tạo phiên kiểm tra tên miền thành công')
      } catch (error: any) {
        showMessageError(error)
      }
      state.isPending = false
    }
  })
}

async function onInputDomains(value: string) {
  formData.domain = value
    .split('\n')
    .filter((item) => item.trim() !== '')
    .map((item) => ensureHttp(item))
  domains.value = value
}

function onChangeFile(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const text = e.target?.result as string
      onInputDomains(text)
    }
    reader.readAsText(file)
  }
  // Reset value to allow re-upload the same file
  target.value = ''
}

const onChangeFilter = useDebounceFn(() => {
  manualCheckDomainStore.state.isFetching = true
  manualCheckDomainStore.fetchData()
  manualCheckDomainStore.fetchProgress()
}, 100)

const onSearch = useDebounceFn(() => {
  manualCheckDomainStore.state.isFetching = true
  manualCheckDomainStore.fetchData()
  manualCheckDomainStore.fetchProgress()
}, 500)

async function onExport() {
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
      manual_sessions_id: manualCheckDomainStore.urlParams.manual_sessions_id,
      type: 'CHECK',
      search: manualCheckDomainStore.urlParams.search
    })
    if (res?.data) {
      useDownload(res.data, 'check_domains.xlsx')
    }
  } catch (error) {
    const { showMessageError } = useHelper()
    showMessageError(error)
  }
  dialog.destroy()
}

function onDeleteSession() {
  const manualSessionsId = manualCheckDomainStore.urlParams.manual_sessions_id
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
        await manualCheckDomainStore.fetchListSession()
        await manualCheckDomainStore.fetchData()
        window.$message.success(`Xóa session ID ${manualSessionsId} thành công`)
      } catch (error: any) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }

      dialog.loading = false
    }
  })
}

async function copyToClipboard() {
  manualCheckDomainStore.state.isFetchingCopySession = true
  let formattedText = ''
  const providerTitle = manualCheckDomainStore.listProviders
    .map((provider) => {
      return `${provider.name}`
    })
    .join('\t')
  const title = 'Domain name\t' + providerTitle + '\t' + 'Thời gian kiểm tra'

  try {
    const res = await apiSessions.copySessionHistory({
      type: 'CHECK',
      manual_sessions_id: manualCheckDomainStore.urlParams.manual_sessions_id,
      search: manualCheckDomainStore.urlParams.search
    })
    if (res?.data?.data) {
      res.data.data.map((item: any) => {
        formattedText += `${item.domain}\t`
        manualCheckDomainStore.listProviders.map((provider) => {
          if (item[provider.name]) {
            switch (item[provider.name].statusCode) {
              case StatusCode.Success:
                if (item[provider.name].domainRedirect) {
                  formattedText += `OK## ${item.domain} --> redirect: ${item[provider.name].domainRedirect} => Access thành công ## ${item[provider.name].imageCloudPath}\t`
                } else {
                  formattedText += `OK## ${item.domain} => Access thành công ## ${item[provider.name].imageCloudPath}\t`
                }
                break
              case StatusCode.Fail:
                formattedText += `Bị chặn## ${item.domain} => ${item[provider.name].error} ## ${item[provider.name].imageCloudPath}\t`
                break
              case StatusCode.Unknown:
                formattedText += `"Unknown## ${item.domain} => ${item[provider.name].error} ## ${item[provider.name].imageCloudPath}\t`
                break
              case StatusCode.ProxyError:
                formattedText += `Lỗi Proxy## ${item.domain} => ${item[provider.name].error} ## ${item[provider.name].imageCloudPath}\t`
                break
              case StatusCode.Timeout:
                formattedText += `Timeout## ${item.domain} => ${item[provider.name].error} ## ${item[provider.name].imageCloudPath}\t`
                break
              case StatusCode.VerifyCaptcha:
                formattedText += `Verify Captcha## ${item.domain} => ${item[provider.name].error} ## ${item[provider.name].imageCloudPath}\t`
                break
              default:
                formattedText += `-\t`
                break
            }
          } else {
            formattedText += `-\t`
          }
        })
        formattedText += `${item.finished_at ?? '-'}\n`
      })
      const finalText = `${title}\n${formattedText}`
      $message.success('Copy thành công')
      copy(finalText)
    }
  } catch (error) {
    $message.warning('Không có dữ liệu để copy')
  }
  manualCheckDomainStore.state.isFetchingCopySession = false
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

//#endregion ----- Functions -----

//#region ----- Hooks -----
onMounted(async () => {
  await manualCheckDomainStore.fetchListSession()
  await Promise.all([manualCheckDomainStore.fetchData(), manualCheckDomainStore.fetchProgress()])

  fetchDataInterval = setInterval(() => {
    if (manualCheckDomainStore.state.pendingFetchData) return
    const totalDone = manualCheckDomainStore.listData.filter(
      (item) => item.status_process >= Session.StatusProcess.Finish
    ).length
    if (totalDone === manualCheckDomainStore.listData.length) {
      return
    }
    manualCheckDomainStore.fetchData()
  }, 10000)

  fetchProgressInterval = setInterval(() => {
    if (manualCheckDomainStore.state.pendingFetchProgress) return
    if (manualCheckDomainStore.progress.done === manualCheckDomainStore.progress.total) {
      return
    }
    manualCheckDomainStore.fetchProgress()
  }, 10000)
})

onBeforeUnmount(() => {
  manualCheckDomainStore.$reset()
  fetchDataInterval && clearInterval(fetchDataInterval)
  fetchProgressInterval && clearInterval(fetchProgressInterval)
})
//#endregion ----- Hooks -----
</script>

<template>
  <div>
    <div class="flex items-end xl:gap-x-[34px] gap-x-4">
      <NForm
        ref="formRef"
        class="flex-1"
        :show-label="false"
        require-mark-placement="left"
        :model="formData"
        :rules="rules"
        :show-feedback="false"
        @submit.prevent="onSubmit"
      >
        <div class="flex flex-1 xl:gap-x-[16px] gap-x-4">
          <div class="flex-1">
            <div class="flex justify-between">
              <PageHeader
                title="Danh sách tên miền"
                tooltip="Nhập danh sách tên miền cần kiểm tra"
                size="small"
                placement="right-end"
                tooltip-description="(Nhập từng tên miền cần kiểm tra vào mỗi dòng)"
              />
            </div>
            <NFormItem path="domain">
              <NInput
                class="mt-3"
                :value="domains"
                type="textarea"
                placeholder="Mỗi dòng một tên miền"
                :autosize="{ minRows: 1, maxRows: 1 }"
                @input="onInputDomains"
              />
            </NFormItem>
          </div>
          <div class="xl:w-[235px] w-40 flex flex-col justify-end">
            <PageHeader title="đăng Tải dữ liệu" size="small" />
            <NInput
              style="cursor: pointer !important"
              class="mt-3"
              type="text"
              placeholder="Tải file lên"
              readonly
              @click="inputFileRef?.click()"
            >
              <template #suffix>
                <CIcon icon="icon-upload-cloud" class="text-primary-600" />
              </template>
            </NInput>
            <input ref="inputFileRef" type="file" class="hidden" @change="onChangeFile" />
          </div>
        </div>
      </NForm>

      <div class="flex gap-x-4 flex-1 max-w-[336px]">
        <NButton
          type="primary"
          class="flex-1"
          :loading="state.isPending"
          :disabled="state.isPending"
          strong
          @click="onSubmit"
        >
          <template #icon>
            <CIcon icon="icon-check" class="text-base" />
          </template>
          Kiểm tra
        </NButton>

        <NButton type="primary" class="flex-1" ghost strong @click="onInputDomains('')">
          <template #icon>
            <CIcon icon="icon-refresh" class="text-base" />
          </template>
          Làm mới
        </NButton>
      </div>
    </div>

    <CProgress class="my-[26px]" :percent="manualCheckDomainStore.getProgressPercent" />

    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center">
        <div class="w-[220px] mr-[20px]">
          <NInput
            v-model:value="manualCheckDomainStore.urlParams.search"
            placeholder="Tìm từ khóa/tên miền ..."
            class="text-[13px] font-medium"
            size="small"
            @input="onSearch"
          >
            <template #suffix>
              <CIcon icon="icon-Search" />
            </template>
          </NInput>
        </div>
        <div class="w-[220px] h-[30px] mr-[8px]">
          <NSelect
            v-model:value="manualCheckDomainStore.urlParams.manual_sessions_id"
            size="small"
            :options="manualCheckDomainStore.listSession"
            :render-label="renderLabel"
            :loading="manualCheckDomainStore.state.isFetchingSession"
            placeholder="Chọn lịch sử kiểm tra"
            @update:value="onChangeFilter"
          />
        </div>
        <NButton
          secondary
          size="small"
          class="hover:!text-[#E5540C]"
          :disabled="!manualCheckDomainStore.urlParams.manual_sessions_id"
          @click="onDeleteSession()"
        >
          <template #icon>
            <CIcon icon="icon-trash" />
          </template>
        </NButton>
      </div>

      <div class="flex items-center gap-x-2">
        <NTooltip trigger="hover" :keep-alive-on-hover="false">
          <template #trigger>
            <NButton
              v-if="!manualCheckDomainStore.state.isFetchingCopySession"
              secondary
              type="primary"
              size="small"
              :disabled="!manualCheckDomainStore.listData.length"
              @click.stop="copyToClipboard()"
            >
              <template #icon>
                <CIcon icon="icon-copy" />
              </template>
            </NButton>
            <NSpin v-if="manualCheckDomainStore.state.isFetchingCopySession" size="small" />
          </template>
          Copy kết quả
        </NTooltip>
        <NTooltip trigger="hover" :keep-alive-on-hover="false">
          <template #trigger>
            <NButton
              type="primary"
              size="small"
              :disabled="!manualCheckDomainStore.listData.length"
              @click="onExport"
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
      :is-fetching="manualCheckDomainStore.state.isFetching"
      :data="manualCheckDomainStore.listData"
    />
  </div>
</template>
