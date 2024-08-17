export namespace Server {
  export interface Item {
    id: number
    name: string
    domain_name: string
    ip_address: string
    limit_process: number
    processing: number
    is_active: 'Y' | 'N'
    type: Type
    created_at: Date
    updated_at: Date
  }

  export interface Create {
    name: string
    domain_name: string
    ip_address: string
    limit_process: number
    processing: number
    is_active: 'Y' | 'N'
    type: 'record-domain'
  }

  export interface Update extends Create {}

  export enum Type {
    RecordDomain = 'record-domain',
    CheckDomain = 'check-domain'
  }

  export enum TypeLabel {
    RecordDomain = 'Quay chụp',
    CheckDomain = 'Kiểm tra'
  }
}
