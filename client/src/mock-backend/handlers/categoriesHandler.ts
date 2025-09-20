import { http } from 'msw'
import { api } from '@/http/api'
import { Id, url } from '../utils/utils'
import { ok, noContent, fail } from '../utils/responses'
import type { Category } from '@/types/models/Category'
import type { PatchCategoryRequest } from '@/types/requests/categoryRequests'

// Seed from JSON
import categoriesSeed from '../data/categories.json'

let categories: Category[] = (categoriesSeed as Category[]) ?? []
const curId = new Id(categories)

const mockThumbUrl = (id: number) => `mock://categories/${id}/${Date.now()}`

export const categoriesHandlers = [
  // GET /category
  http.get(url(api.category.index), async () => {
    return ok<Category[]>(categories)
  }),

  // POST /category
  http.post(url(api.category.store), async ({ request }) => {
    const form = await request.formData()
    const name = form.get('name') as string
    const description = form.get('description') as string
    const file = form.get('thumbnail')

    const id = curId.nextId()
    const hasFile = file instanceof File && file.size > 0

    const category: Category = {
      id,
      name: name || 'Untitled Category',
      description: description || '',
      thumbnail: hasFile ? mockThumbUrl(id) : undefined,
      children: [],
      items: [],
      children_count: 0,
      items_count: 0,
      level: 0,
    }

    categories.push(category)
    return ok<Category>(category, 201)
  }),

  // GET /category/:id
  http.get(
    url(api.category.show(0)).replace('/0', '/:id'),
    async ({ params }) => {
      const id = Number(params.id)
      const category = categories.find((c) => c.id === id)
      if (!category) return fail('Category not found', 404)
      return ok<Category>(category)
    },
  ),

  // PATCH /category/:id
  http.patch(
    url(api.category.patch(0)).replace('/0', '/:id'),
    async ({ request, params }) => {
      const id = Number(params.id)
      const idx = categories.findIndex((c) => c.id === id)
      if (idx === -1) return fail('Category not found', 404)

      const updates = (await request.json()) as PatchCategoryRequest
      categories[idx] = { ...categories[idx], ...updates }
      return ok<Category>(categories[idx])
    },
  ),

  // POST /category/:id/update-thumbnail
  http.post(
    url(api.category.updateThumbnail(0)).replace('/0', '/:id'),
    async ({ request, params }) => {
      const id = Number(params.id)
      const idx = categories.findIndex((c) => c.id === id)
      if (idx === -1) return fail('Category not found', 404)

      const form = await request.formData()
      const file = form.get('thumbnail')
      const hasFile = file instanceof File && file.size > 0

      const newThumb = hasFile ? mockThumbUrl(id) : undefined
      categories[idx] = { ...categories[idx], thumbnail: newThumb }

      return ok<{ thumbnail: string }>({ thumbnail: newThumb ?? '' })
    },
  ),

  // DELETE /category/:id
  http.delete(
    url(api.category.destroy(0)).replace('/0', '/:id'),
    async ({ params }) => {
      const id = Number(params.id)
      const idx = categories.findIndex((c) => c.id === id)
      if (idx === -1) return fail('Category not found', 404)

      categories.splice(idx, 1)
      return noContent()
    },
  ),

  // POST /category/:categoryId/add-item/:itemId
  http.post(
    url(api.category.addItem(0, 0)).replace(
      '/0/add-item/0',
      '/:categoryId/add-item/:itemId',
    ),
    async ({ params }) => {
      const categoryId = Number(params.categoryId)
      const itemId = Number(params.itemId)

      const category = categories.find((c) => c.id === categoryId)
      if (!category) return fail('Category not found', 404)

      // Simple mock - don't validate if item exists, just simulate success
      // In real backend you'd validate item exists and isn't already in category
      if (!category.items) category.items = []
      if (!category.items.some((i) => i.id === itemId)) {
        // Mock item object - in reality you'd fetch from items table
        category.items.push({ id: itemId } as any)
        category.items_count = category.items.length
      }

      return noContent()
    },
  ),

  // POST /category/:categoryId/remove-item/:itemId
  http.post(
    url(api.category.removeItem(0, 0)).replace(
      '/0/remove-item/0',
      '/:categoryId/remove-item/:itemId',
    ),
    async ({ params }) => {
      const categoryId = Number(params.categoryId)
      const itemId = Number(params.itemId)

      const category = categories.find((c) => c.id === categoryId)
      if (!category) return fail('Category not found', 404)

      if (category.items) {
        category.items = category.items.filter((i) => i.id !== itemId)
        category.items_count = category.items.length
      }

      return noContent()
    },
  ),

  // POST /category/:parentId/add-subcategory/:childId
  http.post(
    url(api.category.addSubcategory(0, 0)).replace(
      '/0/add-subcategory/0',
      '/:parentId/add-subcategory/:childId',
    ),
    async ({ params }) => {
      const parentId = Number(params.parentId)
      const childId = Number(params.childId)

      const parent = categories.find((c) => c.id === parentId)
      const child = categories.find((c) => c.id === childId)

      if (!parent) return fail('Parent category not found', 404)
      if (!child) return fail('Child category not found', 404)

      // Simple mock - avoid circular references and complex validation
      if (!parent.children) parent.children = []
      if (!parent.children.some((c) => c.id === childId)) {
        parent.children.push(child)
        parent.children_count = parent.children.length
        child.level = (parent.level || 0) + 1
      }

      return noContent()
    },
  ),

  // POST /category/:parentId/remove-subcategory/:childId
  http.post(
    url(api.category.removeSubcategory(0, 0)).replace(
      '/0/remove-subcategory/0',
      '/:parentId/remove-subcategory/:childId',
    ),
    async ({ params }) => {
      const parentId = Number(params.parentId)
      const childId = Number(params.childId)

      const parent = categories.find((c) => c.id === parentId)
      if (!parent) return fail('Parent category not found', 404)

      if (parent.children) {
        parent.children = parent.children.filter((c) => c.id !== childId)
        parent.children_count = parent.children.length
      }

      return noContent()
    },
  ),
]

export default categoriesHandlers
