import axios from '@/configs/axios'
import type { Domain } from '@/types'

const prefix = '/domains'

export const apiDomains = {
  getList: (params: object) => axios.get<Pagination<Domain.Item>>(prefix, { params }),
  getDetail: (id: number) => axios.get<Domain.Item>(`${prefix}/${id}`),
  create: (data: Domain.Create) => axios.post<Domain.Item>(prefix, data),
  update: (id: number, data: Domain.Update) => axios.put<Domain.Item>(`${prefix}/${id}`, data),
  delete: (id: number) => axios.delete(`${prefix}/${id}`)
}
