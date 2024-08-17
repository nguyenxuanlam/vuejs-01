import axios from '@/configs/axios'
import type { Keyword } from '@/types'

const prefix = '/keywords'

export const apiKeywords = {
  getList: (params: object) => axios.get<Pagination<Keyword.Item>>(prefix, { params }),
  getDetail: (id: number) => axios.get<Keyword.Item>(`${prefix}/${id}`),
  create: (data: Keyword.Create) => axios.post<Keyword.Item>(prefix, data),
  update: (id: number, data: Keyword.Update) => axios.put<Keyword.Item>(`${prefix}/${id}`, data),
  updateRunDaily: (id: number, data: Keyword.UpdateRunDaily) =>
    axios.put<Keyword.Item>(`${prefix}/${id}`, data),
  delete: (id: number) => axios.delete(`${prefix}/${id}`),
  deleteByTag: (id: number) => axios.delete(`${prefix}/delete-by-tag/${id}`)
}
