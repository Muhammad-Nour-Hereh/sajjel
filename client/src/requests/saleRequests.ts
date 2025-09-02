import { Money } from '@/value objects/Money'

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
  saleItems?: {
    item_id?: number | null
    quantity: number
    cost: Money
    price: Money
  }[]
}

export interface PatchSaleRequest {
  sold_at?: string
}

// Sale Item Requests
export interface StoreSaleItemRequest {
  item_id?: number | null
  cost: Money
  price: Money
  quantity: number
  sort_order?: number
}

export interface UpdateSaleItemRequest {
  item_id?: number | null
  cost: Money
  price: Money
  quantity: number
  sort_order?: number
}

export interface PatchSaleItemRequest {
  item_id?: number | null
  cost?: Money
  price?: Money
  quantity?: number
  sort_order?: number
}

export interface ReorderSaleItemRequest {
  item_ids: number[]
}
