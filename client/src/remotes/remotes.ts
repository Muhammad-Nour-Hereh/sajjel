import { Item } from '@/models/Item'
import { request, HttpMethod } from './request'
import { Sale } from '@/models/Sale'
import { LoginRequest, RegisterRequest } from '@/requests/authRequests'
import {
  StoreItemRequest,
  UpdateItemRequest,
  UpdateItemThumbnailRequest,
} from '@/requests/itemRequests'
import {
  PatchSaleItemRequest,
  PatchSaleRequest,
  ReorderSaleItemRequest,
  StoreSaleItemRequest,
  StoreSaleRequest,
  UpdateSaleItemRequest,
  UpdateSaleRequest,
} from '@/requests/saleRequests'

export const remote = {
  // Auth APIs:
  auth: {
    register: (data: RegisterRequest) =>
      request<string>({
        method: HttpMethod.POST,
        route: '/auth/register',
        body: data,
      }),

    login: (data: LoginRequest) =>
      request<string>({
        method: HttpMethod.POST,
        route: '/auth/login',
        body: data,
      }),

    me: () =>
      request<string>({
        method: HttpMethod.GET,
        route: '/auth/me',
        auth: true,
      }),

    logout: () =>
      request({
        method: HttpMethod.POST,
        route: '/auth/logout',
        auth: true,
      }),
  },

  // Item APIs:
  items: {
    fetchAll: (): Promise<Item[]> =>
      request<Item[]>({
        method: HttpMethod.GET,
        route: '/items',
        auth: true,
      }).then((res) => res.data!),

    store: (data: StoreItemRequest) =>
      request<Item>({
        method: HttpMethod.POST,
        route: '/items',
        body: data,
        auth: true,
      }),

    show: (id: number): Promise<Item> =>
      request<Item>({
        method: HttpMethod.GET,
        route: `/items/${id}`,
        auth: true,
      }).then((res) => res.data!),

    update: (id: number, data: UpdateItemRequest) =>
      request<Item>({
        method: HttpMethod.PUT,
        route: `/items/${id}`,
        body: data,
        auth: true,
      }),

    updateThumbnail: (id: number, data: UpdateItemThumbnailRequest) =>
      request<{ thumbnail: string }>({
        method: HttpMethod.PATCH,
        route: `/items/${id}/update-thumbnail`,
        body: data,
        auth: true,
      }),

    destroy: (id: number) =>
      request<void>({
        method: HttpMethod.DELETE,
        route: `/items/${id}`,
        auth: true,
      }),
  },

  // Sales APIs:
  sales: {
    fetchAll: (start?: string, end?: string): Promise<Sale[]> =>
      request<Sale[]>({
        method: HttpMethod.GET,
        route: `/sales?start_date=${start}&end_date=${end}`,
        auth: true,
      }).then((res) => res.data!),

    store: (data: StoreSaleRequest) =>
      request<Sale>({
        method: HttpMethod.POST,
        route: '/sales',
        body: data,
        auth: true,
      }),

    show: (id: number): Promise<Sale> =>
      request<Sale>({
        method: HttpMethod.GET,
        route: `/sales/${id}`,
        auth: true,
      }).then((res) => res.data!),

    update: (id: number, data: UpdateSaleRequest) =>
      request<Sale>({
        method: HttpMethod.PUT,
        route: `/sales/${id}`,
        body: data,
        auth: true,
      }),

    patch: (id: number, data: PatchSaleRequest) =>
      request<Sale>({
        method: HttpMethod.PATCH,
        route: `/sales/${id}`,
        body: data,
        auth: true,
      }),

    destroy: (id: number) =>
      request<void>({
        method: HttpMethod.DELETE,
        route: `/sales/${id}`,
        auth: true,
      }),
  },

  // Sale Items APIs:
  saleItems: {
    store: (saleId: number, data: StoreSaleItemRequest) =>
      request<any>({
        method: HttpMethod.POST,
        route: `/sales/${saleId}/items`,
        body: data,
        auth: true,
      }),

    update: (saleId: number, itemId: number, data: UpdateSaleItemRequest) =>
      request<any>({
        method: HttpMethod.PUT,
        route: `/sales/${saleId}/items/${itemId}`,
        body: data,
        auth: true,
      }),

    patch: (saleId: number, itemId: number, data: PatchSaleItemRequest) =>
      request<any>({
        method: HttpMethod.PATCH,
        route: `/sales/${saleId}/items/${itemId}`,
        body: data,
        auth: true,
      }),

    reorder: (saleId: number, data: ReorderSaleItemRequest) =>
      request<any>({
        method: HttpMethod.PATCH,
        route: `/sales/${saleId}/reorder-items`,
        body: data,
        auth: true,
      }),

    destroy: (saleId: number, itemId: number) =>
      request<void>({
        method: HttpMethod.DELETE,
        route: `/sales/${saleId}/items/${itemId}`,
        auth: true,
      }),
  },
}
