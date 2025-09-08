export interface StoreCategoryRequest {
  name: string
  description: string
  thumbnail?: File
}

export interface PatchCategoryRequest {
  name?: string
  description?: string
}
