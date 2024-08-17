import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/proxies',
    meta: {
      title: 'Proxy'
    },
    children: [
      {
        path: '',
        name: RouteName.proxies.root,
        meta: {
          title: 'Quản lý proxy'
        },
        component: () => import('@/views/proxies/IndexView.vue')
      },
      {
        path: 'providers',
        name: RouteName.providers.root,
        component: () => import('@/views/providers/IndexView.vue'),
        meta: {
          title: 'Quản lý providers'
        }
      }
    ]
  }
]

export default routes
