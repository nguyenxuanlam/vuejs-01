import type { ReportItem } from '../stores/reportGroupStore'
import { type DataTableColumns } from 'naive-ui'
import { useReportGroupStore } from '../stores/reportGroupStore'

export default function useDataTable() {
  const reportStoreStore = useReportGroupStore()
  const columns: DataTableColumns<ReportItem> = reactive([
    {
      title: 'STT',
      key: 'no',
      align: 'center',
      width: 70,
      render: (_, index) => index + 1
    },
    {
      title: 'Bắt đầu',
      key: 'createdAt',
      render: (row) => {
        return h('span', null, { default: () => $d(new Date(row.createdAt), 'dateTime') })
      }
    },
    {
      title: 'Kết thúc',
      key: 'finishedTime',
      render: (row) => {
        return h('span', null, {
          default: () =>
            row.finishedTime ? $d(new Date(row.finishedTime), 'dateTime') : 'Đang xử lý'
        })
      }
    },
    {
      title: 'Số lượng domain',
      key: 'taskTotal',
      render: (row) => {
        return h('span', null, {
          default: () => $n(row.taskTotal, 'number')
        })
      }
    },
    {
      title: 'Thời gian trung bình',
      key: 'timeAverage',
      render: (row) => {
        return h('span', null, {
          default: () => (row.finishedTime ? msToTime(row.excutionTotal / row.taskTotal) : '')
        })
      }
    },
    {
      title: 'Thời gian hoàn thành',
      key: 'excutionTotal',
      render: (row) => {
        return h('span', null, {
          default: () => (row.finishedTime ? msToTime(row.excutionTotal) : '')
        })
      }
    },
    {
      title: 'Người chạy',
      key: 'user_run',
      width: 114,
      render: () => 'D Sey'
    }
  ])

  return {
    columns
  }
}

export function msToTime(ms: number, decimal: boolean = false) {
  if (Number.isNaN(ms) || ms === Infinity) return '00:00:00'
  let seconds = (ms / 1000) % 60
  const minutes = Math.floor((ms / (1000 * 60)) % 60)
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24)

  if (decimal) {
    seconds = parseFloat(seconds.toFixed(1))
  } else {
    seconds = Math.floor(seconds)
  }

  const formattedHours = hours.toString().padStart(2, '0')
  const formattedMinutes = minutes.toString().padStart(2, '0')
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds.toString()

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}
