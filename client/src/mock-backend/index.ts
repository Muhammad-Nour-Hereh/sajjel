import { http } from 'msw'
import authHandlers from './handlers/authHandler'
import itemsHandlers from './handlers/itemsHandler'
import { fail } from './utils/responses'

export const handlers = [
  ...authHandlers,
  ...itemsHandlers,
  // Catch-all
  http.all('*', async () => {
    return fail('Invalid request', 403)
  }),
]
