import type { MenuMixedOption } from 'naive-ui/es/menu/src/interface'
import { Icon } from '@iconify/vue'
import { RouterLink } from 'vue-router'
import { NEllipsis } from 'naive-ui'
import type { RendererNode } from 'vue'
import { User } from '@/types'
import CIcon from '@/components/icon/CIcon.vue'

function renderIcon(icon: string) {
  return () => h(Icon, { icon })
}

function renderCIcon(icon: string) {
  return () => h(CIcon, { icon })
}

function renderRoute(data: { label: string; name: string }) {
  return renderLabel(h(RouterLink, { to: { name: data.name } }, { default: () => data.label }))
}

function renderLabel(label: string | RendererNode) {
  const { sideBarCollapsed } = useAppStore()
  if (sideBarCollapsed) {
    return () => h(() => label)
  }
  return () => h(NEllipsis, { tooltip: { keepAliveOnHover: false } }, { default: () => label })
}

computed(() => {
  return []
})

export const menuOptions = computed<MenuMixedOption[]>(() => {
  const { isUserBlackListed, isUserWhiteListed } = useValidUser()
  const menu: MenuMixedOption[] = isUserBlackListed()
    ? [
        {
          label: renderRoute({
            label: 'Check website thủ công',
            name: RouteName.manuals.check_website.root
          }),
          key: RouteName.manuals.check_website.root,
          icon: renderIcon('fluent-mdl2:test-plan'),
          props: {}
        }
      ]
    : [
        {
          label: renderRoute({
            label: 'Kiểm tra thủ công',
            name: RouteName.index
          }),
          key: RouteName.index,
          icon: renderCIcon('icon-manual-check'),
          props: {}
        },
        {
          label: renderRoute({
            label: 'Kiểm tra tự động',
            name: RouteName.auto_check.root
          }),
          key: RouteName.auto_check.root,
          icon: renderCIcon('icon-auto-check'),
          props: {}
        },
        {
          label: 'Quản lý từ khóa',
          key: 'keywords-menu',
          icon: renderIcon('fluent:keyboard-16-regular'),
          props: {},
          show: isUserWhiteListed(),
          children: [
            // {
            //   label: renderRoute({
            //     label: $t('menus.keywords.root'),
            //     name: RouteName.keywords.root
            //   }),
            //   key: RouteName.keywords.root,
            //   icon: renderIcon('codicon:symbol-keyword'),
            //   props: {}
            // },
            {
              label: renderRoute({
                label: 'Từ khóa',
                name: RouteName.keyword_management.root
              }),
              key: RouteName.keyword_management.root,
              icon: renderCIcon('icon-keyword-management'),
              props: {}
            },
            {
              label: renderRoute({
                label: 'Ngành',
                name: RouteName.branch_management.root
              }),
              key: RouteName.branch_management.root,
              icon: renderIcon('ic:outline-local-laundry-service'),
              props: {}
            },
            {
              label: renderRoute({
                label: 'Thương hiệu',
                name: RouteName.group_management.root
              }),
              key: RouteName.group_management.root,
              icon: renderIcon('mdi:trademark'),
              props: {}
            }
          ]
        },
        {
          label: renderLabel('Quản lý whitelist'),
          key: 'whitelist-menu',
          icon: renderIcon('ph:list-star-light'),
          show: true,
          children: [
            {
              label: renderRoute({
                label: 'Whitelist',
                name: RouteName.whitelist_domains.root
              }),
              key: RouteName.whitelist_domains.root,
              icon: renderIcon('material-symbols-light:domain-add'),
              props: {},
              show: isUserWhiteListed()
            },
            {
              label: renderRoute({
                label: 'Quản lý tag',
                name: RouteName.tags.root
              }),
              key: RouteName.tags.root,
              icon: renderIcon('mdi:tag-outline')
            }
          ]
        },
        {
          label: renderLabel('Server'),
          key: 'server-menu',
          icon: renderIcon('flowbite:server-outline'),
          show: true,
          children: [
            {
              label: renderRoute({
                label: 'Quản lý server',
                name: RouteName.servers.root
              }),
              icon: renderIcon('uil:server'),
              key: RouteName.servers.root
            },
            {
              label: renderRoute({
                label: 'Quản lý proxy',
                name: RouteName.proxies.root
              }),
              icon: renderIcon('mdi:proxy'),
              key: RouteName.proxies.root
            },
            {
              label: renderRoute({
                label: 'Quản lý provider',
                name: RouteName.providers.root
              }),
              key: RouteName.providers.root,
              icon: renderIcon('icon-park-outline:network-tree')
            }
          ]
        },

        {
          label: renderLabel('Người dùng'),
          key: 'user-menu',
          icon: renderIcon('eos-icons:admin-outlined'),
          show: true,
          roles: [User.Role.Admin],
          children: [
            {
              label: renderRoute({
                label: 'Quản lý người dùng',
                name: RouteName.users.root
              }),
              key: RouteName.users.root,
              icon: renderIcon('majesticons:users-line'),
              props: {}
            },
            {
              label: renderRoute({
                label: 'Hoạt động',
                name: RouteName.activities.root
              }),
              key: RouteName.activities.root,
              icon: renderIcon('icon-park-outline:log'),
              props: {}
            }
          ]
        }

        // {
        //   label: renderLabel($t('menus.page_1.root')),
        //   key: 'page_1',
        //   icon: renderIcon('solar:user-circle-outline'),
        //   show: true,
        //   children: [
        //     {
        //       label: renderRoute({
        //         label: $t('menus.page_1.list'),
        //         name: RouteName.page_1.root
        //       }),
        //       key: RouteName.page_1.root
        //     }
        //   ]
        // },
        // {
        //   label: renderRoute({
        //     label: $t('menus.home'),
        //     name: RouteName.index
        //   }),
        //   key: RouteName.index,
        //   icon: renderIcon('fluent:home-16-regular'),
        //   props: {}
        // },
        // {
        //   label: $t('menus.reports.title'),
        //   key: 'report-management',
        //   icon: renderIcon('carbon:report-data'),
        //   children: [
        //     {
        //       label: renderRoute({
        //         label: $t('menus.reports.history-domain-checks.root'),
        //         name: RouteName.reports.domain_checks.root
        //       }),
        //       key: RouteName.reports.domain_checks.root,
        //       icon: renderIcon('material-symbols-light:fact-check-outline'),
        //       props: {}
        //     },
        //     {
        //       label: renderRoute({
        //         label: $t('menus.reports.history-domain-records.root'),
        //         name: RouteName.reports.domain_records.root
        //       }),
        //       key: RouteName.reports.domain_records.root,
        //       icon: renderIcon('tabler:capture-filled'),
        //       props: {}
        //     }
        //   ]
        // },
        // {
        //   label: 'Chạy thủ công',
        //   key: 'run-manually',
        //   icon: renderIcon('material-symbols-light:trackpad-input'),
        //   children: [
        //     {
        //       label: renderRoute({
        //         label: 'Kiểm tra website',
        //         name: RouteName.manuals.check_website.root
        //       }),
        //       key: RouteName.manuals.check_website.root,
        //       icon: renderIcon('material-symbols-light:fact-check-outline'),
        //       props: {}
        //     },
        //     {
        //       label: renderRoute({
        //         label: 'Quay chụp website',
        //         name: RouteName.manuals.record_website.root
        //       }),
        //       key: RouteName.manuals.record_website.root,
        //       icon: renderIcon('tabler:capture-filled'),
        //       props: {}
        //     },
        //     {
        //       label: renderRoute({
        //         label: 'Report',
        //         name: RouteName.manuals.report.root
        //       }),
        //       key: RouteName.manuals.report.root,
        //       icon: renderIcon('tabler:report'),
        //       props: {}
        //     },
        //     {
        //       label: renderRoute({
        //         label: 'Report Group',
        //         name: RouteName.manuals.report_group.root
        //       }),
        //       key: RouteName.manuals.report_group.root,
        //       icon: renderIcon('carbon:report-data'),
        //       props: {}
        //     }
        //   ]
        // },
        // {
        //   label: renderRoute({
        //     label: 'Tên miền',
        //     name: RouteName.domains.root
        //   }),
        //   key: RouteName.domains.root,
        //   icon: renderIcon('icon-park-solid:web-page'),
        //   props: {}
        // },
      ]

  // check permission
  const authStore = useAuthStore()
  return menu.filter((item) => {
    const permissions = item.roles as User.Role[]
    if (permissions && permissions.length) {
      return useCheckRoles(permissions)
    }
    const users = item.users as string[]
    if (users && users.length && authStore.profile) {
      return users.includes(authStore.profile.email)
    }
    return true
  })
})
