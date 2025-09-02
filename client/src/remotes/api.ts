export const api = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    me: '/auth/me',
    logout: '/auth/logout',
  },
  items: {
    index: '/items',
    store: '/items',
    show: (id: number) => `/items/${id}`,
    update: (id: number) => `/items/${id}`,
    updateThumbnail: (id: number) => `/items/${id}/update-thumbnail`,
    destroy: (id: number) => `/items/${id}`,
  },
  sales: {
    index: '/sales',
    store: '/sales',
    show: (id: number) => `/sales/${id}`,
    update: (id: number) => `/sales/${id}`,
    patch: (id: number) => `/sales/${id}`,
    destroy: (id: number) => `/sales/${id}`,
  },
  saleItems: {
    store: (saleId: number) => `/sales/${saleId}/items`,
    update: (saleId: number, itemId: number) => `/sales/${saleId}/items/${itemId}`,
    patch: (saleId: number, itemId: number) => `/sales/${saleId}/items/${itemId}`,
    reorder: (saleId: number) => `/sales/${saleId}/reorder-items`,
    destroy: (saleId: number, itemId: number) => `/sales/${saleId}/items/${itemId}`,
  },
}