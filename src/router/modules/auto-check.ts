import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/auto-check',
    name: RouteName.auto_check.root,
    component: () => import('@/views/auto-check/IndexView.vue'),
    meta: {
      title: 'Kiểm tra tự động'
    }
  }
]

export default routes
