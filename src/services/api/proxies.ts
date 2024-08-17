import axios from '@/configs/axios'
import type { Proxy } from '@/types'

const prefix = '/proxies'

export const apiProxies = {
  getList: (params: object) => axios.get<Pagination<Proxy.Item>>(prefix, { params }),
  getDetail: (id: number) => axios.get<Proxy.Item>(`${prefix}/${id}`),
  create: (data: Proxy.Create) => axios.post<Proxy.Item>(prefix, data),
  update: (id: number, data: Proxy.Update) => axios.put<Proxy.Item>(`${prefix}/${id}`, data),
  delete: (id: number) => axios.delete(`${prefix}/${id}`)
}
