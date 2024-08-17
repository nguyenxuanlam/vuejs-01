<script setup lang="ts">
/* ----- Import Type ----- */
import { User, type Branch, type Group, type Keyword } from '@/types'

/* ----- Import Variables ----- */
import { useKeywordManagementStore } from './stores/keywordManagementStore'
import { useClipboard } from '@vueuse/core'
import { format as formatDate } from 'date-fns'

/* ----- Import Components ----- */
// import DataTable from './components/DataTable.vue'
import ListGroup from './components/ListGroup.vue'
import CreateKeywordModal from './components/CreateKeywordModal.vue'
import UpdateKeyWordModal from './components/UpdateKeyWordModal.vue'
import { NSpin } from 'naive-ui'

/* ----- Global variables ----- */

//#region ----- Element Ref -----
//#endregion ----- Element Ref -----

//#region ----- Stores -----
const keywordManagementStore = useKeywordManagementStore()
keywordManagementStore.resetUrlParams()
//#endregion ----- Stores -----

//#region ----- State -----
//#endregion ----- State -----

//#region ----- Composables -----
const $dialog = useDialog()
const $message = useMessage()
const { copy, copied } = useClipboard()
//#endregion ----- Composables -----

//#region ----- Variables -----
//#endregion ----- Variables -----

//#region ----- Functions -----
function getTotalKeywords(groups: Group.Item[] | undefined) {
  if (!groups) return 0
  return groups.reduce((total, group) => total + (group.keywords ? group.keywords.length : 0), 0)
}

function copyToClipboard(data: Branch.Item) {
  const title =
    'Ngành\tThương hiệu\tNgày tạo của ngành\tTừ khoá\tNgày tạo từ khoá\tNguời tạo\tChạy hằng ngày'
  const formattedText = data.groups
    .map((group: Group.Item) => {
      return group.keywords
        .map((keyword: Keyword.Item) => {
          const groupCreatedAt = formatDate(new Date(group.created_at), 'HH:mm dd/MM/yyyy')
          const keywordCreatedAt = formatDate(new Date(keyword.created_at), 'HH:mm dd/MM/yyyy')
          return `${data.name}\t${group.name}\t${groupCreatedAt}\t${keyword.name}\t${keywordCreatedAt}\t${keyword.user?.name ?? ''}\t${keyword.is_run_daily == 'Y' ? 'Có' : 'Không'}`
        })
        .join('\n')
    })
    .join('\n')

  const finalText = `${title}\n${formattedText}`

  if (formattedText.trim() === '') {
    $message.warning('Không có dữ liệu để copy')
    return
  }

  copy(finalText)
}

const onTypeChangeTag = () => {
  keywordManagementStore.urlParams.group_id = null
  keywordManagementStore.groupsParams.branch_id = keywordManagementStore.urlParams.branch_id
  keywordManagementStore.onChangeFilter()
  keywordManagementStore.onChangeFilterGroups()
}

const onTypeChangeGroup = () => {
  keywordManagementStore.onChangeFilter()
}

