export namespace Report {
  export interface Item {
    id: string
    date: Date
    updatedAt: Date
    taskTotal: number
    excutionTotal: number
    threadExecution: ThreadExecution[]
    type: 'manual' | 'auto'
  }

  export interface ThreadExecution {
    thread: number
    executionDuration: number
    total: number
  }
}
