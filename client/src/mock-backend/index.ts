import authHandlers from './handlers/authHandler'
import categoriesHandlers from './handlers/categoriesHandler'
import itemsHandlers from './handlers/itemsHandler'
import saleItemsHandlers from './handlers/saleItemsHandler'
import salesHandlers from './handlers/salesHandler'
import userPrivilegesHandlers from './handlers/userPrivilagesHandler'

export const handlers = [
  ...authHandlers,
  ...userPrivilegesHandlers,
  ...itemsHandlers,
  ...salesHandlers,
  ...saleItemsHandlers,
  ...categoriesHandlers,
]
