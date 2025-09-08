import { Item } from './Item'

export interface Category {
  id: number
  name: string
  description: string
  thumbnail?: string

  // Relations
  children?: Category[]
  items?: Item[]

  // Counts
  children_count?: number
  items_count?: number

  // Hierarchy
  level?: number
}
