export interface StoreCategoryRequest extends FormData {
  name: string
  description: string
  thumbnail?: File
}

export interface PatchCategoryRequest {
  name?: string
  description?: string
}
