import { Money } from '@/value objects/Money'

interface Item {
  item_id: number
  quantity: number
  price: Money
  cost?: Money
}

export interface SaleDTO {
  items: Item[]
}
