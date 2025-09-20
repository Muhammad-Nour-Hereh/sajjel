import authHandlers from './handlers/authHandler'
import categoriesHandlers from './handlers/categoriesHandler'
import itemsHandlers from './handlers/itemsHandler'
import saleItemsHandlers from './handlers/saleItemsHandler'
import salesHandlers from './handlers/salesHandler'
import userPrivilegesHandlers from './handlers/userPrivilagesHandler'
import userHandlers from './handlers/usersHandler'

export const handlers = [
  ...authHandlers,
  ...userHandlers,
  ...userPrivilegesHandlers,
  ...itemsHandlers,
  ...salesHandlers,
  ...saleItemsHandlers,
  ...categoriesHandlers,
]
