import type { RouteRecordRaw } from 'vue-router'
const { listUserWhitelist } = useValidUser()

const routes: RouteRecordRaw[] = [
  {
    path: '/keyword-management',
    name: RouteName.keyword_management.root,
    component: () => import('@/views/keyword-management/indexView.vue'),
    meta: {
      title: 'Quản lý từ khóa',
      users: [...listUserWhitelist]
    }
  }
]

export default routes
