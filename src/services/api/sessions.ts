import axios from '@/configs/axios'
import { Session } from '@/types'

const prefix = '/sessions'

export const apiSessions = {
  getList: (params?: object) => axios.get<Pagination<Session.Item>>(prefix, { params }),
  getDetail: (id: number) => axios.get<Session.Item>(`${prefix}/${id}`),
  getHistory: (params?: Session.Query.History) =>
    axios.get<Pagination<Session.HistoryDomain>>(`/session-history`, { params }),
  create: (data: Session.Create) => axios.post<Session.Item>(prefix, data),
  update: (id: number, data: Session.Update) => axios.put<Session.Item>(`${prefix}/${id}`, data),
  delete: (id: number) => axios.delete(`${prefix}/${id}`),
  updateHistoryDomain: (id: number, data: Session.HistoryDomainUpdate) =>
    axios.put(`session-history/${id}`, data), // TODO
  getProgress: (id: number) => axios.get<Session.Progress>(`/session-process/${id}`),
  deleteHistory: (id: number) => axios.delete(`/session-history/${id}`),
  copySessionHistory: (params: object) =>
    axios.get<Session.Copy.Check[]>(`/sessions-copy`, { params })
}
