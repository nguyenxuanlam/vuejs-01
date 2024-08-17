export namespace User {
  export interface Item {
    id: number
    name: string
    email: string
    mode: string
    created_at: Date
    updated_at: Date
    phonenumber: string
    avatar: string
    role: Role[]
    permissions: string[]
    is_active: 'Y' | 'N'
    last_login: Date
    username: string
  }

  export interface Create {
    name: string
    email: string
    username: string
    password: string
    role: Role
    is_active: 'Y' | 'N'
  }

  export interface Update {
    name: string
    email: string
    username: string
    role: Role
  }

  export interface UpdatePassword extends Update {
    password: string
  }

  export enum Role {
    Viewer = 'view',
    Editor = 'edit',
    Admin = 'admin'
  }

  export enum RoleStr {
    view = 'Viewer',
    edit = 'Editor',
    admin = 'Admin'
  }
}
