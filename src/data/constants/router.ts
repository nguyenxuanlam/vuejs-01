export const ROUTE_NAME = {
  index: 'index',
  login: 'login',
  page_1: {
    root: 'page_1',
    index: 'page_1.index',
    detail: {
      root: 'page_1.detail',
      index: 'page_1.detail.index',
      child: 'page_1.detail.child'
    }
  },
  users: {
    root: 'users',
    index: 'users.index'
  },
  keywords: {
    root: 'keywords',
    index: 'keywords.index'
  },
  tags: {
    root: 'tags',
    index: 'tags.index'
  },
  proxies: {
    root: 'proxies'
  },
  providers: {
    root: 'providers'
  },
  reports: {
    domain_checks: {
      root: 'domain_checks',
      index: 'domain_checks.index'
    },
    domain_records: {
      root: 'domain_records',
      index: 'domain_records.index'
    }
  },
  manuals: {
    check_website: {
      root: 'check-website',
      index: 'check-website.index'
    },
    record_website: {
      root: 'record-website',
      index: 'record-website.index'
    },
    report: {
      root: 'report',
      index: 'report.index'
    },
    report_group: {
      root: 'report_group',
      index: 'report_group.index'
    }
  },
  servers: {
    root: 'servers',
    index: 'servers.index'
  },
  whitelist_domains: {
    root: 'whitelist_domains',
    index: 'whitelist_domains.index'
  },
  domains: {
    root: 'domains',
    index: 'domains.index'
  },
  activities: {
    root: 'activities',
    index: 'activities.index'
  },
  auto_check: {
    root: 'auto-check',
    index: 'auto-check.index'
  },
  manual_check: {
    root: 'manual-check',
    index: 'manual-check.index',
    check_domain: 'manual-check.check-domain',
    record_domain: 'manual-check.record-domain'
  },
  keyword_management: {
    root: 'keyword-management',
    index: 'keyword-management.index'
  },
  branch_management: {
    root: 'branch_management',
    index: 'branch_management.index'
  },
  group_management: {
    root: 'group_management',
    index: 'group_management.index'
  },
  errors: {
    404: 'notFound',
    403: 'forbidden'
  }
}
