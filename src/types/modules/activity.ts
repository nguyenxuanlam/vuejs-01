export namespace Activity {
  export interface Item {
    id: number
    description: string
    causer: string
    properties: object
    created_at: Date
  }
}
