import type { DataReport } from '../stores/reportStore'
import { useReportStore } from '../stores/reportStore'
import { NButton, NDropdown, type DataTableColumns, type DataTableCreateSummary } from 'naive-ui'

export default function useDataTable() {
  const reportStore = useReportStore()

  const isFetchingReport = reactive<number[]>([])

  const columns: DataTableColumns<DataReport> = [
    {
      type: 'selection',
      disabled(row) {
        return row.report === null
      }
    },
    {
      title: 'STT',
      key: 'id',
      align: 'center',
      width: 70,
      render: (_, index) => index + 1
    },
    {
      title: () => 'Server',
      key: 'server.name',
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: () => 'Tổng task',
      key: 'report.taskTotal',
      render: (row) => (row.report ? $n(row.report.taskTotal, 'number') : '')
    },
    {
      title: () => 'Thời gian trung bình (giây)',
      key: 'report.averageTime',
      render: (row) => {
        if (!row.report || !row.report.taskTotal) return ''
        const avg = row.report.excutionTotal / row.report.taskTotal / 1000
        return $n(Number(avg.toFixed(2)), 'number')
      }
    },
    {
      title: () => 'Thời gian hoàn thành',
      key: 'report.threadExecution',
      render: (row) =>
        row.report
          ? msToTime(Math.max(...row.report.threadExecution.map((item) => item.executionDuration)))
          : ''
    },
    {
      title: '',
      key: 'actions',
      width: 60,
      render: (row) => {
        const options = [
          {
            label: 'Tải lại',
            key: 'reload',
            icon: () => h(Icon, { icon: 'mdi:refresh' }),
            props: {
              onClick: () => onReloadRow(row)
            }
          },
          {
            label: 'Reset data',
            key: 'edit',
            icon: () => h(Icon, { icon: 'system-uicons:reset-hard' }),
            props: {
              onClick: () => onResetRow(row)
            }
          }
        ]

        return h(
          NDropdown,
          { trigger: 'click', options: options, placement: 'bottom-end' },
          {
            default: () =>
              h(
                NButton,
                {
                  size: 'small',
                  tertiary: true,
                  disabled: isFetchingReport.includes(row.server.id),
                  loading: isFetchingReport.includes(row.server.id)
                },
                { icon: () => h(Icon, { icon: 'mdi:dots-vertical' }) }
              )
          }
        )
      }
    }
  ]

  const summaryRow: DataTableCreateSummary<DataReport> = (pageData) => {
    const summary = {
      taskTotal: 0,
      excutionTotal: 0,
      threadExecution: 0
    }
    pageData.forEach((row) => {
      if (row.report) {
        summary.taskTotal += row.report.taskTotal
        summary.excutionTotal += row.report.excutionTotal
        const threadExecutionMax = Math.max(
          ...row.report.threadExecution.map((item) => item.executionDuration)
        )
        if (threadExecutionMax > summary.threadExecution) {
          summary.threadExecution = threadExecutionMax
        }
      }
    })
    return {
      id: {
        value: h('div', { class: 'text-danger font-semibold text-left' }, 'Summary'),
        colSpan: 2
      },
      'report.taskTotal': {
        value: h(
          'span',
          { class: 'text-danger font-semibold' },
          { default: () => $n(summary.taskTotal, 'number') }
        )
      },
      'report.averageTime': {
        value: h(
          'span',
          { class: 'text-danger font-semibold' },
          {
            default: () => {
              if (summary.taskTotal === 0) return '0'
              const avg = summary.excutionTotal / summary.taskTotal / 1000
              return $n(Number(avg.toFixed(2)), 'number')
            }
          }
        )
      },
      'report.threadExecution': {
        value: h(
          'span',
          { class: 'text-danger font-semibold' },
          {
            default: () => {
              if (summary.taskTotal === 0) return '0'

              return msToTime(summary.threadExecution)
            }
          }
        )
      }
    }
  }

  function onResetRow(report: DataReport) {
    const dialog = window.$dialog.warning({
      title: 'Xác nhận reset dữ liệu',
      content: `Dữ liệu sẽ được đếm lại từ đầu, bạn chắc chắn muốn reset?`,
      positiveText: 'Reset',
      negativeText: 'Hủy',
      onPositiveClick: async () => {
        dialog.loading = true
        await reportStore.resetReport(report)
        dialog.loading = false
      }
    })
  }

  async function onReloadRow(report: DataReport) {
    isFetchingReport.push(report.server.id)
    const { fetchReportData } = useReportStore()
    await fetchReportData(report)
    isFetchingReport.splice(isFetchingReport.indexOf(report.server.id), 1)
  }

  function msToTime(ms: number) {
    const seconds = Math.floor((ms / 1000) % 60)
    const minutes = Math.floor((ms / (1000 * 60)) % 60)
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24)

    const formattedHours = hours.toString().padStart(2, '0')
    const formattedMinutes = minutes.toString().padStart(2, '0')
    const formattedSeconds = seconds.toString().padStart(2, '0')

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
  }

  return {
    columns,
    summaryRow
  }
}
