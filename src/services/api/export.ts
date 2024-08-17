import axios from '@/configs/axios'
import type { Session } from '@/types'

const prefix = '/export'

export const apiExport = {
  keyword: (params: { branch_id?: number; group_id?: number }) =>
    axios.axiosInstance.get<Blob>(`${prefix}/keyword`, { params, responseType: 'blob' }),
  manualSession: (params: {
    manual_sessions_id?: number
    type: 'CHECK' | 'RECORD'
    status_process?: Session.StatusProcess
    search?: string
  }) =>
    axios.axiosInstance.get<Blob>(`${prefix}/manual-session-history-domain`, {
      params,
      responseType: 'blob'
    }),
  historyDomainCheck: (params: { checked_at: string }) =>
    axios.axiosInstance.get<Blob>(`${prefix}/history-domain-checks`, {
      params,
      responseType: 'blob'
    }),
  historyDomainRecord: (params: { recorded_at: string }) =>
    axios.axiosInstance.get<Blob>(`${prefix}/history-domain-record`, {
      params,
      responseType: 'blob'
    }),
  autoCheckKeywords: (params: { branch_id?: number; group_id?: number; run_at?: string }) =>
    axios.axiosInstance.get<Blob>(`${prefix}/auto-check-keywords`, {
      params,
      responseType: 'blob'
    }),
  autoCheckDomainRdr: (params: { last_check?: string; day: number | 5 | 15 }) =>
    axios.axiosInstance.get<Blob>(`${prefix}/auto-check-domain-rdr`, {
      params,
      responseType: 'blob'
    }),
  autoCheckHistoryDomainRecord: (params: {
    check_keyword_status: -1 | 0 | 1
    recorded_at: string
  }) =>
    axios.axiosInstance.get<Blob>(`${prefix}/auto-check-history-domain-record`, {
      params,
      responseType: 'blob'
    }),
  autoCheckHistoryDomainCheck: (params: { checked_at: string; type: string }) =>
    axios.axiosInstance.get<Blob>(`${prefix}/auto-check-history-domain-check`, {
      params,
      responseType: 'blob'
    })
}
