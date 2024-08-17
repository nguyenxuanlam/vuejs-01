import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/domains',
    name: RouteName.domains.root,
    component: () => import('@/views/domains/IndexView.vue'),
    meta: {
      title: 'Quản lý tên miền'
    }
  }
]

export default routes
