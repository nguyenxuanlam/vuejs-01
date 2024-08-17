import axios from '@/configs/axios'
import type { Branch } from '@/types'

const prefix = '/branches'

export const apiBranches = {
  getList: (params: object) => axios.get<Pagination<Branch.Item>>(prefix, { params }),
  getDetail: (id: number) => axios.get<Branch.Item>(`${prefix}/${id}`),
  create: (data: Branch.Create) => axios.post<Branch.Item>(prefix, data),
  update: (id: number, data: Branch.Update) => axios.put<Branch.Item>(`${prefix}/${id}`, data),
  delete: (id: number) => axios.delete(`${prefix}/${id}`)
}
