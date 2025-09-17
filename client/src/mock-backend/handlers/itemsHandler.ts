// src/mock-backend/handlers/itemsHandler.ts
import { http } from 'msw'
import { api } from '@/http/api'
import type { Item } from '@/types/models/Item'

// seed from JSON (adjust the path if your setup differs)
import itemsSeed from '../data/items.json'
import { fail, noContent, ok } from '../utils/responses'
import { url } from '../utils/utils'

let items: Item[] = (itemsSeed as Item[]) ?? []

const nextId = () =>
  items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1
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
const mockThumbUrl = (id: number) => `mock://items/${id}/${Date.now()}`

export const itemsHandlers = [
  // GET /items
  http.get(url(api.items.index), async () => {
    return ok<Item[]>(items, 200)
  }),

  // POST /items  (FormData)
  http.post(url(api.items.store), async ({ request }) => {
    const form = await request.formData()
    const name = (form.get('name') as string) || ''
    if (!name.trim()) return fail('The name field is required.', 422)

    const id = nextId()
    const model = (form.get('model') as string) || undefined
    const note = (form.get('note') as string) || undefined
    const cost = parseMaybeJSON<Item['cost']>(form.get('cost'))
    const price = parseMaybeJSON<Item['price']>(form.get('price'))
    const file = form.get('thumbnail')
    const hasFile = file instanceof File && file.size > 0

    const item: Item = {
      id,
      name,
      model,
      note,
      cost,
      price,
      thumbnail: hasFile ? mockThumbUrl(id) : undefined,
    }

    items.push(item)
    return ok<Item>(item, 201)
  }),

  // GET /items/:id
  http.get(url(api.items.show(0)).replace('/0', '/:id'), async ({ params }) => {
    const id = Number(params.id)
    const item = items.find((i) => i.id === id)
    if (!item) return fail('not found', 404)
    return ok<Item>(item, 200)
  }),

  // PUT /items/:id  (JSON)
  http.put(
    url(api.items.update(0)).replace('/0', '/:id'),
    async ({ request, params }) => {
      const id = Number(params.id)
      const idx = items.findIndex((i) => i.id === id)
      if (idx === -1) return fail('not found', 404)

      const body = (await request.json()) as Partial<Item>
      items[idx] = { ...items[idx], ...body }
      return ok<Item>(items[idx], 200)
    },
  ),

  // POST /items/:id/update-thumbnail  (FormData; wrapper sends PATCH as POST)
  http.post(
    url(api.items.updateThumbnail(0)).replace('/0', '/:id'),
    async ({ request, params }) => {
      const id = Number(params.id)
      const idx = items.findIndex((i) => i.id === id)
      if (idx === -1) return fail('not found', 404)

      const form = await request.formData()
      const file = form.get('thumbnail')
      const hasFile = file instanceof File && file.size > 0

      const newThumb = hasFile ? mockThumbUrl(id) : undefined
      items[idx] = { ...items[idx], thumbnail: newThumb }

      // your remote expects { thumbnail: string }
      return ok<{ thumbnail: string }>({ thumbnail: newThumb ?? '' }, 200)
    },
  ),

  // DELETE /items/:id
  http.delete(
    url(api.items.destroy(0)).replace('/0', '/:id'),
    async ({ params }) => {
      const id = Number(params.id)
      const idx = items.findIndex((i) => i.id === id)
      if (idx === -1) return fail('not found', 404)
      items.splice(idx, 1)
      return noContent()
    },
  ),
]

export default itemsHandlers
