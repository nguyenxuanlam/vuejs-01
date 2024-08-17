import type { Group } from './group'

export namespace Tag {
  export interface Item {
    id: number
    name: string
    created_at: Date
    updated_at: Date
    groups: Group.Item[]
  }

  export interface Create {
    name: string
  }

  export interface Update {
    name: string
  }
}
