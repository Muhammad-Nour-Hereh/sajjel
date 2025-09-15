import authHandlers from './handlers/authHandler'
import itemsHandlers from './handlers/itemsHandler'

export const handlers = [...authHandlers, ...itemsHandlers]
