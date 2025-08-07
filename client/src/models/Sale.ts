import { Item } from './Item'
import { Price } from './Price'

export interface Sale {
  id: number
  total_amount: string
  total_currency: string
  profit_amount: string
  profit_currency: string
  profit?: Price
  total?: Price
  items: Item[]
  date: string
  time: string
}
