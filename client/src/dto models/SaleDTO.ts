import { Money } from '@/value objects/Money'

export interface SaleDTO {
  saleItems: {
    item_id?: number | null
    name: string
    model?: string
    note?: string
    quantity: number
    cost: Money
    price: Money
  }[]
}
