import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/403',
    name: RouteName.errors[403],
    component: () => import('@/views/errors/403View.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: RouteName.errors[404],
    component: () => import('@/views/errors/404View.vue')
  }
]

export default routes
