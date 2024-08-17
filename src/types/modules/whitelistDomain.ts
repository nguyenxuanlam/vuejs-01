import type { Tag } from '@/types'

export namespace WhitelistDomain {
  export interface Item {
    id: number
    name: string
    tags: Tag.Item[]
    created_at: Date
    updated_at: Date
  }

  export interface Create {
    names: string[]
    tag: string | undefined
    tags?: string[]
  }

  export interface Update {
    name: string
    tag: string | undefined
    tags?: string[]
  }

  export interface Delete {
    tag_id: number | undefined
  }
}
