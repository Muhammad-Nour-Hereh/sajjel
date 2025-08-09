import { Item } from './Item'
import { Price } from './Price'

export interface Sale {
  id: number
  profit?: Price
  total?: Price
  items: Item[]
  date: string
  time: string
}
