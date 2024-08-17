import axios from '@/configs/axios'
import type { Provider } from '@/types'

const prefix = '/proxy-providers'

export const apiProviders = {
  getList: (params?: object) => axios.get<Pagination<Provider.Item>>(prefix, { params }),
  getDetail: (id: number) => axios.get<Provider.Item>(`${prefix}/${id}`),
  create: (data: Provider.Create) => axios.post<Provider.Item>(prefix, data),
  update: (id: number, data: Provider.Update) => axios.put<Provider.Item>(`${prefix}/${id}`, data),
  delete: (id: number) => axios.delete(`${prefix}/${id}`),
  updateSort: (data: Provider.SortItem[]) => axios.put(`${prefix}/update-sort`, data)
}
