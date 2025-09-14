import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/items', () => {
    return HttpResponse.json([{ id: 1, name: 'Phone' }])
  }),

  http.post('/api/items', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json(body, { status: 201 })
  }),
]
