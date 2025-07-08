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

export function parseItem(raw: any): Item {
  return {
    ...raw,
    buy_price: raw.buy_price
      ? new Price(raw.buy_price.amount, raw.buy_price.currency)
      : undefined,
    sell_price: raw.sell_price
      ? new Price(raw.sell_price.amount, raw.sell_price.currency)
      : undefined,
  }
}
