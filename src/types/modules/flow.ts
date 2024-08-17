export namespace Flow {
  export interface Metric {
    totalSearch: number
    processingCheck: number
    processingKeyword: number
    processingRecord: number
    processing5days: number
    processing15days: number
    check: {
      processingChecked: number
      timeCheck: string
    }
    record: {
      processingRecorded: number
      timeRecord: string
      timeCheck?: string
    }
  }
}
