import { Item } from './Item'
import { Price } from './Price'

export interface SaleItem extends Item {
  quantity: number
  note: string
}

export interface Sale {
  id: number
  profit?: Price
  total?: Price
  items: SaleItem[]
  date: string
  time: string
}
