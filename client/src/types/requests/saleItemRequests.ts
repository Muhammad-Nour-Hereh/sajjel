import { Money } from '@/types/value-objects/Money'

// Sale Item Requests
export interface StoreSaleItemRequest {
  item_id?: number | null
  name: string
  cost: Money
  price: Money
  note: string
  quantity: number
}

export interface UpdateSaleItemRequest extends StoreSaleItemRequest {}

export interface PatchSaleItemRequest {
  item_id?: number | null
  name?: string
  cost?: Money
  price?: Money
  note?: string
  quantity?: number
}

export interface ReorderSaleItemRequest {
  item_ids: number[]
}
