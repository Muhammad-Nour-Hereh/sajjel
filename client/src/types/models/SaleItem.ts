import { Money } from '../value-objects/Money'

export interface SaleItem {
  id: number
  item_id: number
  name: string
  model?: string
  note?: string
  quantity: number
  cost: Money
  price: Money
  revenue: Money
  profit: Money
}
