<script setup lang="ts">
/* ----- Import Type ----- */
import type { Keyword } from '@/types'
import { NTag, type DataTableColumns } from 'naive-ui'
import { useKeywordStore } from '@/views/keywords/stores/useKeywords'

/* ----- Import Variables ----- */

/* ----- Import Components ----- */

/* ----- Global variables ----- */

defineProps<{
  data: Array<Keyword.Domain> | undefined
}>()

//#region ----- Element Ref -----
//#endregion ----- Element Ref -----

//#region ----- Stores -----4
const { urlParams } = useKeywordStore()
//#endregion ----- Stores -----

//#region ----- State -----
//#endregion ----- State -----

//#region ----- Composables -----
const { copyToClipboard } = useCopyToClipboard()
const { renderIndex } = useRender()
//#endregion ----- Composables -----

//#region ----- Variables -----

const columns: DataTableColumns<Keyword.Domain> = reactive([
  {
    title: 'STT',
    key: 'id',
    width: 100,
    ellipsis: {
      tooltip: true
    },
    render: (_, index) => index + 1
  },
  {
    title: 'Tên miền',
    key: 'name',
    ellipsis: {
      tooltip: false
    },
    render: (row) => {
      return h(
        'span',
        {
          class: 'cursor-pointer hover:text-blue-500 transition-colors duration-300',
          onClick: () => {
            copyToClipboard(row.name)
          }
        },
        { default: () => row.name }
      )
    }
  },
  {
    title: 'Trạng thái',
    key: 'note',
    width: 150,
    render: (row) => {
      const notes: VNode[] = []
      if (row.is_x === 'Y') {
        notes.push(h(NTag, { type: 'primary', size: 'small' }, { default: () => 'X' }))
      }
      if (row.is_y === 'Y' && row.is_block === 'Y') {
        notes.push(h(NTag, { type: 'default', size: 'small' }, { default: () => 'Y Block' }))
      }
      if (row.is_whitelist === 'Y' || row.is_whitelist === 'U') {
        notes.push(h(NTag, { type: 'success', size: 'small' }, { default: () => 'Whitelist' }))
      }
      if (row.is_whitelist === 'N' && row.is_x === 'U' && row.is_y === 'U') {
        notes.push(h(NTag, { type: 'error', size: 'small' }, { default: () => 'Error' }))
      }
      return h(
        'div',
        { class: 'flex flex-wrap gap-2' },
        {
          default: () => notes.map((note) => note)
        }
      )
    }
  }
])

//#endregion ----- Variables -----

//#region ----- Functions -----
//#endregion ----- Functions -----

//#region ----- Hooks -----
//#endregion ----- Hooks -----
</script>

<template>
  <div>
    <PageBlock>
      <NDataTable
        :bordered="false"
        :columns="columns"
        :data="$props.data"
        :max-height="600"
        :min-height="200"
      />
    </PageBlock>
  </div>
</template>
