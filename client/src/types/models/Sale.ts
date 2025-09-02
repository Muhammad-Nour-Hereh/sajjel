import { Money } from '../value-objects/Money'
import { SaleItem } from './SaleItem'

export interface Sale {
  id: number
  date: string
  time: string
  total_profit?: Money
  total_revenue?: Money
  total_cost?: Money
  saleItems: SaleItem[]
}
