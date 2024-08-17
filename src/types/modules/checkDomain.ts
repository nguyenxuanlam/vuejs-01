import type { FormattedValue } from 'naive-ui/es/date-picker/src/interface'

export namespace HistoryDomain {
  export namespace Check {
    export interface Item {
      id: number
      status: Status
      checked_at: Date | null
      message: null | string
      image_path: string | null
      video_path: string | null
      image_cloud_path: string | null
      video_cloud_path: string | null
      domain_redirect: null | string
      hook_url: null
      is_check: 0 | 1
      is_record: 0 | 1
      domain: Domain
      proxies: Proxy[]
      domain_check_total: number
      type: 'auto' | 'manual'
    }
  }

  export namespace Record {
    export interface Item extends Omit<Check.Item, 'proxies'> {
      keyword: Keyword
      recorded_at: Date | null
      check_keyword_status: CheckKeywordStatus
    }
  }

  export interface RunRetry {
    history_domain_ids?: number[]
    checked_at?: FormattedValue
  }

  export interface Keyword {
    id: number
    name: string
    is_run_daily: 'Y' | 'N'
    has_domain: number
    created_at: Date
    updated_at: Date
    run_search_google_at: null | Date
    run_search_bing_at: null | Date
    run_search_youtube_at: null | Date
    run_search_ggads_at: null | Date
    status: string
  }

  export interface Domain {
    id: number
    created_at: Date
    updated_at: Date
    link: string
    is_sgg: number
    is_search_bing: number
    name: string
    is_x: string
    is_y: string
    is_block: string
    status: string
    last_check: Date
    last_record: null
    is_search_youtube: number
    is_sggads: number
    is_manual: number
    run_at: Date
    is_active: string
    is_whitelist: string
  }

  export interface Proxy {
    id: number
    proxy_name: string
    host: string
    port: string
    is_active: 'Y' | 'N'
    created_at: Date
    updated_at: Date
    username: null | string
    password: null | string
    provider_id: number
    history: History
    provider: Provider
  }

  export interface History {
    history_domain_check_id: number
    proxy_id: number
    image_path: null | string
    image_cloud_path: null | string
    status: StatusCode
    error: null | string
  }

  export interface Provider {
    id: number
    name: string
    created_at: Date
    updated_at: Date
  }

  export enum StatusCode {
    Unknown = -1,
    Blocked = 0,
    Ok = 1,
    Error = 2,

    ProxyError = 100, // Lỗi proxy
    Timeout = 101, // Timeout
    VerifyCaptcha = 102 // Bị google, cloudflare chặn verify captcha
  }

  export interface Export {
    checked_at?: FormattedValue
    history_domain_id?: JSON
  }

  export enum Status {
    New = 'NEW',
    Done = 'DONE'
  }

  export enum CheckKeywordStatus {
    Found = 1,
    NotFound = 0,
    Unknown = -1
  }
}
