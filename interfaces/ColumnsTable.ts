export default interface ColumnsTable {
  name: string
  label: string
  field: string | ((row: any) => any)
  algin?: 'left' | 'right' | 'center' | undefined
  required?: boolean
  sortable?: boolean
  sort?: (a: any, b: any, rowA: any, rowB: any) => number
  sortOrder?: 'ad' | 'da'
  format?: (val: any, row: any) => any
  style?: string | ((row: any) => string)
  classes?: string | ((row: any) => string)
  headerStyle?: string
  headerClasses?: string
  checked?: boolean
}
