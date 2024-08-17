import type { RouteRecordRaw } from 'vue-router'

const { listUserWhitelist } = useValidUser()
const routes: RouteRecordRaw[] = [
  {
    path: '/keywords',
    name: RouteName.keywords.root,
    component: () => import('@/views/keywords/IndexView.vue'),
    meta: {
      title: i18nRaw.t('menus.keywords.root'),
      users: [...listUserWhitelist]
    }
  },
  {
    path: '/tags',
    name: RouteName.tags.root,
    component: () => import('@/views/tags/IndexView.vue'),
    meta: {
      title: 'Quản lý Tag',
      users: [...listUserWhitelist]
    }
  }
]

export default routes
