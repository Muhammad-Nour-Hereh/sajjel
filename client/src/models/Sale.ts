import { Item } from './Item'
import { Price } from './Price'

export interface Sale {
  id: Number
  profit?: Price
  total?: Price
  item: Item[]
  time: Time
  date: Date
}
