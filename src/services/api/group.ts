import axios from '@/configs/axios'
import type { Group } from '@/types'

const prefix = '/groups'

export const apiGroups = {
  getList: (params: object) => axios.get<Pagination<Group.Item>>(prefix, { params }),
  getDetail: (id: number) => axios.get<Group.Item>(`${prefix}/${id}`),
  create: (data: Group.Create) => axios.post<Group.Item>(prefix, data),
  update: (id: number, data: Group.Update) => axios.put<Group.Item>(`${prefix}/${id}`, data),
  delete: (id: number) => axios.delete(`${prefix}/${id}`)
}
