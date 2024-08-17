import axios from '@/configs/axios'
import type { CheckKeyword } from '@/types'

const prefix = '/keywords'

export const apiHistoryKeywords = {
  getList: (params: object) => axios.get<Pagination<CheckKeyword.Item>>(prefix, { params }),
  getDetail: (id: number) => axios.get<CheckKeyword.Item>(`${prefix}/${id}`)
}
