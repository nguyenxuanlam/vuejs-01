import { type Report, Server } from '@/types'
import { format } from 'date-fns'
import axios from 'axios'

type UrlSearchParams = {
  date: string
  type: 'auto' | 'manual'
  server_type: Server.Type
}

export interface DataReport {
  server: Server.Item
  report: Report.Item | null
}

export const useReportStore = defineStore('reportStore', {
  state: () => ({
    listData: [] as DataReport[] | [],
    urlParams: useUrlSearchParams<UrlSearchParams>(),
    serverSelected: null as Server.Item | null,
    checkedRowIds: [] as number[],
    state: {
      isFetching: true,
      isFetchingServer: true
    },
    serverTypeOptions: [
      { label: Server.TypeLabel.RecordDomain, value: Server.Type.RecordDomain },
      { label: Server.TypeLabel.CheckDomain, value: Server.Type.CheckDomain }
    ],
    typeOptions: [
      { label: 'Tự động', value: 'auto' },
      { label: 'Thủ công', value: 'manual' }
    ]
  }),
  actions: {
    async fetchData() {
      this.state.isFetching = true

      try {
        await Promise.all(
          this.listData.map(async (item) => {
            await this.fetchReportData(item)
          })
        )
      } catch (error) {
        this.listData = []
        const { showMessageError } = useHelper()
        showMessageError(error)
      }

      this.state.isFetching = false
    },
    async fetchServers() {
      this.state.isFetchingServer = true

      try {
        const res = await apiServers.getList({
          type: this.urlParams.server_type,
          is_active: 'Y',
          per_page: 200
        })
        const dataRes = res.data.data
        this.listData = dataRes.data.map((server) => ({ server, report: null }))

        if (import.meta.env.DEV) {
          this.listData.unshift({
            server: {
              id: 0,
              name: 'local (only local)',
              domain_name: 'http://localhost:33002',
              ip_address: '127.0.0.1',
              limit_process: 2,
              processing: 0,
              is_active: 'Y',
              type: this.urlParams.server_type,
              created_at: new Date(),
              updated_at: new Date()
            },
            report: null
          })
        }
        this.fetchData()
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }

      this.state.isFetchingServer = false
    },
    async fetchReportData(dataReport: DataReport) {
      try {
        const res = await axios.get<Report.Item>(`${dataReport.server.domain_name}/api/report`, {
          params: {
            type: this.urlParams.type,
            date: this.urlParams.date
          }
        })
        dataReport.report = res.data
      } catch (error) {
        dataReport.report = null
      }
    },
    async resetReport(report: DataReport) {
      if (!report.report) return
      try {
        await axios.post(`${report.server.domain_name}/api/report/reset/${report.report.id}`)
        window.$message.success(`Reset dữ liệu server ${report.server.name} thành công`)
        report.report = null
      } catch (error) {
        window.$message.error(`Reset dữ liệu server ${report.server.name} thất bại`)
      }
    },
    async resetMultipleReports() {
      this.state.isFetching = true

      try {
        await Promise.all(
          this.checkedRowIds.map(async (id) => {
            const report = this.listData.find((item) => item.server.id === id)
            if (report) {
              await this.resetReport(report)
            }
          })
        )
        this.checkedRowIds = []
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }

      this.state.isFetching = false
    },
    onChangeFilter() {
      this.fetchData()
    },
    resetUrlParams() {
      this.$patch({
        urlParams: useUrlSearchParams<UrlSearchParams>()
      })
      this.urlParams.server_type = zod
        .enum([Server.Type.CheckDomain, Server.Type.RecordDomain])
        .default(Server.Type.CheckDomain)
        .catch(Server.Type.CheckDomain)
        .parse(this.urlParams.server_type)

      this.urlParams.date = zod
        .string()
        .default(format(new Date(), 'yyyy-MM-dd'))
        .catch(format(new Date(), 'yyyy-MM-dd'))
        .parse(this.urlParams.date)

      this.urlParams.type = zod
        .enum(['manual', 'auto'])
        .default('manual')
        .catch('manual')
        .parse(this.urlParams.type)
    }
  }
})
