import type { User } from './user'

export namespace Auth {
  export interface AuthToken {
    access_token: string
    refresh_token: string
    expires_in: number
    token_type: string
  }

  export interface UserProfile {
    id: number
    name: string
    email: string
    email_verified_at: Date
    mode: string
    created_at: Date
    updated_at: Date
    phonenumber: string
    provider_id: string
    avatar: string
    roles: User.Role[]
    username: string
  }

  export interface ChangePassword {
    current_password: string
    new_password: string
    confirm_password: string
  }
}
