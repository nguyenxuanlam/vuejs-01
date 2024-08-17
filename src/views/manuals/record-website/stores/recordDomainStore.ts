import Axios from 'axios'
import { type Provider, Server } from '@/types'
import type { FormattedValue } from 'naive-ui/es/date-picker/src/interface'
import { format } from 'date-fns'
import type { SelectOption } from 'naive-ui'

type UrlSearchParams = {
  page: number
  per_page: number
  server_id?: number
  search?: string
  date?: FormattedValue
  status?: 0 | 1 | 2
  type: 'manual' | 'auto'
}

export interface RecordDomain {
  id: string
  domain: string
  hookUrl: string
  serverId: number
  historyDomainId: number
  status: Status
  isSentBack: boolean
  domainRedirect: null | string
  message: null | string
  imagePath: null | string
  videoPath: null | string
  imageCloudPath: null | string
  videoCloudPath: null | string
  updateAt: Date
  createdAt: Date
}

export interface TaskStatistic {
  pending: number
  running: number
  done: number
  total: number
  processLimit: number
}

export enum Status {
  New = 0,
  Running = 1,
  Done = 2
}

export const axios = Axios.create({
  baseURL: '',
  timeout: 90000
})

export const useRecordDomainStore = defineStore('RecordDomainStore_proxy', {
  state: () => ({
    listData: [] as RecordDomain[],
    pagination: {
      totalItem: 0,
      pageCount: 0
    },
    listProviders: [] as Provider.Item[],
    listServers: [] as Server.Item[],
    serverSelected: null as Server.Item | null,
    urlParams: useUrlSearchParams<UrlSearchParams>(),
    taskStatistic: null as TaskStatistic | null,
    state: {
      pendingFetchData: false,
      pendingTaskStatistic: false,
      isFetching: true,
      isFetchingProviders: true,
      isFetchingServer: true
    },
    stateModal: {
      isShowCreateModal: false
    },
    typeOptions: <SelectOption[]>[
      { label: 'Thủ công', value: 'manual' },
      { label: 'Tự động', value: 'auto' }
    ]
  }),
  getters: {
    getProgressPercent(state): number {
      if (!state.taskStatistic) return 0
      const percent = (state.taskStatistic.done / state.taskStatistic.total) * 100
      return Number(percent.toFixed(2)) || 0
    },
    isTypeManual(state): boolean {
      return state.urlParams.type === 'manual'
    }
  },
  actions: {
    async fetchData() {
      this.state.pendingFetchData = true

      try {
        const serverId = this.serverSelected?.id
        const res = await axios.get<RecordDomain[] | null>('/task', { params: this.urlParams })
        if (res.data === null) {
          this.listData = []
        } else {
          if (serverId !== this.serverSelected?.id) {
            return
          }
          this.listData = res.data
        }

        this.pagination.totalItem = Number(res.headers['x-total-count']) || 0
        this.pagination.pageCount = Math.ceil(this.pagination.totalItem / this.urlParams.per_page)

        if (this.urlParams.page > 1 && !this.listData.length) {
          this.onChangePage(this.urlParams.page - 1)
          return
        }
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }

      this.state.isFetching = false
      this.state.pendingFetchData = false
    },
    async fetchTaskStatistic() {
      this.state.pendingTaskStatistic = true
      try {
        const serverId = this.serverSelected?.id
        const res = await axios.get<TaskStatistic>('/task-statistic/all', {
          params: this.urlParams
        })
        if (serverId !== this.serverSelected?.id) {
          return
        }
        this.taskStatistic = res.data
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }
      this.state.pendingTaskStatistic = false
    },
    async clearAllData() {
      try {
        await axios.delete('/task', { params: this.urlParams })
        this.state.isFetching = true
        await Promise.all([this.fetchData(), this.fetchTaskStatistic()])
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }
    },
    onChangePage(page: number) {
      this.urlParams.page = page
      this.state.isFetching = true
      this.fetchData()
    },
    onChangePageSize(pageSize: number) {
      this.urlParams.per_page = pageSize
      this.onChangePage(1)
    },
    resetUrlParams() {
      this.$patch({
        urlParams: useUrlSearchParams<UrlSearchParams>()
      })
      this.urlParams.page = zod
        .number()
        .min(1)
        .default(1)
        .catch(1)
        .parse(Number(this.urlParams.page))
      this.urlParams.per_page = zod
        .number()
        .min(1)
        .default(10)
        .catch(10)
        .parse(Number(this.urlParams.per_page))

      this.urlParams.server_id = zod
        .number()
        .optional()
        .safeParse(Number(this.urlParams.server_id)).data

      this.urlParams.date = zod
        .string()
        .default(format(new Date(), 'yyyy-MM-dd'))
        .parse(this.urlParams.date)

      this.urlParams.type = zod
        .enum(['manual', 'auto'])
        .default('manual')
        .catch('manual')
        .parse(this.urlParams.type)
    },
    async fetchProviders() {
      this.state.isFetchingProviders = true

      try {
        const res = await apiProviders.getList()
        const dataRes = res.data.data
        this.listProviders = dataRes.data
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }

      this.state.isFetchingProviders = false
    },
    async fetchServers() {
      this.state.isFetchingServer = true

      try {
        const res = await apiServers.getList({
          type: 'record-domain',
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
            type: Server.Type.RecordDomain,
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
      await Promise.all([this.fetchData(), this.fetchTaskStatistic()])
    },
    async clearById(id: string) {
      try {
        await axios.delete(`/task/${id}`)
        this.state.isFetching = true
        await this.fetchData()
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }
    },
    async retryById(id: string) {
      try {
        await axios.get(`/task/retry/${id}`)
        const index = this.listData.findIndex((item) => item.id === id)
        if (index !== -1) {
          this.listData[index].status = 0
          this.fetchTaskStatistic()
        }
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }
    },
    async retryAll() {
      try {
        await axios.get('/task/retry-all', { params: this.urlParams })
        this.state.isFetching = true
        await Promise.all([this.fetchData(), this.fetchTaskStatistic()])
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }
    },
    exportAll(params: any) {
      try {
        return axios.get(`/task/export-all`, {
          params,
          responseType: 'blob'
        })
      } catch (error) {
        const { showMessageError } = useHelper()
        showMessageError(error)
      }
    }
  }
})
