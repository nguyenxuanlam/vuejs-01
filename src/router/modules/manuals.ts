import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/manuals',
    meta: {
      title: 'Manuals'
    },
    children: [
      {
        path: 'check-website',
        name: RouteName.manuals.check_website.root,
        component: () => import('@/views/manuals/check-website/IndexView.vue'),
        meta: {
          title: i18nRaw.t('menus.manuals.check-website.root')
        }
      },
      {
        path: 'record-website',
        name: RouteName.manuals.record_website.root,
        component: () => import('@/views/manuals/record-website/IndexView.vue'),
        meta: {
          title: i18nRaw.t('menus.manuals.record-website.root')
        }
      },
      {
        path: 'report',
        name: RouteName.manuals.report.root,
        component: () => import('@/views/manuals/report/IndexView.vue'),
        meta: {
          title: i18nRaw.t('menus.manuals.report.root')
        }
      },
      {
        path: 'report-group',
        name: RouteName.manuals.report_group.root,
        component: () => import('@/views/manuals/report-group/IndexView.vue'),
        meta: {
          title: i18nRaw.t('menus.manuals.report_group.root')
        }
      }
    ]
  }
]

export default routes
