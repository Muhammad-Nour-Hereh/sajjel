import { Item } from '@/types/models/Item'
import { request, HttpMethod } from './request'
import { Sale } from '@/types/models/Sale'
import { LoginRequest, RegisterRequest } from '@/types/requests/authRequests'
import {
  StoreItemRequest,
  UpdateItemRequest,
  UpdateItemThumbnailRequest,
} from '@/types/requests/itemRequests'
import {
  PatchSaleRequest,
  StoreSaleRequest,
  UpdateSaleRequest,
} from '@/types/requests/saleRequests'
import { api } from './api'
import {
  PatchSaleItemRequest,
  ReorderSaleItemRequest,
  StoreSaleItemRequest,
  UpdateSaleItemRequest,
} from '@/types/requests/saleItemRequests'
import { Category } from '@/types/models/Category'
import {
  PatchCategoryRequest,
  StoreCategoryRequest,
} from '@/types/requests/categoryRequests'
import UserPrivileges from '@/types/models/UserPrivileges'
import UpdateUserPrivilegesRequest from '@/types/requests/UserPrivilegesRequest'
import User from '@/types/models/User'
import Me from '@/types/models/Me'

export const remote = {
  // Auth APIs:
  auth: {
    register: (data: RegisterRequest) =>
      request<string>({
        method: HttpMethod.POST,
        route: api.auth.register,
        body: data,
      }),

    login: (data: LoginRequest) =>
      request<string>({
        method: HttpMethod.POST,
        route: api.auth.login,
        body: data,
      }),

    me: () =>
      request<Me>({
        method: HttpMethod.GET,
        route: api.auth.me,
        auth: true,
      }),

    logout: () =>
      request({
        method: HttpMethod.POST,
        route: api.auth.logout,
        auth: true,
      }),
  },

  // user apis
  user: {
    index: () =>
      request<User[]>({
        method: HttpMethod.GET,
        route: api.user.index,
        auth: true,
      }).then((res) => res.data!),

    show: (id: number) =>
      request<User>({
        method: HttpMethod.GET,
        route: api.user.show(id),
        auth: true,
      }),

    // user privileges apis
    privileges: {
      show: (userId: number): Promise<UserPrivileges> =>
        request<UserPrivileges>({
          method: HttpMethod.GET,
          route: api.user.userPrivileges.show(userId),
          auth: true,
        }).then((res) => res.data!),

      update: (userId: number, data: UpdateUserPrivilegesRequest) =>
        request<UserPrivileges>({
          method: HttpMethod.PUT,
          route: api.user.userPrivileges.update(userId),
          body: data,
          auth: true,
        }),
    },
  },

  // Item APIs:
  items: {
    fetchAll: (): Promise<Item[]> =>
      request<Item[]>({
        method: HttpMethod.GET,
        route: api.items.index,
        auth: true,
      }).then((res) => res.data!),

    store: (data: StoreItemRequest) =>
      request<Item>({
        method: HttpMethod.POST,
        route: api.items.store,
        body: data,
        auth: true,
      }),

    show: (id: number): Promise<Item> =>
      request<Item>({
        method: HttpMethod.GET,
        route: api.items.show(id),
        auth: true,
      }).then((res) => res.data!),

    update: (id: number, data: UpdateItemRequest) =>
      request<Item>({
        method: HttpMethod.PUT,
        route: api.items.update(id),
        body: data,
        auth: true,
      }),

    updateThumbnail: (id: number, data: UpdateItemThumbnailRequest) =>
      request<{ thumbnail: string }>({
        method: HttpMethod.PATCH,
        route: api.items.updateThumbnail(id),
        body: data,
        auth: true,
      }),

    destroy: (id: number) =>
      request<void>({
        method: HttpMethod.DELETE,
        route: api.items.destroy(id),
        auth: true,
      }),
  },

  // Sales APIs:
  sales: {
    fetchAll: (start?: string, end?: string): Promise<Sale[]> => {
      const params = new URLSearchParams()
      if (start) params.append('start_date', start)
      if (end) params.append('end_date', end)
      const queryString = params.toString()

      return request<Sale[]>({
        method: HttpMethod.GET,
        route: `${api.sales.index}${queryString ? `?${queryString}` : ''}`,
        auth: true,
      }).then((res) => res.data!)
    },

    store: (data: StoreSaleRequest) =>
      request<Sale>({
        method: HttpMethod.POST,
        route: api.sales.store,
        body: data,
        auth: true,
      }),

    show: (id: number): Promise<Sale> =>
      request<Sale>({
        method: HttpMethod.GET,
        route: api.sales.show(id),
        auth: true,
      }).then((res) => res.data!),

    update: (id: number, data: UpdateSaleRequest) =>
      request<Sale>({
        method: HttpMethod.PUT,
        route: api.sales.update(id),
        body: data,
        auth: true,
      }),

    patch: (id: number, data: PatchSaleRequest) =>
      request<Sale>({
        method: HttpMethod.PATCH,
        route: api.sales.patch(id),
        body: data,
        auth: true,
      }),

    destroy: (id: number) =>
      request<void>({
        method: HttpMethod.DELETE,
        route: api.sales.destroy(id),
        auth: true,
      }),
  },

  // Sale Items APIs:
  saleItems: {
    store: (saleId: number, data: StoreSaleItemRequest) =>
      request<any>({
        method: HttpMethod.POST,
        route: api.saleItems.store(saleId),
        body: data,
        auth: true,
      }),

    update: (saleId: number, itemId: number, data: UpdateSaleItemRequest) =>
      request<any>({
        method: HttpMethod.PUT,
        route: api.saleItems.update(saleId, itemId),
        body: data,
        auth: true,
      }),

    patch: (saleId: number, itemId: number, data: PatchSaleItemRequest) =>
      request<any>({
        method: HttpMethod.PATCH,
        route: api.saleItems.patch(saleId, itemId),
        body: data,
        auth: true,
      }),

    reorder: (saleId: number, data: ReorderSaleItemRequest) =>
      request<any>({
        method: HttpMethod.PATCH,
        route: api.saleItems.reorder(saleId),
        body: data,
        auth: true,
      }),

    destroy: (saleId: number, itemId: number) =>
      request<void>({
        method: HttpMethod.DELETE,
        route: api.saleItems.destroy(saleId, itemId),
        auth: true,
      }),
  },
  category: {
    index: () =>
      request<Category[]>({
        method: HttpMethod.GET,
        route: api.category.index,
        auth: true,
      }).then((res) => res.data!),

    store: (data: StoreCategoryRequest) =>
      request<Category>({
        method: HttpMethod.POST,
        route: api.category.store,
        body: data,
        auth: true,
      }),

    show: (id: number) =>
      request<Category>({
        method: HttpMethod.GET,
        route: api.category.show(id),
        auth: true,
      }),

    patch: (id: number, data: PatchCategoryRequest) =>
      request<Category>({
        method: HttpMethod.PATCH,
        route: api.category.patch(id),
        body: data,
        auth: true,
      }),

    updateThumbnail: (id: number, data: FormData) =>
      request<Category>({
        method: HttpMethod.PATCH,
        route: api.category.updateThumbnail(id),
        body: data,
        auth: true,
      }),

    destroy: (id: number) =>
      request<void>({
        method: HttpMethod.DELETE,
        route: api.category.destroy(id),
        auth: true,
      }),

    addItem: (categoryId: number, itemId: number) =>
      request<void>({
        method: HttpMethod.POST,
        route: api.category.addItem(categoryId, itemId),
        auth: true,
      }),

    removeItem: (categoryId: number, itemId: number) =>
      request<void>({
        method: HttpMethod.POST,
        route: api.category.removeItem(categoryId, itemId),
        auth: true,
      }),

    addSubcategory: (parentId: number, childId: number) =>
      request<void>({
        method: HttpMethod.POST,
        route: api.category.addSubcategory(parentId, childId),
        auth: true,
      }),

    removeSubcategory: (parentId: number, childId: number) =>
      request<void>({
        method: HttpMethod.POST,
        route: api.category.removeSubcategory(parentId, childId),
        auth: true,
      }),
  },
}
