import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/page-1',
    meta: {
      title: i18nRaw.t('menus.page_1.root')
    },
    children: [
      {
        path: '',
        name: RouteName.page_1.root,
        meta: {
          title: i18nRaw.t('menus.page_1.list')
        },
        redirect: {
          name: RouteName.page_1.index
        },
        children: [
          {
            path: '',
            name: RouteName.page_1.index,
            component: () => import('@/views/page-1/IndexView.vue')
          },
          {
            path: ':id',
            name: RouteName.page_1.detail.root,
            meta: {
              title: 'Test'
            },
            redirect: {
              name: RouteName.page_1.detail.index
            },
            children: [
              {
                path: '',
                name: RouteName.page_1.detail.index,
                component: () => import('@/views/page-1/DetailView.vue')
              },
              {
                path: 'child',
                name: RouteName.page_1.detail.child,
                component: () => import('@/views/page-1/DetailChildView.vue'),
                meta: {
                  title: 'Test child'
                }
              }
            ]
          }
        ]
      }
    ]
  }
]

export default routes
