export const api = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    me: '/auth/me',
    logout: '/auth/logout',
  },
  user: {
    index: '/users',
    show: (id: number) => `/users/${id}`,
    // update: (id: number) => `/users/${id}`,
    // destroy: (id: number) => `/users/${id}`,
    // // Change password endpoint
    // changePassword: (id: number) => `/users/${id}/change-password`,

    userPrivileges: {
      // Get privileges for a specific user
      show: (userId: number) => `/users/${userId}/privileges`,
      // Update privileges for a specific user
      update: (userId: number) => `/users/${userId}/privileges`,
    },
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
    update: (saleId: number, itemId: number) =>
      `/sales/${saleId}/items/${itemId}`,
    patch: (saleId: number, itemId: number) =>
      `/sales/${saleId}/items/${itemId}`,
    reorder: (saleId: number) => `/sales/${saleId}/reorder-items`,
    destroy: (saleId: number, itemId: number) =>
      `/sales/${saleId}/items/${itemId}`,
  },
  category: {
    index: '/category',
    store: '/category',
    show: (id: number) => `/category/${id}`,
    patch: (id: number) => `/category/${id}`,
    updateThumbnail: (id: number) => `/category/${id}/update-thumbnail`,
    destroy: (id: number) => `/category/${id}`,

    // category-item relations
    addItem: (categoryId: number, itemId: number) =>
      `/category/${categoryId}/add-item/${itemId}`,
    removeItem: (categoryId: number, itemId: number) =>
      `/category/${categoryId}/remove-item/${itemId}`,

    // category-subcategory relations
    addSubcategory: (parentId: number, childId: number) =>
      `/category/${parentId}/add-subcategory/${childId}`,
    removeSubcategory: (parentId: number, childId: number) =>
      `/category/${parentId}/remove-subcategory/${childId}`,
  },
}
