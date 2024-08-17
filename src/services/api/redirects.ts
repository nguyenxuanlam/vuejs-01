import axios from '@/configs/axios'
import { type DomainRedirect } from '@/types'

const prefix = '/domain-check-rdr'

export const apiRedirects = {
  getList: (params?: object) => axios.get<Pagination<DomainRedirect.Item>>(prefix, { params })
}
