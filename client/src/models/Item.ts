import { Price } from './Price'

export interface Item {
  id: number
  name: string
  model?: string
  buy_price?: Price
  sell_price?: Price
  thumbnail?: string
  note?: string
  created_at: string
  updated_at: string
}
