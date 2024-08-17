import axios from '@/configs/axios'
import type { Activity } from '@/types'

const prefix = '/logs'

export const apiActivities = {
  getList: (params?: object) => axios.get<Pagination<Activity.Item>>(prefix, { params })
}
