import type { Tag, User, Domain } from '@/types'

export namespace Keyword {
  export interface Item {
    id: number
    name: string
    is_run_daily: 'Y' | 'N'
    tags: Tag.Item[]
    domains: Domain[]
    created_at: Date
    updated_at: Date
    user: User.Item | null
    has_domain?: number
    branch_id?: number
    group_id?: number
  }

  export interface Create {
    names: string[]
    is_run_daily: 'Y' | 'N'
    // tag: string | undefined
    // tags?: string[]
    branch_id: number | null
    group_id: number | null
  }

  export interface Update {
    name: string
    is_run_daily: 'Y' | 'N'
    branch_id: number | null
    group_id: number | null
    id: number | null
  }

  export interface UpdateRunDaily {
    is_run_daily: 'Y' | 'N'
    name: string
  }
  export interface Delete {
    tag_id: number | undefined
  }

  export interface Domain extends Domain.Item {}
}
