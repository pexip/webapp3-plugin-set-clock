export interface Config {
  type: 'elapsed' | 'remaining' | 'time'
  starting_value?: number
  prefix?: string
  suffix?: string
  date?: 'dd/mm/yyyy' | 'mm/dd/yyyy'
}
