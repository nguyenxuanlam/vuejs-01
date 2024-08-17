export namespace Session {
  export interface Item {
    id: number
    name: string
    user_id: number
    type: 'CHECK' | 'RECORD'
    total: number
    finished_at: Date
    created_at: Date
    updated_at: Date
    domain?: string[]
    keywords?: string[]
    session_history_domains: HistoryDomain[]
  }

  export interface HistoryDomain {
    id: number
    manual_sessions_id: number
    domain: string
    keywords: string | null
    type: 'CHECK' | 'RECORD'
    status_domain: StatusDomain
    status_process: StatusProcess
    result: HistoryDomainResult | null
    finished_at: string
    created_at: Date
    updated_at: Date
  }

  export interface HistoryDomainResult {
    id: number
    domain: string
    status: StatusCode
    hookUrl: string
    message: string | null
    proxies: Proxy[] | null
    serverId: number
    updateAt: Date | null
    createdAt: Date
    imagePath: string | null
    videoPath: string | null
    isSentBack: boolean
    processing: number
    domainRedirect: string | null
    imageCloudPath: string | null
    isAcceptRecord: boolean
    videoCloudPath: string | null
    executionThread: number
    historyDomainId: number
    processLimiting: string
    executionDuration: number
  }

  export interface Proxy {
    proxyId: number
    providerId: number
    statusCode: StatusCode
    error: string
    imageCloudPath: string
  }

  export interface Create {
    type: 'CHECK' | 'RECORD'
    domain?: string[]
    keywords?: string[]
  }

  export interface Update {
    status_process: StatusProcess
  }

  export interface HistoryDomainUpdate {
    status_process: StatusProcess
  }

  export enum HistoryDomainResultType {
    auto = 'auto',
    manual = 'manual'
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

  export enum StatusDomain {
    Default = 0,
    X = 1,
    YBlock = 2,
    Whitelist = 3,
    Error = 4
  }

  export enum StatusProcess {
    Create = 0,
    Process = 1,
    Finish = 2,

    FinishUnknown = 19,
    FinishNotFound = 20,
    FinishFound = 21
  }

  export interface Progress {
    total: number
    done: number
  }

  export namespace Query {
    export interface History extends QueryPagination {
      type?: 'CHECK' | 'RECORD'
      manual_sessions_id?: number
      status_process?: StatusProcess
      status_domain?: StatusDomain
    }
  }

  export namespace Copy {
    export interface Check {
      domain: string
      status_domain: StatusDomain
      finished_at: Date | null
      updated_at: Date | null
    }
  }
}
