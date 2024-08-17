import type { RouteRecordRaw } from 'vue-router'
const { listUserWhitelist } = useValidUser()

const routes: RouteRecordRaw[] = [
  {
    path: '/group-management',
    name: RouteName.group_management.root,
    component: () => import('@/views/group/IndexView.vue'),
    meta: {
      title: 'Quản lý thương hiệu',
      users: [...listUserWhitelist]
    }
  }
]

export default routes
