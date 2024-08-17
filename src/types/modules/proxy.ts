import { type Provider } from './provider'
import { type HistoryDomain } from './checkDomain'

export namespace Proxy {
  export interface Item {
    id: number
    proxy_name: string
    provider_id: number
    host: string
    port: string
    is_active: 'Y' | 'N' | 'F'
    created_at: Date
    updated_at: Date
    provider?: Provider.Item
    history?: HistoryDomain.History
  }

  export interface Create {
    proxy_name: string
    provider_id: number | null
    host: string
    port: string
    is_active: 'Y' | 'N' | 'F'
  }

  export interface Update extends Create {}
}
