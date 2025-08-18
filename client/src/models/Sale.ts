import { Item } from './Item'
import { Price } from './Price'

export interface SaleItem extends Item {
  quantity: number
  sell_price: Price
  buy_price: Price
  note: string
}

export interface Sale {
  id: number
  items: SaleItem[]
  profit?: Price
  total?: Price
  date: string
  time: string
}
