export namespace Provider {
  export interface Item {
    id: number
    name: string
    is_active: 'Y' | 'N'
    is_4g: 'Y' | 'N'
    reset_period: 'daily' | 'monthly'
    used_data: number
    total_data: number
    sort: number
    created_at: Date
    updated_at: Date
  }

  export interface Create {
    name: string
    is_active: 'Y' | 'N'
  }

  export interface Update extends Create {}

  export interface SortItem {
    id: Provider.Item['id']
    name: Provider.Item['name']
    sort: number
  }
}
