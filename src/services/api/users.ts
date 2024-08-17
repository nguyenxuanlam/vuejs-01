import axios from '@/configs/axios'
import type { User } from '@/types'

const prefix = '/users'

export const apiUsers = {
  getList: (params: object) => axios.get<Pagination<User.Item>>(prefix, { params }),
  getDetail: (id: number) => axios.get<User.Item>(`${prefix}/${id}`),
  create: (data: User.Create) => axios.post<User.Item>(prefix, data),
  update: (id: number, data: User.Update) => axios.put<User.Item>(`${prefix}/${id}`, data),
  delete: (id: number) => axios.delete(`${prefix}/${id}`),
  updateActive: (id: number, isActive: 'Y' | 'N') =>
    axios.put<User.Item>(`${prefix}/${id}/active`, { is_active: isActive }),
  changePassword: (id: number, data: User.UpdatePassword) =>
    axios.put<User.Item>(`${prefix}/${id}`, data)
}
