import axios from '@/configs/axios'
import type { HistoryDomain } from '@/types'

const prefix = ''

export const apiHistoryDomain = {
  getListCheck: (params: object) =>
    axios.get<Pagination<HistoryDomain.Check.Item>>(`${prefix}/history-domain-checks`, { params }),
  getListRecord: (params: object) =>
    axios.get<Pagination<HistoryDomain.Record.Item>>(`${prefix}/history-domain-records`, {
      params
    }),
  runRetryCheck: (data: HistoryDomain.RunRetry) =>
    axios.post<HistoryDomain.Check.Item>(`${prefix}/run-retry-check-domain`, data),
  runRetryRecord: (data: HistoryDomain.RunRetry) =>
    axios.post<HistoryDomain.Record.Item>(`${prefix}/run-retry-record-domain`, data),
  export: {
    check: (params: HistoryDomain.Export) =>
      axios.axiosInstance.get<Blob>(`/export/history-domain-checks`, {
        params,
        responseType: 'blob'
      }),
    record: (params: HistoryDomain.Export) =>
      axios.axiosInstance.get<Blob>(`/export/history-domain-record`, {
        params,
        responseType: 'blob'
      })
  }
}
