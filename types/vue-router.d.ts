import type { User } from '@/types'
import 'vue-router'

declare module 'vue-router' {
  export declare interface RouteMeta extends Record<string | number | symbol, unknown> {
    title?: string
    roles?: User.Role[]
    users?: string[]
  }
}
