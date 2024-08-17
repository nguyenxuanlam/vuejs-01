import { type Group } from '@/types'

export namespace Branch {
  export interface Item {
    id: number
    name: string
    groups: Group.Item[]
    created_at: Date
    updated_at: Date
  }

  export interface Create {
    name: string
  }

  export interface Update {
    name: string
  }
}
