import type { RouteRecordRaw } from 'vue-router'

const { listUserWhitelist } = useValidUser()
const routes: RouteRecordRaw[] = [
  {
    path: '/whitelist-domains',
    name: RouteName.whitelist_domains.root,
    component: () => import('@/views/whitelist-domains/IndexView.vue'),
    meta: {
      title: 'Quản lý Whitelist Domain',
      users: [...listUserWhitelist]
    }
  }
]

export default routes
