import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/manual-check',
    name: RouteName.index,
    component: () => import('@/views/manual-check/IndexView.vue'),
    meta: {
      title: 'Kiểm tra thủ công'
    },
    redirect: {
      name: RouteName.manual_check.check_domain
    },
    children: [
      {
        path: 'check-domain',
        name: RouteName.manual_check.check_domain,
        component: () => import('@/views/manual-check/check-domain/CheckDomainView.vue'),
        meta: {
          title: 'Kiểm tra tên miền'
        }
      },
      {
        path: 'record-domain',
        name: RouteName.manual_check.record_domain,
        component: () => import('@/views/manual-check/record-domain/RecordDomainView.vue'),
        meta: {
          title: 'Lọc và quay chụp'
        }
      }
    ]
  }
]

export default routes