async function onExport(branch_id: number) {
  const dialog = $dialog.warning({
    title: 'Đang xuất dữ liệu',
    content: () =>
      h('div', { class: 'flex items-center justify-center' }, h(NSpin, { class: 'w-10 h-10' })),
    closable: false,
    closeOnEsc: false,
    maskClosable: false
  })

  try {
    const res = await apiExport.keyword({ branch_id })
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
onBeforeMount(async () => {
  keywordManagementStore.urlParams.group_id = null
  keywordManagementStore.urlParams.branch_id = null
  await keywordManagementStore.fetchData()
  await keywordManagementStore.fetchTagsOptions()
  await keywordManagementStore.fetchTotalData()
  await keywordManagementStore.fetchGroupsOptions()
})

onMounted(() => {
  keywordManagementStore.$reset()
})
//#endregion ----- Hooks -----
</script>

<template>
  <div>
    <PageHeader title="Quản lý từ khóa" tooltip="Quản lý từ khóa" />
    <div class="grid xl:grid-cols-3 lg:grid-cols-3 xl:gap-10 md:gap-5 gap-2 mt-4">
      <div class="flex items-center gap-2 rounded-md bg-white shadow-header-item px-3 py-2">
        <CIcon icon="icon-keyword" class="text-[#845ADF] text-4xl" />
        <div>
          <div class="font-medium text-base text-gray-700">Tổng từ khóa</div>
          <div class="text-xl text-primary font-bold mt-0.5">
            {{ keywordManagementStore.toTalKeyword }}
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2 rounded-md bg-white shadow-header-item px-3 py-2">
        <div
          class="rounded-full size-[36px] flex items-center justify-center"
          style="background-color: rgba(35, 183, 229, 0.1)"
        >
          <CIcon icon="icon-cloud-computing" class="text-[#23B7E5] text-xl" />
        </div>
        <div>
          <div class="font-medium text-base text-gray-700">Tổng số ngành</div>
          <div class="text-xl text-[#12C2C2] font-bold mt-0.5">
            {{ keywordManagementStore.toTalGroup }}
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2 rounded-md bg-white shadow-header-item px-3 py-2">
        <CIcon icon="icon-domain" class="text-[#D63384] text-4xl" />
        <div>
          <div class="font-medium text-base text-gray-700">Tổng số thương hiệu</div>
          <div class="text-xl text-[#D63384] font-bold mt-0.5">
            {{ keywordManagementStore.toTalBranch }}
          </div>
        </div>
      </div>
    </div>

    <NSpin :show="keywordManagementStore.state.isFetching">
      <template #description> Đang tải dữ liệu... </template>
      <div class="min-h-56">
        <div class="mt-8 mb-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <p class="font-semibold text-[#222222]">Lọc Theo</p>
            <div class="w-[196px]">
              <NSelect
                v-model:value="keywordManagementStore.urlParams.branch_id"
                :loading="keywordManagementStore.state.isFetchingTags"
                class=""
                value-field="value"
                label-field="label"
                size="small"
                clearable
                filterable
                placeholder="Nhóm ngành"
                :reset-menu-on-options-change="false"
                :options="keywordManagementStore.tagsOptions"
                clear-filter-after-select
                @update:value="onTypeChangeTag"
                @scroll="keywordManagementStore.onFetchMoreTags"
              />
            </div>
            <div class="w-[196px]">
              <NSelect
                v-model:value="keywordManagementStore.urlParams.group_id"
                :loading="keywordManagementStore.state.isFetchingGroups"
                value-field="value"
                label-field="label"
                size="small"
                clearable
                filterable
                placeholder="Nhóm thương hiệu"
                :reset-menu-on-options-change="false"
                :options="keywordManagementStore.groupsOptions"
                @update:value="onTypeChangeGroup"
                @scroll="keywordManagementStore.onFetchMoreGroups"
              />
            </div>
          </div>
          <NButton
            v-if="useCheckRoles([User.Role.Admin, User.Role.Editor])"
            size="small"
            type="primary"
            class="!px-3"
            @click="keywordManagementStore.stateModal.isShowCreateKeywordModal = true"
          >
            <template #icon>
              <CIcon icon="icon-add" />
            </template>
            {{ $t('buttons.create') }}
          </NButton>
        </div>

        <template v-if="keywordManagementStore.listData">
          <NCollapse
            :accordion="false"
            :default-expanded-names="keywordManagementStore.collapseDefault.parent"
          >
            <NCollapseItem
              v-for="(item, index) in keywordManagementStore.listData.data"
              :key="index"
              :name="item.id"
              class="bg-white px-[15px] py-3 rounded-[5px] border border-[#F3F3F3]"
            >
              <template #header>
                <div class="flex items-center gap-x-4 h-[18px] ml-2.5">
                  <div class="text-base font-bold text-[#333335] uppercase">{{ item.name }}</div>
                  <div class="w-px h-full bg-[#D9D9D9]"></div>
                  <div class="flex items-center gap-x-2 text-xs">
                    <span class="font-medium text-[#929292]">Tổng thương hiệu</span>
                    <span class="font-semibold text-[#D63384]">{{
                      item.groups ? item?.groups.length : 0
                    }}</span>
                  </div>
                  <div class="w-px h-full bg-[#D9D9D9]"></div>
                  <div class="flex items-center gap-x-2 text-xs">
                    <span class="font-medium text-[#929292]">Tổng từ khóa</span>
                    <span class="font-semibold text-[#845ADF]">{{
                      getTotalKeywords(item.groups)
                    }}</span>
                  </div>
                </div>
              </template>
              <template #header-extra>
                <div class="flex items-center gap-x-2">
                  <NTooltip trigger="hover" :keep-alive-on-hover="false">
                    <template #trigger>
                      <NButton
                        secondary
                        type="primary"
                        size="small"
                        @click.stop="copyToClipboard(item)"
                      >
                        <template #icon>
                          <CIcon icon="icon-copy" />
                        </template>
                      </NButton>
                    </template>
                    {{ copied ? 'Copy thành công!' : 'Copy kết quả' }}
                  </NTooltip>
                  <NTooltip trigger="hover" :keep-alive-on-hover="false">
                    <template #trigger>
                      <NButton type="primary" size="small" @click.stop="onExport(item?.id)">
                        <template #icon>
                          <CIcon icon="icon-download" />
                        </template>
                      </NButton>
                    </template>
                    Xuất file kết quả
                  </NTooltip>
                </div>
              </template>

              <ListGroup :data="item" />
            </NCollapseItem>
          </NCollapse>
        </template>
      </div>
    </NSpin>
    <div class="w-full flex justify-center mt-5">
      <NButton
        v-if="keywordManagementStore.state.isLoadMoreData"
        type="primary"
        size="small"
        :loading="keywordManagementStore.state.isFetching"
        @click="keywordManagementStore.loadMoreData"
      >
        {{ $t('buttons.load_more') }}
      </NButton>
    </div>
    <!-- Modals -->
    <NModal v-model:show="keywordManagementStore.stateModal.isShowCreateKeywordModal">
      <CreateKeywordModal
        v-model:show="keywordManagementStore.stateModal.isShowCreateKeywordModal"
        :available-tags="keywordManagementStore.availableTags"
        :available-groups="keywordManagementStore.availableGroups"
        @success="keywordManagementStore.fetchData"
      />
    </NModal>

    <NModal v-model:show="keywordManagementStore.stateModal.isShowUpdateKeywordModal">
      <UpdateKeyWordModal
        v-model:show="keywordManagementStore.stateModal.isShowUpdateKeywordModal"
        @success="keywordManagementStore.fetchData"
      />
    </NModal>
  </div>
</template>

<style scoped>
.shadow-header-item {
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.15);
}
</style>
