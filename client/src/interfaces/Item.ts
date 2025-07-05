export interface Item {
  id: number
  name: string
  model?: string | null
  buy_price?: string | null
  sell_price?: string | null
  thumbnail?: string | null
  note?: string | null
  created_at: string
  updated_at: string
}
