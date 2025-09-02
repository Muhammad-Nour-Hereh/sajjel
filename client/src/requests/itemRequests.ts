import { Money } from '@/value objects/Money'

// Item Requests
export interface StoreItemRequest {
  name: string
  model?: string
  cost?: Money
  price?: Money
  thumbnail?: File
  note?: string
}

export interface UpdateItemRequest {
  name?: string
  model?: string
  note?: string
  cost?: Money
  price?: Money
}

export interface UpdateItemThumbnailRequest {
  thumbnail?: File | null
}
