import { Money } from '@/types/value-objects/Money'

// Item Requests
export interface StoreItemRequest extends FormData {
  name: string
  model?: string
  cost?: Money
  price?: Money
  note?: string
  thumbnail?: File
}

export interface UpdateItemRequest {
  name: string
  model?: string
  cost?: Money
  price?: Money
  note?: string
}

export interface PatchItemRequest {
  name?: string
  model?: string
  note?: string
  cost?: Money
  price?: Money
}

export interface UpdateItemThumbnailRequest {
  thumbnail?: File | null
}
