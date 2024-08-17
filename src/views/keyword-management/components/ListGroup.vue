<script setup lang="ts">
/* ----- Import Type ----- */
import { type Branch, type Group, type Keyword } from '@/types'

/* ----- Import Variables ----- */
import useDataTable from '../composables/useDataTable'
import { format as formatDate } from 'date-fns'
import { useClipboard } from '@vueuse/core'
import { useKeywordManagementStore } from '../stores/keywordManagementStore'

/* ----- Import Components ----- */
import { NSpin } from 'naive-ui'

/* ----- Global variables ----- */
const props = defineProps<{
  data: Branch.Item
}>()

//#region ----- Element Ref -----
//#endregion ----- Element Ref -----

//#region ----- Stores -----
const { collapseDefault } = storeToRefs(useKeywordManagementStore())
//#endregion ----- Stores -----

//#region ----- State -----
//#endregion ----- State -----

//#region ----- Composables -----
const { columns } = useDataTable()
const { copy, copied } = useClipboard()
const $message = useMessage()
const $dialog = useDialog()
//#endregion ----- Composables -----

//#region ----- Variables -----
//#endregion ----- Variables -----

//#region ----- Functions -----
function copyToClipboard(data: Group.Item) {
  const title =
    'Thương hiệu\tNgày tạo của ngành\tTừ khoá\tNgày tạo từ khoá\tNgười tạo\tChạy hằng ngày'
  const formattedText = data.keywords
    .map((keyword: Keyword.Item) => {
      const dataCreatedAt = formatDate(new Date(data.created_at), 'HH:mm dd/MM/yyyy')
      const keywordCreatedAt = formatDate(new Date(keyword.created_at), 'HH:mm dd/MM/yyyy')
      return `${data.name}\t${dataCreatedAt}\t${keyword.name}\t${keywordCreatedAt}\t${keyword.user?.name ?? ''}\t${keyword.is_run_daily == 'Y' ? 'Có' : 'Không'}`
    })
    .join('\n')

  const finalText = `${title}\n${formattedText}`

  if (formattedText.trim() === '') {
    $message.warning('Không có dữ liệu để copy')
    return
  }

  copy(finalText)
}

async function onExport(branch_id: number, group_id: number) {
  const dialog = $dialog.warning({
    title: 'Đang xuất dữ liệu',
    content: () =>
      h('div', { class: 'flex items-center justify-center' }, h(NSpin, { class: 'w-10 h-10' })),
    closable: false,
    closeOnEsc: false,
    maskClosable: false
  })
  try {
    const res = await apiExport.keyword({ branch_id, group_id })
    if (res?.data) {
      useDownload(res.data, 'keywords.xlsx')
    }
  } catch (error) {
    const { showMessageError } = useHelper()
    showMessageError(error)
  }
  dialog.destroy()
}
//#endregion ----- Functions -----

//#region ----- Hooks -----
//#endregion ----- Hooks -----
</script>

<template>
  <NCollapse
    class="keyword-collapse-group mt-2"
    :default-expanded-names="collapseDefault.childrend"
  >
    <NCollapseItem
      v-for="(group, index) in props.data.groups"
      :key="index"
      :name="group.id"
      display-directive="show"
      class="bg-[#F3F3F3] rounded border border-[#F3F3F3] !ml-0"
    >
      <template #header>
        <div class="flex items-center gap-x-4 h-[18px] ml-2.5">
          <div class="text-sm font-semibold text-[#323232] uppercase">{{ group.name }}</div>
          <div class="w-px h-full bg-[#D9D9D9]"></div>
          <div class="flex items-center gap-x-2 text-xs">
            <span class="font-medium text-[#929292]">Tổng từ khóa</span>
            <span class="font-semibold text-[#845ADF]">{{ group.keywords.length }}</span>
          </div>
        </div>
      </template>
      <template #header-extra>
        <div class="flex items-center gap-x-2">
          <NTooltip trigger="hover" :keep-alive-on-hover="false">
            <template #trigger>
              <NButton secondary type="primary" size="small" @click.stop="copyToClipboard(group)">
                <template #icon>
                  <CIcon icon="icon-copy" />
                </template>
              </NButton>
            </template>
            {{ copied ? 'Copy thành công!' : 'Copy kết quả' }}
          </NTooltip>
          <NTooltip trigger="hover" :keep-alive-on-hover="false">
            <template #trigger>
              <NButton type="primary" size="small" @click.stop="onExport($props.data.id, group.id)">
                <template #icon>
                  <CIcon icon="icon-download" />
                </template>
              </NButton>
            </template>
            Xuất file kết quả
          </NTooltip>
        </div>
      </template>

      <NDataTable
        :bordered="false"
        :columns="columns"
        :data="group.keywords"
        :max-height="300"
        :theme-overrides="{
          thColor: '#fff'
        }"
      />
    </NCollapseItem>
  </NCollapse>
</template>

<style lang="scss">
.keyword-collapse-group {
  &.n-collapse {
    .n-collapse-item__header {
      // background-color: #f7f7f7;
      background-color: #f7f7f7;
      padding: 5px 14px 5px 12px !important;
      border-radius: 4px;
    }
    .n-collapse-item__content-inner {
      padding: 8px 14px 12px 12px !important;
    }
  }
}
</style>
