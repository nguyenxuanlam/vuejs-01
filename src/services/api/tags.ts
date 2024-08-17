import axios from '@/configs/axios'
import type { Tag } from '@/types'

const prefix = '/tags'

export const apiTags = {
  getList: (params: object) => axios.get<Pagination<Tag.Item>>(prefix, { params }),
  getDetail: (id: number) => axios.get<Tag.Item>(`${prefix}/${id}`),
  create: (data: Tag.Create) => axios.post<Tag.Item>(prefix, data),
  update: (id: number, data: Tag.Update) => axios.put<Tag.Item>(`${prefix}/${id}`, data),
  delete: (id: number) => axios.delete(`${prefix}/${id}`)
}
