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
    buy_price:
      raw.buy_price && raw.buy_price_currency
        ? new Price(parseFloat(raw.buy_price), raw.buy_price_currency)
        : undefined,

    sell_price:
      raw.sell_price && raw.sell_price_currency
        ? new Price(parseFloat(raw.sell_price), raw.sell_price_currency)
        : undefined,
  }
}
