export namespace CheckKeyword {
  export interface Item {
    id: number
    name: string
    is_run_daily: boolean
    keyword_run_histories: HistoryKeyword[]
    domains: Domain[]
    created_at: Date
    updated_at: Date
  }

  export interface HistoryKeyword {
    id: number
    keyword_id: string
    engine: string
    status: Status
    total_search: number
    total_done_check: number
    total_done_record: number
    run_at: string
    total_x: number
    total_y: number
    total_block: number
    total_whitelist: number
    created_at: Date
    updated_at: Date
  }

  export interface Domain {
    id: number
    created_at: Date
    updated_at: Date
    link: string
    is_sgg: number
    is_search_bing: number
    name: string
    status: string
    last_check: Date | null
    last_record: Date | null
    is_search_youtube: number
    is_sggads: number
    is_manual: number
    run_at: Date | null
    is_active: 'Y' | 'N'
    is_whitelist: 'Y' | 'N'
    is_x: 'Y' | 'N'
    is_y: 'Y' | 'N'
  }

  export enum Status {
    New = 'NEW',
    Done = 'DONE'
  }
}
