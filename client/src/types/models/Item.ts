import { Money } from '../value-objects/Money'

export interface Item {
  id: number
  name: string
  model?: string
  thumbnail?: string
  note?: string
  cost?: Money
  price?: Money
}
