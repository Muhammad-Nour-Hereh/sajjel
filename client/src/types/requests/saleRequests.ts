import { Money } from '@/types/value-objects/Money'
import { UpdateSaleItemRequest } from './saleItemRequests'

export interface StoreSaleRequest {
  sold_at?: string
  saleItems: {
    item_id?: number | null
    quantity: number
    cost: Money
    price: Money
  }[]
}

export interface UpdateSaleRequest {
  sold_at?: string
  saleItems?: UpdateSaleItemRequest
}

export interface PatchSaleRequest {
  sold_at?: string
}
