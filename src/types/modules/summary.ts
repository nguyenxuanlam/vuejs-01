export namespace Summary {
  export interface Item {
    // Keyword
    total_keyword: number
    total_domain: number
    total_time_search: string
    start_search_keyword: Date
    last_search_keyword: Date

    // Check Domain
    total_domain_check: number
    total_server_check: number
    total_time_check_domain: string
    start_check_domain: Date
    last_check_domain: Date

    // Record Domain
    total_domain_record: number
    total_server_record: number
    total_time_record_domain: string
    start_record_domain: Date
    last_record_domain: Date
  }
}
