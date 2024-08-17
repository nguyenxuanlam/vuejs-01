import axios from '@/configs/axios'
import { type Flow } from '@/types'

const prefix = '/flow'

export const apiFlow = {
  stop: () => axios.axiosInstance.post(`${prefix}/stop`),
  start: () => axios.axiosInstance.post(`${prefix}/start`),

  getMetric: (params: { date: string }) =>
    axios.axiosInstance.get<Flow.Metric>(`${prefix}/metric`, { params })
}
