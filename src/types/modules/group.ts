import type { Keyword } from '@/types'

export namespace Group {
  export interface Item {
    id: number
    name: string
    keywords: Keyword.Item[]
    created_at: Date
    updated_at: Date
    branch_id: number
  }

  export interface Create {
    name: string
    branch_id: number | null
  }

  export interface Update {
    name: string
    branch_id: number | null
  }
}
