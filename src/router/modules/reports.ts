import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/reports',
    meta: {
      title: 'Reports'
    },
    children: [
      {
        path: 'history-domain-checks',
        name: RouteName.reports.domain_checks.root,
        component: () => import('@/views/reports/history-domain-check/IndexView.vue'),
        meta: {
          title: i18nRaw.t('menus.reports.history-domain-checks.root')
        }
      },
      {
        path: 'history-domain-records',
        name: RouteName.reports.domain_records.root,
        component: () => import('@/views/reports/history-domain-record/IndexView.vue'),
        meta: {
          title: i18nRaw.t('menus.reports.history-domain-records.root')
        }
      }
    ]
  }
]

export default routes
