export namespace DomainRedirect {
  export interface Item {
    id: number
    domain_id: string
    domain_name: string
    domain_link: string
    count_check: number
    last_check: string
    status: Status.Done | Status.Error // TODO: status error
    history_domain_check_rdr: HistoryDomainCheck[]
    created_at: Date
    updated_at: Date
  }

  export interface HistoryDomainCheck {
    id: number
    check_rdr_id: number
    rdr_link: string | null
    rdr_content: string | null
    is_rdr: number
    created_at: Date
    updated_at: Date
  }

  export enum Status {
    Done = 'DONE',
    Error = 'ERROR'
  }

  export enum Type {
    FIVE_DAY = 5,
    FIFTEEN_DAY = 15
  }
}
