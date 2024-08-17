import type { Keyword } from './keyword'
import type { Proxy } from './proxy'

export namespace Domain {
  export interface Item {
    id: number
    name: string
    link: string
    status: string
    is_active: 'Y' | 'N'
    is_block: 'Y' | 'N'
    is_x: 'Y' | 'N' | 'U'
    is_y: 'Y' | 'N' | 'U'
    is_whitelist: 'Y' | 'N' | 'U'
    last_check: LastCheck
    keywords: Keyword.Item[]
  }

  export interface Create {
    domains: string[]
  }

  export interface Update {
    // name: string
    link: string
  }

  export interface LastCheck {
    id: number
    status: string
    checked_at: Date
    image_path: string
    video_path: string
    image_cloud_path: string
    video_cloud_path: string
    domain_redirect: string
    is_check: number
    is_record: number
    recorded_at: Date
    type: string
    proxies: Proxy.Item[]
  }
}
