import axios from '@/configs/axios'
import type { WhitelistDomain } from '@/types'

const prefix = '/whitelist-domains'

export const apiWhitelist = {
  getList: (params: object) => axios.get<Pagination<WhitelistDomain.Item>>(prefix, { params }),
  getDetail: (id: number) => axios.get<WhitelistDomain.Item>(`${prefix}/${id}`),
  create: (data: WhitelistDomain.Create) => axios.post<WhitelistDomain.Item>(prefix, data),
  update: (id: number, data: WhitelistDomain.Update) =>
    axios.put<WhitelistDomain.Item>(`${prefix}/${id}`, data),
  delete: (id: number) => axios.delete(`${prefix}/${id}`),
  deleteByTag: (id: number) => axios.delete(`${prefix}/delete-by-tag/${id}`)
}
