import { User } from '@/types'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/activities',
    name: RouteName.activities.root,
    component: () => import('@/views/activities/IndexView.vue'),
    meta: {
      title: 'Quản lý hoạt động',
      roles: [User.Role.Admin]
    }
  }
]

export default routes
