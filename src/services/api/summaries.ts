import axios from '@/configs/axios'
import type { Summary } from '@/types/modules/summary'

const prefix = '/summaries'

export const apiSummaries = {
  getData: (params: object) => axios.get<Summary.Item>(prefix, { params })
}
