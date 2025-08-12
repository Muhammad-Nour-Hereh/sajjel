import { Price } from '@/models/Price'

interface Item {
  item_id: number
  quantity: number
  sell_price: Price
  buy_price?: Price
}

export interface SaleDTO {
  items: Item[]
}
