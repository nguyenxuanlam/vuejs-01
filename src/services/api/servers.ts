import axios from '@/configs/axios'
import type { Server } from '@/types'

const prefix = '/servers'

export const apiServers = {
  getList: (params?: object) => axios.get<Pagination<Server.Item>>(prefix, { params }),
  getDetail: (id: number) => axios.get<Server.Item>(`${prefix}/${id}`),
  create: (data: Server.Create) => axios.post<Server.Item>(prefix, data),
  update: (id: number, data: Server.Update) => axios.put<Server.Item>(`${prefix}/${id}`, data),
  delete: (id: number) => axios.delete(`${prefix}/${id}`)
}
