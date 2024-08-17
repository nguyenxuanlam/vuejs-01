import { User } from '@/types'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/users',
    name: RouteName.users.root,
    component: () => import('@/views/users/IndexView.vue'),
    meta: {
      title: i18nRaw.t('menus.users.root'),
      roles: [User.Role.Admin]
    }
  }
]

export default routes
