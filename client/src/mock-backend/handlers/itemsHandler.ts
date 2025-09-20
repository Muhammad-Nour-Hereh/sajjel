// src/mock-backend/handlers/itemsHandler.ts
import { http } from 'msw'
import { api } from '@/http/api'
import type { Item } from '@/types/models/Item'
// seed from JSON (adjust the path if your setup differs)
import itemsSeed from '../data/items.json'
import { fail, noContent, ok } from '../utils/responses'
import { Id, url } from '../utils/utils'

let items: Item[] = (itemsSeed as Item[]) ?? []
const curId = new Id(items)

const parseMaybeJSON = <T = unknown>(
  val: FormDataEntryValue | null,
): T | undefined => {
  if (val == null) return undefined
  if (typeof val !== 'string') return undefined
  try {
    return JSON.parse(val) as T
  } catch {
    return undefined
  }
}

// Helper to convert API paths to MSW route patterns
const mockUrl = (pathWithId: string) =>
  url(pathWithId.replace(/\/\d+/g, '/:id'))

// Use real Unsplash images instead of mock URLs
const getProductImage = (id: number) => {
  const images = [
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop', // iPhone
    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop', // Samsung
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop', // MacBook
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop', // Shoes
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop', // Book
    'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=400&fit=crop', // Book 2
  ]
  return images[(id - 1) % images.length]
}

export const itemsHandlers = [
  // GET /items
  http.get(url(api.items.index), async () => {
    return ok<Item[]>(items)
  }),

  // POST /items (FormData)
  http.post(url(api.items.store), async ({ request }) => {
    const form = await request.formData()
    const name = (form.get('name') as string) || ''

    const id = curId.nextId()
    const model = (form.get('model') as string) || undefined
    const note = (form.get('note') as string) || undefined
    const cost = parseMaybeJSON<Item['cost']>(form.get('cost'))
    const price = parseMaybeJSON<Item['price']>(form.get('price'))
    const file = form.get('thumbnail')
    const hasFile = file instanceof File && file.size > 0

    const item: Item = {
      id,
      name: name || 'Untitled Item',
      model,
      note,
      cost,
      price,
      thumbnail: hasFile ? getProductImage(id) : undefined,
    }

    items.push(item)
    return ok<Item>(item, 201)
  }),

  // GET /items/:id
  http.get(mockUrl(api.items.show(0)), async ({ params }) => {
    const id = Number(params.id)
    const item = items.find((i) => i.id === id)
    if (!item) return fail('Item not found', 404)
    return ok<Item>(item)
  }),

  // PUT /items/:id (JSON)
  http.put(mockUrl(api.items.update(0)), async ({ request, params }) => {
    const id = Number(params.id)
    const idx = items.findIndex((i) => i.id === id)
    if (idx === -1) return fail('Item not found', 404)

    const body = (await request.json()) as Partial<Item>
    items[idx] = { ...items[idx], ...body }
    return ok<Item>(items[idx])
  }),

  // POST /items/:id/update-thumbnail (FormData; wrapper sends PATCH as POST)
  http.post(
    mockUrl(api.items.updateThumbnail(0)),
    async ({ request, params }) => {
      const id = Number(params.id)
      const idx = items.findIndex((i) => i.id === id)
      if (idx === -1) return fail('Item not found', 404)

      const form = await request.formData()
      const file = form.get('thumbnail')
      const hasFile = file instanceof File && file.size > 0

      const newThumb = hasFile ? getProductImage(id) : undefined
      items[idx] = { ...items[idx], thumbnail: newThumb }

      return ok<{ thumbnail: string }>({ thumbnail: newThumb ?? '' })
    },
  ),

  // DELETE /items/:id
  http.delete(mockUrl(api.items.destroy(0)), async ({ params }) => {
    const id = Number(params.id)
    const idx = items.findIndex((i) => i.id === id)
    if (idx === -1) return fail('Item not found', 404)

    items.splice(idx, 1)
    return noContent()
  }),
]

export default itemsHandlers
