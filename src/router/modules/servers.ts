import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/servers',
    name: RouteName.servers.root,
    component: () => import('@/views/servers/IndexView.vue'),
    meta: {
      title: 'Quản lý cụm Server'
    }
  }
]

export default routes
