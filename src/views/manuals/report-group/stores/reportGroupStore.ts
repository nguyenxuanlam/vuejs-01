import Axios from 'axios'
import { format } from 'date-fns'
import { Server } from '@/types'

type UrlSearchParams = {
  server_id?: number
  date?: string
}

export interface ReportItem {
  id: string
  group: string
  createdAt: Date
  taskTotal: number
  excutionTotal: number
  updatedAt: Date
  type: string
  finishedTime: Date | null
}

export const axios = Axios.create({
  baseURL: '',
  timeout: 90000
})

export const useReportGroupStore = defineStore('ReportGroupStore', {
  state: () => ({
    listData: [] as ReportItem[],
    listServers: [] as Server.Item[],
    serverSelected: null as Server.Item | null,
    urlParams: useUrlSearchParams<UrlSearchParams>(),
    state: {
      isFetching: true,
      isFetchingServer: true
    }
  }),
  actions: {
    async fetchData() {
      this.state.isFetching = true
      try {
        const serverId = this.serverSelected?.id
        const res = await axios.get<ReportItem[]>('/report/group', { params: this.urlParams })
        if (serverId !== this.serverSelected?.id) {
          return
        }
        this.listData = res.data
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }

      this.state.isFetching = false
    },
    resetUrlParams() {
      this.$patch({
        urlParams: useUrlSearchParams<UrlSearchParams>()
      })

      this.urlParams.server_id = zod
        .number()
        .optional()
        .safeParse(Number(this.urlParams.server_id)).data

      this.urlParams.date = zod
        .string()
        .default(format(new Date(), 'yyyy-MM-dd'))
        .parse(this.urlParams.date)
    },
    async fetchServers() {
      this.state.isFetchingServer = true

      try {
        const res = await apiServers.getList({
          type: 'check-domain',
          is_active: 'Y'
        })
        const dataRes = res.data.data
        this.listServers = dataRes.data

        if (import.meta.env.DEV) {
          this.listServers.unshift({
            id: 0,
            name: 'local (only local)',
            domain_name: 'http://localhost:33002',
            ip_address: '127.0.0.1',
            limit_process: 2,
            processing: 0,
            is_active: 'Y',
            type: Server.Type.CheckDomain,
            created_at: new Date(),
            updated_at: new Date()
          })
        }
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }

      this.state.isFetchingServer = false
    },
    async handleSelectServer(id: number) {
      this.listData = []
      this.state.isFetching = true
      const server = this.listServers.find((item) => item.id === id)
      if (server) {
        this.serverSelected = server
        this.urlParams.server_id = server.id
      } else if (this.listServers.length > 0) {
        this.serverSelected = this.listServers[0]
        this.urlParams.server_id = this.listServers[0].id
      }

      // Kiểm tra ký tự cuối là / thì xóa
      if (this.serverSelected?.domain_name[this.serverSelected.domain_name.length - 1] === '/') {
        axios.defaults.baseURL = this.serverSelected.domain_name.slice(0, -1) + '/api'
      } else {
        axios.defaults.baseURL = this.serverSelected?.domain_name + '/api'
      }
      await this.fetchData()
    }
  }
})
