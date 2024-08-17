import type { RouteRecordRaw } from 'vue-router'
const { listUserWhitelist } = useValidUser()

const routes: RouteRecordRaw[] = [
  {
    path: '/branch-management',
    name: RouteName.branch_management.root,
    component: () => import('@/views/branch/IndexView.vue'),
    meta: {
      title: 'Quản lý ngành',
      users: [...listUserWhitelist]
    }
  }
]

export default routes
