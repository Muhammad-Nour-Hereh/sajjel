import authHandlers from './handlers/authHandler'
import categoriesHandlers from './handlers/categoriesHandler'
import itemsHandlers from './handlers/itemsHandler'
import saleItemsHandlers from './handlers/saleItemsHandler'
import salesHandlers from './handlers/salesHandler'

export const handlers = [
  ...authHandlers,
  ...itemsHandlers,
  ...salesHandlers,
  ...saleItemsHandlers,
  ...categoriesHandlers,
]
